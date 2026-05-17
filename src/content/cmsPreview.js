const PREVIEW_PREFIX = 'decap_preview:';

export function getCmsPreviewData(collection, lang, fallback) {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  if (params.get('cms-preview') !== collection) return fallback;
  const previewLang = params.get('cms-lang') || lang || 'it';
  try {
    const raw = window.localStorage.getItem(`${PREVIEW_PREFIX}${collection}:${previewLang}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getCmsPreviewItems(collection, lang, fallback = []) {
  const data = getCmsPreviewData(collection, lang, null);
  if (Array.isArray(data?.items)) return data.items;
  return fallback;
}
