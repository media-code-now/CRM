import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ include: { company: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(projects)
  } catch (e: any) {
    console.error('projects GET', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data?.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    const created = await prisma.project.create({
      data: {
        name: data.name,
        stage: data.stage || 'DISCOVERY',
        valueUSD: typeof data.valueUSD === 'number' ? data.valueUSD : null,
        companyId: data.companyId || null
      }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    console.error('projects POST', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
