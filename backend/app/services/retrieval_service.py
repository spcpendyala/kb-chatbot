import os
from dotenv import load_dotenv
from openai import OpenAI
from app.database.qdrant_client import get_collection, COLLECTION_NAME
from app.models.schemas import Source

load_dotenv()

def get_embedding_client():
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

def retrieve(query: str, n_results=5) -> list[Source]:
    client = get_embedding_client()
    qdrant = get_collection()

    response = client.embeddings.create(
        model="openai/text-embedding-3-small",
        input=[query],
    )
    query_embedding = response.data[0].embedding

    results = qdrant.query_points(
    collection_name=COLLECTION_NAME,
    query=query_embedding,
    limit=n_results,
    with_payload=True,
    ).points

    sources = []
    for hit in results:
        payload = hit.payload
        sources.append(Source(
            document_name=payload['filename'],
            excerpt=payload['text'][:300],
            relevance_score=round(hit.score, 3),
        ))
    return sources
