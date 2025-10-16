import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useI18n } from '../i18n';

export default function Header() {
  const { dict, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const safe = useCallback((value, fallback) => {
    if (!value) return fallback;
    return value.includes('�') ? fallback : value;
  }, []);

  const links = useMemo(() => ([
    { key: 'servizi', to: '/servizi', label: safe(dict.nav.servizi, 'Servizi') },
    { key: 'aree', to: '/aree-di-attivita', label: safe(dict.nav.aree, 'Aree di Attività') },
    { key: 'news', to: '/news', label: safe(dict.nav.lavori, 'News') },
    { key: 'chi', to: '/chi-siamo', label: safe(dict.nav.chi, 'Chi siamo') },
  ]), [dict.nav, safe]);

  const contactLabel = safe(dict.nav.contatti, 'Contatti');

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToContact = useCallback((event) => {
    event.preventDefault();
    setOpen(false);
    const performScroll = () => setTimeout(() => scrollTo('contatti'), 200);
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      performScroll();
    } else {
      performScroll();
    }
  }, [location.pathname, navigate, scrollTo]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const renderLangSwitch = (className = '') => (
    <div className={`lang-switch ${className}`.trim()}>
      <button aria-label="Italiano" className={lang === 'it' ? 'active' : ''} onClick={() => setLang('it')}>IT</button>
      <span className="sep">/</span>
      <button aria-label="English" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
    </div>
  );

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
          <img src="/assets/logo.png" alt="Studio Scarimbolo" />
          <span>Studio Scarimbolo</span>
        </Link>
        <nav className="nav-desktop" aria-label="Main navigation">
          {links.map((item) => (
            <Link key={item.key} to={item.to}>{item.label}</Link>
          ))}
          <button type="button" className="btn" onClick={goToContact}>{contactLabel}</button>
          {renderLangSwitch('lang-switch--desktop')}
        </nav>
        <button className="hamburger" aria-label="Apri menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <span></span>
        </button>
      </div>
      <div className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu mobile">
        <div className="drawer__overlay" onClick={() => setOpen(false)} />
        <div className="drawer__panel">
          <button type="button" className="drawer-close" onClick={() => setOpen(false)}>Chiudi</button>
          <nav className="drawer-nav" aria-label="Mobile navigation">
            {links.map((item) => (
              <Link key={item.key} to={item.to}>{item.label}</Link>
            ))}
            <button type="button" className="nav-contact nav-contact--drawer" onClick={goToContact}>{contactLabel}</button>
          </nav>
          <div className="drawer-footer">
            {renderLangSwitch('lang-switch--drawer')}
          </div>
        </div>
      </div>
    </header>
  );
}

