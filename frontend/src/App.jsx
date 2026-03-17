import { useState } from 'react'
import { Database } from 'lucide-react'
import DocumentUpload from './components/DocumentUpload'
import DocumentList from './components/DocumentList'
import ChatInterface from './components/ChatInterface'

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-80 shrink-0 flex flex-col bg-[#13131a] border-r border-white/5">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Database size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">KnowledgeBase</p>
            <p className="text-xs text-gray-600 leading-tight">RAG Chatbot</p>
          </div>
        </div>
        <DocumentUpload onIngested={() => setRefreshTrigger(n => n + 1)} />
        <DocumentList refreshTrigger={refreshTrigger} />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm font-semibold text-white">Chat</p>
            <p className="text-xs text-gray-600">Answers grounded in your uploaded documents</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </div>
        </header>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
