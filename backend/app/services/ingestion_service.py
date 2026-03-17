import os
import uuid
import tiktoken
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from app.database.chroma_client import get_collection

load_dotenv()


def get_client():
    return genai.Client(api_key=os.getenv('GEMINI_API_KEY'))


def chunk_text(text: str, chunk_size=500, overlap=50) -> list[str]:
    enc = tiktoken.get_encoding('cl100k_base')
    tokens = enc.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk = enc.decode(tokens[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = get_client()
    result = client.models.embed_content(
        model='models/gemini-embedding-001',
        contents=texts,
    )
    return [e.values for e in result.embeddings]


async def ingest_document(text: str, filename: str) -> dict:
    doc_id = str(uuid.uuid4())
    chunks = chunk_text(text)
    collection = get_collection()

    all_ids, all_embeddings, all_docs, all_metas = [], [], [], []

    for i in range(0, len(chunks), 100):
        batch = chunks[i:i + 100]
        embeddings = embed_texts(batch)
        for j, (chunk, emb) in enumerate(zip(batch, embeddings)):
            all_ids.append(f'{doc_id}_chunk_{i + j}')
            all_embeddings.append(emb)
            all_docs.append(chunk)
            all_metas.append({
                'document_id': doc_id,
                'filename': filename,
                'chunk_index': i + j,
                'created_at': datetime.utcnow().isoformat()
            })

    collection.add(
        ids=all_ids,
        embeddings=all_embeddings,
        documents=all_docs,
        metadatas=all_metas
    )

    return {'document_id': doc_id, 'chunks_created': len(chunks)}
