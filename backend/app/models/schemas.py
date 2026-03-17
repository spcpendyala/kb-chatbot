from pydantic import BaseModel
from typing import List, Optional


class IngestResponse(BaseModel):
    document_id: str
    filename: str
    chunks_created: int
    status: str


class Source(BaseModel):
    document_name: str
    excerpt: str
    relevance_score: float


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    has_context: bool


class DocumentInfo(BaseModel):
    document_id: str
    filename: str
    chunk_count: int
    created_at: str
