from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, JSON, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    patterns = relationship("Pattern", back_populates="owner")
    progress = relationship("UserPatternProgress", back_populates="user")


class Pattern(Base):
    __tablename__ = "patterns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    pattern_data = Column(JSON, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User", back_populates="patterns")
    progress = relationship("UserPatternProgress", back_populates="pattern")


class UserPatternProgress(Base):
    __tablename__ = "user_pattern_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    pattern_id = Column(Integer, ForeignKey("patterns.id"), nullable=False, index=True)
    current_row = Column(Integer, default=0, nullable=False)
    completed_rows = Column(Integer, default=0, nullable=False)
    notes = Column(Text, default="")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "pattern_id", name="uix_user_pattern"),)

    user = relationship("User", back_populates="progress")
    pattern = relationship("Pattern", back_populates="progress")

