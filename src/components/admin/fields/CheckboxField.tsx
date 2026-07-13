'use client'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {label}
    </label>
  )
}