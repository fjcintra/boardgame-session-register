import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile & Address information
    nome = Column(String(128), nullable=False)
    sobrenome = Column(String(128), nullable=False)
    telefone = Column(String(24), nullable=True)
    endereco = Column(String(255), nullable=True)
    numero = Column(String(16), nullable=True)
    complemento = Column(String(64), nullable=True)
    cidade = Column(String(128), nullable=True)
    estado = Column(String(64), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    games = relationship("BoardGame", back_populates="owner", cascade="all, delete-orphan")
    matches = relationship("MatchRecord", back_populates="user", cascade="all, delete-orphan")
