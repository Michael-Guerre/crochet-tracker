from sqlalchemy.orm import Session

from .models import Pattern, User, UserPatternProgress
from .schemas import PatternCreate, ProgressCreate, UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate, password_hash: str) -> User:
    user = User(email=user_in.email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_pattern(db: Session, user_id: int, pattern_in: PatternCreate) -> Pattern:
    pattern = Pattern(
        user_id=user_id,
        name=pattern_in.name,
        description=pattern_in.description,
        pattern_data=pattern_in.pattern_data,
    )
    db.add(pattern)
    db.commit()
    db.refresh(pattern)
    return pattern


def list_patterns_for_user(db: Session, user_id: int):
    return db.query(Pattern).filter(Pattern.user_id == user_id).order_by(Pattern.created_at.desc()).all()


def upsert_progress(db: Session, user_id: int, progress_in: ProgressCreate):
    existing = (
        db.query(UserPatternProgress)
        .filter(UserPatternProgress.user_id == user_id)
        .filter(UserPatternProgress.pattern_id == progress_in.pattern_id)
        .first()
    )

    if existing:
        existing.current_row = progress_in.current_row
        existing.completed_rows = progress_in.completed_rows
        existing.notes = progress_in.notes
        db.commit()
        db.refresh(existing)
        return existing

    progress = UserPatternProgress(
        user_id=user_id,
        pattern_id=progress_in.pattern_id,
        current_row=progress_in.current_row,
        completed_rows=progress_in.completed_rows,
        notes=progress_in.notes,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def list_progress_for_user(db: Session, user_id: int):
    return (
        db.query(UserPatternProgress)
        .filter(UserPatternProgress.user_id == user_id)
        .order_by(UserPatternProgress.updated_at.desc())
        .all()
    )

