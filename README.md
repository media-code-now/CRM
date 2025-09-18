# Mini CRM - Next.js + Prisma + NextAuth

## Quick start
1. Clone or unzip this folder.
2. Create a Postgres database (Supabase, Railway, Neon, or local). Get the connection string.
3. Copy `.env.example` to `.env` and fill values.
4. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
5. Run database migrations and seed:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
6. Start the dev server:
   ```bash
   npm run dev
   ```

Default admin from seed:
- email: admin@example.com
- password: admin123

## Notes
- Do not store raw passwords anywhere. This app stores `passwordHash` only.
- Use the **Credentials** page to keep links to items in your password manager instead of secrets.
