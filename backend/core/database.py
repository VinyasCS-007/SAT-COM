# backend/core/database.py
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build MySQL URL
DB_USER = os.getenv("DB_USER", "satcom_user")
DB_PASS = os.getenv("DB_PASSWORD", "secure_password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "satcom_ai")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine and session
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for models
Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)

# Telemetry Log Model
class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    snr_db = Column(Float, nullable=False)
    noise_type = Column(String(50), nullable=False)
    ecc_scheme = Column(String(50), nullable=False)
    ber_before = Column(Float, nullable=False)
    ber_after = Column(Float, nullable=False)
    ai_corrected = Column(Integer, nullable=False)  # 0 or 1
    latency_ms = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
