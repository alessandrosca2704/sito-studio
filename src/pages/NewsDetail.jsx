import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsDetail.css';
import useNews from '../hooks/useNews';
import { LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { IconFacebook, IconLinkedIn, IconShare, IconWhatsapp } from '../components/icons/Icons';
import { Helmet } from 'react-helmet-async';
import { shareOnMobile } from 'react-mobile-share';

export default function NewsDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items } = useNews(lang);
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
  const defaultMeta = {
    title: 'News | Studio Scarimbolo',
    description: 'Novita e appuntamenti dal mondo della finanza, contabilita, normativa e molto altro.',
    image: fallback,
    url: shareUrl
  };
  const meta = post
    ? { title: post.title, description: excerpt || defaultMeta.description, image: imageAbs, url: shareUrl }
    : defaultMeta;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.prerenderReady = !!post;
    }
  }, [post]);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.url} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:site_name" content="Studio Scarimbolo" />
        <meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_US'} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:secure_url" content={meta.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Helmet>

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
