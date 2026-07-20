import { createPendingUploadsState, upsertPendingUpload, collectUploadFiles, clearPendingUploadsForDatasets } from '../adminPageUploadState';

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
});
