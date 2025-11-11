import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr('');
    // try backend login
    try {
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      if(res.ok){ const j = await res.json(); localStorage.setItem('sap_jwt', j.token); navigate('/dashboard'); return; }
    } catch(e){ console.warn('backend not available', e); }
    // fallback: simple local account check
    const users = JSON.parse(localStorage.getItem('sap_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if(user){ localStorage.setItem('sap_jwt', 'local-'+Date.now()); navigate('/dashboard'); return; }
    setErr('Invalid credentials or server not reachable.');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" type="email" />
        <input required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" type="password" />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-slate-800 text-white rounded">Login</button>
          <Link to="/register" className="text-sm">Create account</Link>
        </div>
      </form>
    </div>
  );
}
