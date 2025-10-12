import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { name: true, company: { select: { name: true } } }
        }
      }
    })
    return NextResponse.json(tasks)
  } catch (e: any) {
    console.error('tasks GET', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const task = await prisma.task.create({
      data: {
        title: data.title,
        status: data.status || 'TODO',
        priority: Number(data.priority ?? 3),
        projectId: data.projectId || null
      }
    })
    return NextResponse.json(task, { status: 201 })
  } catch (e: any) {
    console.error('tasks POST', e)
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}
