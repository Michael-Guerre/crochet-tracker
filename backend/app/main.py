from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import create_access_token, get_current_user, hash_password, verify_password
from .crud import create_pattern, create_user, get_user_by_email, list_patterns_for_user, list_progress_for_user, upsert_progress
from .database import Base, engine, get_db
from .models import User
from .schemas import PatternCreate, PatternRead, ProgressCreate, ProgressRead, Token, UserCreate, UserRead

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crochet Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = create_user(db, user_in, hash_password(user_in.password))
    return user


@app.post("/auth/login", response_model=Token)
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_in.email)
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/patterns", response_model=list[PatternRead])
def list_patterns(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    return list_patterns_for_user(db, current_user.id)


@app.post("/patterns", response_model=PatternRead)
def create_new_pattern(
    pattern_in: PatternCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    return create_pattern(db, current_user.id, pattern_in)


@app.get("/progress", response_model=list[ProgressRead])
def list_user_progress(current_user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    return list_progress_for_user(db, current_user.id)


@app.post("/progress", response_model=ProgressRead)
def save_progress(
    progress_in: ProgressCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    return upsert_progress(db, current_user.id, progress_in)

