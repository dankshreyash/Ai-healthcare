"""
LangGraph tool implementations.
Each tool is a function that takes GraphState and returns updated state.
These are the 5 core CRM capabilities executed by the graph.
"""

import json
from datetime import date, datetime, timezone
from typing import Optional

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from app.core.config import settings
from app.langgraph.state import GraphState
from app.langgraph.prompts import (
    EXTRACT_ENTITIES_PROMPT,
    EDIT_INTERACTION_PROMPT,
    SEARCH_QUERY_PROMPT,
    SEARCH_RESULTS_FORMAT_PROMPT,
    GENERATE_FOLLOWUP_PROMPT,
    INTERACTION_SUMMARY_PROMPT,
    GENERAL_RESPONSE_PROMPT,
)
from app.database.session import SessionLocal
from app.models.interaction import Interaction
from sqlalchemy import or_


def _get_llm() -> ChatGroq:
    """Create a ChatGroq instance with the configured model."""
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model_name="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=2048,
    )


def _invoke_llm(prompt: str) -> str:
    """Send a prompt to the LLM and return the text response."""
    llm = _get_llm()
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content.strip()


def _parse_json_response(text: str) -> dict:
    """
    Parse JSON from LLM response, handling common issues
    like markdown code fences or extra text.
    """
    # Strip markdown code fences if present
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to find JSON object in the response
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(cleaned[start:end])
            except json.JSONDecodeError:
                return {}
        return {}


def _today_str() -> str:
    """Return today's date as YYYY-MM-DD string."""
    return date.today().isoformat()


# ──────────────────────────────────────────────────────────────
# TOOL 1: LOG INTERACTION
# ──────────────────────────────────────────────────────────────

def tool_log_interaction(state: GraphState) -> GraphState:
    """
    Extract entities from natural language and create a new interaction record.
    Uses LLM to parse free-text into structured fields, then stores in DB.
    """
    user_message = state["user_message"]

    try:
        # Step 1: Extract entities via LLM
        prompt = EXTRACT_ENTITIES_PROMPT.format(
            user_message=user_message,
            today=_today_str(),
        )
        raw_response = _invoke_llm(prompt)
        extracted = _parse_json_response(raw_response)

        if not extracted or not extracted.get("doctor_name"):
            return {
                **state,
                "reply": "I couldn't extract enough information from your message. Please mention at least the doctor's name. For example: 'I met Dr. Sharma at Apollo Hospital today to discuss our diabetes medicine.'",
                "action": "log_interaction_failed",
                "error": "Insufficient data extracted",
            }

        # Step 2: Store in database
        db = SessionLocal()
        try:
            interaction = Interaction(
                doctor_name=extracted.get("doctor_name", ""),
                hospital=extracted.get("hospital"),
                specialty=extracted.get("specialty"),
                interaction_type=extracted.get("interaction_type", "In-Person"),
                interaction_date=(
                    datetime.strptime(extracted["interaction_date"], "%Y-%m-%d").date()
                    if extracted.get("interaction_date")
                    else date.today()
                ),
                discussion_notes=extracted.get("discussion_notes"),
                products_discussed=extracted.get("products_discussed"),
                summary=extracted.get("summary"),
                follow_up_date=(
                    datetime.strptime(extracted["follow_up_date"], "%Y-%m-%d").date()
                    if extracted.get("follow_up_date")
                    else None
                ),
                follow_up_action=extracted.get("follow_up_action"),
            )
            db.add(interaction)
            db.commit()
            db.refresh(interaction)
            interaction_id = interaction.id
        finally:
            db.close()

        # Step 3: Build confirmation reply
        reply_parts = [f"I've logged your interaction successfully! (ID: {interaction_id})\n"]
        reply_parts.append("**Extracted Details:**")
        field_labels = {
            "doctor_name": "Doctor",
            "hospital": "Hospital",
            "specialty": "Specialty",
            "interaction_type": "Type",
            "interaction_date": "Date",
            "products_discussed": "Products",
            "discussion_notes": "Notes",
            "summary": "Summary",
            "follow_up_date": "Follow-up Date",
            "follow_up_action": "Follow-up Action",
        }
        for key, label in field_labels.items():
            value = extracted.get(key)
            if value:
                reply_parts.append(f"- **{label}:** {value}")

        return {
            **state,
            "reply": "\n".join(reply_parts),
            "extracted_data": extracted,
            "interaction_id": interaction_id,
            "action": "log_interaction",
        }

    except Exception as e:
        return {
            **state,
            "reply": f"Sorry, I encountered an error while logging the interaction: {str(e)}",
            "action": "log_interaction_error",
            "error": str(e),
        }


# ──────────────────────────────────────────────────────────────
# TOOL 2: EDIT INTERACTION
# ──────────────────────────────────────────────────────────────

