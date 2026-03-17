import os
from dotenv import load_dotenv
from google import genai
from app.database.chroma_client import get_collection
from app.models.schemas import Source

load_dotenv()


def get_client():
    return genai.Client(api_key=os.getenv('GEMINI_API_KEY'))


def retrieve(query: str, n_results=5) -> list[Source]:
    client = get_client()
    collection = get_collection()

    if collection.count() == 0:
        return []

    result = client.models.embed_content(
        model='models/gemini-embedding-001',
        contents=[query],
    )
    query_embedding = result.embeddings[0].values

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
        include=['documents', 'metadatas', 'distances']
    )

    sources = []
    for doc, meta, dist in zip(
        results['documents'][0],
        results['metadatas'][0],
        results['distances'][0]
    ):
        sources.append(Source(
            document_name=meta['filename'],
            excerpt=doc[:300],
            relevance_score=round(1 - dist, 3)
        ))

    return sources
