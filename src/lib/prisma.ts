import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
// @ts-ignore
neonConfig.fetchConnectionCache = true

const connectionString =
  process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL
if (!connectionString) throw new Error('Missing DATABASE_URL/NETLIFY_DATABASE_URL')

const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter })
