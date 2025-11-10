from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.v1.text_analysis import router as text_analysis_router

app = FastAPI(title="Sentiment Aura Backend", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(text_analysis_router)