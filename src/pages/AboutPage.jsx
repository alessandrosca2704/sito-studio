import './AboutPage.css';
import { useI18n } from '../i18n';
import { IconBars, IconHandshake } from '../components/icons/Icons';
import useReveal from '../hooks/useReveal';

export default function AboutPage(){
  const { dict } = useI18n();
    const { ref, visible } = useReveal();
  
  return (
    <>
      <section className="about-hero">
        <div
          className="about-hero__bg"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${process.env.PUBLIC_URL}/assets/about_bg.jpg) center/cover no-repeat`
          }}
        />
        <div className="container">
          <h1>Lo Studio</h1>
        </div>
      </section>
    <div className={`reveal ${visible?'is-visible':''}`}ref={ref}>      
      <section className="section">
        <div className="container intro">
          <h2 className="text-brand">Dal 1995 competenza e serietà<br/>nella gestione della tua azienda</h2>
          <p>
            {dict.about.p1}
          </p>
        </div>
      </section>

      <section className="about-band">
        <div className="container about-band__inner">
          <div className="about-band__tile">
            <div className="container strengths">
          <div className="strengths__card">
            <h3 className="text-brand">La nostra forza,<br/>investire nelle nuove generazioni</h3>
            <h4>I nostri clienti</h4>
            <p>
              Sono <strong>professionisti, piccole e medie imprese</strong> che cercano un interlocutore competente ed unico in grado di assisterli
              in tutti gli aspetti fiscali, finanziari e del lavoro. Gli elevati standard di cortesia, efficienza e tempestività costituiscono gli
              elementi di successo dello Studio e assicurano ai Clienti tranquillità a costi contenuti.
            </p>
          </div>
        </div>
          </div>
          <div className="about-band__image">
            <img src="/assets/about1.jpg" alt="Team" />
          </div>
        </div>
      </section>

      <section className="section">
       
      </section>

      <section className="section">
        <div className="container pro">
          <div className="pro__photo">
            <img src="/assets/foto_home_vincenzo.jpg" alt="Vincenzo Scarimbolo" />
          </div>
          <div className="pro__bio">
            <h3 className="text-brand">I nostri professionisti</h3>
            <h4>Vincenzo Scarimbolo</h4>
            <div className="role">Commercialista e Revisore dei conti</div>
            <p>
              Iscritto all’Ordine dei Dottori Commercialisti e degli Esperti Contabili di Bari;
              iscritto al MEF nel registro dei revisori legali; iscritto all’Albo dei Delegati e dei Curatori fallimentari;
              iscritto all’albo dei CTU del Tribunale di Bari; Professionista Delegato e Custode in procedure esecutive del Tribunale di Bari;
              Coadiutore in procedure concorsuali del Tribunale di Bari.
            </p>
            <p><strong>
              Svolge attività professionale di esperto fiscalista e contabile, esperto in operazioni straordinarie d’impresa, fusioni, trasformazione e liquidazioni,
              consulenza societaria, sindaco effettivo in società di capitali.
            </strong></p>
            <div className="container social-strip__inner">
                    <div className="social-strip__fb">
                      
                      <div className="social-strip__caption"><img src='assets/ordine_comm.png' style={{width:'50%', borderRadius:'15px'}}></img></div>
                    </div>
                  </div>
          </div>
          
        </div>
      </section>

     </div>
    </>
  );
}
