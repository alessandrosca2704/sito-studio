import React from 'react';
import './ActivitiesPage.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';

const itBlocks = [

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
    id: 'realizzazione-siti-web',
    title: 'Realizzazione siti web',
    highlight: 'Consulenza',
    image: `${process.env.PUBLIC_URL}/assets/siti.png`,
    content: (
      <>
        <section id="realizzazione-siti-web"
         class="servizio"
         aria-labelledby="titolo-servizio"
         itemscope
         itemtype="https://schema.org/Service">
          <header class="servizio__header">
            <h2 id="titolo-servizio" itemprop="name"></h2>
            <p class="servizio__sottotitolo" itemprop="description">
              Sviluppiamo siti veloci, responsive e ottimizzati per la SEO, pensati per convertire visitatori in clienti e raccontare al meglio il tuo brand.
            </p>
          </header>

  <div class="servizio__contenuto">
    <ul class="servizio__benefici" role="list">
      <li>
        <strong>Design su misura</strong>
        <p>Interfacce moderne e accessibili, progettate sui tuoi obiettivi e sulla tua identità visiva.</p>
      </li>
      <li>
        <strong>Prestazioni & SEO</strong>
        <p>Codice leggero, caricamento rapido, struttura semantica e best practice SEO on-page.</p>
      </li>
      <li>
        <strong>Mobile-first</strong>
        <p>Layout adattivi che funzionano perfettamente su smartphone, tablet e desktop.</p>
      </li>
      <li>
        <strong>Gestione autonoma</strong>
        <p>CMS intuitivo per aggiornare testi, immagini e pagine in autonomia.</p>
      </li>
      <li>
        <strong>Sicurezza & GDPR</strong>
        <p>HTTPS, backup automatici, cookie banner e moduli conformi al GDPR.</p>
      </li>
    </ul>

    <div class="servizio__cosa-includiamo">
      <h3>Cosa include</h3>
      <dl>
        <dt><strong>Analisi & strategia</strong></dt>
        <dd>Mappatura obiettivi, architettura informativa e wireframe.</dd>

        <dt><strong>Sviluppo</strong></dt>
        <dd>Front-end semantico (HTML5, CSS, JS).</dd>

        <dt><strong>Contenuti</strong></dt>
        <dd>Setup pagine principali, blog/news, moduli contatto e tracciamenti (GA4/Tag Manager).</dd>

        <dt><strong>Formazione</strong></dt>
        <dd>Sessione di training per l’uso del pannello di gestione.</dd>

        <dt><strong>Assistenza</strong></dt>
        <dd>Supporto post-go-live e piani di manutenzione opzionali.</dd>
      </dl>
    </div> 
  </div>
  </section>
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
        <p>Affianchiamo i clienti nella gestione dei rapporti con l&rsquo;Amministrazione Finanziaria dello Stato, degli Enti locali offrendo una consulenza guidata per gli obblighi tributari a enti, societ&agrave;, imprese, privati, con un occhio attent su tutti gli aspetti della tassazione, sia per imposte dirette che per imposte indirette.</p>
        <p><strong>Nello specifico, le imposte dirette di cui si occupa uno studio con servizi di consulenza fiscale sono:</strong><br />&bull; Dichiarazione dei Redditi per persone fisiche, giuridiche, societ&agrave;, ONLUS, enti non commerciali, per Mod. UNICO, IVA e IRAP.<br />&bull; Dichiarazione sostituti d&rsquo;imposta, con modello 770.<br />&bull; Dichiarazioni di TASI e IMU, con anche i vari versamenti.<br />&bull; Liquidazioni IVA periodiche.<br />&bull; Valutazioni delle rimanenze finali nei magazzini.<br />&bull; Apertura di una Partita IVA in base al migliore e pi&ugrave; appropriato regime fiscale.<br />&bull; Calcolo di saldi e acconti IRPEF, IVA, IRES e IRAP.</p>
        <p><strong>Per quanto riguarda le imposte indirette, i servizi di consulenza fiscale riguardano il bollo, la successione e il registro.</strong><br />Per questi motivi, la consulenza tributaria non &egrave; limitata solamente alle dichiarazioni fiscali, ma fornisce anche servizi di assistenza per problematiche pi&ugrave; difficili.</p>
        <p><strong>Ecco perch&eacute; &egrave; assolutamente fondamentale rivolgersi ad un professionista in grado di assicurare la migliore e pi&ugrave; completa gestione di ogni aspetto fiscale al fine di capire come orientarsi nell&rsquo;intricato e difficile mondo delle normative su tributi e imposte che, tra le altre cose, vanno sempre correttamente calcolate e versate su base del fatturato e rispettando le scadenze.</strong></p>
      </>
    ),
  },
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
  
];

const enBlocks = [

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
    id: 'realizzazione-siti-web',
    title: 'Web-Site Developing',
    highlight: 'Web Developing',
    image: `${process.env.PUBLIC_URL}/assets/siti.png`,
    content: (
      <section id="website-development"
         class="service"
         aria-labelledby="service-title"
         itemscope
         itemtype="https://schema.org/Service">
  <header class="service__header">
    <h2 id="service-title" itemprop="name">Professional Website Development</h2>
    <p class="service__subtitle" itemprop="description">
      We build fast, responsive, and SEO-optimized websites designed to convert visitors into customers and effectively showcase your brand.
    </p>
  </header>

  <div class="service__content">
    <ul class="service__benefits" role="list">
      <li>
        <strong>Custom Design</strong>
        <p>Modern, accessible interfaces tailored to your goals and brand identity.</p>
      </li>
      <li>
        <strong>Performance & SEO</strong>
        <p>Lightweight code, fast loading times, semantic structure, and on-page SEO best practices.</p>
      </li>
      <li>
        <strong>Mobile-first</strong>
        <p>Responsive layouts that work flawlessly on smartphones, tablets, and desktops.</p>
      </li>
      <li>
        <strong>Self-management</strong>
        <p>Intuitive CMS to update text, images, and pages independently.</p>
      </li>
      <li>
        <strong>Security & GDPR</strong>
        <p>HTTPS, automatic backups, cookie banner, and GDPR-compliant forms.</p>
      </li>
    </ul>

    <div class="service__inclusions">
      <h3>What’s Included</h3>
      <dl>
        <dt><strong>Strategy & Planning</strong></dt>
        <dd>Goal mapping, information architecture, and wireframes.</dd>

        <dt><strong>Development</strong></dt>
        <dd>Semantic front-end (HTML5, CSS, JS).</dd>

        <dt><strong>Content Setup</strong></dt>
        <dd>Main pages, blog/news, contact forms, and tracking (GA4/Tag Manager).</dd>

        <dt><strong>Training</strong></dt>
        <dd>Training session on how to use the admin panel.</dd>

        <dt><strong>Support</strong></dt>
        <dd>Post-launch support and optional maintenance plans.</dd>
      </dl>
    </div>
  </div>
</section>

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
];

export default function ActivitiesPage(){
  const { lang } = useI18n();
  const blocks = lang === 'en' ? enBlocks : itBlocks;
  const heroTitle = lang === 'en' ? 'Areas of Activity' : 'Aree di Attività';
  const { ref, visible } = useReveal({threshold:0});
  
  return (
    <>
      <section className="act-hero">
        <div className="act-hero__bg" />
        <div className="container">
          <h1>{heroTitle}</h1>
        </div>
      </section>
      <div className={`container reveal ${visible?'is-visible':''}`}ref={ref}>

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
      </div>
    </>
  );
}
