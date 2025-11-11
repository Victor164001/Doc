import React, { useState, useEffect } from 'react';

export default function Dashboard(){
  const [tab, setTab] = useState('create');
  const [docs, setDocs] = useState([]);

  useEffect(()=>{ const d = JSON.parse(localStorage.getItem('sap_saved_docs')||'[]'); setDocs(d); }, []);

  function saveDocLocal(doc){
    const arr = JSON.parse(localStorage.getItem('sap_saved_docs')||'[]');
    arr.unshift(doc);
    localStorage.setItem('sap_saved_docs', JSON.stringify(arr));
    setDocs(arr);
  }

  async function submitForm(e){
    e.preventDefault();
    const form = new FormData(e.target);
    const title = form.get('title') || '';
    const story = form.get('story') || '';
    const tr = form.get('tr') || '';
    const requirement = form.get('requirement') || '';
    const testCases = JSON.parse(form.get('testCases') || '[]');
    const doc = { id: Date.now(), title: title|| (story?`${story} - ${tr}`:'Untitled'), story, tr, requirement, testCases, createdAt: new Date().toISOString() };
    // try backend save
    try {
      const token = localStorage.getItem('sap_jwt');
      const res = await fetch('/api/docs', { method:'POST', headers: { 'Content-Type':'application/json', Authorization: token?`Bearer ${token}`:'', }, body: JSON.stringify(doc) });
      if(res.ok){ const json = await res.json(); saveDocLocal(json); alert('Saved on server'); setTab('list'); return; }
    } catch(e){ console.warn('server not available', e); }
    // fallback: save locally
    saveDocLocal(doc);
    alert('Saved locally');
    setTab('list');
  }

  function downloadDoc(d){
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${(d.title||'doc').replace(/[^a-z0-9-_]/gi,'_')}.json`; a.click(); URL.revokeObjectURL(url);
  }

  function logout(){ localStorage.removeItem('sap_jwt'); window.location.href='/login'; }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="space-x-2">
          <button onClick={()=>setTab('create')} className={`px-3 py-1 rounded ${tab==='create'?'bg-slate-800 text-white':'border'}`}>Create Document</button>
          <button onClick={()=>setTab('list')} className={`px-3 py-1 rounded ${tab==='list'?'bg-slate-800 text-white':'border'}`}>My Documents</button>
          <button onClick={logout} className="px-3 py-1 border rounded text-sm">Logout</button>
        </div>
      </div>

      {tab==='create' && (
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={submitForm}>
            <input name="title" placeholder="Document Title" className="w-full p-2 border rounded mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input name="story" placeholder="JIRA / Story / Task" className="p-2 border rounded" />
              <input name="tr" placeholder="TR" className="p-2 border rounded" />
            </div>
            <textarea name="requirement" placeholder="Requirement description" className="w-full p-2 border rounded mb-3" />
            <TestCasesEditor initialTc={[{ id: Date.now(), title:'', description:'', input:'', expected:'' }]} />
            <div className="mt-3 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded">Save Document</button>
            </div>
          </form>
        </div>
      )}

      {tab==='list' && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">My Documents</h3>
          {docs.length===0 ? <div className="text-sm text-gray-600">No documents yet</div> :
            <ul className="space-y-2">
              {docs.map(d=>(
                <li key={d.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={()=>downloadDoc(d)} className="px-2 py-1 border rounded text-sm">Download JSON</button>
                    <button onClick={()=>{ navigator.clipboard.writeText(JSON.stringify(d)); alert('Copied JSON to clipboard'); }} className="px-2 py-1 border rounded text-sm">Copy</button>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      )}
    </div>
  );
}

// Simple TestCasesEditor component
function TestCasesEditor({ initialTc }){
  const [tcs, setTcs] = React.useState(initialTc || []);
  function add(){ setTcs(s=>[...s, { id: Date.now(), title:'', description:'', input:'', expected:'' }]); }
  function update(id, field, val){ setTcs(s=>s.map(tc=>tc.id===id?{...tc,[field]:val}:tc)); }
  function remove(id){ setTcs(s=>s.filter(tc=>tc.id!==id)); }
  // keep a hidden input to pass tcs to form submit
  return (
    <div>
      <div className="space-y-3">
        {tcs.map((tc,i)=>(
          <div key={tc.id} className="p-3 border rounded">
            <div className="flex items-start justify-between">
              <input className="flex-1 p-2 border rounded mr-3" placeholder={`Test Case ${i+1} title`} value={tc.title} onChange={e=>update(tc.id,'title',e.target.value)} />
              <button onClick={()=>remove(tc.id)} className="text-red-600">Remove</button>
            </div>
            <textarea className="w-full p-2 border rounded mt-2" placeholder="Description" value={tc.description} onChange={e=>update(tc.id,'description',e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <textarea className="w-full p-2 border rounded" placeholder="Input" value={tc.input} onChange={e=>update(tc.id,'input',e.target.value)} />
              <textarea className="w-full p-2 border rounded" placeholder="Expected" value={tc.expected} onChange={e=>update(tc.id,'expected',e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button type="button" onClick={add} className="px-3 py-1 border rounded">+ Add Test Case</button>
      </div>
      <input type="hidden" name="testCases" value={JSON.stringify(tcs)} />
    </div>
  );
}
