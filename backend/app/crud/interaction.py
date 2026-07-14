"""
CRUD operations for the Interaction model.
Pure data-access layer – no HTTP or business logic here.
"""

from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.interaction import Interaction
from app.schemas.interaction import InteractionCreate, InteractionUpdate


def create_interaction(db: Session, data: InteractionCreate) -> Interaction:
    """Insert a new interaction record."""
    interaction = Interaction(
        doctor_name=data.doctor_name,
        hospital=data.hospital,
        specialty=data.specialty,
        interaction_type=data.interaction_type,
        interaction_date=data.interaction_date,
        discussion_notes=data.discussion_notes,
        products_discussed=data.products_discussed,
        summary=data.summary,
        follow_up_date=data.follow_up_date,
        follow_up_action=data.follow_up_action,
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def get_interaction(db: Session, interaction_id: int) -> Optional[Interaction]:
    """Fetch a single interaction by ID."""
    return db.query(Interaction).filter(Interaction.id == interaction_id).first()


def get_interactions(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
) -> tuple[List[Interaction], int]:
    """
    Fetch a paginated list of interactions.
    Optional full-text search across doctor_name, hospital, products, and notes.
    Returns (list_of_interactions, total_count).
    """
    query = db.query(Interaction)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Interaction.doctor_name.ilike(pattern),
                Interaction.hospital.ilike(pattern),
                Interaction.products_discussed.ilike(pattern),
                Interaction.discussion_notes.ilike(pattern),
                Interaction.specialty.ilike(pattern),
                Interaction.summary.ilike(pattern),
            )
        )

    total = query.count()
    interactions = (
        query.order_by(Interaction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return interactions, total


def update_interaction(
    db: Session,
    interaction_id: int,
    data: InteractionUpdate,
) -> Optional[Interaction]:
    """Update an existing interaction. Only non-None fields are changed."""
    interaction = get_interaction(db, interaction_id)
    if not interaction:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(interaction, field, value)

    interaction.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(interaction)
    return interaction


def delete_interaction(db: Session, interaction_id: int) -> bool:
    """Delete an interaction by ID. Returns True if deleted, False if not found."""
    interaction = get_interaction(db, interaction_id)
    if not interaction:
        return False

    db.delete(interaction)
    db.commit()
    return True
