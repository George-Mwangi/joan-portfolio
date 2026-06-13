import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NextRequest } from 'next/server'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatters
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-KE', options || { year: 'numeric', month: 'long' })
}

export function formatDateRange(startDate: Date, endDate?: Date | null, isCurrent?: boolean): string {
  const start = formatDate(startDate, { year: 'numeric', month: 'short' })
  if (isCurrent) return `${start} – Present`
  if (!endDate) return start
  const end = formatDate(endDate, { year: 'numeric', month: 'short' })
  return `${start} – ${end}`
}

// Simple in-memory rate limiter for API routes
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  req: NextRequest,
  options: { limit: number; windowMs: number } = { limit: 10, windowMs: 60_000 }
): { success: boolean; remaining: number } {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const key = `${ip}:${req.nextUrl.pathname}`
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs })
    return { success: true, remaining: options.limit - 1 }
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: options.limit - record.count }
}

// Input sanitizer (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// File validation
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_DOC_TYPES = ['application/pdf']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_DOC_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Accepted: ${allowedTypes.join(', ')}` }
  }
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` }
  }
  return { valid: true }
}

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${ext}`
}

// Skill category labels
export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  CORE: 'Core Skills',
  TECHNICAL: 'Technical Skills',
  SOFT: 'Soft Skills',
  LANGUAGE: 'Languages',
}

// Tool category labels
export const TOOL_CATEGORY_LABELS: Record<string, string> = {
  CRM_SUPPORT: 'CRM & Support',
  PRODUCTIVITY: 'Productivity',
  PROJECT_MANAGEMENT: 'Project Management',
  COMMUNICATION: 'Communication',
  ERP_ACCOUNTING: 'ERP & Accounting',
}

// Tool category icons (Lucide icon names)
export const TOOL_CATEGORY_ICONS: Record<string, string> = {
  CRM_SUPPORT: 'Users',
  PRODUCTIVITY: 'Briefcase',
  PROJECT_MANAGEMENT: 'KanbanSquare',
  COMMUNICATION: 'MessageSquare',
  ERP_ACCOUNTING: 'BarChart3',
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

// Slugify
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
