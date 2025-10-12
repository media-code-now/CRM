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
    if (!form.system.trim()) return alert('System name is required')
    if (!form.accountEmail.trim()) return alert('Account email is required')
    if (!form.externalVaultItemUrl.trim()) return alert('Password item URL is required')
    
    // Validate URL format
    const normalizedUrl = normalizeUrl(form.externalVaultItemUrl);
    if (normalizedUrl === '#') {
      return alert('Please enter a valid URL. Examples:\n• https://vault.bitwarden.com/#/vault?itemId=your-item-id\n• https://my.1password.com/vaults/all/allitems/your-item-id\n• https://your-password-manager.com/item/123')
    }
    
    const payload: any = {
      ...form,
      externalVaultItemUrl: normalizedUrl,
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
    } else {
      alert('Failed to create credential reference')
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
        <input 
          className="input" 
          value={form.externalVaultItemUrl} 
          onChange={e=>setForm(s=>({...s, externalVaultItemUrl:e.target.value}))}
          placeholder="e.g. https://vault.bitwarden.com/#/vault?itemId=abc123"
        />
        <p className="text-sm text-white/60 mt-1">Enter the direct link to this item in your password manager</p>
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
              <td>
                {x.externalVaultItemUrl ? (
                  <a className="underline" href={normalizeUrl(x.externalVaultItemUrl)} target="_blank" rel="noopener noreferrer">
                    Open in vault
                  </a>
                ) : (
                  <span className="text-gray-500">No URL</span>
                )}
              </td>
              <td>{x.rotationDays ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function normalizeUrl(u: string) {
  if (!u || u.trim() === '') return '#';
  
  const trimmed = u.trim();
  
  try {
    // If it already has a scheme, validate and return
    const url = new URL(trimmed);
    return url.toString();
  } catch {
    // No scheme or invalid URL
    // Check if it looks like a domain/path
    if (trimmed.includes('.') || trimmed.startsWith('/')) {
      return `https://${trimmed.replace(/^\/+/, '')}`;
    }
    
    // If it's just a random string (like "nd9412594"), 
    // treat it as potentially a password manager ID
    // You could customize this based on your password manager
    if (trimmed.match(/^[a-zA-Z0-9]+$/)) {
      // For Bitwarden web vault, IDs are in this format:
      // return `https://vault.bitwarden.com/#/vault?itemId=${trimmed}`;
      // For 1Password, it might be different
      // For now, return a safe placeholder
      console.warn(`Invalid URL detected: ${trimmed}. Please enter a complete URL.`);
      return '#';
    }
    
    // Fallback: prepend https
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }
}

