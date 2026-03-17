import PyPDF2
import io
from fastapi import UploadFile, HTTPException


async def extract_text(file: UploadFile) -> str:
    content = await file.read()

    if file.filename.endswith('.pdf'):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ' '.join(page.extract_text() or '' for page in reader.pages)
    elif file.filename.endswith('.txt'):
        text = content.decode('utf-8', errors='ignore')
    else:
        raise HTTPException(400, 'Only PDF and TXT files supported')

    if len(text.strip()) < 50:
        raise HTTPException(400, 'Could not extract text — make sure it is not a scanned image PDF')

    return text
