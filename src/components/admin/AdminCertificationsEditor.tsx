'use client'
import { BadgeCheck, Plus, Save, Trash2, X } from 'lucide-react'
import { useAdminForm } from '@/hooks/useAdminForm'
import { formatDate } from '@/lib/utils'

const EMPTY = { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' }

export function AdminCertificationsEditor({ certifications }: { certifications: any[] }) {
  const { items, form, setForm, openNew, openEdit, closeForm, save, remove, saving, deleting } =
    useAdminForm({
      initialItems: certifications,
      apiBase: '/api/admin/certifications',
      dateFields: ['issueDate', 'expiryDate'],
      emptyForm: EMPTY,
      validate: (f) => !f.name?.trim() ? 'Name is required' : !f.issuer?.trim() ? 'Issuer is required' : null,
    })

  const fields: [string, string, string][] = [
    ['name',          'Certification Name *', 'text'],
    ['issuer',        'Issuing Organisation *', 'text'],
    ['issueDate',     'Issue Date',  'date'],
    ['expiryDate',    'Expiry Date', 'date'],
    ['credentialId',  'Credential ID', 'text'],
    ['credentialUrl', 'Credential URL', 'url'],
  ]

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Certifications</h2>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />Add Certification
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{(form as any).id ? 'Edit' : 'New'} Certification</h3>
            <button onClick={closeForm}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            {fields.map(([f, l, t]) => (
              <div key={f} suppressHydrationWarning>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{l}</label>
                <input type={t} value={(form as any)[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value } as any)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(cert => (
          <div key={cert.id} className="glass-card rounded-2xl p-5 border border-border/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{cert.name}</p>
              <p className="text-primary text-sm">{cert.issuer}</p>
              {cert.issueDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Issued {formatDate(new Date(cert.issueDate), { year: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(cert)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <Save className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(cert.id)} disabled={deleting === cert.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-muted-foreground">No certifications yet.</p>}
      </div>
    </div>
  )
}
