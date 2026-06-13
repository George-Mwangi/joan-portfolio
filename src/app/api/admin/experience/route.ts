import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  location: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  order: z.number().default(0),
})

export async function GET() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(experiences)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = experienceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

  try {
    const exp = await prisma.experience.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        isPublished: true,
      },
    })
    return NextResponse.json(exp, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
