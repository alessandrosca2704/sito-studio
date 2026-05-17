import './Welcome.css';
import { useI18n } from '../i18n';
import { IconHandshake } from './icons/Icons';
import useReveal from '../hooks/useReveal';
import { Link } from 'react-router-dom';
import siteSettings from '../content/siteSettings.json';

export default function Welcome(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section className="section welcome">
      <div className="container">
        <div className="welcome__grid">
          <div className="welcome__media">
            <img alt="Founder" src={dict.welcome.image || siteSettings.assets.welcomeImage} />
          </div>
          <div className={`welcome__content reveal ${visible?'is-visible':''}`} ref={ref}>
            <div className="welcome__icon"> <img 
            src={dict.welcome.icon || siteSettings.assets.welcomeIcon}
            style={{width:'20%', borderRadius:'45%', alignContent:'center', padding:'3%'}}
            /></div>
            <div className="eyebrow text-brand">{dict.welcome.since}</div>
            <h2>{dict.welcome.heading}</h2>
            <p>{dict.welcome.intro1}</p>
            <p>{dict.welcome.intro2}</p>
            <Link className="welcome__more" to="/chi-siamo">{dict.welcome.more}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
