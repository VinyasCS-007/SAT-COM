# backend/api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from core.database import init_db

app = FastAPI(
    title="SatCom AI",
    description="Fault-Tolerant Satellite Communication with AI Error Correction",
    version="1.0"
)


# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    init_db()