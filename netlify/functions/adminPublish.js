import { hasValidSession, isSameOrigin, json } from './lib/adminSession.js';

const OWNER = process.env.GITHUB_REPO_OWNER || 'alessandrosca2704';
const REPO = process.env.GITHUB_REPO_NAME || 'sito-studio';
const BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';
const ALLOWED_JSON = new Set(['public/assets/news.it.json', 'public/assets/news.en.json', 'public/assets/news.json', 'public/assets/scadenze.it.json', 'public/assets/scadenze.en.json', 'public/assets/scadenze.json']);
const IMAGE_PATH = /^public\/assets\/(news|scadenze)\/[a-z0-9][a-z0-9._-]*\.(?:jpe?g|png|webp|gif)$/i;

const allowedFile = (file) => file && typeof file.path === 'string' && typeof file.content === 'string'
  && (ALLOWED_JSON.has(file.path) || IMAGE_PATH.test(file.path))
  && ['utf-8', 'base64'].includes(file.encoding || 'utf-8') && file.content.length <= 4 * 1024 * 1024;

async function github(path, token, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...options,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' }, { allow: 'POST' });
  if (!isSameOrigin(event) || !hasValidSession(event)) return json(401, { error: 'Unauthorized' });
  if (Buffer.byteLength(event.body || '', 'utf8') > 12 * 1024 * 1024) return json(413, { error: 'Payload too large' });
  const token = process.env.GITHUB_TOKEN;
  if (!token) return json(503, { error: 'Publishing is not configured' });

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid payload' }); }
  const files = Array.isArray(payload.files) ? payload.files : [];
  if (!files.length || files.length > 20 || !files.every(allowedFile)) return json(400, { error: 'Invalid files' });

  try {
    const refPath = `/git/refs/heads/${encodeURIComponent(BRANCH)}`;
    const ref = await github(refPath, token);
    const head = await github(`/git/commits/${ref.object.sha}`, token);
    const tree = [];
    for (const file of files) {
      const blob = await github('/git/blobs', token, { method: 'POST', body: JSON.stringify({ content: file.content, encoding: file.encoding || 'utf-8' }) });
      tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const newTree = await github('/git/trees', token, { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
    const commit = await github('/git/commits', token, { method: 'POST', body: JSON.stringify({ message: String(payload.message || 'chore: update site content').slice(0, 120), tree: newTree.sha, parents: [ref.object.sha], committer: { name: 'Site Admin', email: 'admin@example.com' } }) });
    await github(refPath, token, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) });
    return json(200, { ok: true, commit: commit.sha });
  } catch (error) {
    console.error('[adminPublish] publish failed', error);
    return json(502, { error: 'GitHub publishing failed' });
  }
}
