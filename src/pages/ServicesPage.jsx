import { useI18n } from '../i18n';
import './ServicesPage.css';
import { IconChart, IconTarget, IconBars, IconScale } from '../components/icons/Icons';
import { getServices } from '../data';
import useReveal from '../hooks/useReveal';

const iconByIndex = [IconTarget, IconChart, IconBars, IconScale];

export default function ServicesPage(){
  const { dict } = useI18n();
  const lang = (typeof window!=='undefined' && document.documentElement.lang) || 'it';
  const list = getServices(lang);
  const { ref, visible } = useReveal();
  
  return (
    <>
      <section className="section section-bg">
        <div className="container">
          <h1 className="text-brand" style={{textAlign:'center',color:"white", fontSize:"350%",  whiteSpace:"nowrap"}}>{dict.services.title}</h1>
        </div>
      </section>
     <div className={`reveal ${visible?'is-visible':''}`}ref={ref}>

      {list.map((s, i)=>{
        const Icon = iconByIndex[i % iconByIndex.length];
        const imgUrl = `${process.env.PUBLIC_URL}/assets/${s.slug}.png`;
        const reversed = i % 2 === 1;
        return (
          <section id={s.slug} className="svc section" key={s.slug}>
            <div className="container">
              <div className={`svc__grid ${reversed? 'svc__grid--rev':''}`}>
                <div className="svc__text">
                  <div className="svc__icon"><Icon size={56} /></div>
                  <h2>{s.title}</h2>
                  <div className="svc__content" dangerouslySetInnerHTML={{__html: s.content}} />
                </div>
                <div className="svc__image">
                  <img src={imgUrl} alt={s.title} onError={(e)=>{e.currentTarget.style.display='none';}}/>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      </div>
    </>
  );
}
