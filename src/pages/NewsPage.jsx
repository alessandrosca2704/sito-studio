import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsPage.css';
import useNews from '../hooks/useNews';
import Sole24hPanel from '../components/Sole24hPanel';
import useReveal from '../hooks/useReveal';
import React from 'react';
import { IconMore } from '../components/icons/Icons';

export default function NewsPage(){
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { ref, visible } = useReveal();
  const { items: posts } = useNews(lang);
  const [visibleCount, setVisibleCount] = React.useState(3);
  React.useEffect(()=>{ setVisibleCount(3); }, [lang]);
  const canLoadMore = visibleCount < posts.length;
  const loadMore = () => setVisibleCount(v => Math.min(v + 3, posts.length));
  return (
    <>
    <h1 className="text-brand news-header" style={{textAlign:'center',color:"white"}}>{dict.news.title}</h1>

    <section className="section">
      <div className={`container reveal ${visible?'is-visible':''}`}ref={ref}>
        <h2 style={{textAlign:'center', marginBottom: 24}}>{dict.news.subtitle}</h2>
        <div className="news-page-grid">
          {posts.slice(0, visibleCount).map(p=> (
            <article className="news-page-card" key={p.slug}>
              <Link to={`/news/${p.slug}`} className="news-page-media" style={{backgroundImage:`url(${p.image})`}} />
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
