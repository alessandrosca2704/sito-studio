import servicesContent from './content/services.json';

export function getServices(lang= 'it'){
  return servicesContent[lang] || servicesContent.it || [];
}

const SUPPORTED_LANGS = ['it','en'];
const APP_VERSION = process.env.REACT_APP_APP_VERSION || process.env.REACT_APP_VERSION || '0.1.0';
const VERSION_KEY = 'app_version';
const CACHE_EXPIRY_KEY = 'app_cache_expiry';
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours before forcing a full cache refresh
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes throttling between asset fetches

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

function touchCacheMetadata(now = Date.now()){
  if (typeof window === 'undefined') return;
  localStorage.setItem(VERSION_KEY, APP_VERSION);
  localStorage.setItem(CACHE_EXPIRY_KEY, String(now + CACHE_TTL));
}

function invalidateAllCaches(){
  if (typeof window === 'undefined') return;
  Object.values(DATASETS).forEach(cfg => {
    SUPPORTED_LANGS.forEach(lang => {
      localStorage.removeItem(cfg.override(lang));
      localStorage.removeItem(cfg.remote(lang));
    });
    localStorage.removeItem(cfg.last);
    try { window.dispatchEvent(new Event(cfg.event)); } catch {}
  });
}

function ensureFreshVersion(){
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const savedVersion = localStorage.getItem(VERSION_KEY);
  const expiry = Number(localStorage.getItem(CACHE_EXPIRY_KEY) || 0);
  const versionChanged = savedVersion !== APP_VERSION;
  const expired = !expiry || now > expiry;
  if (versionChanged || expired) {
    invalidateAllCaches();
  }
  touchCacheMetadata(now);
}

function loadOverride(kind, lang){
  ensureFreshVersion();
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
  ensureFreshVersion();
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  localStorage.setItem(cfg.override(lang), JSON.stringify(items || []));
  try { window.dispatchEvent(new Event(cfg.event)); } catch {}
}

function resetItems(kind, lang){
  ensureFreshVersion();
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  localStorage.removeItem(cfg.override(lang));
  try { window.dispatchEvent(new Event(cfg.event)); } catch {}
}

function getItems(kind, lang='it'){
  ensureFreshVersion();
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
  ensureFreshVersion();
  if (typeof window === 'undefined') return;
  const cfg = DATASETS[kind];
  if (!cfg) return;
  const last = Number(localStorage.getItem(cfg.last) || 0);
  const now = Date.now();
  if (now - last < CACHE_DURATION) return;
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/assets/${cfg.file}`, { cache: 'no-store' });
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
