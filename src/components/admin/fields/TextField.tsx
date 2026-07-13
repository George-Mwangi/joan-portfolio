'use client'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}: TextFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {label}
        {required && ' *'}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none disabled:opacity-50"
      />
    </div>
  )
}