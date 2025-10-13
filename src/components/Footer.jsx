import './Footer.css';
import { useI18n } from '../i18n';

export default function Footer(){
  const { dict } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          {dict.footer.copyPrefix} {year} {dict.footer.copySuffix}
        </div>
        <div style={{display:'flex', gap:16}}>
          <a href="#privacy">{dict.footer.privacy}</a>
          <a href="#cookie">{dict.footer.cookie}</a>
        </div>
      </div>
    </footer>
  );
}

