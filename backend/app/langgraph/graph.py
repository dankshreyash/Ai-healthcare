"""
LangGraph graph definition.
Implements the flow: User Request → Intent Detection → Select Tool → Execute → Return Response.
"""

from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from app.core.config import settings
from app.langgraph.state import GraphState
from app.langgraph.prompts import INTENT_DETECTION_PROMPT
from app.langgraph.tools import (
    tool_log_interaction,
    tool_edit_interaction,
    tool_search_interaction,
    tool_generate_followup,
    tool_interaction_summary,
    tool_general_response,
)


# ──────────────────────────────────────────────
# Node 1: Intent Detection
# ──────────────────────────────────────────────

def detect_intent(state: GraphState) -> GraphState:
    """
    Classify the user's message into one of the known intents
    using the LLM as a zero-shot classifier.
    """
    user_message = state["user_message"]

    try:
        llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name="llama-3.3-70b-versatile",
            temperature=0.0,
            max_tokens=50,
        )

        prompt = INTENT_DETECTION_PROMPT.format(user_message=user_message)
        response = llm.invoke([HumanMessage(content=prompt)])
        intent = response.content.strip().lower().replace('"', "").replace("'", "")

        # Validate intent
        valid_intents = {
            "log_interaction",
            "edit_interaction",
            "search_interaction",
            "generate_followup",
            "interaction_summary",
            "general",
        }
        if intent not in valid_intents:
            intent = "general"

        return {**state, "intent": intent}

    except Exception as e:
        return {
            **state,
            "intent": "general",
            "error": f"Intent detection error: {str(e)}",
        }


# ──────────────────────────────────────────────
# Node 2: Route to correct tool (conditional edge)
# ──────────────────────────────────────────────

def route_by_intent(state: GraphState) -> str:
    """
    Conditional edge function.
    Returns the name of the next node based on the detected intent.
    """
    intent = state.get("intent", "general")

    routing_map = {
        "log_interaction": "log_interaction",
        "edit_interaction": "edit_interaction",
        "search_interaction": "search_interaction",
        "generate_followup": "generate_followup",
        "interaction_summary": "interaction_summary",
        "general": "general_response",
    }

    return routing_map.get(intent, "general_response")


# ──────────────────────────────────────────────
# Build the Graph
# ──────────────────────────────────────────────

def build_graph() -> StateGraph:
    """
    Construct and compile the LangGraph CRM agent graph.

    Flow:
        START → detect_intent → (conditional routing) → tool_node → END
    """
    graph = StateGraph(GraphState)

    # Add nodes
    graph.add_node("detect_intent", detect_intent)
    graph.add_node("log_interaction", tool_log_interaction)
    graph.add_node("edit_interaction", tool_edit_interaction)
    graph.add_node("search_interaction", tool_search_interaction)
    graph.add_node("generate_followup", tool_generate_followup)
    graph.add_node("interaction_summary", tool_interaction_summary)
    graph.add_node("general_response", tool_general_response)

    # Set entry point
    graph.set_entry_point("detect_intent")

    # Add conditional edges from intent detection to tool nodes
    graph.add_conditional_edges(
        "detect_intent",
        route_by_intent,
        {
            "log_interaction": "log_interaction",
            "edit_interaction": "edit_interaction",
            "search_interaction": "search_interaction",
            "generate_followup": "generate_followup",
            "interaction_summary": "interaction_summary",
            "general_response": "general_response",
        },
    )

    # All tool nodes lead to END
    graph.add_edge("log_interaction", END)
    graph.add_edge("edit_interaction", END)
    graph.add_edge("search_interaction", END)
    graph.add_edge("generate_followup", END)
    graph.add_edge("interaction_summary", END)
    graph.add_edge("general_response", END)

    return graph.compile()


# Singleton compiled graph
crm_graph = build_graph()


def run_graph(user_message: str, interaction_id: int = None) -> dict:
    """
    Public interface to invoke the CRM graph.

    Args:
        user_message: Natural language input from the user.
        interaction_id: Optional ID for context (edit/follow-up).

    Returns:
        dict with keys: reply, extracted_data, interaction_id, action, error
    """
    initial_state: GraphState = {
        "user_message": user_message,
        "intent": None,
        "tool_output": None,
        "reply": None,
        "extracted_data": None,
        "interaction_id": interaction_id,
        "action": None,
        "error": None,
    }

    result = crm_graph.invoke(initial_state)

    return {
        "reply": result.get("reply", "I'm sorry, I couldn't process your request."),
        "extracted_data": result.get("extracted_data"),
        "interaction_id": result.get("interaction_id"),
        "action": result.get("action"),
    }
