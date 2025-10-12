'use client'
import { useEffect, useState } from 'react'
type Company = { id: string; name: string }
type Project = { id: string; name: string; stage: string; valueUSD?: number | null; companyId?: string | null; company?: Company | null }

const STAGES = ['LEAD','DISCOVERY','PROPOSAL','IN_PROGRESS','QA','LAUNCHED','RETAINER'] as const

export default function ProjectsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [items, setItems] = useState<Project[]>([])
  const [form, setForm] = useState({ name: '', stage: 'DISCOVERY', valueUSD: '', companyId: '' })
  const [editing, setEditing] = useState<Project | null>(null)

  async function load() {
    const [c,p] = await Promise.all([fetch('/api/companies'), fetch('/api/projects')])
    setCompanies(c.ok ? await c.json() : [])
    setItems(p.ok ? await p.json() : [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    if (!form.name.trim()) return alert('Name required')
    const payload: any = { name: form.name, stage: form.stage }
    if (form.valueUSD) payload.valueUSD = Number(form.valueUSD)
    if (form.companyId) payload.companyId = form.companyId
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return alert('Create failed')
    setForm({ name: '', stage: 'DISCOVERY', valueUSD: '', companyId: '' }); load()
  }

  async function saveEdit() {
    if (!editing) return
    const res = await fetch(`/api/projects/${editing.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editing.name,
        stage: editing.stage,
        valueUSD: editing.valueUSD ?? null,
        companyId: editing.companyId ?? null
      })
    })
    if (!res.ok) return alert('Update failed')
    setEditing(null); load()
  }

  async function remove(id: string) {
    if (!confirm('Delete project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (!res.ok) return alert('Delete failed')
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>

      <div className="card grid gap-2 max-w-xl">
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm(s=>({...s, name:e.target.value}))} />
        <label className="label">Stage</label>
        <select className="input" value={form.stage} onChange={e=>setForm(s=>({...s, stage:e.target.value}))}>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="label">Value USD</label>
        <input className="input" value={form.valueUSD} onChange={e=>setForm(s=>({...s, valueUSD:e.target.value}))} />
        <label className="label">Company</label>
        <select className="input" value={form.companyId} onChange={e=>setForm(s=>({...s, companyId:e.target.value}))}>
          <option value="">No company</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn" onClick={create}>Add project</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table min-w-[42rem]">
          <thead><tr><th>Name</th><th>Stage</th><th>Value</th><th>Company</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id}>
                <td>{editing?.id === x.id
                  ? <input className="input" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
                  : x.name}
                </td>
                <td>{editing?.id === x.id
                  ? <select className="input" value={editing.stage} onChange={e=>setEditing({...editing, stage:e.target.value})}>
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  : x.stage}
                </td>
                <td>{editing?.id === x.id
                  ? <input className="input" value={editing.valueUSD ?? ''} onChange={e=>setEditing({...editing, valueUSD: Number(e.target.value || 0)})} />
                  : (x.valueUSD ?? '')}
                </td>
                <td>{editing?.id === x.id
                  ? <select className="input" value={editing.companyId ?? ''} onChange={e=>setEditing({...editing, companyId: e.target.value || null})}>
                      <option value="">No company</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  : x.company?.name ?? ''}
                </td>
                <td className="flex gap-2">
                  {editing?.id === x.id
                    ? (<>
                        <button className="btn" onClick={saveEdit}>Save</button>
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
    </div>
  )
}
