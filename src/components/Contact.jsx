import './Contact.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';

export default function Contact(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  return (
    <section id="contatti" className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <div className="eyebrow">{dict.contact.eyebrow}</div>
            <h2>{dict.contact.title}</h2>
          </div>
        </div>
        <div ref={ref} className={`grid grid--two reveal ${visible?'is-visible':''}`}>
          <div>
            <p>{dict.contact.msg}</p>
            <p><strong>{dict.contact.emailLabel}</strong>: info@studioscarimbolo.it<br/><strong>{dict.contact.phoneLabel}</strong>:+39 (00) 373 73 86 170</p>
          </div>
          <form onSubmit={(e)=>e.preventDefault()}>
            <div className="form-grid">
              <input required placeholder={dict.contact.name} />
              <input required type="email" placeholder={dict.contact.email} />
              <textarea required placeholder={dict.contact.message} rows={4} />
              <button className="btn" type="submit">{dict.contact.submit}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

