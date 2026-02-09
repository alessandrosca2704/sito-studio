import React from 'react';
import './AdminPage.css';
import { getNews, saveNews, resetNews, getScadenze, saveScadenze, resetScadenze, ensureNewsLoaded, ensureScadenzeLoaded } from '../data';
import { logout } from '../auth';
import RichEditor from '../components/admin/RichEditor';

// Static GitHub config (edit here once)
// Set these values to your repo and Netlify hook
const GIT_CFG = {
  owner: 'alessandrosca2704',
  repo: 'sito-studio',
  branch: 'main',
  userName: 'Site Admin',
  userEmail: 'admin@example.com',
  deployHook: '' // optional Netlify build hook URL
};

const DATASETS = {
  news: {
    label: 'News',
    singular: 'news',
    basePath: '/news',
    get: getNews,
    save: saveNews,
    reset: resetNews,
    exportName: (lang) => `news_${lang}.json`,
    commitPath: 'public/assets/news.json',
    commitMessage: 'chore: update news.json via /admin',
    buildPayload: () => ({ it: getNews('it'), en: getNews('en') })
  },
  deadlines: {
    label: 'Scadenze',
    singular: 'scadenza',
    basePath: '/scadenze',
    get: getScadenze,
    save: saveScadenze,
    reset: resetScadenze,
    exportName: (lang) => `scadenze_${lang}.json`,
    commitPath: 'public/assets/scadenze.json',
    commitMessage: 'chore: update scadenze.json via /admin',
    buildPayload: () => ({ it: getScadenze('it'), en: getScadenze('en') })
  }
};

const DATASET_OPTIONS = [
  { value: 'news', label: DATASETS.news.label },
  { value: 'deadlines', label: DATASETS.deadlines.label }
];

const MULTI_COMMIT_MESSAGE = 'chore: update news & scadenze via /admin';

function emptyPost(){
  return { slug:'', title:'', excerpt:'', image:'', content:'' };
}

