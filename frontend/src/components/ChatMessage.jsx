import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, User, ChevronDown } from 'lucide-react'
import SourceCard from './SourceCard'

export default function ChatMessage({ message }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end fade-up">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="bg-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
            {message.content}
          </div>
          <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center shrink-0 mb-0.5">
            <User size={12} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start fade-up">
      <div className="flex items-end gap-2 max-w-[85%]">
        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mb-0.5">
          <Bot size={12} className="text-violet-400" />
        </div>
        <div className="space-y-2">
          <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-200 prose-chat">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {message.sources && message.sources.length > 0 && (
            <div className="pl-1">
              <button
                onClick={() => setSourcesOpen(o => !o)}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mb-1.5"
              >
                <ChevronDown size={12} className={`transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
              </button>
              {sourcesOpen && (
                <div className="space-y-1.5">
                  {message.sources.map((s, i) => <SourceCard key={i} source={s} />)}
                </div>
              )}
            </div>
          )}
          {message.has_context === false && (
            <p className="pl-1 text-xs text-gray-600 italic">No relevant documents found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
