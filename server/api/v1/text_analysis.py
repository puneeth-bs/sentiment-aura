from fastapi import APIRouter, HTTPException
from schemas import ProcessTextReq, ProcessTextRes
from services.llm import analyze

# 👇 single clear prefix for versioning
router = APIRouter(prefix="/api/v1", tags=["analysis"])

@router.get("/healthz")
def healthz():
    return {"ok": True}

@router.post("/process_text", response_model=ProcessTextRes)
async def process_text(body: ProcessTextReq):
    """
    Analyze sentiment or other text-level features via the LLM service.
    """
    try:
        res = await analyze(body.text)
        return ProcessTextRes(**res)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Analysis error: {e}")
