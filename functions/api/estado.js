// GET /api/estado?ref=CT3-...  →  {pagado, estado}
const SB = 'https://ruysrsrlevqkfzfjlujc.supabase.co';
const REF = /^CT[0-9]-[0-9a-f]{20}$/;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const sbHeaders = (k) => (k.startsWith('eyJ') ? { apikey: k, Authorization: `Bearer ${k}` } : { apikey: k });

export async function onRequestGet({ request, env }) {
  const ref = new URL(request.url).searchParams.get('ref') || '';
  if (!REF.test(ref)) return json({ error: 'referencia' }, 400);
  if (!env.SUPABASE_SERVICE_KEY) return json({ error: 'config' }, 503);
  const r = await fetch(`${env.SUPABASE_URL || SB}/rest/v1/inscripciones?referencia=eq.${ref}&select=pagado,pago_estado`, { headers: sbHeaders(env.SUPABASE_SERVICE_KEY) });
  if (!r.ok) return json({ error: 'db' }, 502);
  const rows = await r.json();
  if (!rows.length) return json({ error: 'no_existe' }, 404);
  return json({ pagado: !!rows[0].pagado, estado: rows[0].pago_estado || null });
}
