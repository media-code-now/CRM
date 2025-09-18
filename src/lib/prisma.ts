import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
// Helpful for serverless - reuse fetch connections
// @ts-ignore
neonConfig.fetchConnectionCache = true

const connectionString =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL

const adapter = new PrismaNeon({ connectionString })

const globalForPrisma = global as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
