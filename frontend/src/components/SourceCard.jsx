import { useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'

export default function SourceCard({ source }) {
  const [open, setOpen] = useState(false)
  const score = Math.round(source.relevance_score * 100)

  return (
    <div className="border border-white/8 rounded-lg overflow-hidden bg-white/3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors"
      >
        <FileText size={12} className="text-violet-400 shrink-0" />
        <span className="flex-1 text-xs text-gray-400 truncate font-medium">
          {source.document_name}
        </span>
        <span className="text-xs text-emerald-500 font-mono shrink-0">{score}%</span>
        <ChevronDown size={12} className={`text-gray-600 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-white/5">
          <p className="text-xs text-gray-500 leading-relaxed font-mono">{source.excerpt}</p>
        </div>
      )}
    </div>
  )
}
