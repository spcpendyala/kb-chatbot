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

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={16} className="text-gray-600 animate-spin" /></div>

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-3">
        Documents <span className="text-gray-600 font-normal normal-case tracking-normal ml-1">({docs.length})</span>
      </p>
      {docs.length === 0 ? (
        <div className="text-center py-8">
          <Layers size={24} className="mx-auto mb-2 text-gray-700" />
          <p className="text-xs text-gray-600">No documents yet.</p>
          <p className="text-xs text-gray-700 mt-1">Upload above to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc.document_id} className="group flex items-start gap-2.5 p-2.5 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 transition-all">
              <FileText size={14} className="text-violet-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-300 truncate">{doc.filename}</p>
                <p className="text-xs text-gray-600 mt-0.5">{doc.chunk_count} chunks · {formatDate(doc.created_at)}</p>
              </div>
              <button onClick={() => handleDelete(doc.document_id, doc.filename)} disabled={deleting === doc.document_id}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all disabled:opacity-50">
                {deleting === doc.document_id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
