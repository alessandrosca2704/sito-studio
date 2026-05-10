
import React from 'react';
import './AboutPage.css';
import { useI18n } from '../i18n';
import { IconHandshake, IconBars } from '../components/icons/Icons';
import useReveal from '../hooks/useReveal';

const copy = {
  it: {
    heroTitle: 'Lo Studio',
    introTitle: 'Dal 1995 competenza e serietà nella gestione della tua azienda',
    introParagraphs: [
      'Lo studio Scarimbolo, grazie alla pluriennale esperienza nel campo della consulenza aziendale, è in grado di offrire soluzioni adatte alle esigenze del mercato accompagnando, senza indugio e in modo proattivo, la crescita di ciascuna azienda.',
      'Il nostro obiettivo primario è fornire assistenza attenta e costante attraverso una rete di professionisti qualificati.'
    ],
    focusTitle: 'La nostra forza, investire nelle nuove generazioni',
    focusLead:<p><strong>Professionisti, piccole e medie imprese</strong> trovano nello studio un interlocutore competente capace di assisterli in ogni aspetto fiscale, finanziario e del lavoro.  Gli elevati standard di cortesia, efficienza e tempestività costituiscono gli elementi di successo dello Studio e assicurano ai Clienti tranquillità a costi contenuti.</p> ,
    focusBullets: [
      'Ridisegniamo i processi aziendali preservando e potenziando i reparti più produttivi',
      'Impostiamo piani di riduzione dei costi mirati e sostenibili',
      'Sviluppiamo strategie concrete per generare valore, fatturato e utili'
    ],
    teamTitle: 'I nostri professionisti',
    teamName: 'Vincenzo Scarimbolo',
    teamRole: 'Commercialista e Revisore dei conti',
    teamBio: [
      "Iscritto all'Ordine dei Dottori Commercialisti e degli Esperti Contabili di Bari, al MEF nel registro dei revisori legali e all'Albo dei Delegati e dei Curatori fallimentari.",
      "Delegato e Custode in procedure esecutive del Tribunale di Bari, Coadiutore in procedure concorsuali e professionista esperto in operazioni straordinarie d'impresa, fusioni, trasformazioni e liquidazioni."
    ],
    badgeCaption: 'Ordine dei Dottori Commercialisti di Bari'
  },
  en: {
    heroTitle: 'Our Firm',
    introTitle: 'Since 1995 expertise and reliability for your company',
    introParagraphs: [
      'Scarimbolo Studio offers tailored solutions thanks to long-standing experience in business advisory, proactively supporting the growth of every client.',
      'Our primary goal is to provide attentive, ongoing assistance through a network of highly qualified professionals.'
    ],
    focusTitle: 'Our strength: investing in new generations',
    focusLead: 'Professionals, small and medium-sized enterprises find a competent partner guiding them through fiscal, financial and labour matters.',
    focusBullets: [
      'We redesign corporate processes while enhancing the most productive areas',
      'We implement targeted, sustainable cost-reduction plans',
      'We craft concrete strategies to generate value, revenue and profit'
    ],
    teamTitle: 'Our professionals',
    teamName: 'Vincenzo Scarimbolo',
    teamRole: 'Chartered accountant and statutory auditor',
    teamBio: [
      'Member of the Bari Order of Chartered Accountants, registered auditor with the Ministry of Economy and Finance, and listed as delegated professional and receiver for insolvency proceedings.',
      'Court-appointed specialist in extraordinary corporate transactions, mergers, transformations and liquidations.'
    ],
    badgeCaption: 'Italian Chartered Accountants Association'
  }
};

export default function AboutPage(){
  const { lang } = useI18n();
  const { ref, visible } = useReveal();
  const content = copy[lang] || copy.it;
  const focusLead = React.isValidElement(content.focusLead)
    ? content.focusLead
    : <p>{content.focusLead}</p>;

  return (
    <>
      <section className="about-hero">
        <div
          className="about-hero__bg"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.55)), url(${process.env.PUBLIC_URL}/assets/about_bg.jpg) center/cover no-repeat`
          }}
        />
        <div className="container about-hero__inner">
          <h1>{content.heroTitle}</h1>
        </div>
      </section>

      <section className="section about-intro" ref={ref}>
        <div className={`container about-intro__grid ${visible ? 'is-visible' : ''}`}>
          <div className="about-intro__icon"><IconHandshake size={52} /></div>
          <div>
            <h2 className="text-brand">{content.introTitle}</h2>
            {content.introParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-focus">
        <div className="container about-focus__grid">

          <div className="about-focus__text">
            <span className="eyebrow"><IconBars size={32} />&nbsp; {content.focusTitle}</span>
            <div className="about-focus__lead">{focusLead}</div>
            <ul>
              {content.focusBullets.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
         <div className="about-focus__media">
         </div>
        </div>

          
      </section>

      <section className="section about-team">
        <div className="container about-team__grid">
          <div className="about-team__photo">
            <img src="/assets/foto_home_vincenzo.jpg" alt={content.teamName} />
          </div>
          <div className="about-team__bio">
            <h3 className="text-brand">{content.teamTitle}</h3>
            <h4>{content.teamName}</h4>
            <div className="about-team__role">{content.teamRole}</div>
            {content.teamBio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            <div className="about-team__badge">
              <img src="/assets/ordine_comm.png" alt={content.badgeCaption} />
              <span>{content.badgeCaption}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


