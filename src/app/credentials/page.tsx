'use client'
import { useEffect, useState } from 'react'

type Cred = {
  id: string; system: string; accountEmail: string; externalVaultItemUrl: string;
  mfaEnabled: boolean; rotationDays?: number | null; lastRotatedAt?: string | null
}
export default function CredentialsPage() {
  const [items, setItems] = useState<Cred[]>([])
  const [form, setForm] = useState({ system: '', accountEmail: '', externalVaultItemUrl: '', mfaEnabled: true, rotationDays: '' })

  async function load() {
    const res = await fetch('/api/credentials')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  async function create() {
    const payload: any = {
      ...form,
      externalVaultItemUrl: normalizeUrl(form.externalVaultItemUrl),
      rotationDays: form.rotationDays ? Number(form.rotationDays) : null,
    }
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setForm({ system: '', accountEmail: '', externalVaultItemUrl: '', mfaEnabled: true, rotationDays: '' })
      load()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Credential references</h1>
      <p className="text-white/80">Link to Bitwarden or 1Password items. No secrets are stored here.</p>
      <div className="card grid gap-2">
        <label className="label">System</label>
        <input className="input" value={form.system} onChange={e=>setForm(s=>({...s, system:e.target.value}))} />
        <label className="label">Account email</label>
        <input className="input" value={form.accountEmail} onChange={e=>setForm(s=>({...s, accountEmail:e.target.value}))} />
        <label className="label">Password item URL</label>
        <input className="input" value={form.externalVaultItemUrl} onChange={e=>setForm(s=>({...s, externalVaultItemUrl:e.target.value}))} />
        <label className="label">Rotation days</label>
        <input className="input" value={form.rotationDays} onChange={e=>setForm(s=>({...s, rotationDays:e.target.value}))} />
        <button className="btn" onClick={create}>Add credential ref</button>
      </div>
      <table className="table">
        <thead><tr><th>System</th><th>Account</th><th>MFA</th><th>Item</th><th>Rotation</th></tr></thead>
        <tbody>
          {items.map(x => (
            <tr key={x.id}>
              <td>{x.system}</td>
              <td>{x.accountEmail}</td>
              <td>{x.mfaEnabled ? 'Yes' : 'No'}</td>
              <td><a className="underline" href={x.externalVaultItemUrl} target="_blank">Open in vault</a></td>
              <td>{x.rotationDays ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function normalizeUrl(u: string) {
  try {
    // If it already has a scheme, keep it
    const url = new URL(u);
    return url.toString();
  } catch {
    // No scheme. Prepend https
    return `https://${u.replace(/^\/+/, '')}`;
  }
}

