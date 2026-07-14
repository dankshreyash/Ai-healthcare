"""
API routes for the Interaction resource.
Handles HTTP concerns: request parsing, status codes, error responses.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.interaction import (
    InteractionCreate,
    InteractionUpdate,
    InteractionResponse,
    InteractionListResponse,
)
from app.crud import interaction as crud

router = APIRouter(prefix="/interaction", tags=["Interactions"])


@router.post("", response_model=InteractionResponse, status_code=201)
def create_interaction(
    data: InteractionCreate,
    db: Session = Depends(get_db),
):
    """Log a new HCP interaction."""
    interaction = crud.create_interaction(db, data)
    return interaction


@router.get("", response_model=InteractionListResponse)
def list_interactions(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Max records to return"),
    search: Optional[str] = Query(None, description="Search across doctor, hospital, products, notes"),
    db: Session = Depends(get_db),
):
    """Retrieve a paginated list of interactions with optional search."""
    interactions, total = crud.get_interactions(db, skip=skip, limit=limit, search=search)
    return InteractionListResponse(total=total, interactions=interactions)


@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
):
    """Retrieve a single interaction by ID."""
    interaction = crud.get_interaction(db, interaction_id)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction


@router.put("/{interaction_id}", response_model=InteractionResponse)
def update_interaction(
    interaction_id: int,
    data: InteractionUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing interaction (partial update)."""
    interaction = crud.update_interaction(db, interaction_id, data)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction


@router.delete("/{interaction_id}", status_code=204)
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
):
    """Delete an interaction by ID."""
    deleted = crud.delete_interaction(db, interaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return None
