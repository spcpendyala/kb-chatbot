from fastapi import APIRouter
from app.database.chroma_client import get_collection

router = APIRouter()


@router.get('/documents')
def list_documents():
    col = get_collection()
    if col.count() == 0:
        return {'documents': []}

    result = col.get(include=['metadatas'])
    seen = {}
    for meta in result['metadatas']:
        did = meta['document_id']
        if did not in seen:
            seen[did] = {
                'document_id': did,
                'filename': meta['filename'],
                'chunk_count': 0,
                'created_at': meta.get('created_at', '')
            }
        seen[did]['chunk_count'] += 1

    return {'documents': list(seen.values())}


@router.delete('/documents/{document_id}')
def delete_document(document_id: str):
    col = get_collection()
    result = col.get(where={'document_id': document_id})
    if result['ids']:
        col.delete(ids=result['ids'])
    return {'deleted': document_id, 'chunks_removed': len(result['ids'])}
