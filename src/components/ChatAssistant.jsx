import { useEffect, useRef, useState } from 'react';
import './ChatAssistant.css';

const SYSTEM_PROMPT = `Sei un assistente digitale cordiale e professionale per lo studio scarimbolo uno studio contabile cui aree di competenza e servizi offerti sono: Servizi Contabili e di Bilancio, Servizi Fiscali e Tributari, Servizi Societari, Servizi Ausiliari, Assistenza e Ricerca Gare Appalto, Realizzazione Siti Web, Rispondi in italiano con messaggi sintetici (massimo 3 frasi) e proponi eventuali passi successivi utili.
Se non conosci la risposta, invita l'utente a contattare lo studio tramite il form principale.`;

const INTRO_MESSAGE =
  "Ciao! Sono l'assistente digitale dello studio. Chiedimi pure informazioni su servizi, scadenze o come contattarci.";

const BubbleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M6 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6.1L9 19.7V15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M6 18 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const OpenAILogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path xmlns="http://www.w3.org/2000/svg" d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"/>
  </svg>
);

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: INTRO_MESSAGE }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const submitMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/.netlify/functions/chatAssistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...nextMessages]
        })
      });

      if (!response.ok) {
        throw new Error('La funzione ha risposto con un errore.');
      }

      const data = await response.json();
      const reply = data?.reply?.trim();

      if (!reply) {
        throw new Error('Risposta vuota dal modello.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('[ChatAssistant] errore invio messaggio', error);
      setErrorMessage("Impossibile contattare l'assistente ora. Riprova piu tardi.");
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Mi dispiace, sto riscontrando un problema tecnico. Prova di nuovo tra qualche minuto.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className={`chat-assistant ${isOpen ? 'chat-assistant--open' : ''}`}>
      <button
        type="button"
        className="chat-assistant__toggle"
        aria-expanded={isOpen}
        aria-controls="chat-assistant-panel"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="chat-assistant__icon" aria-hidden="true">
          {isOpen ? <CloseIcon /> : <BubbleIcon />}
        </span>
        <span className="chat-assistant__toggle-label">{isOpen ? 'Chiudi' : 'Serve aiuto?'}</span>
      </button>

      <section
        id="chat-assistant-panel"
        className="chat-assistant__panel"
        aria-live="polite"
        aria-label="Chat con l'assistente digitale"
      >
        <header className="chat-assistant__header">
          <div>
            <p className="chat-assistant__eyebrow">Assistente digitale</p>
            <strong>Hai bisogno di supporto?</strong>
          </div>
          <button type="button" className="chat-assistant__close" onClick={() => setIsOpen(false)}>
            Chiudi
          </button>
        </header>

        <div className="chat-assistant__messages" ref={listRef}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content.length}`}
              className={`chat-assistant__message chat-assistant__message--${message.role}`}
            >
              <p>{message.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="chat-assistant__message chat-assistant__message--assistant">
              <span className="chat-assistant__loader" aria-label="L'assistente sta scrivendo">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>

        {errorMessage && <p className="chat-assistant__error">{errorMessage}</p>}
        <p className="chat-assistant__powered" aria-label="Assistente alimentato da OpenAI">

          <span>Powered by OpenAI</span>
        </p>

        <form className="chat-assistant__form" onSubmit={handleSubmit}>
          <textarea
            rows="2"
            placeholder="Scrivi un messaggio..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading}>
            Invia
          </button>
        </form>
      </section>
    </div>
  );
}
