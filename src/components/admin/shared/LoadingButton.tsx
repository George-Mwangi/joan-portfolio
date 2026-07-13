'use client'

import { ReactNode } from 'react'
import { Save } from 'lucide-react'

interface LoadingButtonProps {
  loading: boolean
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}

export function LoadingButton({
  loading,
  children,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}

      {loading ? 'Saving…' : children}
    </button>
  )
}