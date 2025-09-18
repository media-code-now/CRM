import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    const item = await prisma.project.findUnique({ where: { id: params.id }, include: { company: true } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (e: any) {
    console.error('projects GET one', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const data = await req.json()
    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        name: data.name,
        stage: data.stage,
        valueUSD: data.valueUSD ?? null,
        companyId: data.companyId ?? null
      }
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('projects PATCH', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.project.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('projects DELETE', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
