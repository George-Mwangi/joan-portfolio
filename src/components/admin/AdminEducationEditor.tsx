'use client'
import { GraduationCap, Calendar, Plus, Save, Trash2, X } from 'lucide-react'
import { useAdminForm } from '@/hooks/useAdminForm'
import { formatDateRange } from '@/lib/utils'

const EMPTY = { institution: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, grade: '', description: '' }

export function AdminEducationEditor({ education }: { education: any[] }) {
  const { items, form, setForm, openNew, openEdit, closeForm, save, remove, saving, deleting } =
    useAdminForm({
      initialItems: education,
      apiBase: '/api/admin/education',
      dateFields: ['startDate', 'endDate'],
      emptyForm: EMPTY,
      validate: (f) =>
        !f.institution?.trim() ? 'Institution is required' :
        !f.degree?.trim()      ? 'Degree is required'      :
        !f.startDate           ? 'Start date is required'  : null,
      transform: (f: any) => ({
        ...f,
        endDate: f.isCurrent ? null : f.endDate || null,
      }),
    })

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Education</h2>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />Add Education
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{(form as any).id ? 'Edit' : 'New'} Education</h3>
            <button onClick={closeForm}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            {([['institution','Institution *'],['degree','Degree / Qualification *'],['field','Field of Study'],['grade','Grade / GPA']] as const).map(([f, l]) => (
              <div key={f} suppressHydrationWarning>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{l}</label>
                <input value={(form as any)[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value } as any)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
              </div>
            ))}
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Date *</label>
              <input type="date" value={(form as any).startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value } as any)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
            </div>
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">End Date</label>
              <input type="date" value={(form as any).endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value } as any)}
                disabled={(form as any).isCurrent}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none disabled:opacity-40" suppressHydrationWarning />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={(form as any).isCurrent || false}
              onChange={e => setForm({ ...form, isCurrent: e.target.checked, endDate: '' } as any)} />
            Currently studying here
          </label>
          <div suppressHydrationWarning>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (optional)</label>
            <textarea rows={3} value={(form as any).description || ''} onChange={e => setForm({ ...form, description: e.target.value } as any)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none resize-none" suppressHydrationWarning />
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(edu => (
          <div key={edu.id} className="glass-card rounded-2xl p-5 border border-border/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{edu.degree}</p>
              <p className="text-primary text-sm">{edu.institution}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDateRange(new Date(edu.startDate), edu.endDate ? new Date(edu.endDate) : null, edu.isCurrent)}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(edu)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <Save className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(edu.id)} disabled={deleting === edu.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-muted-foreground">No education entries yet.</p>}
      </div>
    </div>
  )
}
