import { Link } from 'react-router-dom';
import './NewsPage.css';
import useNews from '../hooks/useNews';
import Sole24hPanel from '../components/Sole24hPanel';
import useReveal from '../hooks/useReveal';
import React from 'react';
import { IconMore } from '../components/icons/Icons';
import useScadenze from '../hooks/useScadenze';
import newsPageContent from '../content/newsPage';
import { getCmsPreviewData } from '../content/cmsPreview';

const MOBILE_QUERY = '(max-width: 640px)';

const isMobileViewport = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(MOBILE_QUERY).matches
);

export default function NewsPage(){
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const newsPage = getCmsPreviewData('path_news', lang, newsPageContent[lang] || newsPageContent.it);
  const { ref: deadlinesRef, visible: deadlinesVisible } = useReveal();
  const { ref: newsRef, visible: newsVisible } = useReveal();
  const { items: posts } = useNews(lang);
  const { items: deadlines } = useScadenze(lang);
  const [isMobileList, setIsMobileList] = React.useState(isMobileViewport);
  const initialVisibleCount = isMobileList ? 1 : 3;
  const [visibleCount, setVisibleCount] = React.useState(initialVisibleCount);
  const [visibleDeadCount, setVisibleDeadCount] = React.useState(initialVisibleCount);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobileList(media.matches);
    handleChange();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  React.useEffect(()=>{
    setVisibleCount(initialVisibleCount);
    setVisibleDeadCount(initialVisibleCount);
  }, [lang, initialVisibleCount]);

  const canLoadMore = visibleCount < posts.length;
  const canLoadMoreDead = visibleDeadCount < deadlines.length;
  const loadMore = () => setVisibleCount(v => Math.min(v + initialVisibleCount, posts.length));
  const loadMoreDead = () => setVisibleDeadCount(d => Math.min(d + initialVisibleCount, deadlines.length));
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
  const fallback = `${BASE_URL}${newsPage.assets.fallbackImage}`;
  const resolveImage = (img = '') => ensureAbsolute(img) || fallback;

  return (
    <>
    <h1 className="text-brand news-header" style={{textAlign:'center',color:"white", backgroundImage:`url(${newsPage.assets.headerBackground})`}}>{newsPage.news.title}</h1>

    <section className="section">
       <div className={`container reveal ${deadlinesVisible?'is-visible':''}`} ref={deadlinesRef}>
        <h2 style={{textAlign:'center', marginBottom: 24}}>{newsPage.scadenze.subtitle}</h2>
        <div className=" deadline news-page-grid">
          {deadlines.slice(0, visibleDeadCount).map(p=> (
            <article className="news-page-card" key={p.slug}>
              <Link to={`/scadenze/${p.slug}`} className="news-page-media" style={{backgroundImage:`url(${resolveImage(p.image)})`}} />
              <div className="news-page-body">
                <h3><Link to={`/scadenze/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/scadenze/${p.slug}`} className="btn btn-brand">{newsPage.scadenze.readMore}</Link>
              </div>
            </article>
          ))}
        </div>
        {canLoadMoreDead && (
          <div className="news-loadmore">
            <button className="loadmore-btn" onClick={loadMoreDead} aria-label="Carica altri">
              <IconMore/>
            </button>
          </div>
        )}
      </div>
      <div className={`container reveal ${newsVisible?'is-visible':''}`} ref={newsRef}>
        <h2 style={{textAlign:'center', marginBottom: 24}}>{newsPage.news.subtitle}</h2>
        <div className="news-page-grid">
          {posts.slice(0, visibleCount).map(p=> (
            <article className="news-page-card" key={p.slug}>
              <Link to={`/news/${p.slug}`} className="news-page-media" style={{backgroundImage:`url(${resolveImage(p.image)})`}} />
              <div className="news-page-body">
                <h3><Link to={`/news/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/news/${p.slug}`} className="btn btn-brand">{newsPage.news.readMore}</Link>
              </div>
            </article>
          ))}
        </div>
        {canLoadMore && (
          <div className="news-loadmore">
            <button className="loadmore-btn" onClick={loadMore} aria-label="Carica altri">
              <IconMore/>
            </button>
          </div>
        )}
      </div>
      <Sole24hPanel query="news" />
    </section>
    </>
  );

}
