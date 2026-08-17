import React from 'react';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthed, loginWithPassword } from '../auth';

export default function Login(){
  const nav = useNavigate();
  const loc = useLocation();
  const [pw, setPw] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

React.useEffect(()=>{
    let active = true;
    isAuthed().then((ok) => { if (active && ok) nav('/admin', { replace: true }); });
    return () => { active = false; };
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await loginWithPassword(pw.trim());   //await qui
      if (ok) {
        const dest = (loc.state && loc.state.from) || '/admin';
        nav(dest, { replace: true });
      } else {
        setError('Password non corretta');
      }
    } catch {
      setError('Errore di rete, riprova');
    } finally {
      setLoading(false);
    }
  };

 return (
    <section className="login">
      <form className="login__card" onSubmit={submit}>
        <h1>Area Riservata</h1>
        <p className="login__hint">Inserisci la password amministratore per accedere.</p>
        <input
          type="password"
          value={pw}
          onChange={e=>setPw(e.target.value)}
          placeholder="Password"
          disabled={loading}
        />
        {error && <div className="login__error">{error}</div>}
        <button className="btn btn-brand" type="submit" disabled={loading}>
          {loading ? 'Verifica…' : 'Entra'}
        </button>
        {/* Nota aggiornata: niente REACT_APP_ADMIN_PASSWORD nel client */}
        <div className="login__note">
          La password è verificata lato server (Netlify Function).
        </div>
      </form>
    </section>
  );
}

