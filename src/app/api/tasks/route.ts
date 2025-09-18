import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
type Params = { params: { id: string } }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const data = await req.json()
    const updated = await prisma.task.update({
      where: { id: params.id },
      data: { title: data.title, status: data.status, priority: Number(data.priority ?? 3) }
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('tasks PATCH', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.task.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('tasks DELETE', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
