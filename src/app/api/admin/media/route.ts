import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file || !type) return NextResponse.json({ message: 'Missing file or type' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ message: 'File type not allowed' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 })

    const ext = file.name.split('.').pop() || 'png'
    const filename = `${type}-${Date.now()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(uploadDir, filename), buffer)

    const url = `/uploads/${filename}`

    // Update profile
    const profile = await prisma.profile.findFirst()
    const updateData: Record<string, string> = {}
    if (type === 'profileImage') updateData.profileImageUrl = url
    if (type === 'logo')         updateData.logoUrl = url
    if (type === 'favicon')      updateData.faviconUrl = url

    if (profile) {
      await prisma.profile.update({ where: { id: profile.id }, data: updateData })
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Media upload error:', err)
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { type } = await req.json()
  const profile = await prisma.profile.findFirst()
  if (!profile) return NextResponse.json({ ok: true })

  const updateData: Record<string, null> = {}
  if (type === 'profileImage') updateData.profileImageUrl = null
  if (type === 'logo')         updateData.logoUrl = null
  if (type === 'favicon')      updateData.faviconUrl = null

  await prisma.profile.update({ where: { id: profile.id }, data: updateData })
  return NextResponse.json({ ok: true })
}
