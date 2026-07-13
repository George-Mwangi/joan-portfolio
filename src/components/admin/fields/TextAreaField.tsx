'use client'

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none resize-none"
      />
    </div>
  )
}