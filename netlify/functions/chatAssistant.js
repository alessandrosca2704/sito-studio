const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const SYSTEM_PROMPT = `Sei un assistente digitale cordiale e professionale per Studio Scarimbolo. Rispondi in italiano, in massimo tre frasi, solo su servizi contabili, fiscali, societari, gare d'appalto, siti web, scadenze e contatti dello studio. Non fornire consulenza fiscale personalizzata. Se non conosci la risposta, invita l'utente a contattare lo studio.`;
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;

const json = (statusCode, body, headers = {}) => ({ statusCode, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers }, body: JSON.stringify(body) });
const sameOrigin = (event) => {
  try {
    const origin = event.headers?.origin;
    const host = event.headers?.['x-forwarded-host'] || event.headers?.host;
    return Boolean(origin && host && new URL(origin).host === host);
  } catch { return false; }
};
const clientKey = (event) => String(event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for'] || 'unknown').split(',')[0].trim();
function limited(key) {
  const recent = (attempts.get(key) || []).filter((time) => Date.now() - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  attempts.set(key, [...recent, Date.now()]);
  return false;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" }, { allow: 'POST' });
  }
  if (!sameOrigin(event)) return json(403, { error: 'Forbidden' });
  if (limited(clientKey(event))) return json(429, { error: 'Too many requests' }, { 'retry-after': '600' });
  if (Buffer.byteLength(event.body || '', 'utf8') > 12000) return json(413, { error: 'Payload too large' });

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Server not configured" })
    };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    console.error("[chatAssistant] invalid JSON body", error);
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Invalid payload" })
    };
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.slice(-8).filter((item) => ['user', 'assistant'].includes(item?.role) && typeof item?.content === 'string' && item.content.length <= 1000).map((item) => ({ role: item.role, content: item.content }))
    : null;

  if (!messages?.length) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing messages" })
    };
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-5.1",
        temperature: 0.6,
        max_completion_tokens: 250,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[chatAssistant] upstream error", response.status, errorText);
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "OpenAI request failed" })
      };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("[chatAssistant] unexpected error", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Unable to connect to assistant" })
    };
  }
}
