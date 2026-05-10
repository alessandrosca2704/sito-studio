import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsDetail.css';
import useNews from '../hooks/useNews';
import { LinkedinShareButton } from 'react-share';
import { IconFacebook, IconLinkedIn, IconWhatsapp } from '../components/icons/Icons';
import Seo from '../components/Seo';

const BASE_URL = 'https://www.studioscarimbolo.it';

const ensureAbsolute = (url = '') => {
  if (!url) return '';
  try {
    return new URL(url, BASE_URL).href;
  } catch {
    if (/^https?:\/\//i.test(url)) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
};

const getImageType = (url = '') => {
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
};

export default function NewsDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items } = useNews(lang);
  const post = items.find(p => p.slug === slug);

  const encodedSlug = encodeURIComponent(post?.slug || slug || '');
  const shareUrl = `${BASE_URL}/news/${encodedSlug}`;
  const fallback = ensureAbsolute('/assets/logo-facebook.png');
  const imageAbs = ensureAbsolute(post?.image) || fallback;
  const imageType = getImageType(imageAbs);
  const raw = String(post?.excerpt || post?.content || post?.title || '')
    .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt = raw.length > 200 ? raw.slice(0, 197) + '...' : raw;
  const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const fbDeepLink = `fb://faceweb/f?href=${encodeURIComponent(shareUrl)}`;
  const openFacebook = () => {
    if (!isMobile) {
      window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const start = Date.now();
    window.location.assign(fbDeepLink);
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
      }
    }, 800);
  };
  const whatsappText = post ? `${post.title}\n${shareUrl}` : shareUrl;
  const whatsappUrl = isMobile
    ? `https://wa.me/?text=${encodeURIComponent(whatsappText)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
  const shareToWhatsApp = async () => {
    if (!post) return;
    if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: excerpt,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  const notFoundMeta = {
    title: 'Articolo non trovato | Studio Scarimbolo',
    description: "L'articolo richiesto non e' disponibile.",
    image: fallback,
    url: shareUrl,
    type: 'website',
    imageType
  };
  const meta = post
    ? { title: post.title, description: excerpt, image: imageAbs, url: shareUrl, type: 'article', imageType }
    : notFoundMeta;

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        url={meta.url}
        image={meta.image}
        type={meta.type}
        locale={lang === 'it' ? 'it_IT' : 'en_US'}
        imageWidth={1200}
        imageHeight={630}
        imageType={meta.imageType}
      />

      {!post ? (
        <section className="section">
          <div className="container">
            <h2>Articolo non trovato</h2>
            <Link to="/news" className="btn btn-brand">Torna alle news</Link>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container">
            <div className="news-detail">
              {imageAbs && (
                <div className="news-detail__media">
                  <img src={imageAbs} alt={post.title} loading="lazy" />
                </div>
              )}
              <h1 className="text-brand">{post.title}</h1>
              <p className="lead">{post.excerpt}</p>
              <div className="news-detail__content" dangerouslySetInnerHTML={{__html: post.content || post.excerpt}} />
              <div className='share-grid'>
                <span>Condividi la news sui Social!</span>
                <button
                  className="share-button"
                  type="button"
                  onClick={openFacebook}
                  aria-label="Condividi su Facebook"
                >
                  <IconFacebook />
                </button>
                <button
                  className="share-button"
                  type="button"
                  onClick={shareToWhatsApp}
                  aria-label="Condividi su WhatsApp"
                >
                  <IconWhatsapp />
                </button>
                <LinkedinShareButton
                  className="share-button"
                  title={`${post.title}\n\n${excerpt}`}
                  resetButtonStyle={false}
                  url={shareUrl}
                >
                  <IconLinkedIn />
                </LinkedinShareButton>
              </div>
              <div style={{marginTop:16}}><Link to="/news" className="btn">&larr; {dict.news.archive}</Link></div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
