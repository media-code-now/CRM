'use client'
import { useEffect, useState } from 'react'

type Company = { id: string; name: string; domain?: string | null; timezone?: string | null }

export default function CompaniesPage() {
  const [items, setItems] = useState<Company[]>([])
  const [form, setForm] = useState({ name: '', domain: '', timezone: '' })

  async function load() {
    const res = await fetch('/api/companies')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  async function create() {
    const res = await fetch('/api/companies', { method: 'POST', body: JSON.stringify(form) })
    if (res.ok) { setForm({ name: '', domain: '', timezone: '' }); load() }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Companies</h1>
      <div className="card space-y-2">
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm(s=>({...s, name:e.target.value}))} />
        <label className="label">Domain</label>
        <input className="input" value={form.domain} onChange={e=>setForm(s=>({...s, domain:e.target.value}))} />
        <label className="label">Timezone</label>
        <input className="input" value={form.timezone} onChange={e=>setForm(s=>({...s, timezone:e.target.value}))} />
        <button className="btn" onClick={create}>Add company</button>
      </div>

      <table className="table">
        <thead><tr><th>Name</th><th>Domain</th><th>Timezone</th></tr></thead>
        <tbody>
          {items.map(x => (
            <tr key={x.id}><td>{x.name}</td><td>{x.domain}</td><td>{x.timezone}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
