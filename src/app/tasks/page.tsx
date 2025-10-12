'use client'
import { useEffect, useState } from 'react'
type Task = { id: string; title: string; status: string; priority: number }
const STATUSES = ['TODO','DOING','BLOCKED','REVIEW','DONE'] as const

export default function TasksPage() {
  const [items, setItems] = useState<Task[]>([])
  const [form, setForm] = useState({ title: '', status: 'TODO', priority: 3 })

  async function load() {
    const res = await fetch('/api/tasks')
    setItems(res.ok ? await res.json() : [])
  }
  useEffect(() => { load() }, [])

  async function create() {
    if (!form.title.trim()) return alert('Title required')
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ title: '', status: 'TODO', priority: 3 }); load() } else alert('Create failed')
  }

  async function update(id: string, patch: Partial<Task>) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (res.ok) load()
  }

  async function remove(id: string) {
    if (!confirm('Delete task?')) return
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <div className="card grid gap-2 max-w-xl">
        <label className="label">Title</label>
        <input className="input" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))} />
        <label className="label">Status</label>
        <select className="input" value={form.status} onChange={e=>setForm(s=>({...s, status:e.target.value}))}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="label">Priority (1-5)</label>
        <input type="number" min={1} max={5} className="input" value={form.priority} onChange={e=>setForm(s=>({...s, priority:Number(e.target.value)}))} />
        <button className="btn" onClick={create}>Add task</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table min-w-[40rem]">
          <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(x => (
              <tr key={x.id}>
                <td>{x.title}</td>
                <td className="flex gap-2 flex-wrap">
                  {STATUSES.map(s => (
                    <button key={s} className={`btn ${x.status===s ? 'bg-white/10' : ''}`} onClick={()=>update(x.id, { status: s })}>{s}</button>
                  ))}
                </td>
                <td>{x.priority}</td>
                <td><button className="btn" onClick={()=>remove(x.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
