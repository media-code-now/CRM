import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-white/10">
          <div className="container flex items-center gap-4 py-3">
            <Link href="/" className="font-semibold">Mini CRM</Link>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/projects" className="btn">Projects</Link>
              <Link href="/tasks" className="btn">Tasks</Link>
              <Link href="/companies" className="btn">Companies</Link>
              <Link href="/credentials" className="btn">Credentials</Link>
              <Link href="/login" className="btn">Login</Link>
            </div>
          </div>
        </nav>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
