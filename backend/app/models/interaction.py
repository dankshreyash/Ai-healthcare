"""
SQLAlchemy model for the Interaction table.
Represents a pharmaceutical sales rep's meeting with a Healthcare Professional.
"""

from datetime import datetime, date
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
)

from app.database.database import Base


class Interaction(Base):
    """
    Interaction table – stores every logged meeting between
    a pharma sales representative and a doctor / HCP.
    """

    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    doctor_name = Column(String(255), nullable=False, index=True)
    hospital = Column(String(255), nullable=True, index=True)
    specialty = Column(String(255), nullable=True)

    interaction_type = Column(String(50), nullable=True, default="In-Person")

    interaction_date = Column(Date, nullable=True, default=date.today)
    discussion_notes = Column(Text, nullable=True)
    products_discussed = Column(Text, nullable=True)  # Stored as comma-separated
    summary = Column(Text, nullable=True)

    follow_up_date = Column(Date, nullable=True)
    follow_up_action = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    def __repr__(self) -> str:
        return (
            f"<Interaction(id={self.id}, doctor={self.doctor_name}, "
            f"hospital={self.hospital}, date={self.interaction_date})>"
        )
