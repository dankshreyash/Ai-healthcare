"""
Models package.
Import all models here so Base.metadata picks them up for table creation.
"""

from app.models.interaction import Interaction

__all__ = ["Interaction"]
