"""
services/llm.py
---------------
Handles sentiment analysis using OpenAI’s Chat Completions API.

The model returns a strict JSON response containing:
- sentiment_score: number in [0,1]
- sentiment_label: one of ["very_neg", "neg", "neutral", "pos", "very_pos"]
- keywords: list of 3–7 short keywords
"""

import os
import json
from typing import Dict
import httpx

# ------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"

if not OPENAI_API_KEY:
    raise RuntimeError("❌ OPENAI_API_KEY not found. Please set it in your environment.")

# ------------------------------------------------------------------
# Prompt
# ------------------------------------------------------------------
SYSTEM_PROMPT = (
    "You are a strict JSON API. Given input text, respond ONLY with a JSON object:\n"
    '{ "sentiment_score": number in [0,1], '
    '"sentiment_label": one of ["very_neg","neg","neutral","pos","very_pos"], '
    '"keywords": array of 3-7 short keywords }\n'
    "No explanations, no extra text."
)


# ------------------------------------------------------------------
# Sentiment Analysis
# ------------------------------------------------------------------
async def analyze(text: str) -> Dict:
    """
    Sends input text to the OpenAI API for sentiment analysis.
    Expects a JSON-formatted response with sentiment details.
    """
    if not text or text.strip() == "":
        raise ValueError("Input text cannot be empty")

    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Text: {text}"},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.0,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(OPENAI_CHAT_URL, headers=headers, json=payload)

    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]

    try:
        return json.loads(content)
    except Exception as e:
        raise RuntimeError(f"❌ Failed to parse OpenAI response: {content}\nError: {e}")
