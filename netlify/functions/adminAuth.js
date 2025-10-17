export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const expectedRaw = process.env.ADMIN_PASSWORD;
  const expected = (expectedRaw || "").trim();

  // Log utili (visibili nei Logs delle Functions su Netlify)
  console.log("[adminAuth] hasEnv=", !!expectedRaw, "len=", expected.length);

  if (!expected) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, reason: "server_not_configured" })
    };
  }

  let provided = "";
  try {
    const body = JSON.parse(event.body || "{}");
    provided = (body.password || "").trim();
  } catch (e) {
    console.error("[adminAuth] bad json", e);
  }

  console.log("[adminAuth] providedLen=", provided.length);

  const ok = provided && provided === expected;

  return {
    statusCode: ok ? 200 : 401,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok, reason: ok ? "ok" : "invalid_credentials" })
  };
}
