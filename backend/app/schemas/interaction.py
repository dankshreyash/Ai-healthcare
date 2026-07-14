"""
Pydantic schemas for the Interaction resource.
Used for request validation, response serialization, and OpenAPI docs.
"""

from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ---------- Request schemas ----------

class InteractionCreate(BaseModel):
    """Schema for creating a new interaction."""

    doctor_name: str = Field(..., min_length=1, max_length=255, examples=["Dr. Sharma"])
    hospital: Optional[str] = Field(None, max_length=255, examples=["Apollo Hospital"])
    specialty: Optional[str] = Field(None, max_length=255, examples=["Cardiology"])
    interaction_type: Optional[str] = Field(
        "In-Person",
        examples=["In-Person", "Virtual", "Phone Call", "Email", "Conference", "Other"],
    )
    interaction_date: Optional[date] = Field(None, examples=["2026-07-13"])
    discussion_notes: Optional[str] = Field(None, examples=["Discussed new diabetes medication"])
    products_discussed: Optional[str] = Field(None, examples=["Metformin XR, Insulin Glargine"])
    summary: Optional[str] = None
    follow_up_date: Optional[date] = None
    follow_up_action: Optional[str] = None


class InteractionUpdate(BaseModel):
    """Schema for updating an existing interaction. All fields optional."""

    doctor_name: Optional[str] = Field(None, max_length=255)
    hospital: Optional[str] = Field(None, max_length=255)
    specialty: Optional[str] = Field(None, max_length=255)
    interaction_type: Optional[str] = None
    interaction_date: Optional[date] = None
    discussion_notes: Optional[str] = None
    products_discussed: Optional[str] = None
    summary: Optional[str] = None
    follow_up_date: Optional[date] = None
    follow_up_action: Optional[str] = None


# ---------- Response schemas ----------

class InteractionResponse(BaseModel):
    """Schema for returning an interaction in API responses."""

    id: int
    doctor_name: str
    hospital: Optional[str] = None
    specialty: Optional[str] = None
    interaction_type: Optional[str] = None
    interaction_date: Optional[date] = None
    discussion_notes: Optional[str] = None
    products_discussed: Optional[str] = None
    summary: Optional[str] = None
    follow_up_date: Optional[date] = None
    follow_up_action: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InteractionListResponse(BaseModel):
    """Paginated list response for interactions."""

    total: int
    interactions: List[InteractionResponse]


# ---------- Chat schemas ----------

class ChatRequest(BaseModel):
    """Schema for the AI chat endpoint."""

    message: str = Field(..., min_length=1, examples=[
        "I met Dr Sharma today at Apollo Hospital. We discussed our diabetes medicine."
    ])
    interaction_id: Optional[int] = Field(
        None,
        description="If provided, the chat relates to an existing interaction.",
    )


class ChatResponse(BaseModel):
    """Schema for the AI chat response."""

    reply: str
    extracted_data: Optional[dict] = None
    interaction_id: Optional[int] = None
    action: Optional[str] = None
