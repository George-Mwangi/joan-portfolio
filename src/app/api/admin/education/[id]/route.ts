import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  try {
    const item = await (prisma.education as any).update({ where: { id }, data: body })
    return NextResponse.json(item)
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  try {
    const item = await (prisma.education as any).update({ where: { id }, data: body })
    return NextResponse.json(item)
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await (prisma.education as any).delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Error' }, { status: 500 })
  }
}
