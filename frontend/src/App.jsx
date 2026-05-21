import { useState } from 'react'
import { Database } from 'lucide-react'
import DocumentUpload from './components/DocumentUpload'
import DocumentList from './components/DocumentList'
import ChatInterface from './components/ChatInterface'

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0e0e16', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '300px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#13131f',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Database size={15} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.2px' }}>KnowledgeBase</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>RAG Chatbot</div>
            </div>
          </div>
        </div>

        {/* Upload — fixed height */}
        <div style={{ flexShrink: 0 }}>
          <DocumentUpload onIngested={() => setRefreshTrigger(n => n + 1)} />
        </div>

        {/* Document list — scrollable */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DocumentList refreshTrigger={refreshTrigger} />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Chat</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>Answers grounded in your uploaded documents</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#34d399' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#34d399',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            Connected
          </div>
        </header>

        {/* Chat — fills remaining space, scrolls internally */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
