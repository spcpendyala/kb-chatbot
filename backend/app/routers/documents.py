from fastapi import APIRouter
from app.database.qdrant_client import get_collection, COLLECTION_NAME

router = APIRouter()

@router.get('/documents')
def list_documents():
    qdrant = get_collection()
    seen = {}
    offset = None
    while True:
        results, offset = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            with_payload=True,
            limit=100,
            offset=offset,
        )
        for point in results:
            did = point.payload['document_id']
            if did not in seen:
                seen[did] = {
                    'document_id': did,
                    'filename': point.payload['filename'],
                    'chunk_count': 0,
                    'created_at': point.payload.get('created_at', ''),
                }
            seen[did]['chunk_count'] += 1
        if offset is None:
            break
    return {'documents': list(seen.values())}

@router.delete('/documents/{document_id}')
def delete_document(document_id: str):
    qdrant = get_collection()
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    qdrant.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[FieldCondition(
                key="document_id",
                match=MatchValue(value=document_id)
            )]
        )
    )
    return {'deleted': document_id}
