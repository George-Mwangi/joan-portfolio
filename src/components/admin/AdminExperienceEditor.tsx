'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit3, Calendar, Building2 } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'
import toast from 'react-hot-toast'

export function AdminExperienceEditor({ experiences: initial }: { experiences: any[] }) {
  const [experiences, setExperiences] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success('Deleted successfully')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Work Experience</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="glass-card rounded-2xl p-5 border border-border/50 flex items-start justify-between gap-4"
          >
            <div className="flex gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{exp.role}</h3>
                <p className="text-primary text-sm">{exp.company}</p>
                <p className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateRange(new Date(exp.startDate), exp.endDate ? new Date(exp.endDate) : null, exp.isCurrent)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                disabled={deleting === exp.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No experience entries yet. Click &quot;Add Experience&quot; to get started.
          </div>
        )}
      </div>
    </div>
  )
}
