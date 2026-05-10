import './News.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import { Link } from 'react-router-dom';
import useNews from '../hooks/useNews';
import React from 'react';

const MOBILE_QUERY = '(max-width: 640px)';

const isMobileViewport = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(MOBILE_QUERY).matches
);

export default function News(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items: posts } = useNews(lang);
  const [isMobile, setIsMobile] = React.useState(isMobileViewport);
  const visiblePosts = isMobile ? 1 : 3;

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  return (
    <section className="section news">
      <div className="container">
        <h2 className="text-brand" style={{textAlign:'center'}}>{dict.news.title}</h2>
        <p style={{textAlign:'center', marginBottom: 24}}>{dict.news.subtitle}</p>
        <div ref={ref} className={`news-grid reveal ${visible?'is-visible':''}`}>
          {posts.slice(0,visiblePosts).map((p)=>(
            <article className="news-card" key={p.slug}>
              <Link to={`/news/${p.slug}`} className="news-media" style={{backgroundImage:`url(${p.image})`}} />
              <div className="news-body">
                <h3><Link to={`/news/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/news/${p.slug}`} className="btn btn-brand">{dict.news.readMore}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="news-archive"><Link to="/news" className="archive-link">{dict.news.archive}</Link></div>
      </div>
    </section>
  );
}
