import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function normalizeUrl(u: string) {
  if (!u || u.trim() === '') return '';
  
  const trimmed = u.trim();
  
  try {
    // If it already has a scheme, validate and return
    const url = new URL(trimmed);
    return url.toString();
  } catch {
    // Check if it looks like a domain/path
    if (trimmed.includes('.') || trimmed.startsWith('/')) {
      return `https://${trimmed.replace(/^\/+/, '')}`;
    }
    
    // If it's just a random string, mark for manual review
    if (trimmed.match(/^[a-zA-Z0-9]+$/)) {
      console.warn(`⚠️  Invalid URL found: "${trimmed}" - needs manual review`);
      return ''; // Clear invalid URLs
    }
    
    // Fallback: prepend https
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }
}

async function main() {
  const creds = await prisma.credentialRef.findMany()
  console.log(`Found ${creds.length} credential reference(s)`)
  
  for (const c of creds) {
    const original = c.externalVaultItemUrl || '';
    const fixed = normalizeUrl(original);
    
    if (fixed !== original) {
      if (fixed === '') {
        console.log(`🗑️  Clearing invalid URL for ${c.system} (${c.accountEmail}): "${original}"`)
      } else {
        console.log(`🔧 Fixing URL for ${c.system} (${c.accountEmail}): "${original}" -> "${fixed}"`)
      }
      
      await prisma.credentialRef.update({ 
        where: { id: c.id }, 
        data: { externalVaultItemUrl: fixed } 
      })
    } else {
      console.log(`✅ URL OK for ${c.system} (${c.accountEmail}): "${original}"`)
    }
  }
  
  console.log('\n✨ Credential URL cleanup complete!')
}

main().finally(() => prisma.$disconnect())
