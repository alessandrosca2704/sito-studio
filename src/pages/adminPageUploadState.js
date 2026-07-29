export function createPendingUploadsState() {
  return { news: {}, deadlines: {} };
}

export function sanitizeSlug(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function validateImageUpload(file, maxBytes = 2 * 1024 * 1024) {
  if (!file) return 'Nessun file selezionato.';
  if (!file.type.startsWith('image/')) return 'Seleziona un file immagine valido.';
  if (file.size > maxBytes) return `Il file è troppo grande. Massimo ${Math.round(maxBytes / 1024 / 1024)} MB.`;
  return null;
}

export function hasUnsavedDraftChanges(uploadInfo, current, items, editingIndex) {
  if (!current) return false;
  if (uploadInfo) return true;

  const hasDraftContent = Boolean(
    current.title || current.slug || current.excerpt || current.content || current.image
  );

  if (editingIndex === -1) return hasDraftContent;

  const existing = items?.[editingIndex];
  if (!existing) return hasDraftContent;
  return JSON.stringify(current) !== JSON.stringify(existing);
}

export function upsertPendingUpload(state, dataset, repoPath, content, encoding = 'base64') {
  return {
    ...state,
    [dataset]: {
      ...(state?.[dataset] || {}),
      [repoPath]: { content, encoding }
    }
  };
}

export function collectUploadFiles(pendingUploads, draftUploads, selectedKeys) {
  const files = [];
  selectedKeys.forEach((key) => {
    const pending = pendingUploads?.[key] || {};
    Object.entries(pending).forEach(([path, data]) => {
      files.push({ path, content: data.content, encoding: data.encoding || 'base64' });
    });

    const draft = draftUploads?.[key] || {};
    Object.entries(draft).forEach(([slug, data]) => {
      if (!data?.content) return;
      const ext = data.ext || '.jpg';
      const repoPath = `/public/assets/${key === 'deadlines' ? 'scadenze' : 'news'}/${slug}${ext}`;
      files.push({ path: repoPath, content: data.content, encoding: 'base64' });
    });
  });
  return files;
}

export function clearPendingUploadsForDatasets(state, selectedKeys) {
  const next = { ...state };
  selectedKeys.forEach((k) => {
    next[k] = {};
  });
  return next;
}
