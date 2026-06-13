import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.tool.findMany({ orderBy: { order: 'asc' } }).catch(() => [])
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  try {
    const item = await (prisma.tool as any).create({ data: { ...body, isPublished: true } })
    return NextResponse.json(item, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 })
  }
}
