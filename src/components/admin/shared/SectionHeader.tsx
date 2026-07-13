'use client'

import { LucideIcon, Plus } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  addLabel: string
  onAdd: () => void
  icon?: LucideIcon
}

export function SectionHeader({
  title,
  addLabel,
  onAdd,
  icon: Icon,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}

        <h2 className="text-xl font-display font-bold text-foreground">
          {title}
        </h2>
      </div>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  )
}