import chromadb
import os

_client = None
_collection = None


def get_client():
    global _client
    if _client is None:
        persist_dir = os.getenv('CHROMA_PERSIST_DIR', './chroma_data')
        _client = chromadb.PersistentClient(path=persist_dir)
    return _client


def get_collection():
    global _collection
    if _collection is None:
        client = get_client()
        _collection = client.get_or_create_collection(
            name='documents',
            metadata={'hnsw:space': 'cosine'}
        )
    return _collection
