import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.credentialRef.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const created = await prisma.credentialRef.create({ data })
  return NextResponse.json(created, { status: 201 })
}
