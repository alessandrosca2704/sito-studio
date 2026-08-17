const FEEDS = {
  economia: 'https://www.ilsole24ore.com/rss/economia.xml',
  'norme-e-tributi': 'https://www.ilsole24ore.com/rss/norme-e-tributi.xml',
  primapagina: 'https://www.ilsole24ore.com/rss/primapagina.xml'
};

const decodeXml = (value = '') => String(value)
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : '';
}

function parseFeed(xml, limit) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0, limit).map(([, item]) => {
    const link = tag(item, 'link');
    try {
      if (!/(^|\.)ilsole24ore\.com$/i.test(new URL(link).hostname)) return null;
    } catch { return null; }
    return { title: tag(item, 'title'), url: link, publishedAt: tag(item, 'pubDate'), category: tag(item, 'category') };
  }).filter((item) => item?.title && item?.url);
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: { allow: 'GET' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  const feedName = FEEDS[event.queryStringParameters?.feed] ? event.queryStringParameters.feed : 'economia';
  const requestedLimit = Number(event.queryStringParameters?.limit || 10);
  const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 10, 1), 20);

  try {
    const response = await fetch(FEEDS[feedName], {
      headers: { accept: 'application/rss+xml, application/xml, text/xml', 'user-agent': 'StudioScarimbolo/1.0 RSS reader' },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`RSS HTTP ${response.status}`);
    const items = parseFeed(await response.text(), limit);
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300, stale-while-revalidate=3600' },
      body: JSON.stringify({ source: 'Il Sole 24 ORE', feed: feedName, items })
    };
  } catch (error) {
    console.error('[sole24News] RSS unavailable', error.message || error);
    return { statusCode: 502, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify({ error: 'News source temporarily unavailable' }) };
  }
}
