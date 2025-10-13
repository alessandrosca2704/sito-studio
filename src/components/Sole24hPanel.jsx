import React from 'react';
import './Sole24hPanel.css';

export default function Sole24hPanel({ query = 'scadenzario' }) {
  const url = `https://www.ricerca24.ilsole24ore.com/?cmd=static&chId=30&path=/search/search_engine.jsp&field=Titolo|Testo&orderBy=score+desc&chId=30&keyWords=${encodeURIComponent(query)}&button=&pageNumber=1&pageSize=10&fromDate=&toDate=&filter=all`;
  const [failed, setFailed] = React.useState(false);

  return (
    <section className="section sole24">
      <div className="container">
        <div className="sole24__head">
          <h2 className="text-brand">Sole 24 ORE — Ricerca “{query}”</h2>
          <a className="btn btn-brand" href={url} target="_blank" rel="noreferrer">Apri sito</a>
        </div>
        <div className="sole24__framewrap">
          {!failed && (
            <iframe
              title="Sole 24 ORE Ricerca"
              className="sole24__frame"
              src={url}
              onError={() => setFailed(true)}
            />
          )}
          {failed && (
            <div className="sole24__fallback">
              <p>Impossibile incorporare la pagina. Alcuni siti impediscono l’embed su domini esterni.</p>
              <a className="btn btn-brand" href={url} target="_blank" rel="noreferrer">Apri su ilsole24ore.com</a>
            </div>
          )}
          <div className="sole24__note">Nota: il sito di destinazione potrebbe bloccare l’incorporamento in iframe. In tal caso, utilizza il link “Apri sito”.</div>
        </div>
      </div>
    </section>
  );
}

