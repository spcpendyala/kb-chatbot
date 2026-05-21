import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, MessageSquare } from 'lucide-react'
import ChatMessage from './ChatMessage'

const API = import.meta.env.VITE_API_URL

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await axios.post(`${API}/chat`, { message: text, history })
      const { answer, sources, has_context } = res.data
      setMessages(prev => [...prev, { role: 'assistant', content: answer, sources, has_context }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please check that the backend is running.',
        sources: [],
        has_context: false,
      }])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center fade-up">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
              <MessageSquare size={22} className="text-violet-400" />
            </div>
            <p className="text-gray-400 font-medium">Ask anything about your documents</p>
            <p className="text-sm text-gray-600 mt-1 max-w-xs">
              Upload documents on the left, then ask questions here. Answers are grounded in your documents with citations.
            </p>
          </div>
        )}
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
        {loading && (
          <div className="flex justify-start fade-up">
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-violet-400 text-xs">AI</span>
              </div>
              <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-3 items-end bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/40 transition-colors">
          <textarea
  ref={textareaRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={onKeyDown}
  placeholder="Ask a question about your documents…"
  rows={1}
  style={{ resize: 'none', maxHeight: '120px', color: '#e5e7eb' }}
  className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none leading-relaxed"
  onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
/>
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-700 mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