def tool_edit_interaction(state: GraphState) -> GraphState:
    """
    Modify an existing interaction using natural language.
    Finds the most recent interaction (or uses provided ID) and applies changes.
    """
    user_message = state["user_message"]
    interaction_id = state.get("interaction_id")

    db = SessionLocal()
    try:
        # Find the interaction to edit
        if interaction_id:
            interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        else:
            # Use the most recent interaction
            interaction = db.query(Interaction).order_by(Interaction.created_at.desc()).first()

        if not interaction:
            return {
                **state,
                "reply": "I couldn't find an interaction to edit. Please specify which interaction you'd like to modify.",
                "action": "edit_interaction_failed",
                "error": "Interaction not found",
            }

        # Build current record representation for the LLM
        current_record = json.dumps({
            "id": interaction.id,
            "doctor_name": interaction.doctor_name,
            "hospital": interaction.hospital,
            "specialty": interaction.specialty,
            "interaction_type": interaction.interaction_type,
            "interaction_date": str(interaction.interaction_date) if interaction.interaction_date else None,
            "products_discussed": interaction.products_discussed,
            "discussion_notes": interaction.discussion_notes,
            "summary": interaction.summary,
            "follow_up_date": str(interaction.follow_up_date) if interaction.follow_up_date else None,
            "follow_up_action": interaction.follow_up_action,
        }, indent=2)

        # Ask LLM what fields to update
        prompt = EDIT_INTERACTION_PROMPT.format(
            current_record=current_record,
            user_message=user_message,
            today=_today_str(),
        )
        raw_response = _invoke_llm(prompt)
        updates = _parse_json_response(raw_response)

        if not updates:
            return {
                **state,
                "reply": "I couldn't determine what changes to make. Please be more specific, e.g., 'Change the follow-up date to next Friday.'",
                "action": "edit_interaction_failed",
                "error": "No updates parsed",
            }

        # Apply updates
        date_fields = {"interaction_date", "follow_up_date"}
        for field, value in updates.items():
            if hasattr(interaction, field) and value is not None:
                if field in date_fields and isinstance(value, str):
                    try:
                        value = datetime.strptime(value, "%Y-%m-%d").date()
                    except ValueError:
                        continue
                setattr(interaction, field, value)

        interaction.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(interaction)

        # Build reply
        reply_parts = [f"Updated interaction #{interaction.id} successfully!\n"]
        reply_parts.append("**Changes made:**")
        for field, value in updates.items():
            reply_parts.append(f"- **{field.replace('_', ' ').title()}:** {value}")

        return {
            **state,
            "reply": "\n".join(reply_parts),
            "extracted_data": updates,
            "interaction_id": interaction.id,
            "action": "edit_interaction",
        }

    except Exception as e:
        return {
            **state,
            "reply": f"Sorry, I encountered an error while editing: {str(e)}",
            "action": "edit_interaction_error",
            "error": str(e),
        }
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────
# TOOL 3: SEARCH INTERACTION
# ──────────────────────────────────────────────────────────────

def tool_search_interaction(state: GraphState) -> GraphState:
    """
    Search interactions by doctor, hospital, date, or product.
    Uses LLM to parse the search query, then queries the DB.
    """
    user_message = state["user_message"]

    try:
        # Parse search parameters via LLM
        prompt = SEARCH_QUERY_PROMPT.format(
            user_message=user_message,
            today=_today_str(),
        )
        raw_response = _invoke_llm(prompt)
        search_params = _parse_json_response(raw_response)

        # Build database query
        db = SessionLocal()
        try:
            query = db.query(Interaction)

            if search_params.get("doctor_name"):
                query = query.filter(Interaction.doctor_name.ilike(f"%{search_params['doctor_name']}%"))
            if search_params.get("hospital"):
                query = query.filter(Interaction.hospital.ilike(f"%{search_params['hospital']}%"))
            if search_params.get("product"):
                query = query.filter(Interaction.products_discussed.ilike(f"%{search_params['product']}%"))
            if search_params.get("search_term"):
                term = f"%{search_params['search_term']}%"
                query = query.filter(
                    or_(
                        Interaction.doctor_name.ilike(term),
                        Interaction.hospital.ilike(term),
                        Interaction.products_discussed.ilike(term),
                        Interaction.discussion_notes.ilike(term),
                        Interaction.summary.ilike(term),
                    )
                )
            if search_params.get("date_from"):
                try:
                    from_date = datetime.strptime(search_params["date_from"], "%Y-%m-%d").date()
                    query = query.filter(Interaction.interaction_date >= from_date)
                except ValueError:
                    pass
            if search_params.get("date_to"):
                try:
                    to_date = datetime.strptime(search_params["date_to"], "%Y-%m-%d").date()
                    query = query.filter(Interaction.interaction_date <= to_date)
                except ValueError:
                    pass

            results = query.order_by(Interaction.interaction_date.desc()).limit(20).all()

            # Format results for LLM
            if results:
                results_text = "\n\n".join([
                    f"ID: {r.id} | Doctor: {r.doctor_name} | Hospital: {r.hospital or 'N/A'} | "
                    f"Date: {r.interaction_date} | Type: {r.interaction_type}\n"
                    f"Products: {r.products_discussed or 'N/A'}\n"
                    f"Summary: {r.summary or r.discussion_notes or 'N/A'}\n"
                    f"Follow-up: {r.follow_up_date} — {r.follow_up_action or 'N/A'}"
                    for r in results
                ])
            else:
                results_text = "No interactions found matching the search criteria."

        finally:
            db.close()

        # Format results via LLM for a nice response
        format_prompt = SEARCH_RESULTS_FORMAT_PROMPT.format(results=results_text)
        formatted_reply = _invoke_llm(format_prompt)

        return {
            **state,
            "reply": formatted_reply,
            "extracted_data": search_params,
            "action": "search_interaction",
        }

    except Exception as e:
        return {
            **state,
            "reply": f"Sorry, I encountered an error while searching: {str(e)}",
            "action": "search_interaction_error",
            "error": str(e),
        }


