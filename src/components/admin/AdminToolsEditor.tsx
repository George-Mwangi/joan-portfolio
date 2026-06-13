'use client'
import { useState } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'CRM_SUPPORT', label: 'CRM & Support' },
  { value: 'PRODUCTIVITY', label: 'Productivity' },
  { value: 'PROJECT_MANAGEMENT', label: 'Project Management' },
  { value: 'COMMUNICATION', label: 'Communication' },
  { value: 'ERP_ACCOUNTING', label: 'ERP & Accounting' },
]

export function AdminToolsEditor({ tools: init }: { tools: any[] }) {
  const [tools, setTools] = useState(init)
  const [form, setForm]   = useState<any|null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return }
    setSaving(true)
    try {
      const isEdit = !!form.id
      const res = await fetch(isEdit ? `/api/admin/tools/${form.id}` : '/api/admin/tools', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: form.category }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setTools(isEdit ? tools.map(t => t.id === saved.id ? saved : t) : [...tools, saved])
      toast.success(isEdit ? 'Updated' : 'Added')
      setForm(null)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this tool?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/tools/${id}`, { method: 'DELETE' })
      setTools(tools.filter(t => t.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
    finally { setDeleting(null) }
  }

  const grouped = CATEGORIES.map(c => ({ ...c, items: tools.filter(t => t.category === c.value) })).filter(c => c.items.length > 0)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Tools & Technologies</h2>
        <button onClick={() => setForm({ name: '', category: 'PRODUCTIVITY' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />Add Tool
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{form.id ? 'Edit Tool' : 'New Tool'}</h3>
            <button onClick={() => setForm(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tool Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Zendesk"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      <div className="space-y-5">
        {grouped.map(cat => (
          <div key={cat.value}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat.label}</p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map(tool => (
                <div key={tool.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-sm text-foreground">
                  {tool.name}
                  <button onClick={() => setForm({...tool})} className="text-muted-foreground hover:text-primary transition-colors"><Save className="w-3 h-3" /></button>
                  <button onClick={() => remove(tool.id)} disabled={deleting===tool.id} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {tools.length === 0 && <p className="text-center py-12 text-muted-foreground">No tools yet.</p>}
      </div>
    </div>
  )
}
