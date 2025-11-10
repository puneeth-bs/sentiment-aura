from pydantic import BaseModel, Field, constr
from typing import List, Literal

SentimentLabel = Literal["very_neg","neg","neutral","pos","very_pos"]

class ProcessTextReq(BaseModel):
    text: constr(min_length=1, max_length=4000)

class ProcessTextRes(BaseModel):
    sentiment_score: float = Field(ge=0.0, le=1.0)
    sentiment_label: SentimentLabel
    keywords: List[constr(min_length=1, max_length=32)]

class ProcessBatchReq(BaseModel):
    texts: List[constr(min_length=1, max_length=4000)]

class ProcessBatchRes(BaseModel):
    results: List[ProcessTextRes]