export default function AdminPage(){
  const lang = (typeof window!=='undefined' && document.documentElement.lang) || 'it';
  const [dataset, setDataset] = React.useState('news');
  const [items, setItems] = React.useState(()=>DATASETS.news.get(lang));
  const [current, setCurrent] = React.useState(emptyPost());
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [uploadInfo, setUploadInfo] = React.useState(null); // { base64, ext }
  const [pendingUploads, setPendingUploads] = React.useState({ news: {}, deadlines: {} });
  const [token, setToken] = React.useState(()=>localStorage.getItem('admin_github_token')||'');
  const [commitStatus, setCommitStatus] = React.useState('');
  const datasetCfg = DATASETS[dataset];
  const isNews = dataset === 'news';
  const formTitle = editingIndex === -1 ? (isNews ? 'Nuovo Articolo' : 'Nuova Scadenza') : (isNews ? "Modifica un'articolo" : 'Modifica una scadenza');
  const imageFolder = isNews ? 'news' : 'scadenze';

  React.useEffect(()=>{
    let mounted = true;
    const cfg = DATASETS[dataset];
    const ensureFn = dataset === 'news' ? ensureNewsLoaded : ensureScadenzeLoaded;
    const ensurePromise = ensureFn ? ensureFn() : Promise.resolve();
    Promise.resolve(ensurePromise)
      .catch(()=>{})
      .finally(()=>{
        if (!mounted) return;
        setItems(cfg.get(lang));
        setEditingIndex(-1);
        setCurrent(emptyPost());
        setUploadInfo(null);
      });
    return () => { mounted = false; };
  }, [lang, dataset]);

  const startNew = () => { setCurrent(emptyPost()); setEditingIndex(-1); setUploadInfo(null); };
  const confirmImageBeforeChange = () => {
    if (!uploadInfo) return true;
    const ok = window.confirm("Hai caricato un'immagine non salvata. Vuoi salvare il post prima di cambiare?");
    if (ok) {
      save();
    }
    return false;
  };
  const editItem = (i) => {
    if (!confirmImageBeforeChange()) return;
    setEditingIndex(i);
    setCurrent(items[i]);
    setUploadInfo(null);
  };
  const updateField = (k,v) => setCurrent(prev => ({...prev, [k]: v}));
  const sanitizeSlug = (value) => (
    (value || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
  );
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setCurrent(prev => {
      const next = { ...prev, title };
      if (editingIndex === -1 || !prev.slug) {
        next.slug = sanitizeSlug(title);
      }
      return next;
    });
  };
  const getImagePath = (slugValue, ext) => `/assets/${imageFolder}/${slugValue}${ext}`;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slugValue = (current.slug || '').trim();
    if (!slugValue) { alert('Per caricare un immagine inserisci prima lo slug'); e.target.value = ''; return; }
    const matchExt = file.name.match(/\.[a-zA-Z0-9]+$/);
    const ext = matchExt ? matchExt[0].toLowerCase() : '.jpg';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result || '';
        const base64 = typeof result === 'string' ? result.split(',').pop() : '';
        if (!base64) throw new Error('File non valido');
        const imgPath = getImagePath(slugValue, ext);
        setCurrent(prev => ({ ...prev, image: imgPath }));
        setUploadInfo({ base64, ext });
      } catch (err){
        alert('Errore durante la lettura del file immagine');
      }
    };
    reader.readAsDataURL(file);
  };

  const pushPendingUpload = (slugValue, ext) => {
    if (!uploadInfo) return null;
    const imgPath = getImagePath(slugValue, ext);
    const repoPath = imgPath.startsWith('/') ? `public${imgPath}` : `public/${imgPath}`;
    setPendingUploads(prev => ({
      ...prev,
      [dataset]: {
        ...(prev[dataset] || {}),
        [repoPath]: { content: uploadInfo.base64, encoding: 'base64' }
      }
    }));
    setUploadInfo(null);
    return imgPath;
  };

  const save = () => {
    if (!current.title || !current.slug) { alert('Title and slug are required'); return; }
    const slugValue = current.slug;
    let next = { ...current };
    if (uploadInfo) {
      const imgPath = pushPendingUpload(slugValue, uploadInfo.ext);
      if (imgPath) { next.image = imgPath; }
    }
    const arr = [...items];
    const existsIdx = arr.findIndex(p => p.slug === slugValue);
    if (editingIndex === -1) {
      if (existsIdx !== -1) { alert('Slug already exists'); return; }
      arr.unshift(next);
    } else {
      if (existsIdx !== -1 && existsIdx !== editingIndex) { alert('Slug already exists'); return; }
      arr[editingIndex] = next;
    }
    setItems(arr);
    datasetCfg.save(lang, arr);
    startNew();
  };

  const remove = (i) => {
    if (!window.confirm(`Delete this ${datasetCfg.singular}?`)) return;
    const arr = items.filter((_,idx)=> idx!==i);
    setItems(arr);
    datasetCfg.save(lang, arr);
    startNew();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = datasetCfg.exportName(lang);
    a.click();
  };

  const importJson = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('Invalid JSON array');
        setItems(arr);
        datasetCfg.save(lang, arr);
        startNew();
      } catch(err){ alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (!window.confirm(`Reset ${datasetCfg.label.toLowerCase()} to defaults?`)) return;
    datasetCfg.reset(lang);
    setItems(datasetCfg.get(lang));
    startNew();
  };

  const describeTargets = (keys) => {
    if (keys.length === 1) return DATASETS[keys[0]].label;
    return 'News + Scadenze';
  };

  const testConnection = async (target = dataset) => {
    if (!token) { setCommitStatus('Token missing'); return; }
    const cfg = DATASETS[target];
    if (!cfg) { setCommitStatus('Unknown dataset'); return; }
    setCommitStatus(`Testing GitHub connection for ${cfg.commitPath}...`);
    try {
      const baseUrl = `https://api.github.com/repos/${GIT_CFG.owner}/${GIT_CFG.repo}/contents/${cfg.commitPath}?ref=${encodeURIComponent(GIT_CFG.branch)}`;
      const res = await fetch(baseUrl, { headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}` }});
      if (res.status === 404) { setCommitStatus(`Repo/branch OK. ${cfg.commitPath} will be created.`); return; }
      if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t}`); }
      const j = await res.json();
      setCommitStatus(`OK. ${cfg.commitPath} exists (sha: ${j.sha ? j.sha.slice(0,7) : 'n/a'})`);
    } catch(err){ setCommitStatus('Test error: ' + (err.message || String(err))); }
  };

  const performCommit = async (files, message) => {
    if (!files.length) throw new Error('No files to commit');
    const baseApi = `https://api.github.com/repos/${GIT_CFG.owner}/${GIT_CFG.repo}`;
    const authHeaders = {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`
    };
    const jsonHeaders = {
      ...authHeaders,
      'Content-Type': 'application/json'
    };
    const refUrl = `${baseApi}/git/refs/heads/${GIT_CFG.branch}`;
    const refRes = await fetch(refUrl, { headers: authHeaders });
    if (!refRes.ok) { const t = await refRes.text(); throw new Error(`Unable to read branch ref: ${refRes.status} ${t}`); }
    const refData = await refRes.json();
    const baseCommitSha = refData?.object?.sha;
    if (!baseCommitSha) throw new Error('Invalid branch reference received from GitHub');

    const headCommitRes = await fetch(`${baseApi}/git/commits/${baseCommitSha}`, { headers: authHeaders });
    if (!headCommitRes.ok) { const t = await headCommitRes.text(); throw new Error(`Unable to read head commit: ${headCommitRes.status} ${t}`); }
    const headCommit = await headCommitRes.json();
    const baseTreeSha = headCommit?.tree?.sha;
    if (!baseTreeSha) throw new Error('Missing base tree information');

    const treeEntries = [];
    for (const file of files) {
      const blobRes = await fetch(`${baseApi}/git/blobs`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ content: file.content, encoding: file.encoding || 'utf-8' }) });
      if (!blobRes.ok) { const t = await blobRes.text(); throw new Error(`Blob create failed for ${file.path}: ${blobRes.status} ${t}`); }
      const blobData = await blobRes.json();
      treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blobData.sha });
    }

    const treeRes = await fetch(`${baseApi}/git/trees`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }) });
    if (!treeRes.ok) { const t = await treeRes.text(); throw new Error(`Tree create failed: ${treeRes.status} ${t}`); }
    const treeData = await treeRes.json();

    const commitRes = await fetch(`${baseApi}/git/commits`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [baseCommitSha],
      committer: { name: GIT_CFG.userName, email: GIT_CFG.userEmail }
    })});
    if (!commitRes.ok) { const t = await commitRes.text(); throw new Error(`Commit create failed: ${commitRes.status} ${t}`); }
    const commitData = await commitRes.json();

    const updateRes = await fetch(refUrl, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ sha: commitData.sha }) });
    if (!updateRes.ok) { const t = await updateRes.text(); throw new Error(`Ref update failed: ${updateRes.status} ${t}`); }
  };

  const commitDatasets = async (targetKeys) => {
    if (!token) { setCommitStatus('Token missing'); return; }
    const keys = Array.from(new Set((targetKeys || []).filter(Boolean)));
    if (!keys.length) { setCommitStatus('No datasets selected'); return; }
    if (keys.includes(dataset)) {
      datasetCfg.save(lang, items);
    }

    const label = describeTargets(keys);
    setCommitStatus(`Preparing commit (${label})...`);

    try {
      const files = [];
      keys.forEach((key) => {
        const cfg = DATASETS[key];
        if (!cfg) throw new Error(`Unknown dataset ${key}`);
        const content = JSON.stringify(cfg.buildPayload(), null, 2);
        files.push({ path: cfg.commitPath, content });
        const pending = pendingUploads[key] || {};
        Object.entries(pending).forEach(([path, data]) => {
          files.push({ path, content: data.content, encoding: data.encoding || 'base64' });
        });
      });

      const message = keys.length === 1 ? DATASETS[keys[0]].commitMessage : MULTI_COMMIT_MESSAGE;
      await performCommit(files, message);
      setCommitStatus(`Commit done (${label}).`);
      // clear pending uploads for committed datasets
      setPendingUploads(prev => {
        const next = { ...prev };
        keys.forEach(k => { next[k] = {}; });
        return next;
      });

      if (GIT_CFG.deployHook){
        setCommitStatus(`Commit OK (${label}). Triggering Netlify...`);
        try {
          await fetch(GIT_CFG.deployHook, { method:'POST', mode:'no-cors' });
          setCommitStatus(`Deploy hook sent (${label}).`);
        } catch {
          setCommitStatus(`Commit OK (${label}). Deploy hook unreachable.`);
        }
      }
    } catch(err){
      setCommitStatus(`Commit error: ${err.message || String(err)}`);
    }
  };

  return (
    <section className="section admin">
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <h2 style={{margin:0}}>Admin</h2>
              <select value={dataset} onChange={e=>setDataset(e.target.value)} className="admin__dataset-select">
                {DATASET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
        <button className="btn" onClick={()=>{ logout(); window.location.href = '/login'; }}>Logout</button>
      </div>
      <div className="container admin__layout">
        <div className="admin__list">
          <div className="admin__listhead">
              <h2 style={{margin:0}}>{datasetCfg.label} ({lang.toUpperCase()})</h2>

            <div className="admin__actions">
              <button className="btn" onClick={() => { if (confirmImageBeforeChange()) startNew(); }}>New</button>
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
                <div className="slug">{`${datasetCfg.basePath}/${p.slug}`}</div>
                <button className="link danger" onClick={()=>remove(i)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin__form">
          <h3>{formTitle}</h3>
          <div className="form-admin">
            <label>
              <span>Titolo</span>
              <input value={current.title} onChange={handleTitleChange} />
            </label>
            <label>
              <span>Slug (url)</span>
              <input value={current.slug} readOnly />
            </label>
            <label className="full">
              <span>Immagine (upload)</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {current.image && <div className="help">File: {current.image}</div>}
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
            <div><strong>Repo:</strong> {GIT_CFG.owner}/{GIT_CFG.repo}</div>
            <div><strong>Branch:</strong> {GIT_CFG.branch}</div>
            <div><strong>File news:</strong> {DATASETS.news.commitPath}</div>
            <div><strong>File scadenze:</strong> {DATASETS.deadlines.commitPath}</div>
          </div>
          <label className="full">
            <span>GitHub Token (PAT)</span>
            <input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Fine-grained PAT with Contents: Read/Write" />
          </label>
        </div>
        <div className="panel__actions">
          
          <button className="btn" onClick={()=>testConnection(dataset)}>Test {datasetCfg.label}</button>
          <button className="btn" onClick={()=>commitDatasets(['news'])}>Commit news.json</button>
          <button className="btn" onClick={()=>commitDatasets(['deadlines'])}>Commit scadenze.json</button>
          <button className="btn btn-brand" onClick={()=>commitDatasets(['news','deadlines'])}>Commit news + scadenze</button>
          <div className="status">{commitStatus}</div>
        </div>
      </div>
    </section>
  );
}
