import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.company.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (e: any) {
    console.error('companies GET', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data?.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    const created = await prisma.company.create({ data: { name: data.name, domain: data.domain || null, timezone: data.timezone || null } })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    console.error('companies POST', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
