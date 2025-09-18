import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function normalizeUrl(u: string) {
  try { return new URL(u).toString() } catch { return `https://${u.replace(/^\/+/, '')}` }
}

async function main() {
  const creds = await prisma.credentialRef.findMany()
  for (const c of creds) {
    const fixed = normalizeUrl(c.externalVaultItemUrl || '')
    if (fixed !== c.externalVaultItemUrl) {
      await prisma.credentialRef.update({ where: { id: c.id }, data: { externalVaultItemUrl: fixed } })
      console.log(`Fixed ${c.id} -> ${fixed}`)
    }
  }
}
main().finally(() => prisma.$disconnect())
