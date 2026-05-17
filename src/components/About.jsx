import './About.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import { Link } from 'react-router-dom';
import siteSettings from '../content/siteSettings.json';

export default function About(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section id="chi-siamo" className="section section--muted">
      <div className="container about">
        <div ref={ref} className={`reveal ${visible?'is-visible':''}`}>
          <div className="eyebrow">{dict.about.eyebrow}</div>
          <h2>{dict.about.title}</h2>
          <p>{dict.about.p1}</p>
          <p>{dict.about.p2}</p>
          <Link to="/chi-siamo" href="#"><button className='btn btn-about'>{dict.about.cta}</button></Link>
        </div>
        <div>
          <img alt="Studio" src={dict.about.image || siteSettings.assets.aboutHomeImage} />
        </div>
      </div>
    </section>
  );
}
