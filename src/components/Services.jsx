import './Services.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import { IconChart, IconTarget, IconBars, IconScale, IconMore } from './icons/Icons';
import { Link } from 'react-router-dom';
import { getServices } from '../data';
export default function Services(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section id="servizi" className="section section--muted">
      <div className="container" >
        <div className="section__head" >
          <div>
            <div className="eyebrow text-brand">{dict.services.eyebrow}</div>
            <h2 className="text-brand">{dict.services.title}</h2>
          </div>
        </div>
        <div ref={ref} className={`services-grid reveal ${visible?'is-visible':''}`}>
          {getServices((typeof window!=='undefined' && document.documentElement.lang)||'it').slice(0,6).map((tile, i) => (
            <Link to={`/servizi#${tile.slug}`} className="service-tile" key={tile.slug}>
              <div className="service-icon">
                {i===0 && <IconChart size={56} />}
                {i===1 && <IconTarget size={56} />}
                {i===2 && <IconBars size={56} />}
                {i===3 && <IconScale size={56} />}
                {i===4 && <IconScale size={56} />}
                {i===5 && <IconMore size={56} />}
              </div>
              <div className="service-title">{tile.title}</div>
            </Link>
          ))}
        </div>
        <div className="services-more">
          <Link className="btn btn-brand" to="/servizi">{dict.services.more}</Link>
        </div>
      </div>
    </section>
  );
}
