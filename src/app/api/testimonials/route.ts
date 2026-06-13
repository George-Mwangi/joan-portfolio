import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit, sanitizeInput } from '@/lib/utils'

const schema = z.object({
  authorName:    z.string().min(2).max(100),
  authorTitle:   z.string().max(100).optional(),
  authorCompany: z.string().max(100).optional(),
  content:       z.string().min(20).max(1000),
  rating:        z.number().min(1).max(5),
})

export async function POST(req: NextRequest) {
  const { success } = rateLimit(req, { limit: 3, windowMs: 60 * 60 * 1000 }) // 3 per hour per IP
  if (!success) return NextResponse.json({ message: 'Too many requests.' }, { status: 429 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid input' }, { status: 400 })

  const { authorName, authorTitle, authorCompany, content, rating } = parsed.data

  await prisma.testimonial.create({
    data: {
      authorName:    sanitizeInput(authorName),
      authorTitle:   authorTitle   ? sanitizeInput(authorTitle)   : null,
      authorCompany: authorCompany ? sanitizeInput(authorCompany) : null,
      content:       sanitizeInput(content),
      rating,
      isPublished: false, // pending admin approval
    },
  })

  return NextResponse.json({ message: 'Submitted for review' }, { status: 201 })
}
