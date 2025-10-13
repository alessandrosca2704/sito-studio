import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsPage.css';
import useNews from '../hooks/useNews';
import useReveal from '../hooks/useReveal';

export default function NewsPage(){
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { ref, visible } = useReveal();
  const { items: posts } = useNews(lang);
  return (
    <section className="section">
      <div className={`container reveal ${visible?'is-visible':''}`}ref={ref}>
        <h1 className="text-brand" style={{textAlign:'center'}}>{dict.news.title}</h1>
        <p style={{textAlign:'center', marginBottom: 24}}>{dict.news.subtitle}</p>
        <div className="news-page-grid">
          {posts.map(p=> (
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
      </div>
    </section>
  );
}
