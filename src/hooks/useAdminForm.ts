'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

// ── Date helpers ─────────────────────────────────────────────────────────────
// Prisma requires full ISO-8601 DateTime strings.
// HTML date inputs return "YYYY-MM-DD". This converts safely.
export function toISODate(val: string | null | undefined): string | null {
  if (!val || val.trim() === '') return null
  // Already a full ISO string — return as-is
  if (val.includes('T')) return val
  // "YYYY-MM-DD" → "YYYY-MM-DDT00:00:00.000Z"
  const d = new Date(`${val}T00:00:00.000Z`)
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

// For display: ISO string → "YYYY-MM-DD" for <input type="date">
export function toDateInput(val: string | Date | null | undefined): string {
  if (!val) return ''
  const d = typeof val === 'string' ? new Date(val) : val
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

// Walk through a payload and convert any date field values to ISO strings.
// Field names must match the dateFields list passed by each editor.
function normalizeDates(payload: Record<string, any>, dateFields: string[]): Record<string, any> {
  const result = { ...payload }
  for (const field of dateFields) {
    if (field in result) {
      result[field] = toISODate(result[field] as string)
    }
  }
  return result
}

// ── Hook ─────────────────────────────────────────────────────────────────────
interface UseAdminFormOptions<T extends { id?: string }> {
  /** Initial list of items */
  initialItems: T[]
  /** API base path e.g. "/api/admin/certifications" */
  apiBase: string
  /** Fields that contain dates — automatically converted to ISO-8601 before save */
  dateFields?: string[]
  /** Validate before save. Return error string or null. */
  validate?: (form: Partial<T>) => string | null
  /** Transform form data before sending to API (after date normalisation) */
  transform?: (form: Partial<T>) => Record<string, any>
  /** Empty form defaults */
  emptyForm: Partial<T>
}

export function useAdminForm<T extends { id?: string }>({
  initialItems,
  apiBase,
  dateFields = [],
  validate,
  transform,
  emptyForm,
}: UseAdminFormOptions<T>) {
  const [items,    setItems]    = useState<T[]>(initialItems)
  const [form,     setForm]     = useState<Partial<T> | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const openNew  = useCallback(() => setForm({ ...emptyForm }), [emptyForm])
  const openEdit = useCallback((item: T) => {
    // Normalise date fields for <input type="date"> display
    const prepped: any = { ...item }
    for (const f of dateFields) {
      if (prepped[f]) prepped[f] = toDateInput(prepped[f])
    }
    setForm(prepped)
  }, [dateFields])
  const closeForm = useCallback(() => setForm(null), [])

  const save = useCallback(async () => {
    if (!form) return

    // Validate
    const error = validate?.(form)
    if (error) { toast.error(error); return }

    setSaving(true)
    try {
      const isEdit = !!form.id

      // Normalise dates then apply optional transform
      let payload = normalizeDates(form as Record<string, any>, dateFields)
      if (transform) payload = transform(payload as Partial<T>)

      const url    = isEdit ? `${apiBase}/${form.id}` : apiBase
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${res.status}`)
      }

      const saved: T = await res.json()
      setItems(prev => isEdit
        ? prev.map(i => i.id === saved.id ? saved : i)
        : [...prev, saved]
      )
      toast.success(isEdit ? 'Updated successfully' : 'Added successfully')
      setForm(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [form, apiBase, dateFields, validate, transform])

  const remove = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setDeleting(id)
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Deleted successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }, [apiBase])

  return { items, form, setForm, openNew, openEdit, closeForm, save, remove, saving, deleting }
}
