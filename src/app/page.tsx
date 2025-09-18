'use client'
import { useEffect, useState } from 'react'

type Company = { id: string; name: string; domain?: string | null; timezone?: string | null }

export default function CompaniesPage() {
  const [items, setItems] = useState<Company[]>([])
  const [form, setForm] = useState({ name: '', domain: '', timezone: '' })
  const [editing, setEditing] = useState<Company | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    const res = await fetch('/api/companies')
    if (!res.ok) { setError(await res.text()); return }
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  async function create() {
    if (!form.name.trim()) return alert('Name required')
    setLoading(true)
    const res = await fetch('/api/companies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false)
    if (!res.ok) return alert('Create failed')
    setForm({ name: '', domain: '', timezone: '' }); load()
  }

  async function update() {
    if (!editing) return
    const res = await fetch(`/api/companies/${editing.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editing.name, domain: editing.domain, timezone: editing.timezone })
    })
    if (!res.ok) return alert('Update failed')
    setEditing(null); load()
  }

  async function remove(id: string) {
    if (!confirm('Delete company?')) return
    const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' })
    if (!res.ok) return alert('Delete failed')
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Companies</h1>

      {error && <div className="card text-red-300">Error: {error}</div>}

      <div className="card grid gap-2 max-w-xl">
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm(s=>({...s, name:e.target.value}))} />
        <label className="label">Domain</label>
        <input className="input" value={form.domain} onChange={e=>setForm(s=>({...s, domain:e.target.value}))} />
        <label className="label">Timezone</label>
        <input className="input" value={form.timezone} onChange={e=>setForm(s=>({...s, timezone:e.target.value}))} />
        <button className="btn" onClick={create} disabled={loading}>{loading ? 'Saving...' : 'Add company'}</button>
      </div>

      <table className="table">
        <thead><tr><th>Name</th><th>Domain</th><th>Timezone</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(x => (
            <tr key={x.id}>
              <td>{editing?.id === x.id
                ? <input className="input" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
                : x.name}
              </td>
              <td>{editing?.id === x.id
                ? <input className="input" value={editing.domain ?? ''} onChange={e=>setEditing({...editing, domain:e.target.value})} />
                : x.domain}
              </td>
              <td>{editing?.id === x.id
                ? <input className="input" value={editing.timezone ?? ''} onChange={e=>setEditing({...editing, timezone:e.target.value})} />
                : x.timezone}
              </td>
              <td className="flex gap-2">
                {editing?.id === x.id
                  ? (<>
                      <button className="btn" onClick={update}>Save</button>
                      <button className="btn" onClick={()=>setEditing(null)}>Cancel</button>
                    </>)
                  : (<>
                      <button className="btn" onClick={()=>setEditing(x)}>Edit</button>
                      <button className="btn" onClick={()=>remove(x.id)}>Delete</button>
                    </>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
