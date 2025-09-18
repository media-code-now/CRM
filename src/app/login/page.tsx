'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')

  // Placeholder UI - wire up to NextAuth if you want client sign-in
  async function demo(e: React.FormEvent) {
    e.preventDefault()
    alert('This starter uses Credentials provider on the API route. Protect pages with auth in a next step.')
  }

  return (
    <form onSubmit={demo} className="card max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Login</h1>
      <label className="label">Email</label>
      <input className="input mb-2" value={email} onChange={e=>setEmail(e.target.value)} />
      <label className="label">Password</label>
      <input className="input mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn" type="submit">Sign in</button>
    </form>
  )
}
