'use client'

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function NumberField({
  label,
  value,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none"
      />
    </div>
  )
}