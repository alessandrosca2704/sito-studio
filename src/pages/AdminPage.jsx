import React from 'react';
import './AdminPage.css';
import { getNews, saveNews, resetNews } from '../data';
import { logout } from '../auth';
import RichEditor from '../components/admin/RichEditor';

// Static GitHub config (edit here once)
// Set these values to your repo and Netlify hook
const COMMIT_CFG = {
  owner: 'alessandrosca2704',
  repo: 'sito-studio',
  branch: 'main',
  path: 'public/assets/news.json',
  message: 'chore: update news.json via /admin',
  userName: 'Site Admin',
  userEmail: 'admin@example.com',
  deployHook: '' // optional Netlify build hook URL
};

function emptyPost(){
  return { slug:'', title:'', excerpt:'', image:'', content:'' };
}

export default function AdminPage(){
  const lang = (typeof window!=='undefined' && document.documentElement.lang) || 'it';
  const [items, setItems] = React.useState(()=>getNews(lang));
  const [current, setCurrent] = React.useState(emptyPost());
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [token, setToken] = React.useState(()=>localStorage.getItem('admin_github_token')||'');
  const [rememberToken, setRememberToken] = React.useState(()=>{
    try { return JSON.parse(localStorage.getItem('admin_github_remember')||'false'); } catch { return false; }
  });
  const [commitStatus, setCommitStatus] = React.useState('');

  React.useEffect(()=>{ setItems(getNews(lang)); setEditingIndex(-1); setCurrent(emptyPost()); }, [lang]);

  const startNew = () => { setCurrent(emptyPost()); setEditingIndex(-1); };
  const editItem = (i) => { setEditingIndex(i); setCurrent(items[i]); };
  const updateField = (k,v) => setCurrent(prev => ({...prev, [k]: v}));

  const save = () => {
    if (!current.title || !current.slug) { alert('Title and slug are required'); return; }
    const arr = [...items];
    const existsIdx = arr.findIndex(p => p.slug === current.slug);
    if (editingIndex === -1) {
      if (existsIdx !== -1) { alert('Slug already exists'); return; }
      arr.unshift(current);
    } else {
      if (existsIdx !== -1 && existsIdx !== editingIndex) { alert('Slug already exists'); return; }
      arr[editingIndex] = current;
    }
    setItems(arr); saveNews(lang, arr); startNew();
  };

  const remove = (i) => {
    if (!window.confirm('Delete this news?')) return;
    const arr = items.filter((_,idx)=> idx!==i);
    setItems(arr); saveNews(lang, arr); startNew();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `news_${lang}.json`;
    a.click();
  };

  const importJson = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('Invalid JSON array');
        setItems(arr); saveNews(lang, arr); startNew();
      } catch(err){ alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (!window.confirm('Reset to defaults?')) return;
    resetNews(lang); setItems(getNews(lang)); startNew();
  };

  const testConnection = async () => {
    if (!token) { setCommitStatus('Token missing'); return; }
    setCommitStatus('Testing GitHub connection...');
    try {
      const baseUrl = `https://api.github.com/repos/${COMMIT_CFG.owner}/${COMMIT_CFG.repo}/contents/${COMMIT_CFG.path}?ref=${encodeURIComponent(COMMIT_CFG.branch)}`;
      const res = await fetch(baseUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}` }});
      if (res.status === 404) { setCommitStatus('Repo/branch OK. File not found (will be created)'); return; }
      if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t}`); }
      const j = await res.json();
      setCommitStatus(`OK. File exists (sha: ${j.sha ? j.sha.slice(0,7) : 'n/a'})`);
    } catch(err){ setCommitStatus('Test error: ' + (err.message || String(err))); }
  };

  const commitNews = async () => {
    if (!token) { setCommitStatus('Token missing'); return; }
    saveNews(lang, items); // ensure latest in current lang
    setCommitStatus('Preparing commit...');
    try {
      const payload = { it: getNews('it'), en: getNews('en') };
      const json = JSON.stringify(payload, null, 2);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      const baseUrl = `https://api.github.com/repos/${COMMIT_CFG.owner}/${COMMIT_CFG.repo}/contents/${COMMIT_CFG.path}`;
      let sha = undefined;
      const getRes = await fetch(`${baseUrl}?ref=${encodeURIComponent(COMMIT_CFG.branch)}`, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}` }});
      if (getRes.ok){ const j = await getRes.json(); sha = j.sha; }
      const body = { message: COMMIT_CFG.message, content: b64, branch: COMMIT_CFG.branch, committer: { name: COMMIT_CFG.userName, email: COMMIT_CFG.userEmail } };
      if (sha) body.sha = sha;
      const putRes = await fetch(baseUrl, { method:'PUT', headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      if (!putRes.ok) { const t = await putRes.text(); throw new Error(`Commit failed: ${t}`); }
      setCommitStatus('Commit done.');
      if (COMMIT_CFG.deployHook){
        setCommitStatus('Commit OK. Triggering Netlify...');
        try { await fetch(COMMIT_CFG.deployHook, { method:'POST', mode:'no-cors' }); setCommitStatus('Deploy hook sent.'); }
        catch { setCommitStatus('Commit OK. Deploy hook unreachable.'); }
      }
    } catch(err){ setCommitStatus(String(err.message||err)); }
  };

  return (
    <section className="section admin">
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
        <h2 style={{margin:0}}>Admin</h2>
        <button className="btn" onClick={()=>{ logout(); window.location.href = '/login'; }}>Logout</button>
      </div>
      <div className="container admin__layout">
        <div className="admin__list">
          <div className="admin__listhead">
            <h2>News ({lang.toUpperCase()})</h2>
            <div className="admin__actions">
              <button className="btn" onClick={startNew}>New</button>
              <button className="btn" onClick={exportJson}>Export</button>
              <label className="btn" style={{cursor:'pointer'}}>
                Import
                <input type="file" accept="application/json" onChange={importJson} style={{display:'none'}}/>
              </label>
              <button className="btn" onClick={reset}>Reset</button>
            </div>
          </div>
          <ul className="admin__items">
            {items.map((p,i)=> (
              <li key={p.slug} className={i===editingIndex? 'active':''}>
                <div className="title" onClick={()=>editItem(i)}>{p.title}</div>
                <div className="slug">/{p.slug}</div>
                <button className="link danger" onClick={()=>remove(i)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin__form">
          <h3>{editingIndex===-1? 'Nuovo Articolo' : "Modifica un'articolo"}</h3>
          <div className="form-admin">
            <label>
              <span>Titolo</span>
              <input value={current.title} onChange={e=>updateField('title', e.target.value)} />
            </label>
            <label>
              <span>Slug (url)</span>
              <input value={current.slug} onChange={e=>updateField('slug', e.target.value.replace(/\s+/g,'-').toLowerCase())} />
            </label>
            <label className="full">
              <span>Immagine (URL)</span>
              <input value={current.image} onChange={e=>updateField('image', e.target.value)} placeholder={`${window.location.origin}/assets/news/example.jpg`} />
            </label>
            <label className="full">
              <span>Estratto</span>
              <textarea rows={3} value={current.excerpt} onChange={e=>updateField('excerpt', e.target.value)} />
            </label>
            <label className="full editor">
              <span>Contenuto</span>
              <RichEditor value={current.content} onChange={(val)=>updateField('content', val)} />
            </label>
          </div>
          <div className="admin__formactions">
            <button className="btn btn-brand" onClick={save}>Save</button>
          </div>
        </div>
      </div>

      <div className="container panel">
        <div className="panel__head">
          <h3>GitHub Commit (Netlify deploy)</h3>
        </div>
        <div className="cfg-grid">
          <div className="cfg-readonly">
            <div><strong>Repo:</strong> {COMMIT_CFG.owner}/{COMMIT_CFG.repo}</div>
            <div><strong>Branch:</strong> {COMMIT_CFG.branch}</div>
            <div><strong>Path:</strong> {COMMIT_CFG.path}</div>
          </div>
          <label className="full">
            <span>GitHub Token (PAT)</span>
            <input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Fine-grained PAT with Contents: Read/Write" />
          </label>
        </div>
        <div className="panel__actions">
          
          <button className="btn" onClick={testConnection}>Test connection</button>
          <button className="btn btn-brand" onClick={commitNews}>Commit news.json</button>
          <div className="status">{commitStatus}</div>
        </div>
      </div>
    </section>
  );
}
