import './Hero.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';

export default function Hero(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="container">
        <div ref={ref} className={`reveal ${visible?'is-visible':''}`}>
          <div className="eyebrow">{dict.hero.eyebrow}</div>
          <h1 className="hero__title">{dict.hero.title}</h1>
          <p className="hero__subtitle">{dict.hero.subtitle}</p>
          <div className="hero__cta">
            <a className="btn" href="#contatti" onClick={(e)=>{e.preventDefault();document.getElementById('contatti')?.scrollIntoView({behavior:'smooth'});}}>{dict.hero.cta1}</a>
            <a className="btn" href="#servizi" onClick={(e)=>{e.preventDefault();document.getElementById('servizi')?.scrollIntoView({behavior:'smooth'});}}>{dict.hero.cta2}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
