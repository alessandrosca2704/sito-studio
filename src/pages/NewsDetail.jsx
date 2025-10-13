import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import './NewsDetail.css';
import useNews from '../hooks/useNews';

export default function NewsDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang)||'it';
  const { items } = useNews(lang);
  const post = items.find(p => p.slug === slug);
  if(!post){
    return (
      <section className="section"><div className="container"><h2>Articolo non trovato</h2><Link to="/news" className="btn btn-brand">Torna alle news</Link></div></section>
    );
  }
  return (
    <section className="section">
      <div className="container">
        <div className="news-detail">
          <div className="news-detail__media" style={{backgroundImage:`url(${post.image})`}} />
          <h1 className="text-brand">{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="news-detail__content" dangerouslySetInnerHTML={{__html: post.content || post.excerpt}} />
          <div style={{marginTop:16}}><Link to="/news" className="btn">← {dict.news.archive}</Link></div>
        </div>
      </div>
    </section>
  );
}
