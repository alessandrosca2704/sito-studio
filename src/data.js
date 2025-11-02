export function getServices(lang= 'it'){
  const it = [
    { slug:'contabilita-bilancio', title:'Servizi Contabili e di Bilancio', summary:'Contabilità ordinaria e semplificata, bilanci e situazioni.', content:'<p>Gestione completa della contabilità, redazione bilanci civilistici e fiscali, adempimenti periodici, riconciliazioni e reportistica.</p>' },
    { slug:'fiscali-tributari', title:'Servizi Fiscali e Tributari', summary:'Pianificazione fiscale, dichiarativi e compliance.', content:'<p>Pianificazione e ottimizzazione fiscale, gestione dichiarazioni, pratiche con Agenzia delle Entrate, interpelli e contenzioso.</p>' },
    { slug:'societari', title:'Servizi Societari', summary:'Operazioni societarie e governance.', content:'<p>Costituzioni, modifiche statutarie, operazioni straordinarie, segreteria societaria e adempimenti con il Registro delle Imprese.</p>' },
    { slug:'ausiliari', title:'Servizi Ausiliari', summary:'Adempimenti connessi e servizi accessori.', content:'<p>Gestione pratiche camerali, comunicazioni e servizi amministrativi di supporto all’attività aziendale.</p>' },
    { slug:'gare-appalto', title:'Assistenza e Ricerca Gare Appalto', summary:'Supporto per partecipazione a gare.', content:'<p>Ricerca opportunità, predisposizione documentazione e affiancamento lungo tutto il processo di gara.</p>' },
    { slug:'siti', title:'Realizzazione Siti Web', summary:'Sviluppiamo siti veloci, responsive e ottimizzati per la SEO, pensati per convertire visitatori in clienti e raccontare al meglio il tuo brand.', content:'<p>Sviluppiamo siti veloci, responsive e ottimizzati per la SEO, pensati per convertire visitatori in clienti e raccontare al meglio il tuo brand.</p>' },
  ];
  const en = [
    { slug:'contabilita-bilancio', title:'Accounting & Financial Statements', summary:'Bookkeeping, financial statements and reports.', content:'<p>Full bookkeeping, statutory and tax financial statements, periodic filings, reconciliations and reporting.</p>' },
    { slug:'fiscali-tributari', title:'Tax & Tributary Services', summary:'Tax planning, filings and compliance.', content:'<p>Tax planning and optimization, returns filing, dealings with the Revenue Agency, rulings and disputes.</p>' },
    { slug:'societari', title:'Corporate Services', summary:'Corporate operations and governance.', content:'<p>Incorporations, bylaw changes, extraordinary corporate operations, corporate secretarial and chamber filings.</p>' },
    { slug:'ausiliari', title:'Auxiliary Services', summary:'Related compliance and accessory services.', content:'<p>Chamber practices management, communications and administrative support services.</p>' },
    { slug:'gare-appalto', title:'Tender Support', summary:'Support for public tenders participation.', content:'<p>Opportunity scouting, documentation preparation and assistance throughout the tender process.</p>' },
    { slug:'siti', title:'Website Developing', summary:'We build fast, responsive, and SEO-optimized websites designed to convert visitors into customers and effectively showcase your brand.', content:'<p>We build fast, responsive, and SEO-optimized websites designed to convert visitors into customers and effectively showcase your brand.</p>' },
  ];
  return lang==='en' ? en : it;
}

const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

const DATASETS = {
  news: {
    override: (lang) => `news_${lang}`,
    remote: (lang) => `news_remote_${lang}`,
    last: 'news_remote_last',
    event: 'news-updated',
    file: 'news.json'
  },
  deadlines: {
    override: (lang) => `scadenze_${lang}`,
    remote: (lang) => `scadenze_remote_${lang}`,
    last: 'scadenze_remote_last',
    event: 'deadlines-updated',
    file: 'scadenze.json'
  }
};

function loadOverride(kind, lang){
  if (typeof window === 'undefined') return null;
  const cfg = DATASETS[kind];
  if (!cfg) return null;
  try {
    const raw = localStorage.getItem(cfg.override(lang));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return null;
}

function saveItems(kind, lang, items){
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  localStorage.setItem(cfg.override(lang), JSON.stringify(items || []));
  try { window.dispatchEvent(new Event(cfg.event)); } catch {}
}

function resetItems(kind, lang){
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  localStorage.removeItem(cfg.override(lang));
  try { window.dispatchEvent(new Event(cfg.event)); } catch {}
}

function getItems(kind, lang='it'){
  const override = loadOverride(kind, lang);
  if (override) return override;
  if (typeof window !== 'undefined') {
    const cfg = DATASETS[kind];
    if (cfg) {
      const cached = localStorage.getItem(cfg.remote(lang));
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
  }
  return [];
}

async function ensureDatasetLoaded(kind){
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  const last = Number(localStorage.getItem(cfg.last) || 0);
  const now = Date.now();
  if (now - last < CACHE_DURATION) return;
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/assets/${cfg.file}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (json?.it) localStorage.setItem(cfg.remote('it'), JSON.stringify(json.it));
    if (json?.en) localStorage.setItem(cfg.remote('en'), JSON.stringify(json.en));
    localStorage.setItem(cfg.last, String(now));
    try { window.dispatchEvent(new Event(cfg.event)); } catch {}
  } catch (e) {
    // ignore; will rely on existing cache/overrides
  }
}

export function saveNews(lang, items){ saveItems('news', lang, items); }
export function resetNews(lang){ resetItems('news', lang); }
export function getNews(lang='it'){ return getItems('news', lang); }
export async function ensureNewsLoaded(){ await ensureDatasetLoaded('news'); }

export function saveScadenze(lang, items){ saveItems('deadlines', lang, items); }
export function resetScadenze(lang){ resetItems('deadlines', lang); }
export function getScadenze(lang='it'){ return getItems('deadlines', lang); }
export async function ensureScadenzeLoaded(){ await ensureDatasetLoaded('deadlines'); }
