import { PrismaClient } from '@prisma/client'

const connectionString =
  process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL

if (!connectionString) {
  throw new Error('Missing DATABASE_URL or NETLIFY_DATABASE_URL')
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: connectionString,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
