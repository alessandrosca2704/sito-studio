import './Footer.css';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';

export default function Footer(){
  const { dict } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          {dict.footer.copyPrefix} {year} {dict.footer.copySuffix}
          <a href='https://www.alessandroscarimbolo.it' target='blank'><strong> - Sito realizzato da Alessandro Scarimbolo</strong></a>
        </div>
        <div style={{display:'flex', gap:16}}>
          <Link to="/privacy">{dict.footer.privacy}</Link>
          <a href="#cookie">{dict.footer.cookie}</a>
        </div>
      </div>
    </footer>
  );
}
