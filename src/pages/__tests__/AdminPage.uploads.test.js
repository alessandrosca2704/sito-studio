import { createPendingUploadsState, upsertPendingUpload, collectUploadFiles, clearPendingUploadsForDatasets, hasUnsavedDraftChanges, sanitizeSlug, validateImageUpload } from '../adminPageUploadState';

describe('admin upload state', () => {
  it('preserves uploads for other datasets when adding a new one', () => {
    const state = createPendingUploadsState();
    const afterNews = upsertPendingUpload(state, 'news', '/public/assets/news/hello.jpg', 'AAA');
    const afterBoth = upsertPendingUpload(afterNews, 'deadlines', '/public/assets/scadenze/bye.jpg', 'BBB');

    expect(afterBoth.news['/public/assets/news/hello.jpg']).toEqual({ content: 'AAA', encoding: 'base64' });
    expect(afterBoth.deadlines['/public/assets/scadenze/bye.jpg']).toEqual({ content: 'BBB', encoding: 'base64' });
  });

  it('collects pending and draft uploads from multiple datasets', () => {
    const pending = createPendingUploadsState();
    const draftUploads = {
      news: {},
      deadlines: {
        'slug': { content: 'CCC', ext: '.jpg' }
      }
    };

    const files = collectUploadFiles(pending, draftUploads, ['news', 'deadlines']);

    expect(files).toHaveLength(1);
    expect(files[0]).toEqual({ path: '/public/assets/scadenze/slug.jpg', content: 'CCC', encoding: 'base64' });
  });

  it('clears only the selected dataset buckets', () => {
    const state = createPendingUploadsState();
    const withNews = upsertPendingUpload(state, 'news', '/public/assets/news/one.jpg', 'AAA');
    const withBoth = upsertPendingUpload(withNews, 'deadlines', '/public/assets/scadenze/two.jpg', 'BBB');
    const cleared = clearPendingUploadsForDatasets(withBoth, ['news']);

    expect(cleared.news).toEqual({});
    expect(cleared.deadlines['/public/assets/scadenze/two.jpg']).toEqual({ content: 'BBB', encoding: 'base64' });
  });

  it('detects unsaved draft changes and uploads', () => {
    const items = [{ slug: 'one', title: 'One', image: '', excerpt: '', content: '' }];

    expect(hasUnsavedDraftChanges(null, { slug: 'one', title: 'One', image: '', excerpt: '', content: '' }, items, 0)).toBe(false);
    expect(hasUnsavedDraftChanges({ base64: 'AAA', ext: '.jpg' }, { slug: 'one', title: 'One', image: '', excerpt: '', content: '' }, items, 0)).toBe(true);
    expect(hasUnsavedDraftChanges(null, { slug: 'one', title: 'Changed', image: '', excerpt: '', content: '' }, items, 0)).toBe(true);
  });

  it('normalizes slug from title including accented characters', () => {
    expect(sanitizeSlug('Nuovo Articolo 2026!')).toBe('nuovoarticolo2026');
    expect(sanitizeSlug('Caffè & Fiscale')).toBe('caffefiscale');
  });

  it('rejects invalid image uploads', () => {
    const invalidType = { type: 'text/plain', size: 100 };
    const invalidSize = { type: 'image/jpeg', size: 3 * 1024 * 1024 };
    const validFile = { type: 'image/png', size: 100 };

    expect(validateImageUpload(invalidType)).toBe('Seleziona un file immagine valido.');
    expect(validateImageUpload(invalidSize)).toBe('Il file è troppo grande. Massimo 2 MB.');
    expect(validateImageUpload(validFile)).toBeNull();
  });
});
