(function () {
  if (!window.CMS) return;

  var h = window.h || (window.React && window.React.createElement);
  if (!h) {
    window.CMS.registerPreviewTemplate('path_home', function () {
      return 'Anteprima non disponibile: React non è stato caricato nella pagina CMS.';
    });
    return;
  }

  function getIn(entry, path, fallback) {
    if (!entry || typeof entry.getIn !== 'function') return fallback;
    var value = entry.getIn(['data'].concat(path));
    return value === undefined || value === null ? fallback : value;
  }

  function asArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (value.toJS) return value.toJS();
    return [];
  }

  function firstSlug(entry, fallbackPath) {
    var items = asArray(getIn(entry, ['items'], []));
    var first = items.find(function (item) { return item && item.slug; });
    return first ? first.slug : fallbackPath;
  }

  function entryHash(entry) {
    if (!entry || typeof entry.get !== 'function') return '0';
    var data = entry.get('data');
    var value = data && data.toJS ? JSON.stringify(data.toJS()) : String(data || '');
    var hash = 0;
    for (var i = 0; i < value.length; i += 1) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash));
  }

  function entryData(entry) {
    if (!entry || typeof entry.get !== 'function') return {};
    var data = entry.get('data');
    return data && data.toJS ? data.toJS() : {};
  }

  function isImageKey(key) {
    return /(image|img|photo|picture|background|heroBackground|backgroundImage|logo|icon|badge)$/i.test(String(key || ''));
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve) {
      if (!file || typeof FileReader === 'undefined') {
        resolve('');
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { resolve(''); };
      reader.readAsDataURL(file);
    });
  }

  function validPreviewUrl(url) {
    return typeof url === 'string' && /^(blob:|data:|https?:\/\/|\/assets\/|\/images\/uploads\/)/i.test(url);
  }

  function looksUnpublishedUpload(url) {
    return typeof url === 'string' && /^\/images\/uploads\//i.test(url);
  }

  async function assetUrl(value, getAsset) {
    if (!value) return value;
    var raw = value;
    if (raw && typeof raw === 'object') {
      if (typeof Blob !== 'undefined' && raw instanceof Blob) return fileToDataUrl(raw);
      raw = raw.url || raw.path || raw.src || raw.preview || raw.public_path || raw.publicPath || raw.name || '';
    }
    if (typeof raw !== 'string' || !raw) return value;
    if (/^(blob:|data:|https?:\/\/)/i.test(raw)) return raw;
    if (/^\/assets\//i.test(raw)) return raw;
    if (typeof getAsset !== 'function') {
      return /^\/images\/uploads\//i.test(raw) ? undefined : raw;
    }

    function readAssetUrl(asset) {
      if (!asset) return '';
      if (typeof Blob !== 'undefined' && asset instanceof Blob) return asset;
      if (typeof asset === 'string') return asset;
      if (typeof asset.url === 'function') {
        try {
          var fnUrl = asset.url();
          if (fnUrl) return fnUrl;
        } catch (err) {}
      }
      if (typeof asset.get === 'function') {
        return asset.get('url') || asset.get('path') || asset.get('src') || asset.get('preview') || asset.get('public_path') || asset.get('publicPath') || asset.get('file') || '';
      }
      if (typeof asset.toJS === 'function') {
        var jsAsset = asset.toJS();
        return jsAsset.url || jsAsset.path || jsAsset.src || jsAsset.preview || jsAsset.public_path || jsAsset.publicPath || jsAsset.file || '';
      }
      return asset.url || asset.path || asset.src || asset.preview || asset.public_path || asset.publicPath || asset.file || '';
    }

    function normalizeCandidate(candidate) {
      if (!candidate || typeof candidate !== 'string') return '';
      return candidate.replace(/^\/images\/uploads\//i, '');
    }

    var candidates = [raw, normalizeCandidate(raw)].filter(function (candidate, index, all) {
      return candidate && all.indexOf(candidate) === index;
    });

    try {
      for (var i = 0; i < candidates.length; i += 1) {
        var asset = await Promise.resolve(getAsset(candidates[i]));
        var url = readAssetUrl(asset);
        if (typeof Blob !== 'undefined' && url instanceof Blob) return fileToDataUrl(url);
        if (validPreviewUrl(url) && !looksUnpublishedUpload(url)) return url;
        if (validPreviewUrl(url) && looksUnpublishedUpload(url) && !looksUnpublishedUpload(raw)) return url;
      }
      return /^\/images\/uploads\//i.test(raw) ? undefined : raw;
    } catch (err) {
      return /^\/images\/uploads\//i.test(raw) ? undefined : raw;
    }
  }

  async function withPreviewAssets(value, getAsset, key) {
    if (Array.isArray(value)) {
      return Promise.all(value.map(function (item) {
        return withPreviewAssets(item, getAsset, key);
      }));
    }
    if (value && typeof value === 'object') {
      var next = {};
      var childKeys = Object.keys(value);
      var childValues = await Promise.all(childKeys.map(function (childKey) {
        return withPreviewAssets(value[childKey], getAsset, childKey);
      }));
      childKeys.forEach(function (childKey, index) {
        if (childValues[index] !== undefined) next[childKey] = childValues[index];
      });
      return next;
    }
    if (isImageKey(key)) {
      var imageUrl = await assetUrl(value, getAsset);
      return imageUrl || undefined;
    }
    return value;
  }

  async function saveDraft(collectionName, lang, entry, getAsset) {
    try {
      var data = await withPreviewAssets(entryData(entry), getAsset, '');
      window.localStorage.setItem(
        'decap_preview:' + collectionName + ':' + lang,
        JSON.stringify(data)
      );
      return true;
    } catch (err) {
      // Preview should keep working even if storage is unavailable.
      return false;
    }
  }

  function livePath(collectionName, entry) {
    switch (collectionName) {
      case 'path_home':
      case 'popup_notices':
        return '/';
      case 'path_services':
        return '/servizi';
      case 'path_news':
        return '/news';
      case 'path_news_detail':
        return '/news/' + firstSlug(entry, '');
      case 'path_deadline_detail':
        return '/scadenze/' + firstSlug(entry, '');
      case 'path_about':
        return '/chi-siamo';
      case 'path_activities':
        return '/aree-di-attivita';
      case 'path_privacy':
        return '/privacy';
      default:
        return '/';
    }
  }

  function LivePreview(collectionName, label, lang) {
    return function Preview(_ref) {
      var entry = _ref && _ref.entry;
      var getAsset = _ref && _ref.getAsset;
      var initialHash = entryHash(entry);
      var path = livePath(collectionName, entry);
      var frameId = 'cms-live-preview-' + collectionName + '-' + lang;
      var src = path + (path.indexOf('?') === -1 ? '?' : '&') + 'cms-preview=' + encodeURIComponent(collectionName) + '&cms-lang=' + encodeURIComponent(lang) + '&v=' + encodeURIComponent(initialHash);

      saveDraft(collectionName, lang, entry, getAsset).then(function () {
        window.setTimeout(function () {
          var frame = document.getElementById(frameId);
          if (!frame) return;
          var nextSrc = path + (path.indexOf('?') === -1 ? '?' : '&') + 'cms-preview=' + encodeURIComponent(collectionName) + '&cms-lang=' + encodeURIComponent(lang) + '&v=' + encodeURIComponent(entryHash(entry) + '-' + Date.now());
          if (frame.getAttribute('src') !== nextSrc) {
            frame.setAttribute('src', nextSrc);
          }
        }, 0);
      });

      return h('main', { className: 'live-preview' }, [
        h('header', { className: 'live-preview__bar' }, [
          h('div', null, [
            h('strong', null, label),
            h('span', null, path)
          ]),
          h('a', { href: path, target: '_blank', rel: 'noreferrer' }, 'Apri pagina')
        ]),
        h('iframe', {
          id: frameId,
          key: src,
          title: 'Anteprima ' + label,
          src: src,
          className: 'live-preview__frame'
        })
      ]);
    };
  }

  function registerPreview(name, collectionName, label, lang) {
    CMS.registerPreviewTemplate(name, LivePreview(collectionName, label, lang));
  }

  CMS.registerPreviewStyle('/admin/CMS/live-preview.css?v=20260517-1');
  registerPreview('path_home', 'path_home', 'studioscarimbolo.it/', 'it');
  registerPreview('home_it', 'path_home', 'studioscarimbolo.it/', 'it');
  registerPreview('home_en', 'path_home', 'studioscarimbolo.it/', 'en');
  registerPreview('path_services', 'path_services', 'studioscarimbolo.it/servizi', 'it');
  registerPreview('services_it', 'path_services', 'studioscarimbolo.it/servizi', 'it');
  registerPreview('services_en', 'path_services', 'studioscarimbolo.it/servizi', 'en');
  registerPreview('path_news', 'path_news', 'studioscarimbolo.it/news', 'it');
  registerPreview('news_page_it', 'path_news', 'studioscarimbolo.it/news', 'it');
  registerPreview('news_page_en', 'path_news', 'studioscarimbolo.it/news', 'en');
  registerPreview('path_news_detail', 'path_news_detail', 'studioscarimbolo.it/news/{slug}', 'it');
  registerPreview('news_posts_it', 'path_news_detail', 'studioscarimbolo.it/news/{slug}', 'it');
  registerPreview('news_posts_en', 'path_news_detail', 'studioscarimbolo.it/news/{slug}', 'en');
  registerPreview('path_deadline_detail', 'path_deadline_detail', 'studioscarimbolo.it/scadenze/{slug}', 'it');
  registerPreview('deadline_posts_it', 'path_deadline_detail', 'studioscarimbolo.it/scadenze/{slug}', 'it');
  registerPreview('deadline_posts_en', 'path_deadline_detail', 'studioscarimbolo.it/scadenze/{slug}', 'en');
  registerPreview('path_about', 'path_about', 'studioscarimbolo.it/chi-siamo', 'it');
  registerPreview('about_it', 'path_about', 'studioscarimbolo.it/chi-siamo', 'it');
  registerPreview('about_en', 'path_about', 'studioscarimbolo.it/chi-siamo', 'en');
  registerPreview('path_activities', 'path_activities', 'studioscarimbolo.it/aree-di-attivita', 'it');
  registerPreview('activities_it', 'path_activities', 'studioscarimbolo.it/aree-di-attivita', 'it');
  registerPreview('activities_en', 'path_activities', 'studioscarimbolo.it/aree-di-attivita', 'en');
  registerPreview('path_privacy', 'path_privacy', 'studioscarimbolo.it/privacy', 'it');
  registerPreview('privacy_it', 'path_privacy', 'studioscarimbolo.it/privacy', 'it');
  registerPreview('privacy_en', 'path_privacy', 'studioscarimbolo.it/privacy', 'en');
  registerPreview('popup_notices', 'popup_notices', 'Popup e avvisi', 'it');
  registerPreview('popups', 'popup_notices', 'Popup e avvisi', 'it');
})();
