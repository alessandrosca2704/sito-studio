const fs = require('fs/promises');
const path = require('path');

const DEFAULT_SITE_URL = 'https://www.studioscarimbolo.it';
const DEFAULT_LIMIT = 10;

const DATASETS = [
  { file: 'news.json', basePath: '/news', label: 'news' },
  { file: 'scadenze.json', basePath: '/scadenze', label: 'scadenze' },
];

function siteUrl() {
  return (process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || DEFAULT_SITE_URL)
    .replace(/\/+$/, '');
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function articleUrls(data, basePath, limit, baseUrl) {
  const urls = [];
  ['it', 'en'].forEach((lang) => {
    const items = Array.isArray(data?.[lang]) ? data[lang] : [];
    items.slice(0, limit).forEach((item) => {
      const slug = String(item?.slug || '').trim();
      if (slug) urls.push(`${baseUrl}${basePath}/${encodeURIComponent(slug)}`);
    });
  });
  return unique(urls).slice(0, limit);
}

async function readLocalDataset(file) {
  const candidates = [
    path.join(process.cwd(), 'public', 'assets', file),
    path.join(__dirname, '..', '..', 'public', 'assets', file),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      // Netlify functions usually do not include public assets in runtime.
    }
  }
  return null;
}

async function fetchDataset(file, baseUrl) {
  const res = await fetch(`${baseUrl}/assets/${file}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching ${file}`);
  }
  return res.json();
}

async function loadDataset(file, baseUrl) {
  const local = await readLocalDataset(file);
  if (local) return local;
  return fetchDataset(file, baseUrl);
}

async function scrapeUrl(url, token) {
  const endpoint = new URL('https://graph.facebook.com/');
  endpoint.searchParams.set('id', url);
  endpoint.searchParams.set('scrape', 'true');
  endpoint.searchParams.set('access_token', token);

  const res = await fetch(endpoint.toString(), { method: 'POST' });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Facebook scrape failed (${res.status}): ${body}`);
  }
  return body;
}

exports.handler = async () => {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!token) {
    console.warn('[deploy-succeeded] FACEBOOK_ACCESS_TOKEN missing; skipping Meta pre-scrape.');
    return { statusCode: 200, body: 'FACEBOOK_ACCESS_TOKEN missing; skipped.' };
  }

  const limit = Number(process.env.FACEBOOK_SCRAPE_LIMIT || DEFAULT_LIMIT) || DEFAULT_LIMIT;
  const baseUrl = siteUrl();
  const urls = [];

  for (const dataset of DATASETS) {
    try {
      const data = await loadDataset(dataset.file, baseUrl);
      urls.push(...articleUrls(data, dataset.basePath, limit, baseUrl));
    } catch (err) {
      console.error(`[deploy-succeeded] Unable to load ${dataset.label}:`, err.message || err);
    }
  }

  const uniqueUrls = unique(urls);
  if (!uniqueUrls.length) {
    console.warn('[deploy-succeeded] No URLs found for Meta pre-scrape.');
    return { statusCode: 200, body: 'No URLs found.' };
  }

  const results = await Promise.allSettled(uniqueUrls.map((url) => scrapeUrl(url, token)));
  results.forEach((result, index) => {
    const url = uniqueUrls[index];
    if (result.status === 'fulfilled') {
      console.log(`[deploy-succeeded] Scraped ${url}`);
    } else {
      console.error(`[deploy-succeeded] Failed ${url}:`, result.reason?.message || result.reason);
    }
  });

  const ok = results.filter((result) => result.status === 'fulfilled').length;
  return { statusCode: 200, body: `Meta pre-scrape completed: ${ok}/${uniqueUrls.length}` };
};
