import './Header.css';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';

export default function Header(){
  const { lang, setLang, dict } = useI18n();
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="brand">
          <img 
            src="/assets/logo.png"
            style={{width:'20%', borderRadius:'45%', alignContent:'center', padding:'3%'}}
            />
          <Link to="/"href="/" onclick={window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}>Studio Scarimbolo</Link>
          </div>
        <nav className="nav">
          <Link to="/servizi">{dict.nav.servizi}</Link>
          <Link to="/news"><a href="#news">{dict.nav.lavori}</a></Link>
          <Link to="/chi-siamo">{dict.nav.chi}</Link>
          <a href="#contatti" className="btn" onClick={(e)=>{e.preventDefault();scrollTo('contatti');}}>{dict.nav.contatti}</a>
          <div className="lang-switch">
            <button aria-label="Italiano" className={lang==='it'?'active':''} onClick={()=>setLang('it')}>IT</button>
            <span className="sep">/</span>
            <button aria-label="English" className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
