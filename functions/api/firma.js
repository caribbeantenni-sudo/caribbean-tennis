// POST /api/firma  {referencia}  →  {amountInCents, currency, integrity}
// Calcula la firma de integridad de Wompi en el servidor (el secreto nunca llega al navegador).
const SB = 'https://ruysrsrlevqkfzfjlujc.supabase.co';
const REF = /^CT[0-9]-[0-9a-f]{20}$/;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const sha256 = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
const sbHeaders = (k) => (k.startsWith('eyJ') ? { apikey: k, Authorization: `Bearer ${k}` } : { apikey: k });

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const ref = String(body && body.referencia || '');
  if (!REF.test(ref)) return json({ error: 'referencia' }, 400);
  if (!env.WOMPI_INTEGRITY_SECRET || !env.SUPABASE_SERVICE_KEY) return json({ error: 'config' }, 503);
  const r = await fetch(`${env.SUPABASE_URL || SB}/rest/v1/inscripciones?referencia=eq.${ref}&select=pagado`, { headers: sbHeaders(env.SUPABASE_SERVICE_KEY) });
  if (!r.ok) return json({ error: 'db' }, 502);
  const rows = await r.json();
  if (!rows.length) return json({ error: 'no_existe' }, 404);
  if (rows[0].pagado) return json({ error: 'ya_pago' }, 409);
  const amountInCents = parseInt(env.PRECIO_CENTAVOS || '11200000', 10);
  const currency = 'COP';
  const integrity = await sha256(`${ref}${amountInCents}${currency}${env.WOMPI_INTEGRITY_SECRET}`);
  return json({ amountInCents, currency, integrity });
}
