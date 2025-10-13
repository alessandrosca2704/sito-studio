import React from 'react';
import './ActivitiesPage.css';
import { useI18n } from '../i18n';

const itBlocks = [
  {
    id: 'finanza-aziendale',
    title: 'Finanza Aziendale',
    highlight: 'Finanza',
    image: `${process.env.PUBLIC_URL}/assets/aziendale.jpg`,
    content: (
      <>
        <p>Lo studio si occuperà di studiare le migliori decisioni in ambito aziendale atte a garantire, all’azienda stessa, un bilancio attivo.</p>
        <p>Occupandosi quindi della cosiddetta corporate finance mettendo in pratica tutte le tecniche e gli strumenti che mirano a migliorare il valore dell’impresa e ad assicurare un rendimento del capitale superiore al costo del capitale, il tutto evitando i rischi finanziari.</p>
        <p><strong>Le decisioni in analisi verranno prese sulla base dei fondi disponibili e delle attività sulle quali investire;</strong> l’obiettivo finale è stabilire un buon equilibrio tra i due aspetti, possibilmente aumentando il rendimento, abbassando i costi e riducendo i rischi.</p>
      </>
    ),
  },
  {
    id: 'ristrutturazioni-aziendali',
    title: 'Ristrutturazioni Aziendali',
    highlight: 'Ristrutturazioni',
    image: `${process.env.PUBLIC_URL}/assets/ristrutturazione.jpg`,
    content: (
      <>
        <p>L’azienda con problemi di perdite viene studiata da un punto di vista esterno in tutte le sue caratteristiche. Il nostro team si occuperà di fare un’analisi della redditività di tutte le attività produttive e delle tendenze del mercato in cui l’impresa si muove.</p>
        <ul>
          <li>Ridisegnare l’azienda, tagliando i rami meno produttivi e cercando di salvare i rami più produttivi.</li>
          <li>Proporre un piano di riduzione dei costi strettissimo.</li>
          <li>Predisporre un piano strategico concreto su come generare vendite, fatturato e utili per rispettare gli obiettivi finanziari.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'consulenza-finanziaria',
    title: 'Consulenza Finanziaria',
    highlight: 'Consulenza',
    image: `${process.env.PUBLIC_URL}/assets/finanziaria.jpg`,
    content: (
      <>
        <p>Lo studio avrà come priorità quella di incontrare il cliente per individuare aspettative ed esigenze di investimento, di protezione del risparmio, di miglioramento della situazione finanziaria presente o futura.</p>
        <p>Svolge quindi un’analisi approfondita della situazione personale, fiscale ed economica del cliente e fissa gli obiettivi a breve e a lungo termine.</p>
        <p><strong>Finalizzerà la costruzione di un rapporto personale con il cliente, improntato alla trasparenza,</strong> per permettere di conoscerne a fondo la situazione e gli obiettivi finanziari, e di formulare la soluzione più idonea nell’interesse del cliente.</p>
      </>
    ),
  },
  {
    id: 'consulenza-fiscale-tributaria',
    title: 'Consulenza Fiscale e Tributaria',
    highlight: 'Consulenza',
    image: `${process.env.PUBLIC_URL}/assets/fiscale_tributaria.jpg`,
    content: (
      <>
        <p>Un&rsquo;attivit&agrave; fondamentale, il management dello studio con l&rsquo;ausilio dei suoi collaboratori e professionisti qualificati, rivolto sia alle aziende sia ai privati cittadini.</p>
        <p>&nbsp;</p>
        <p>Affianchiamo i clienti nella gestione dei rapporti con l&rsquo;Amministrazione Finanziaria dello Stato, degli Enti locali offrendo una consulenza guidata per gli obblighi tributari a enti, societ&agrave;, imprese, privati, con un occhio attent su tutti gli aspetti della tassazione, sia per imposte dirette che per imposte indirette.</p>
        <p>&nbsp;</p>
        <p><strong>Nello specifico, le imposte dirette di cui si occupa uno studio con servizi di consulenza fiscale sono:</strong><br />&bull; Dichiarazione dei Redditi per persone fisiche, giuridiche, societ&agrave;, ONLUS, enti non commerciali, per Mod. UNICO, IVA e IRAP.<br />&bull; Dichiarazione sostituti d&rsquo;imposta, con modello 770.<br />&bull; Dichiarazioni di TASI e IMU, con anche i vari versamenti.<br />&bull; Liquidazioni IVA periodiche.<br />&bull; Valutazioni delle rimanenze finali nei magazzini.<br />&bull; Apertura di una Partita IVA in base al migliore e pi&ugrave; appropriato regime fiscale.<br />&bull; Calcolo di saldi e acconti IRPEF, IVA, IRES e IRAP.</p>
        <p>&nbsp;</p>
        <p><strong>Per quanto riguarda le imposte indirette, i servizi di consulenza fiscale riguardano il bollo, la successione e il registro.</strong><br />Per questi motivi, la consulenza tributaria non &egrave; limitata solamente alle dichiarazioni fiscali, ma fornisce anche servizi di assistenza per problematiche pi&ugrave; difficili.</p>
        <p>&nbsp;</p>
        <p><strong>Ecco perch&eacute; &egrave; assolutamente fondamentale rivolgersi ad un professionista in grado di assicurare la migliore e pi&ugrave; completa gestione di ogni aspetto fiscale al fine di capire come orientarsi nell&rsquo;intricato e difficile mondo delle normative su tributi e imposte che, tra le altre cose, vanno sempre correttamente calcolate e versate su base del fatturato e rispettando le scadenze.</strong></p>
      </>
    ),
  },
];

const enBlocks = [
  {
    id: 'finanza-aziendale',
    title: 'Corporate Finance',
    highlight: 'Finance',
    image: `${process.env.PUBLIC_URL}/assets/aziendale.jpg`,
    content: (
      <>
        <p>We study corporate decisions to secure a healthy, profitable balance sheet.</p>
        <p>We apply corporate finance techniques and tools to improve company value and achieve returns above the cost of capital while managing risks.</p>
        <p><strong>Decisions balance available funds and investable assets</strong> to raise returns while reducing costs and risks.</p>
      </>
    ),
  },
  {
    id: 'ristrutturazioni-aziendali',
    title: 'Corporate Restructuring',
    highlight: 'Restructuring',
    image: `${process.env.PUBLIC_URL}/assets/ristrutturazione.jpg`,
    content: (
      <>
        <p>External analysis for companies facing losses: profitability, operations and market trends.</p>
        <ul>
          <li>Redesign the company, removing low‑productivity areas and strengthening the best ones.</li>
          <li>Strict cost‑reduction plan.</li>
          <li>Concrete strategy to generate sales, revenue and profit.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'consulenza-finanziaria',
    title: 'Financial Advisory',
    highlight: 'Advisory',
    image: `${process.env.PUBLIC_URL}/assets/finanziaria.jpg`,
    content: (
      <>
        <p>We meet clients to understand investment goals, risk protection and financial improvement needs.</p>
        <p>We analyse personal, tax and economic situation and set short‑ and long‑term goals.</p>
        <p><strong>We build a transparent relationship</strong> to propose the most suitable solution.</p>
      </>
    ),
  },
  {
    id: 'consulenza-fiscale-tributaria',
    title: 'Tax Advisory',
    highlight: 'Advisory',
    image: `${process.env.PUBLIC_URL}/assets/fiscale_tributaria.jpg`,
    content: (
      <>
        <p>Support for companies and individuals in dealing with the Tax Administration and ensuring compliance.</p>
        <p>Direct and indirect taxes, returns, VAT settlements, VAT number opening, tax calculations.</p>
      </>
    ),
  },
];

export default function ActivitiesPage(){
  const { lang } = useI18n();
  const blocks = lang === 'en' ? enBlocks : itBlocks;
  const heroTitle = lang === 'en' ? 'Areas of Activity' : 'Aree di Attività';
  return (
    <>
      <section className="act-hero">
        <div className="act-hero__bg" />
        <div className="container">
          <h1>{heroTitle}</h1>
        </div>
      </section>

      {blocks.map((b, i) => {
        const reversed = i % 2 === 1;
        const tinted = i % 2 === 0;
        return (
          <section id={b.id} key={b.id} className={`section act ${reversed? 'act--rev':''} ${tinted? 'act--tint':''}`}>
            <div className="container">
              <div className="act__grid">
                <div className="act__text">
                  <h2><span className="text-brand">{b.highlight}</span> {b.title.replace(b.highlight + ' ', '')}</h2>
                  <div className="act__content">{b.content}</div>
                </div>
                <div className="act__image">
                  <div className="act__imgwrap">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={b.image} alt={`${b.title} image`} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                    <div className="act__label">{b.title.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
