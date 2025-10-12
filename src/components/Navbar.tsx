'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/companies', label: 'Companies' },
  { href: '/credentials', label: 'Credentials' },
  { href: '/login', label: 'Login' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(prev => !prev)
  }

  function closeMenu() {
    setOpen(false)
  }

  return (
    <nav className="border-b border-white/10">
      <div className="container flex items-center gap-3 py-3">
        <Link href="/" className="font-semibold text-lg sm:text-base">Mini CRM</Link>
        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 sm:hidden"
          onClick={toggle}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span className="flex flex-col items-center justify-between h-5">
            <span className="block h-0.5 w-6 rounded bg-current"></span>
            <span className="block h-0.5 w-6 rounded bg-current"></span>
            <span className="block h-0.5 w-6 rounded bg-current"></span>
          </span>
        </button>
        <div className="hidden items-center gap-3 sm:ml-auto sm:flex">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="btn">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {open && (
        <div className="container pb-3 sm:hidden">
          <div className="flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="btn w-full justify-center"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