# ──────────────────────────────────────────────────────────────
# TOOL 4: GENERATE FOLLOW-UP
# ──────────────────────────────────────────────────────────────

def tool_generate_followup(state: GraphState) -> GraphState:
    """
    Generate AI-powered follow-up suggestions for an interaction.
    """
    interaction_id = state.get("interaction_id")

    db = SessionLocal()
    try:
        if interaction_id:
            interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        else:
            # Use the most recent interaction
            interaction = db.query(Interaction).order_by(Interaction.created_at.desc()).first()

        if not interaction:
            return {
                **state,
                "reply": "No interaction found to generate follow-up suggestions for. Please log an interaction first or specify an interaction ID.",
                "action": "generate_followup_failed",
            }

        # Build interaction details for the LLM
        details = (
            f"Doctor: {interaction.doctor_name}\n"
            f"Hospital: {interaction.hospital or 'N/A'}\n"
            f"Specialty: {interaction.specialty or 'N/A'}\n"
            f"Date: {interaction.interaction_date}\n"
            f"Type: {interaction.interaction_type}\n"
            f"Products Discussed: {interaction.products_discussed or 'N/A'}\n"
            f"Discussion Notes: {interaction.discussion_notes or 'N/A'}\n"
            f"Current Follow-up Date: {interaction.follow_up_date or 'Not set'}\n"
            f"Current Follow-up Action: {interaction.follow_up_action or 'Not set'}"
        )

        prompt = GENERATE_FOLLOWUP_PROMPT.format(interaction_details=details)
        suggestions = _invoke_llm(prompt)

        reply = (
            f"**Follow-up Suggestions for Interaction #{interaction.id}**\n"
            f"*(Dr. {interaction.doctor_name} @ {interaction.hospital or 'N/A'})*\n\n"
            f"{suggestions}"
        )

        return {
            **state,
            "reply": reply,
            "interaction_id": interaction.id,
            "action": "generate_followup",
        }

    except Exception as e:
        return {
            **state,
            "reply": f"Sorry, I encountered an error generating follow-up suggestions: {str(e)}",
            "action": "generate_followup_error",
            "error": str(e),
        }
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────
# TOOL 5: INTERACTION SUMMARY
# ──────────────────────────────────────────────────────────────

def tool_interaction_summary(state: GraphState) -> GraphState:
    """
    Generate a concise management summary of recent interactions.
    """
    db = SessionLocal()
    try:
        interactions = (
            db.query(Interaction)
            .order_by(Interaction.interaction_date.desc())
            .limit(20)
            .all()
        )

        if not interactions:
            return {
                **state,
                "reply": "No interactions found in the system. Please log some interactions first.",
                "action": "interaction_summary_failed",
            }

        interactions_text = "\n\n".join([
            f"#{i.id} | {i.interaction_date} | {i.doctor_name} @ {i.hospital or 'N/A'}\n"
            f"Type: {i.interaction_type} | Specialty: {i.specialty or 'N/A'}\n"
            f"Products: {i.products_discussed or 'N/A'}\n"
            f"Summary: {i.summary or i.discussion_notes or 'N/A'}\n"
            f"Follow-up: {i.follow_up_date} — {i.follow_up_action or 'N/A'}"
            for i in interactions
        ])

        prompt = INTERACTION_SUMMARY_PROMPT.format(interactions=interactions_text)
        summary = _invoke_llm(prompt)

        return {
            **state,
            "reply": f"**Management Summary Report**\n\n{summary}",
            "action": "interaction_summary",
        }

    except Exception as e:
        return {
            **state,
            "reply": f"Sorry, I encountered an error generating the summary: {str(e)}",
            "action": "interaction_summary_error",
            "error": str(e),
        }
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────
# GENERAL RESPONSE (not a CRM tool – fallback)
# ──────────────────────────────────────────────────────────────

def tool_general_response(state: GraphState) -> GraphState:
    """Handle general conversation / greetings / help requests."""
    user_message = state["user_message"]

    try:
        prompt = GENERAL_RESPONSE_PROMPT.format(user_message=user_message)
        reply = _invoke_llm(prompt)

        return {
            **state,
            "reply": reply,
            "action": "general",
        }
    except Exception as e:
        return {
            **state,
            "reply": "Hello! I'm your CRM assistant. I can help you log interactions, search records, edit entries, generate follow-up suggestions, or create management summaries. How can I help you today?",
            "action": "general",
            "error": str(e),
        }
