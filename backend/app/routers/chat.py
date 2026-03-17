from fastapi import APIRouter
from app.services.retrieval_service import retrieve
from app.services.chat_service import generate_answer
from app.models.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post('/chat', response_model=ChatResponse)
async def chat(request: ChatRequest):
    sources = retrieve(request.message)
    answer = await generate_answer(request.message, sources, request.history)
    return ChatResponse(
        answer=answer,
        sources=sources,
        has_context=len(sources) > 0
    )
