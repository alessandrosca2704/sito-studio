import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsPage.css';
import useNews from '../hooks/useNews';
import Sole24hPanel from '../components/Sole24hPanel';
import useReveal from '../hooks/useReveal';
import React from 'react';
import { IconMore } from '../components/icons/Icons';
import useScadenze from '../hooks/useScadenze';

export default function NewsPage(){
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { ref: deadlinesRef, visible: deadlinesVisible } = useReveal();
  const { ref: newsRef, visible: newsVisible } = useReveal();
  const { items: posts } = useNews(lang);
  const { items: deadlines } = useScadenze(lang);
  const [visibleCount, setVisibleCount] = React.useState(3);
  const [visibleDeadCount, setVisibleDeadCount] = React.useState(3);
  React.useEffect(()=>{
    setVisibleCount(3);
    setVisibleDeadCount(3);
  }, [lang]);
  const canLoadMore = visibleCount < posts.length;
  const canLoadMoreDead = visibleDeadCount < deadlines.length;
  const loadMore = () => setVisibleCount(v => Math.min(v + 3, posts.length));
  const loadMoreDead = () => setVisibleDeadCount(d => Math.min(d + 3, deadlines.length));
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
  const fallback = `${BASE_URL}/assets/logo-facebook.png`;
  const resolveImage = (img = '') => ensureAbsolute(img) || fallback;

  return (
    <>
    <h1 className="text-brand news-header" style={{textAlign:'center',color:"white"}}>{dict.news.title}</h1>

    <section className="section">
       <div className={`container reveal ${deadlinesVisible?'is-visible':''}`} ref={deadlinesRef}>
        <h2 style={{textAlign:'center', marginBottom: 24}}>{dict.scadenze.subtitle}</h2>
        <div className=" deadline news-page-grid">
          {deadlines.slice(0, visibleDeadCount).map(p=> (
            <article className="news-page-card" key={p.slug}>
              <Link to={`/scadenze/${p.slug}`} className="news-page-media" style={{backgroundImage:`url(${resolveImage(p.image)})`}} />
              <div className="news-page-body">
                <h3><Link to={`/scadenze/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/scadenze/${p.slug}`} className="btn btn-brand">{dict.scadenze.readMore}</Link>
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
        <h2 style={{textAlign:'center', marginBottom: 24}}>{dict.news.subtitle}</h2>
        <div className="news-page-grid">
          {posts.slice(0, visibleCount).map(p=> (
            <article className="news-page-card" key={p.slug}>
              <Link to={`/news/${p.slug}`} className="news-page-media" style={{backgroundImage:`url(${resolveImage(p.image)})`}} />
              <div className="news-page-body">
                <h3><Link to={`/news/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/news/${p.slug}`} className="btn btn-brand">{dict.news.readMore}</Link>
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
