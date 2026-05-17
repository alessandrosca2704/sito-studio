import './Contact.css';
import { useI18n } from '../i18n';
import useReveal from '../hooks/useReveal';
import React from 'react';
import siteSettings from '../content/siteSettings.json';

const CONTACT_EMAIL = siteSettings.contact.email;

export default function Contact(){
  const { dict } = useI18n();
  const { ref, visible } = useReveal();
  const [form, setForm] = React.useState({ name:'', email:'', message:'' });
  const [status, setStatus] = React.useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const encode = (data) => new URLSearchParams(data).toString();

  const fallbackMailto = () => {
    const subject = encodeURIComponent(siteSettings.contact.mailtoSubject);
    const body = encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(dict.contact.sending);
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contatti', name: form.name, email: form.email, message: form.message })
      });
      if (res.ok || res.status === 302) {
        setStatus(dict.contact.success);
        setForm({ name:'', email:'', message:'' });
      } else {
        setStatus(dict.contact.fallback);
        fallbackMailto();
      }
    } catch {
      setStatus(dict.contact.fallback);
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
            <p><strong>{dict.contact.emailLabel}</strong>: {CONTACT_EMAIL}<br/><strong>{dict.contact.phoneLabel}</strong>: {siteSettings.contact.phone}</p>
            <div className="map-embed">
              <iframe title="Mappa Studio Scarimbolo" src={siteSettings.contact.mapEmbedUrl} width="600" height="450" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
          <form
            name="contatti"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            action="/"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contatti" />
            <input type="hidden" name="bot-field" />
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
