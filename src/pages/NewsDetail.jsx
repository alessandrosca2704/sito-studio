import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsDetail.css';
import useNews from '../hooks/useNews';
import { LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { IconFacebook, IconLinkedIn, IconShare, IconWhatsapp } from '../components/icons/Icons';
import Seo from '../components/Seo';
import { shareOnMobile } from 'react-mobile-share';

export default function NewsDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items, loading } = useNews(lang);
  const post = items.find(p => p.slug === slug);

  const BASE_URL = 'https://www.studioscarimbolo.it';
  const encodedSlug = encodeURIComponent(slug || '');
  const shareUrl = `${BASE_URL}/news/${encodedSlug}`;
  const ensureAbsolute = (url = '') => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const fallback = ensureAbsolute('/assets/logo-facebook.png');
  const imageAbs = ensureAbsolute(post?.image) || fallback;
  const raw = String(post?.excerpt || post?.content || post?.title || '')
    .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const excerpt = raw.length > 200 ? raw.slice(0, 197) + '...' : raw;

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const fbDeepLink = `fb://faceweb/f?href=${encodeURIComponent(shareUrl)}`;
  const openFacebook = () => {
    const start = Date.now();
    window.location.assign(fbDeepLink);
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
      }
    }, 800);
  };
  const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const notFoundMeta = {
    title: 'Articolo non trovato | Studio Scarimbolo',
    description: "L'articolo richiesto non e' disponibile.",
    image: fallback,
    url: shareUrl,
    type: 'website'
  };
  const meta = post
    ? { title: post.title, description: excerpt, image: imageAbs, url: shareUrl, type: 'article' }
    : notFoundMeta;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    // Attende il caricamento delle news: solo allora sappiamo se il post esiste e i meta sono definitivi.
    window.prerenderReady = false;
    const safetyTimer = setTimeout(() => {
      window.prerenderReady = true;
    }, 8000); // fallback di sicurezza: evita stalli del prerender
    if (!loading) {
      window.prerenderReady = true;
      clearTimeout(safetyTimer);
    }
    return () => clearTimeout(safetyTimer);
  }, [loading, slug]);


  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        url={meta.url}
        image={meta.image}
        type={meta.type}
        locale={lang === 'it' ? 'it_IT' : 'en_US'}
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
                {isMobile ? (
                  <div className='share-grid'>
                    <button
                      className="share-button share-button--mobile"
                      type="button"
                      onClick={() =>
                        shareOnMobile({
                          text: `${post.title}\n${shareUrl}`,
                          url: shareUrl,
                          title: post.title,
                        })
                      }
                    >
                      <IconShare color="#143153" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="share-button"
                      type="button"
                      onClick={() => window.open(fbShareUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <IconFacebook />
                    </button>
                    <WhatsappShareButton
                      className="share-button"
                      title={`${post.title}\n\n${excerpt}`}
                      resetButtonStyle={false}
                      url={shareUrl}
                    >
                      <IconWhatsapp />
                    </WhatsappShareButton>
                    <LinkedinShareButton
                      className="share-button"
                      title={`${post.title}\n\n${excerpt}`}
                      resetButtonStyle={false}
                      url={shareUrl}
                    >
                      <IconLinkedIn />
                    </LinkedinShareButton>
                  </>
                )}
              </div>
              <div style={{marginTop:16}}><Link to="/news" className="btn">&larr; {dict.news.archive}</Link></div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
