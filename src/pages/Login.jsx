import React from 'react';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthed, loginWithPassword } from '../auth';

export default function Login(){
  const nav = useNavigate();
  const loc = useLocation();
  const [pw, setPw] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(()=>{
    if (isAuthed()) nav('/admin', { replace: true });
  }, [nav]);

  const submit = (e) => {
    e.preventDefault();
    if (loginWithPassword(pw)) {
      const dest = (loc.state && loc.state.from) || '/admin';
      nav(dest, { replace: true });
    } else {
      setError('Password non corretta');
    }
  };

  return (
    <section className="login">
      <form className="login__card" onSubmit={submit}>
        <h1>Area Riservata</h1>
        <p className="login__hint">Inserisci la password amministratore per accedere.</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" />
        {error && <div className="login__error">{error}</div>}
        <button className="btn btn-brand" type="submit">Entra</button>
        <div className="login__note">Suggerimento: imposta la password tramite variabile env <code>REACT_APP_ADMIN_PASSWORD</code> o modifica in codice.</div>
      </form>
    </section>
  );
}

