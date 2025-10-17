export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const { password } = JSON.parse(event.body || "{}");
  const ok = password && password === process.env.ADMIN_PASSWORD;
  return {
    statusCode: ok ? 200 : 401,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok })
  };
}
