import './globals.css'
import type { ReactNode } from 'react'
import { Navbar } from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
