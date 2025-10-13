import './Works.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';

export default function Works(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section id="lavori" className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <div className="eyebrow">{dict.works.eyebrow}</div>
            <h2>{dict.works.title}</h2>
          </div>
          <a className="btn" href="#contatti" onClick={(e)=>{e.preventDefault();document.getElementById('contatti')?.scrollIntoView({behavior:'smooth'});}}>{dict.works.cta}</a>
        </div>
        <div ref={ref} className={`grid grid--three reveal ${visible?'is-visible':''}`}>
          {dict.works.items.map((w, i) => (
            <article className="card" key={i}>
              <div className="card__media" style={{backgroundImage:`url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop)`, backgroundSize:'cover', backgroundPosition:'center'}} />
              <div className="card__body">
                <h3 className="card__title">{w.title}</h3>
                <p className="card__meta">{w.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

