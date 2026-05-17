import './News.css';
import useReveal from '../hooks/useReveal';
import { Link } from 'react-router-dom';
import useNews from '../hooks/useNews';
import React from 'react';
import newsPageContent from '../content/newsPage';
import { getCmsPreviewData } from '../content/cmsPreview';

const MOBILE_QUERY = '(max-width: 640px)';

const isMobileViewport = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(MOBILE_QUERY).matches
);

export default function News(){
  const { ref, visible } = useReveal();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const newsPage = getCmsPreviewData('path_news', lang, newsPageContent[lang] || newsPageContent.it);
  const newsCopy = newsPage.news;
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
        <h2 className="text-brand" style={{textAlign:'center'}}>{newsCopy.title}</h2>
        <p style={{textAlign:'center', marginBottom: 24}}>{newsCopy.subtitle}</p>
        <div ref={ref} className={`news-grid reveal ${visible?'is-visible':''}`}>
          {posts.slice(0,visiblePosts).map((p)=>(
            <article className="news-card" key={p.slug}>
              <Link to={`/news/${p.slug}`} className="news-media" style={{backgroundImage:`url(${p.image})`}} />
              <div className="news-body">
                <h3><Link to={`/news/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.excerpt}</p>
                <Link to={`/news/${p.slug}`} className="btn btn-brand">{newsCopy.readMore}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="news-archive"><Link to="/news" className="archive-link">{newsCopy.archive}</Link></div>
      </div>
    </section>
  );
}
