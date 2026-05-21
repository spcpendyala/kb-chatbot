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
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Messages — this is the only scrollable area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <MessageSquare size={22} color="#a78bfa" />
            </div>
            <p style={{ color: '#9ca3af', fontWeight: 500, fontSize: 14, margin: 0 }}>Ask anything about your documents</p>
            <p style={{ color: '#4b5563', fontSize: 13, marginTop: 6, maxWidth: 280, lineHeight: 1.5 }}>
              Upload documents on the left, then ask questions here.
            </p>
          </div>
        )}

        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: '#a78bfa', flexShrink: 0,
              }}>AI</div>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                display: 'flex', gap: 4,
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#a78bfa', display: 'inline-block',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — fixed at bottom, never scrolls */}
      <div style={{
        flexShrink: 0,
        padding: '12px 24px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#0e0e16',
      }}>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '10px 14px',
          transition: 'border-color 0.2s',
        }}
          onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question about your documents…"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              maxHeight: 120,
              fontSize: 13,
              color: '#e5e7eb',
              lineHeight: 1.6,
              fontFamily: 'inherit',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: input.trim() && !loading ? '#7c3aed' : 'rgba(124,58,237,0.2)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <Send size={13} color={input.trim() && !loading ? '#fff' : '#6d28d9'} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#374151', marginTop: 8 }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        div[style*="overflowY"]::-webkit-scrollbar { width: 4px; }
        div[style*="overflowY"]::-webkit-scrollbar-track { background: transparent; }
        div[style*="overflowY"]::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  )
}
