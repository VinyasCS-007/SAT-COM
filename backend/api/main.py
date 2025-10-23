# backend/api/main.py
from fastapi import FastAPI
from api.routes import router
from core.database import init_db

app = FastAPI(
    title="SatCom AI",
    description="Fault-Tolerant Satellite Communication with AI Error Correction",
    version="1.0"
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    init_db()