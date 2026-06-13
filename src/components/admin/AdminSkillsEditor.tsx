'use client'
import { useState } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const CATEGORIES = [{ value: 'CORE', label: 'Core Skills' }, { value: 'TECHNICAL', label: 'Technical' }, { value: 'SOFT', label: 'Soft Skills' }, { value: 'LANGUAGE', label: 'Languages' }]

const emptySkill = { name: '', category: 'CORE', proficiency: 85 }

export function AdminSkillsEditor({ skills: init }: { skills: any[] }) {
  const [skills, setSkills] = useState(init)
  const [form, setForm]     = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)

  const openNew  = () => setForm({ ...emptySkill })
  const openEdit = (s: any) => setForm({ ...s })
  const closeForm = () => setForm(null)

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const isEdit = !!form.id
      const res = await fetch(isEdit ? `/api/admin/skills/${form.id}` : '/api/admin/skills', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: form.category, proficiency: Number(form.proficiency) }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setSkills(isEdit ? skills.map(s => s.id === saved.id ? saved : s) : [...skills, saved])
      toast.success(isEdit ? 'Skill updated' : 'Skill added')
      closeForm()
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
      setSkills(skills.filter(s => s.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
    finally { setDeleting(null) }
  }

  const grouped = CATEGORIES.map(c => ({ ...c, items: skills.filter(s => s.category === c.value) })).filter(c => c.items.length > 0)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Skills</h2>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />Add Skill
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{form.id ? 'Edit Skill' : 'New Skill'}</h3>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3" suppressHydrationWarning>
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Contract Negotiation"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Proficiency: {form.proficiency}%</label>
              <input type="range" min={10} max={100} step={5} value={form.proficiency} onChange={e => setForm({...form, proficiency: Number(e.target.value)})}
                className="w-full" suppressHydrationWarning />
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {grouped.map(cat => (
          <div key={cat.value}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat.label}</p>
            <div className="space-y-2">
              {cat.items.map(skill => (
                <div key={skill.id} className="glass-card rounded-xl p-4 border border-border/50 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{skill.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{skill.proficiency}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(skill)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(skill.id)} disabled={deleting === skill.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-center py-12 text-muted-foreground">No skills yet. Click "Add Skill" to start.</p>}
      </div>
    </div>
  )
}
