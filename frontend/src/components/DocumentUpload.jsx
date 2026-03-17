import { useState, useRef } from 'react'
import axios from 'axios'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function DocumentUpload({ onIngested }) {
  const [tab, setTab] = useState('file')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [pasteText, setPasteText] = useState('')
  const fileRef = useRef()

  const upload = async (formData) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await axios.post(`${API}/ingest`, formData)
      setResult({ ok: true, message: `✓ ${res.data.filename} — ${res.data.chunks_created} chunks` })
      onIngested()
      setPasteText('')
    } catch (err) {
      setResult({ ok: false, message: err.response?.data?.detail || 'Upload failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setResult({ ok: false, message: 'Only PDF and TXT files are supported.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setResult({ ok: false, message: 'File is too large (max 10 MB).' })
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    upload(fd)
  }

  const handlePaste = () => {
    if (!pasteText.trim()) return
    const fd = new FormData()
    fd.append('raw_text', pasteText.trim())
    upload(fd)
  }

  return (
    <div className="p-4 border-b border-white/5">
      <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-3">Add Documents</p>
      <div className="flex mb-3 bg-white/5 rounded-lg p-0.5">
        {['file', 'text'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs rounded-md transition-all ${tab === t ? 'bg-violet-600 text-white font-medium' : 'text-gray-400 hover:text-white'}`}>
            {t === 'file' ? 'Upload File' : 'Paste Text'}
          </button>
        ))}
      </div>
      {tab === 'file' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50'}`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          {loading ? <Loader2 className="mx-auto mb-2 text-violet-400 animate-spin" size={20} /> : <Upload className="mx-auto mb-2 text-gray-500" size={20} />}
          <p className="text-xs text-gray-400">{loading ? 'Processing…' : 'Drop PDF or TXT here'}</p>
          <p className="text-xs text-gray-600 mt-1">or click to browse · max 10 MB</p>
        </div>
      ) : (
        <div>
          <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your text here…" rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/50 transition-colors" />
          <button onClick={handlePaste} disabled={loading || !pasteText.trim()}
            className="mt-2 w-full py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Processing…</span> : 'Ingest Text'}
          </button>
        </div>
      )}
      {result && (
        <div className={`mt-3 flex items-start gap-2 text-xs rounded-lg p-2.5 ${result.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {result.ok ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
          {result.message}
        </div>
      )}
    </div>
  )
}
