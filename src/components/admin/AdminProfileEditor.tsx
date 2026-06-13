'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  summary: z.string().min(10).max(5000),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  whatsappNumber: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function AdminProfileEditor({ profile }: { profile: any }) {
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      summary: profile?.summary || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      linkedinUrl: profile?.linkedinUrl || '',
      whatsappNumber: profile?.whatsappNumber || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Profile saved successfully')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const Field = ({ name, label, type = 'text', textarea = false }: {
    name: keyof ProfileFormData; label: string; type?: string; textarea?: boolean
  }) => (
    <div suppressHydrationWarning>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          {...register(name)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all resize-none"
          suppressHydrationWarning
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all"
          suppressHydrationWarning
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-xs text-destructive">{errors[name]?.message}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Edit Profile</h2>
        {isDirty && (
          <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 border border-border/50 space-y-5" suppressHydrationWarning>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="name" label="Full Name" />
          <Field name="email" label="Email Address" type="email" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="phone" label="Phone Number" />
          <Field name="location" label="Location" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="linkedinUrl" label="LinkedIn URL" />
          <Field name="whatsappNumber" label="WhatsApp Number" />
        </div>
        <Field name="summary" label="Professional Summary" textarea />

        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </form>
    </div>
  )
}
