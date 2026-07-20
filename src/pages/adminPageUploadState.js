export function createPendingUploadsState() {
  return { news: {}, deadlines: {} };
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
