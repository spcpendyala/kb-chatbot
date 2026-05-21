import { useEffect, useState } from 'react'
import axios from 'axios'
import { FileText, Trash2, Loader2, Layers } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function DocumentList({ refreshTrigger }) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API}/documents`)
      setDocs(res.data.documents || [])
    } catch { setDocs([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDocs() }, [refreshTrigger])

  const handleDelete = async (docId, filename) => {
    if (!confirm(`Remove "${filename}"?`)) return
    setDeleting(docId)
    try {
      await axios.delete(`${API}/documents/${docId}`)
      setDocs(prev => prev.filter(d => d.document_id !== docId))
    } catch { alert('Failed to delete.') }
    finally { setDeleting(null) }
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
    catch { return '' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header — fixed */}
      <div style={{ padding: '16px 20px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#7c3aed', textTransform: 'uppercase' }}>
            Documents
          </span>
          <span style={{
            fontSize: 10, color: '#4b5563',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '1px 8px',
          }}>{docs.length}</span>
        </div>
      </div>

      {/* List — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Loader2 size={16} color="#555" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Layers size={22} color="#2d2d3d" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>No documents yet.</p>
            <p style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>Upload above to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {docs.map(doc => (
              <div
                key={doc.document_id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                className="doc-item"
              >
                <FileText size={13} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 500, color: '#d1d5db',
                    margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{doc.filename}</p>
                  <p style={{ fontSize: 11, color: '#4b5563', margin: '2px 0 0' }}>
                    {doc.chunk_count} chunks · {formatDate(doc.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.document_id, doc.filename)}
                  disabled={deleting === doc.document_id}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#4b5563', padding: 2, display: 'flex',
                    alignItems: 'center', flexShrink: 0,
                    opacity: deleting === doc.document_id ? 0.5 : 1,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                >
                  {deleting === doc.document_id
                    ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Trash2 size={12} />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        div[style*="overflowY"]::-webkit-scrollbar { width: 3px; }
        div[style*="overflowY"]::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>
    </div>
  )
}
