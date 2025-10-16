import React from 'react';

const translations = {
  it: {
    nav: { servizi: 'Servizi', lavori: 'News e Scadenze', aree: 'Aree di Attivit�', chi: 'Chi siamo', contatti: 'Contatti' },
    hero: {
      eyebrow: 'Studio professionale',
      title: 'Soluzioni per la tua azienda',
      subtitle: 'Supportiamo crescita, efficienza e serenità operativa con consulenza strategica, servizi fiscali e amministrativi chiari e trasparenti.',
      cta1: 'Richiedi consulenza',
      cta2: 'Scopri i servizi',
    },
    services: {
      eyebrow: 'Servizi e Consulenze.',
      title: 'Affidati agli esperti della gestione aziendale',
      tiles: [
        { title: 'Servizi Contabili\ne di Bilancio' },
        { title: 'Servizi Fiscali\ne Tributari' },
        { title: 'Servizi\nSocietari' },
        { title: 'Servizi\nAusiliari' },
        { title: 'Assistenza e Ricerca\nGare Appalto' },
        {title:'Realizzazione Siti Web'},
        { title: 'Altri\nservizi' },
      ],
      more: 'Scopri tutti i nostri servizi',
    },
    works: {
      eyebrow: 'Casi recenti',
      title: 'Alcuni lavori',
      items: [
        { title: 'Riorganizzazione societaria', meta: 'Settore manifatturiero' },
        { title: 'Controllo di gestione', meta: 'Servizi B2B' },
        { title: 'Start-up innovativa', meta: 'Tecnologia' },
        { title: 'Ottimizzazione fiscale', meta: 'Retail' },
        { title: 'Passaggi generazionali', meta: 'PMI' },
        { title: 'Internazionalizzazione', meta: 'Export' },
      ],
      cta: 'Parliamone',
    },
    about: {
      eyebrow: 'Chi siamo',
      title: 'Un partner affidabile e vicino al business.',
      p1: 'Approccio consulenziale, linguaggio chiaro, responsabilità nei risultati. Lavoriamo al fianco di imprenditori e professionisti per costruire processi solidi e decisioni informate.',
      p2: 'Operiamo con una rete di specialisti per coprire ambiti fiscali, societari, giuslavoristici e finanziari.',
    },
    contact: {
      eyebrow: 'Contatti',
      title: 'Parliamo della tua esigenza',
      msg: 'Scrivici e ti risponderemo entro 1 giorno lavorativo.',
      name: 'Nome e Cognome',
      email: 'Email',
      message: 'Messaggio',
      submit: 'Invia',
      emailLabel: 'Email',
      phoneLabel: 'Telefono',
    },
    welcome: {
      since: 'Dal 1995 la nostra competenza al servizio della tua azienda',
      heading: 'Benvenuti',
      intro1: 'Lo studio Scarimbolo, grazie alla pluriennale esperienza nel campo della consulenza aziendale, è in grado di offrire a qualunque business le soluzioni più adatte alle peculiari esigenze del mercato, accompagnando, senza indugio e proattivamente, la crescita di ciascuna azienda con l’ausilio di un completo network di seri professionisti altamente qualificati.',
      intro2: 'Il nostro obiettivo primario è di fornire la migliore e la più attenta assistenza.',
    },
    news: {
      title: 'Scadenze e News',
      subtitle: 'Novità e appuntamenti dal mondo della finanza, contabilità, normativa e molto altro.',
      readMore: 'Leggi tutto',
      archive: 'Archivio news >',
      items: [
        { title: 'Viaggi, trasferte e rappresentanza: tracciabilità pagamenti obbligatoria.', excerpt: 'Nuovi criteri sulla tracciabilità dei pagamenti ai fini della deducibilità...', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1600&auto=format&fit=crop' },
        { title: 'Scadenza al 1° gennaio prossimo, del ravvedimento per aderenti al CPB 2025-2026', excerpt: 'Le regole dell’Agenzia delle Entrate per il Provvedimento 350617...', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=1600&auto=format&fit=crop' },
        { title: 'Costi e termini decadenziali per il Ravvedimento speciale.', excerpt: 'Sintesi delle tempistiche e delle modalità di adesione al ravvedimento...', image: 'https://images.unsplash.com/photo-1518544801976-3f3c6c4f1a1a?q=80&w=1600&auto=format&fit=crop' },
      ]
    },
    footer: { privacy: 'Privacy', cookie: 'Cookie', copyPrefix: '©', copySuffix: 'Via Brigata Bari n° 5/A - 70123 Bari - Studio Scarimbolo P.IVA IT07742460723 ' },
  },
  en: {
    nav: { servizi: 'Services', lavori: 'News & Deadlines', aree: 'Areas of Activity', chi: 'About', contatti: 'Contact' },
    hero: {
      eyebrow: 'Professional firm',
      title: 'Solutions for your company',
      subtitle: 'We support growth, efficiency and operational peace with strategic consulting, tax and administrative services that are clear and transparent.',
      cta1: 'Request a consult',
      cta2: 'View services',
    },
    services: {
      eyebrow: 'Services & Consulting.',
      title: 'Trust the experts of business management',
      tiles: [
        { title: 'Accounting &\nFinancial Statements' },
        { title: 'Tax &\nTributary Services' },
        { title: 'Corporate\nServices' },
        { title: 'Auxiliary\nServices' },
        { title: 'Tender\nSupport' },
        { title: 'More\nservices' },
      ],
      more: 'See all services',
    },
    works: {
      eyebrow: 'Recent cases',
      title: 'Selected work',
      items: [
        { title: 'Corporate reorganization', meta: 'Manufacturing' },
        { title: 'Management control', meta: 'B2B services' },
        { title: 'Innovative start-up', meta: 'Technology' },
        { title: 'Tax optimization', meta: 'Retail' },
        { title: 'Generational handovers', meta: 'SMEs' },
        { title: 'Internationalization', meta: 'Export' },
      ],
      cta: 'Let’s talk',
    },
    about: {
      eyebrow: 'About',
      title: 'A reliable partner, close to your business.',
      p1: 'Consultative approach, clear language, responsibility for results. We work alongside entrepreneurs and professionals to build solid processes and informed decisions.',
      p2: 'We operate with a network of specialists covering tax, corporate, labor and financial areas.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Tell us about your needs',
      msg: 'Write to us and we’ll reply within 1 business day.',
      name: 'Full name',
      email: 'Email',
      message: 'Message',
      submit: 'Send',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
    },
    welcome: {
      since: 'Since 1995 our expertise at your service',
      heading: 'Welcome',
      intro1: 'Thanks to long-standing experience in business advisory, our firm provides solutions tailored to each market’s needs, proactively supporting growth through a network of qualified professionals.',
      intro2: 'Our primary goal is to deliver the best and most attentive assistance.',
    },
    news: {
      title: 'Events & News',
      subtitle: 'Updates from finance, accounting, regulations and more.',
      readMore: 'Read more',
      archive: 'News archive >',
      items: [
        { title: 'Travel and representation expenses: mandatory traceability.', excerpt: 'New criteria for payment traceability for deductibility...', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1600&auto=format&fit=crop' },
        { title: 'Deadline January 1st for special regularization 2025–2026', excerpt: 'Revenue Agency rules and timelines summarized...', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=1600&auto=format&fit=crop' },
        { title: 'Costs and terms for the special regularization.', excerpt: 'Overview of timing and how to join the program...', image: 'https://images.unsplash.com/photo-1518544801976-3f3c6c4f1a1a?q=80&w=1600&auto=format&fit=crop' },
      ]
    },
    footer: { privacy: 'Privacy', cookie: 'Cookie', copyPrefix: '©', copySuffix: 'Studio. VAT 00000000000' },
  }
};

export const I18nContext = React.createContext({ lang: 'it', dict: translations.it, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = React.useState('it');
  React.useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const value = React.useMemo(() => ({ lang, setLang, dict: translations[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}


