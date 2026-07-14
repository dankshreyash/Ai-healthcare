"""
API route for the AI Chat endpoint.
Routes user messages through the LangGraph CRM agent.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.interaction import ChatRequest, ChatResponse
from app.langgraph.graph import run_graph

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    AI-powered chat endpoint.
    Accepts natural language and routes through the LangGraph CRM agent.
    Supports: logging, editing, searching, follow-ups, and summaries.
    """
    result = run_graph(
        user_message=request.message,
        interaction_id=request.interaction_id,
    )

    return ChatResponse(
        reply=result["reply"],
        extracted_data=result.get("extracted_data"),
        interaction_id=result.get("interaction_id"),
        action=result.get("action"),
    )
