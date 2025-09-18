import { NextResponse } from 'next/server'

export async function GET() {
  const hasDbVar = Boolean(process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL)
  return NextResponse.json({ ok: true, hasDbVar })
}
