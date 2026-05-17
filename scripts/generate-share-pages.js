const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.studioscarimbolo.it';
const SITE_NAME = 'Studio Scarimbolo';
const FALLBACK_IMAGE = `${SITE_URL}/assets/logo-facebook.png`;
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const publicAssetsDir = path.join(rootDir, 'public', 'assets');
const indexPath = path.join(buildDir, 'index.html');
const redirectsPath = path.join(buildDir, '_redirects');

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/servizi', priority: '0.8' },
  { path: '/news', priority: '0.9' },
  { path: '/chi-siamo', priority: '0.7' },
  { path: '/aree-di-attivita', priority: '0.7' },
  { path: '/privacy', priority: '0.5' },
];

const datasets = [
  {
    kind: 'news',
    files: { it: 'news.it.json', en: 'news.en.json' },
    basePath: '/news',
    defaultTitle: 'News | Studio Scarimbolo',
  },
  {
    kind: 'scadenze',
    files: { it: 'scadenze.it.json', en: 'scadenze.en.json' },
    basePath: '/scadenze',
    defaultTitle: 'Scadenze | Studio Scarimbolo',
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength = 200) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const short = text.slice(0, maxLength - 3).trimEnd();
  const lastSpace = short.lastIndexOf(' ');
  return `${(lastSpace > 80 ? short.slice(0, lastSpace) : short).trimEnd()}...`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodePathSegment(segment) {
  return encodeURIComponent(String(segment || '')).replace(/%2F/gi, '/');
}

function safeFileSegment(segment) {
  return encodeURIComponent(String(segment || '').trim());
}

function absoluteUrl(url) {
  if (!url) return '';
  try {
    return new URL(url, SITE_URL).href;
  } catch {
    if (/^https?:\/\//i.test(url)) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}

function imageType(imageUrl) {
  const cleanUrl = String(imageUrl || '').split('?')[0].split('#')[0].toLowerCase();
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function itemDescription(item) {
  return truncate(stripHtml(item.excerpt || item.content || item.title || SITE_NAME));
}

function itemUrl(basePath, slug) {
  return `${SITE_URL}${basePath}/${encodePathSegment(slug)}`;
}

function buildMetaTags(meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = escapeHtml(meta.url);
  const image = escapeHtml(meta.image);
  const locale = escapeHtml(meta.locale);
  const imageMime = escapeHtml(meta.imageType);

  return [
    '<!-- Static Open Graph tags generated for crawlers -->',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="article" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${locale}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:width" content="${DEFAULT_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${DEFAULT_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:type" content="${imageMime}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    '<!-- End static Open Graph tags -->',
  ].join('\n    ');
}

function injectHeadTags(html, tags) {
  if (html.includes('<script defer=')) {
    return html.replace('<script defer=', `    ${tags}\n    <script defer=`);
  }
  return html.replace('</head>', `    ${tags}\n  </head>`);
}

function writeArticlePage(indexHtml, dataset, item, lang) {
  const slug = String(item.slug || '').trim();
  if (!slug) return null;

  const title = stripHtml(item.title) || dataset.defaultTitle;
  const description = itemDescription(item);
  const image = absoluteUrl(item.image) || FALLBACK_IMAGE;
  const url = itemUrl(dataset.basePath, slug);
  const metaTags = buildMetaTags({
    title,
    description,
    url,
    image,
    imageType: imageType(image),
    locale: lang === 'en' ? 'en_US' : 'it_IT',
  });

  const outputHtml = injectHeadTags(indexHtml, metaTags);
  const fsSlug = safeFileSegment(slug);
  const targetDir = path.join(buildDir, dataset.basePath.replace(/^\//, ''), fsSlug);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), outputHtml, 'utf8');

  return {
    loc: `${dataset.basePath}/${encodePathSegment(slug)}`,
    rawLoc: `${dataset.basePath}/${slug}`,
    target: `${dataset.basePath}/${fsSlug}/index.html`,
    priority: dataset.kind === 'news' ? '0.8' : '0.7',
  };
}

function writeRedirects(articleEntries) {
  const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8').trim() : '';
  const redirectLines = [];
  const seen = new Set();

  articleEntries.forEach((entry) => {
    const paths = [entry.loc];
    if (entry.rawLoc && entry.rawLoc !== entry.loc && !/\s/.test(entry.rawLoc)) {
      paths.push(entry.rawLoc);
    }

    paths.forEach((from) => {
      const line = `${from} ${entry.target} 200`;
      if (!seen.has(line)) {
        seen.add(line);
        redirectLines.push(line);
      }
    });
  });

  const content = [redirectLines.join('\n'), existing].filter(Boolean).join('\n\n');
  fs.writeFileSync(redirectsPath, `${content}\n`, 'utf8');
}

function sitemapXml(entries) {
  const today = new Date().toISOString().slice(0, 10);
  const unique = new Map();
  entries.forEach((entry) => {
    if (!entry?.path && !entry?.loc) return;
    const locPath = entry.path || entry.loc;
    unique.set(locPath, { ...entry, path: locPath });
  });

  const urls = Array.from(unique.values()).map((entry) => {
    const loc = `${SITE_URL}${entry.path === '/' ? '/' : entry.path}`;
    return [
      '  <url>',
      `    <loc>${escapeHtml(loc)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${entry.priority || '0.6'}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

function main() {
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing build index: ${indexPath}`);
  }

  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const sitemapEntries = [...staticPages];
  const articleEntries = [];
  let pageCount = 0;

  datasets.forEach((dataset) => {
    ['it', 'en'].forEach((lang) => {
      const dataPath = path.join(publicAssetsDir, dataset.files[lang]);
      const data = readJson(dataPath);
      const items = Array.isArray(data.items) ? data.items : [];
      items.forEach((item) => {
        const entry = writeArticlePage(indexHtml, dataset, item, lang);
        if (entry) {
          sitemapEntries.push({ path: entry.loc, priority: entry.priority });
          articleEntries.push(entry);
          pageCount += 1;
        }
      });
    });
  });

  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemapXml(sitemapEntries), 'utf8');
  writeRedirects(articleEntries);
  console.log(`[share-pages] Generated ${pageCount} article pages and build/sitemap.xml`);
}

main();
