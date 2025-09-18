// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const raw = process.env.SEED_ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(raw, 10)

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', passwordHash },
  })

  const acme = await prisma.company.create({
    data: { name: 'Acme Co', domain: 'acme.test', timezone: 'America/Los_Angeles' }
  })

  const proj = await prisma.project.create({
    data: { name: 'Website Revamp', companyId: acme.id, stage: 'DISCOVERY' }
  })

  await prisma.task.createMany({
    data: [
      { projectId: proj.id, title: 'Kickoff call', status: 'TODO', priority: 2 },
      { projectId: proj.id, title: 'Audit DNS', status: 'TODO', priority: 3 },
    ]
  })

  console.log('Seeded. Admin login: admin@example.com / admin123')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
