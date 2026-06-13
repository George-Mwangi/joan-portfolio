import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Increment download count on active resume
    await prisma.resume.updateMany({
      where: { isActive: true },
      data: { downloads: { increment: 1 } },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // non-critical, always succeed
  }
}
