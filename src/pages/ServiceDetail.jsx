import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { getServices } from '../data';
import './ServiceDetail.css';

export default function ServiceDetail(){
  const { slug } = useParams();
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang) || 'it';
  const item = getServices(lang).find(s => s.slug === slug);
  if(!item){
    return (
      <section className="section"><div className="container"><h2>Servizio non trovato</h2><Link to="/servizi" className="btn btn-brand">Torna ai servizi</Link></div></section>
    );
  }
  return (
    <section className="section">
      <div className="container detail">
        <div className="detail__header">
          <h1 className="text-brand">{item.title}</h1>
          <p className="detail__summary">{item.summary}</p>
        </div>
        <div className="detail__content" dangerouslySetInnerHTML={{__html: item.content}} />
        <div style={{marginTop:16}}><Link to="/servizi" className="btn">← {dict.services.more}</Link></div>
      </div>
    </section>
  );
}
