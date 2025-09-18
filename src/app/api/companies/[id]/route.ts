import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const data = await req.json()
    const updated = await prisma.company.update({
      where: { id: params.id },
      data: { name: data.name, domain: data.domain ?? null, timezone: data.timezone ?? null }
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('companies PATCH', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.company.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('companies DELETE', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
