'use client'

interface DateFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export function DateField({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
}: DateFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {label}
        {required && ' *'}
      </label>

      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none disabled:opacity-40"
      />
    </div>
  )
}