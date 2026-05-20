import os
from dotenv import load_dotenv
from openai import OpenAI
from app.database.chroma_client import get_collection
from app.models.schemas import Source

load_dotenv()


def get_embedding_client():
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )


def retrieve(query: str, n_results=5) -> list[Source]:
    client = get_embedding_client()
    collection = get_collection()

    if collection.count() == 0:
        return []

    response = client.embeddings.create(
        model="openai/text-embedding-3-small",
        input=[query],
    )
    query_embedding = response.data[0].embedding

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
