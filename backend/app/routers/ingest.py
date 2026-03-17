from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_service import extract_text
from app.services.ingestion_service import ingest_document
from app.models.schemas import IngestResponse

router = APIRouter()


@router.post('/ingest', response_model=IngestResponse)
async def ingest(file: UploadFile = File(None), raw_text: str = Form(None)):
    if file and file.filename:
        text = await extract_text(file)
        filename = file.filename
    elif raw_text:
        text = raw_text
        filename = 'pasted_text.txt'
    else:
        raise HTTPException(400, 'Provide a file or raw_text')

    result = await ingest_document(text, filename)

    return IngestResponse(
        document_id=result['document_id'],
        filename=filename,
        chunks_created=result['chunks_created'],
        status='success'
    )
