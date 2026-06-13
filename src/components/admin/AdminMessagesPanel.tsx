'use client'

import { useState } from 'react'
import { Mail, Archive, Check } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_STYLES: Record<string, string> = {
  UNREAD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  READ: 'bg-muted text-muted-foreground border-border',
  REPLIED: 'bg-primary/10 text-primary border-primary/20',
  ARCHIVED: 'bg-muted text-muted-foreground/50 border-border',
}

export function AdminMessagesPanel({ messages: initial }: { messages: any[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<string | null>(null)

  const selectedMsg = messages.find((m) => m.id === selected)

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Contact Messages</h2>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Message list */}
        <div className="lg:col-span-2 space-y-2">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No messages yet.
            </div>
          )}
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelected(msg.id)
                if (msg.status === 'UNREAD') updateStatus(msg.id, 'READ')
              }}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all',
                selected === msg.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 bg-card/50',
                msg.status === 'UNREAD' && 'font-semibold'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm text-foreground truncate">{msg.name}</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full border flex-shrink-0', STATUS_STYLES[msg.status])}>
                  {msg.status.toLowerCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.subject || '(no subject)'}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {formatDate(new Date(msg.createdAt), { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </button>
          ))}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          {selectedMsg ? (
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedMsg.name}</h3>
                  <a href={`mailto:${selectedMsg.email}`} className="text-primary text-sm hover:underline">
                    {selectedMsg.email}
                  </a>
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDate(new Date(selectedMsg.createdAt), { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {selectedMsg.subject && (
                <p className="text-sm font-medium text-foreground mb-3">
                  Re: {selectedMsg.subject}
                </p>
              )}

              <div className="bg-muted/50 rounded-xl p-4 text-sm text-foreground leading-relaxed mb-5 whitespace-pre-wrap">
                {selectedMsg.message}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || 'Your message'}`}
                  onClick={() => updateStatus(selectedMsg.id, 'REPLIED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
                <button
                  onClick={() => updateStatus(selectedMsg.id, 'REPLIED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark Replied
                </button>
                <button
                  onClick={() => updateStatus(selectedMsg.id, 'ARCHIVED')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Mail className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
