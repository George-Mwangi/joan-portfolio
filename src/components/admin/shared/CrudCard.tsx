'use client'

import { Calendar, Edit3, Trash2, LucideIcon } from 'lucide-react'

interface CrudCardProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  date?: string
  deleting?: boolean
  onEdit: () => void
  onDelete: () => void
}

export function CrudCard({
  icon: Icon,
  title,
  subtitle,
  date,
  deleting = false,
  onEdit,
  onDelete,
}: CrudCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/50 flex items-start gap-4">

      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">
          {title}
        </p>

        {subtitle && (
          <p className="text-primary text-sm">
            {subtitle}
          </p>
        )}

        {date && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {date}
          </p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  )
}