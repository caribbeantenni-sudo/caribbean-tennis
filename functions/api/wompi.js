// POST /api/wompi  ←  eventos de Wompi (transaction.updated)
// Valida la firma del evento y, si el pago fue aprobado, marca la inscripción como pagada.
const SB = 'https://ruysrsrlevqkfzfjlujc.supabase.co';
const REF = /^CT[0-9]-[0-9a-f]{20}$/;
const sha256 = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
const sbHeaders = (k) => (k.startsWith('eyJ') ? { apikey: k, Authorization: `Bearer ${k}` } : { apikey: k });
const txt = (t, s = 200) => new Response(t, { status: s, headers: { 'cache-control': 'no-store' } });

export async function onRequestGet() { return txt('ok'); }

export async function onRequestPost({ request, env }) {
  if (!env.WOMPI_EVENTS_SECRET || !env.SUPABASE_SERVICE_KEY) return txt('config', 503);
  let ev;
  try { ev = await request.json(); } catch { return txt('bad_request', 400); }
  if (!ev || !ev.data || !ev.signature || !Array.isArray(ev.signature.properties)) return txt('bad_request', 400);

  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), ev.data);
  const chain = ev.signature.properties.map((p) => String(get(p) ?? '')).join('') + String(ev.timestamp) + env.WOMPI_EVENTS_SECRET;
  const sum = await sha256(chain);
  const recv = String(ev.signature.checksum || request.headers.get('x-event-checksum') || '').toLowerCase();
  if (sum !== recv) return txt('firma_invalida', 401);

  if (ev.event !== 'transaction.updated' || !ev.data.transaction) return txt('ok');
  const t = ev.data.transaction;
  if (!REF.test(String(t.reference || ''))) return txt('ok');

  const precio = parseInt(env.PRECIO_CENTAVOS || '11200000', 10);
  const aprobado = t.status === 'APPROVED' && t.currency === 'COP' && Number(t.amount_in_cents) >= precio;
  const base = `${env.SUPABASE_URL || SB}/rest/v1/inscripciones?referencia=eq.${t.reference}`;
  const body = aprobado
    ? { pagado: true, pago_estado: 'APPROVED', pago_id: String(t.id), pago_metodo: t.payment_method_type || null, pagado_at: new Date().toISOString() }
    : { pago_estado: t.status === 'APPROVED' ? 'MONTO_INCORRECTO' : String(t.status || ''), pago_id: String(t.id || ''), pago_metodo: t.payment_method_type || null };
  const url = aprobado ? base : `${base}&pagado=eq.false`;
  const r = await fetch(url, { method: 'PATCH', headers: { ...sbHeaders(env.SUPABASE_SERVICE_KEY), 'content-type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(body) });
  if (!r.ok) return txt('db_error', 500); // Wompi reintenta
  return txt('ok');
}
