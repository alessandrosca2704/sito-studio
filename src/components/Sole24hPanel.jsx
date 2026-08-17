import React from 'react';
import './Sole24hPanel.css';

const SOURCE_URL = 'https://www.ilsole24ore.com/';
const SECTIONS = [
  { id: 'norme-e-tributi', title: 'Fisco, lavoro e normativa', limit: 6 },
  { id: 'economia', title: 'Economia e imprese', limit: 6 }
];

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function NewsCard({ item }) {
  return (
    <li className="sole24__item">
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <span className="sole24__meta">
          {item.category && <span>{item.category}</span>}
          {item.publishedAt && <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>}
        </span>
        <strong>{item.title}</strong>
        <span className="sole24__read">Leggi su ilsole24ore.com <span aria-hidden="true">↗</span></span>
      </a>
    </li>
  );
}

export default function Sole24hPanel() {
  const [feeds, setFeeds] = React.useState(() => Object.fromEntries(
    SECTIONS.map(({ id }) => [id, { loading: true, items: [], error: false }])
  ));

  React.useEffect(() => {
    const controller = new AbortController();
    SECTIONS.forEach(({ id, limit }) => {
      fetch(`/.netlify/functions/sole24News?feed=${encodeURIComponent(id)}&limit=${limit}`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => setFeeds((current) => ({
          ...current,
          [id]: { loading: false, items: Array.isArray(data.items) ? data.items : [], error: false }
        })))
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setFeeds((current) => ({ ...current, [id]: { loading: false, items: [], error: true } }));
          }
        });
    });
    return () => controller.abort();
  }, []);

  return (
    <section className="section sole24" aria-labelledby="sole24-title">
      <div className="container">
        <div className="sole24__head">
          <div>
            <p className="sole24__eyebrow">Fonte esterna · Feed RSS ufficiali</p>
            <h2 id="sole24-title" className="text-brand">Aggiornamenti dal Sole 24 ORE</h2>
          </div>
          <a className="btn btn-brand" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Apri Il Sole 24 ORE</a>
        </div>

        <div className="sole24__sections">
          {SECTIONS.map(({ id, title }) => {
            const state = feeds[id];
            return (
              <section className="sole24__group" key={id} aria-labelledby={`sole24-${id}`}>
                <h3 id={`sole24-${id}`}>{title}</h3>
                {state.loading && <p className="sole24__status">Caricamento delle notizie…</p>}
                {state.error && (
                  <div className="sole24__status">
                    <p>Questa sezione non è disponibile in questo momento.</p>
                    <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Consulta il sito del Sole 24 ORE</a>
                  </div>
                )}
                {!state.loading && !state.error && state.items.length === 0 && (
                  <p className="sole24__status">Non ci sono aggiornamenti disponibili.</p>
                )}
                {!state.loading && !state.error && state.items.length > 0 && (
                  <ul className="sole24__list">
                    {state.items.map((item) => <NewsCard item={item} key={item.url} />)}
                  </ul>
                )}
              </section>
            );
          })}
        </div>

        <p className="sole24__attribution">Titoli e collegamenti forniti dai feed RSS ufficiali del Sole 24 ORE. I contenuti appartengono ai rispettivi titolari.</p>
      </div>
    </section>
  );
}
