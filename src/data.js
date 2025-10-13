export function getServices(lang='it'){
  const it = [
    { slug:'contabilita-bilancio', title:'Servizi Contabili e di Bilancio', summary:'Contabilità ordinaria e semplificata, bilanci e situazioni.', content:'<p>Gestione completa della contabilità, redazione bilanci civilistici e fiscali, adempimenti periodici, riconciliazioni e reportistica.</p>' },
    { slug:'fiscali-tributari', title:'Servizi Fiscali e Tributari', summary:'Pianificazione fiscale, dichiarativi e compliance.', content:'<p>Pianificazione e ottimizzazione fiscale, gestione dichiarazioni, pratiche con Agenzia delle Entrate, interpelli e contenzioso.</p>' },
    { slug:'societari', title:'Servizi Societari', summary:'Operazioni societarie e governance.', content:'<p>Costituzioni, modifiche statutarie, operazioni straordinarie, segreteria societaria e adempimenti con il Registro delle Imprese.</p>' },
    { slug:'ausiliari', title:'Servizi Ausiliari', summary:'Adempimenti connessi e servizi accessori.', content:'<p>Gestione pratiche camerali, comunicazioni e servizi amministrativi di supporto all’attività aziendale.</p>' },
    { slug:'gare-appalto', title:'Assistenza e Ricerca Gare Appalto', summary:'Supporto per partecipazione a gare.', content:'<p>Ricerca opportunità, predisposizione documentazione e affiancamento lungo tutto il processo di gara.</p>' },
    { slug:'altri-servizi', title:'Altri servizi', summary:'Richiedi un’offerta personalizzata.', content:'<p>Servizi su misura in base alle necessità specifiche della tua impresa.</p>' },
  ];
  const en = [
    { slug:'contabilita-bilancio', title:'Accounting & Financial Statements', summary:'Bookkeeping, financial statements and reports.', content:'<p>Full bookkeeping, statutory and tax financial statements, periodic filings, reconciliations and reporting.</p>' },
    { slug:'fiscali-tributari', title:'Tax & Tributary Services', summary:'Tax planning, filings and compliance.', content:'<p>Tax planning and optimization, returns filing, dealings with the Revenue Agency, rulings and disputes.</p>' },
    { slug:'societari', title:'Corporate Services', summary:'Corporate operations and governance.', content:'<p>Incorporations, bylaw changes, extraordinary corporate operations, corporate secretarial and chamber filings.</p>' },
    { slug:'ausiliari', title:'Auxiliary Services', summary:'Related compliance and accessory services.', content:'<p>Chamber practices management, communications and administrative support services.</p>' },
    { slug:'gare-appalto', title:'Tender Support', summary:'Support for public tenders participation.', content:'<p>Opportunity scouting, documentation preparation and assistance throughout the tender process.</p>' },
    { slug:'altri-servizi', title:'More services', summary:'Ask for a tailored offer.', content:'<p>Custom services based on your company’s specific needs.</p>' },
  ];
  return lang==='en' ? en : it;
}

// Local override helpers for News
function loadOverride(lang){
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`news_${lang}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return null;
}

export function saveNews(lang, items){
  if (typeof window === 'undefined') return;
  localStorage.setItem(`news_${lang}` , JSON.stringify(items||[]));
  try { window.dispatchEvent(new Event('news-updated')); } catch {}
}

export function resetNews(lang){
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`news_${lang}`);
  try { window.dispatchEvent(new Event('news-updated')); } catch {}
}

export function getNews(lang='it'){
  const override = loadOverride(lang);
  if (override) return override;
  // Try cached remote copy first
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`news_remote_${lang}`);
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
  }
  return [];
}

export async function ensureNewsLoaded(){
  if (typeof window === 'undefined') return;
  const last = Number(localStorage.getItem('news_remote_last')||0);
  const now = Date.now();
  if (now - last < 1000*60*10) return; // cache 10m
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/assets/news.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (json?.it) localStorage.setItem('news_remote_it', JSON.stringify(json.it));
    if (json?.en) localStorage.setItem('news_remote_en', JSON.stringify(json.en));
    localStorage.setItem('news_remote_last', String(now));
    try { window.dispatchEvent(new Event('news-updated')); } catch {}
  } catch (e) {
    // ignore; will rely on existing cache/overrides
  }
}
