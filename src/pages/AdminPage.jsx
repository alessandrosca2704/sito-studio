import React from 'react';
import './AdminPage.css';
import { getNews, saveNews, resetNews } from '../data';

function emptyPost(){
  return { slug:'', title:'', excerpt:'', image:'', content:'' };
}

export default function AdminPage(){
  const lang = (typeof window!=='undefined' && document.documentElement.lang) || 'it';
  const [items, setItems] = React.useState(()=>getNews(lang));
  const [current, setCurrent] = React.useState(emptyPost());
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [gitCfg, setGitCfg] = React.useState(()=>{
    try { return JSON.parse(localStorage.getItem('admin_github_cfg')||'{}'); } catch { return {}; }
  });
  const [rememberToken, setRememberToken] = React.useState(()=>{
    try { return JSON.parse(localStorage.getItem('admin_github_remember')||'false'); } catch { return false; }
  });
  const [commitStatus, setCommitStatus] = React.useState('');

  React.useEffect(()=>{ setItems(getNews(lang)); setEditingIndex(-1); setCurrent(emptyPost()); }, [lang]);

  const startNew = () => { setCurrent(emptyPost()); setEditingIndex(-1); };
  const editItem = (i) => { setEditingIndex(i); setCurrent(items[i]); };
  const updateField = (k,v) => setCurrent(prev => ({...prev, [k]: v}));

  const save = () => {
    if (!current.title || !current.slug) { alert('Titolo e slug sono obbligatori'); return; }
    const arr = [...items];
    const existsIdx = arr.findIndex(p => p.slug === current.slug);
    if (editingIndex === -1) {
      if (existsIdx !== -1) { alert('Slug già esistente'); return; }
      arr.unshift(current);
    } else {
      // keep position or ensure uniqueness
      if (existsIdx !== -1 && existsIdx !== editingIndex) { alert('Slug già esistente'); return; }
      arr[editingIndex] = current;
    }
    setItems(arr); saveNews(lang, arr); startNew();
  };

  const remove = (i) => {
    if (!window.confirm('Eliminare questa news?')) return;
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
        if (!Array.isArray(arr)) throw new Error('Formato non valido');
        setItems(arr); saveNews(lang, arr); startNew();
      } catch(err){ alert('JSON non valido'); }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (!window.confirm('Ripristinare le news predefinite?')) return;
    resetNews(lang); setItems(getNews(lang)); startNew();
  };

  return (
    <section className="section admin">
      <div className="container admin__layout">
        <div className="admin__list">
          <div className="admin__listhead">
            <h2>News ({lang.toUpperCase()})</h2>
            <div className="admin__actions">
              <button className="btn" onClick={startNew}>Nuovo</button>
              <button className="btn" onClick={exportJson}>Esporta</button>
              <label className="btn" style={{cursor:'pointer'}}>
                Importa
                <input type="file" accept="application/json" onChange={importJson} style={{display:'none'}}/>
              </label>
              <button className="btn" onClick={reset}>Ripristina</button>
            </div>
          </div>
          <ul className="admin__items">
            {items.map((p,i)=> (
              <li key={p.slug} className={i===editingIndex? 'active':''}>
                <div className="title" onClick={()=>editItem(i)}>{p.title}</div>
                <div className="slug">/{p.slug}</div>
                <button className="link danger" onClick={()=>remove(i)}>Elimina</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin__form">
          <h3>{editingIndex===-1? 'Nuova news' : 'Modifica news'}</h3>
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
            <label className="full">
              <span>Contenuto (HTML)</span>
              <textarea rows={8} value={current.content} onChange={e=>updateField('content', e.target.value)} />
            </label>
          </div>
          <div className="admin__formactions">
            <button className="btn btn-brand" onClick={save}>Salva</button>
          </div>
        </div>
      </div>
      <p className="admin__note container">Nota: questa pagina salva le news in <strong>localStorage</strong> per lingua (IT/EN). Puoi eseguire un commit su GitHub per innescare il deploy Netlify.</p>

      <div className="container panel">
        <div className="panel__head">
          <h3>GitHub Commit (deploy Netlify)</h3>
        </div>
        <div className="cfg-grid">
          <label>
            <span>Owner</span>
            <input value={gitCfg.owner||''} onChange={e=>setGitCfg({...gitCfg, owner:e.target.value})} placeholder="org o username" />
          </label>
          <label>
            <span>Repo</span>
            <input value={gitCfg.repo||''} onChange={e=>setGitCfg({...gitCfg, repo:e.target.value})} placeholder="nome-repo" />
          </label>
          <label>
            <span>Branch</span>
            <input value={gitCfg.branch||'main'} onChange={e=>setGitCfg({...gitCfg, branch:e.target.value||'main'})} />
          </label>
          <label>
            <span>Path file</span>
            <input value={gitCfg.path||'public/assets/news.json'} onChange={e=>setGitCfg({...gitCfg, path:e.target.value})} />
          </label>
          <label>
            <span>Commit message</span>
            <input value={gitCfg.message||'chore: update news.json via /admin'} onChange={e=>setGitCfg({...gitCfg, message:e.target.value})} />
          </label>
          <label>
            <span>Committer name</span>
            <input value={gitCfg.userName||'Site Admin'} onChange={e=>setGitCfg({...gitCfg, userName:e.target.value})} />
          </label>
          <label>
            <span>Committer email</span>
            <input value={gitCfg.userEmail||'admin@example.com'} onChange={e=>setGitCfg({...gitCfg, userEmail:e.target.value})} />
          </label>
          <label className="full">
            <span>GitHub Token (PAT)</span>
            <input type="password" value={gitCfg.token||''} onChange={e=>setGitCfg({...gitCfg, token:e.target.value})} placeholder="Fine-grained PAT con Contents: Read/Write" />
            <div className="hint">Il token può essere memorizzato localmente, ma è sconsigliato in produzione.</div>
            <label className="remember"><input type="checkbox" checked={rememberToken} onChange={e=>{ setRememberToken(e.target.checked); localStorage.setItem('admin_github_remember', JSON.stringify(e.target.checked)); }} /> Ricorda token nel browser</label>
          </label>
          <label className="full">
            <span>Netlify Deploy Hook URL (opzionale)</span>
            <input value={gitCfg.deployHook||''} onChange={e=>setGitCfg({...gitCfg, deployHook:e.target.value})} placeholder="https://api.netlify.com/build_hooks/xxx" />
          </label>
        </div>
        <div className="panel__actions">
          <button className="btn" onClick={()=>{
            const toSave = {...gitCfg}; if(!rememberToken) delete toSave.token; localStorage.setItem('admin_github_cfg', JSON.stringify(toSave)); setCommitStatus('Configurazione salvata');
          }}>Salva config</button>
          <button className="btn btn-brand" onClick={async()=>{
            // Assicurati che le modifiche correnti siano salvate per la lingua in uso
            saveNews(lang, items);
            setCommitStatus('Preparazione commit...');
            try {
              const cfg = {...gitCfg}; if(!cfg.owner||!cfg.repo||!cfg.branch||!cfg.path||!cfg.token){ setCommitStatus('Config incompleta'); return; }
              const payload = { it: getNews('it'), en: getNews('en') };
              const json = JSON.stringify(payload, null, 2);
              const b64 = btoa(unescape(encodeURIComponent(json)));
              const baseUrl = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`;
              let sha = undefined;
              const getRes = await fetch(`${baseUrl}?ref=${encodeURIComponent(cfg.branch)}`, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${cfg.token}` }});
              if (getRes.ok){ const j = await getRes.json(); sha = j.sha; }
              const body = { message: cfg.message || 'chore: update news.json via /admin', content: b64, branch: cfg.branch, committer: { name: cfg.userName || 'Site Admin', email: cfg.userEmail || 'admin@example.com' } };
              if (sha) body.sha = sha;
              const putRes = await fetch(baseUrl, { method:'PUT', headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${cfg.token}` }, body: JSON.stringify(body) });
              if (!putRes.ok) { const t = await putRes.text(); throw new Error(`Commit fallito: ${t}`); }
              setCommitStatus('Commit eseguito con successo');
              if (cfg.deployHook){
                setCommitStatus('Commit OK. Avvio deploy Netlify...');
                try { await fetch(cfg.deployHook, { method:'POST', mode:'no-cors' }); setCommitStatus('Deploy trigger inviato.'); }
                catch{ setCommitStatus('Commit OK. Deploy hook non raggiungibile.'); }
              }
            } catch(err){ setCommitStatus(String(err.message||err)); }
          }}>Commit news.json</button>
          <div className="status">{commitStatus}</div>
        </div>
      </div>
    </section>
  );
}
