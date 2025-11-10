import './Contact.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import React from 'react';

const CONTACT_EMAIL = 'info@studioscarimbolo.it';

export default function Contact(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  const [form, setForm] = React.useState({ name:'', email:'', message:'' });
  const [status, setStatus] = React.useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const encode = (data) => new URLSearchParams(data).toString();

  const fallbackMailto = () => {
    const subject = encodeURIComponent('Richiesta di contatto dal sito');
    const body = encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Invio in corso...');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contatti', name: form.name, email: form.email, message: form.message })
      });
      if (res.ok || res.status === 302) {
        setStatus('Messaggio inviato correttamente. Ti ricontatteremo a breve.');
        setForm({ name:'', email:'', message:'' });
      } else {
        setStatus('Impossibile inviare dal sito, apro il client email...');
        fallbackMailto();
      }
    } catch {
      setStatus('Impossibile inviare dal sito, apro il client email...');
      fallbackMailto();
    }
  };

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
            <p><strong>{dict.contact.emailLabel}</strong>: {CONTACT_EMAIL}<br/><strong>{dict.contact.phoneLabel}</strong>: +39 (00) 373 73 86 170</p>
            <div className="map-embed">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6011.42687436686!2d16.849821674486236!3d41.11894911260538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347e8ee170f27ff%3A0xdef5805116d0ef!2sSTUDIO%20SCARIMBOLO!5e0!3m2!1sit!2sit!4v1762780682869!5m2!1sit!2sit" width="600" height="450" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
          <form name="contatti" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="contatti" />
            <div className="form-grid">
              <input required name="name" value={form.name} onChange={update('name')} placeholder={dict.contact.name} />
              <input required name="email" type="email" value={form.email} onChange={update('email')} placeholder={dict.contact.email} />
              <textarea required name="message" value={form.message} onChange={update('message')} placeholder={dict.contact.message} rows={4} />
              <button className="btn" type="submit">{dict.contact.submit}</button>
              {status && <div aria-live="polite" style={{color:'var(--muted)'}}>{status}</div>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
