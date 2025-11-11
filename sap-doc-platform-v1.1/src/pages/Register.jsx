import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr('');
    // try backend register
    try {
      const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      if(res.ok){ navigate('/login'); return; }
    } catch(e){ console.warn('backend not available', e); }
    // fallback: store locally
    const users = JSON.parse(localStorage.getItem('sap_users') || '[]');
    if(users.find(u=>u.email===email)){ setErr('Account exists'); return; }
    users.push({ email, password }); localStorage.setItem('sap_users', JSON.stringify(users)); navigate('/login');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" type="email" />
        <input required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" type="password" />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-slate-800 text-white rounded">Create account</button>
        </div>
      </form>
    </div>
  );
}
