/* Capa de datos: Supabase (resultados, inscripciones, sesión del organizador) */
(function () {
  'use strict';
  var C = window.CT_CONFIG;
  var sb = null;
  try {
    sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  } catch (e) { sb = null; }

  function need() { if (!sb) throw new Error('Sin conexión con la base de datos'); return sb; }
  function unwrap(r) { if (r.error) throw r.error; return r.data; }

  window.DB = {
    ok: function () { return !!sb; },

    /* ---------- datos del circuito (fx = fijos, st = resultados) ---------- */
    loadKV: function (keys) {
      if (!sb) return Promise.resolve({});
      var q = sb.from('kv').select('key,value');
      if (keys) q = q.in('key', keys);
      return q.then(function (r) {
        var out = {};
        (unwrap(r) || []).forEach(function (row) { out[row.key] = row.value; });
        return out;
      }).catch(function () { return {}; });
    },
    saveKV: function (rows) {
      var now = new Date().toISOString();
      return need().from('kv').upsert(rows.map(function (x) {
        return { key: x.key, value: x.value, updated_at: now };
      })).then(unwrap);
    },

    /* ---------- sesión del organizador ---------- */
    sessionEmail: function () {
      if (!sb) return Promise.resolve(null);
      return sb.auth.getSession().then(function (r) {
        var s = r.data && r.data.session;
        return s && s.user ? (s.user.email || '').toLowerCase() : null;
      }).catch(function () { return null; });
    },
    login: function (email, password) {
      return need().auth.signInWithPassword({ email: email, password: password }).then(function (r) {
        if (r.error) throw r.error;
        return (r.data.user.email || '').toLowerCase();
      });
    },
    logout: function () { return sb ? sb.auth.signOut() : Promise.resolve(); },

    /* ---------- inscripciones ---------- */
    inscribir: function (d) {
      var row = {
        edicion: C.edicionActual, nombre: d.nombre, correo: d.correo,
        telefono: d.telefono, edad: d.edad, categoria: d.categoria
      };
      if (d.referencia) row.referencia = d.referencia;
      return need().from('inscripciones').insert(row).then(unwrap);
    },
    config: function () {
      if (!sb) return Promise.resolve(null);
      return sb.from('inscripcion_config').select('*').eq('edicion', C.edicionActual).maybeSingle()
        .then(unwrap).catch(function () { return null; });
    },
    llenas: function () {
      if (!sb) return Promise.resolve({});
      return sb.rpc('categorias_llenas', { ed: C.edicionActual }).then(function (r) {
        var out = {}; (unwrap(r) || []).forEach(function (x) { out[x.categoria] = x.llena; }); return out;
      }).catch(function () { return {}; });
    },
    /* solo organizador (la base de datos lo exige) */
    inscritos: function () {
      return need().from('inscripciones').select('*').eq('edicion', C.edicionActual)
        .order('created_at', { ascending: true }).then(unwrap);
    },
    setPagado: function (id, v) {
      return need().from('inscripciones').update({ pagado: v }).eq('id', id).then(unwrap);
    },
    borrar: function (id) {
      return need().from('inscripciones').delete().eq('id', id).then(unwrap);
    },
    setConfig: function (cupo, abiertas) {
      return need().from('inscripcion_config').upsert({ edicion: C.edicionActual, cupo: cupo, abiertas: abiertas }).then(unwrap);
    }
  };

  /* ---------- arranque rápido ----------
     1) Si este navegador ya visitó la página, se muestra al instante con la última copia guardada
        y por detrás se trae lo nuevo de Supabase.
     2) Si es la primera visita, se espera a Supabase máximo 2,5 s; si tarda más, se muestra
        con los datos iniciales (seed.json) y se actualiza apenas llegue Supabase. */
  var CK = 'ct_kv_v1', started = false;
  function readCache() { try { var x = JSON.parse(localStorage.getItem(CK) || 'null'); return x && x.fx && x.st ? x : null; } catch (e) { return null; } }
  function writeCache(d) { try { localStorage.setItem(CK, JSON.stringify({ fx: d.fx, st: d.st })); } catch (e) {} }
  function start(d) {
    if (started) return; started = true;
    window.__FX = JSON.parse(JSON.stringify(d.fx)); window.__ST = JSON.parse(JSON.stringify(d.st)); window.__SEEDED = d.seeded;
    window.__FX.logo = 'img/perfil.svg';
    window.__BOOTFX = JSON.stringify(d.fx);
    window.startApp();
  }
  function fresh(d) {
    if (!started) return start(d);
    if (JSON.stringify(d.fx) !== window.__BOOTFX) {
      /* cambió la estructura del torneo: se recarga una sola vez con los datos nuevos */
      try { if (!sessionStorage.getItem('ct_rl')) { sessionStorage.setItem('ct_rl', '1'); location.reload(); return; } } catch (e) {}
    }
    if (window.__applyST) window.__applyST(d.st);
  }
  var seedP = null;
  function seed() { return seedP || (seedP = fetch('seed.json').then(function (r) { return r.json(); })); }
  var cached = readCache();
  if (cached) start({ fx: cached.fx, st: cached.st, seeded: true });

  var remote = window.DB.loadKV(['fx', 'st']).then(function (kv) {
    if (kv.fx && kv.st) return { fx: kv.fx, st: kv.st, seeded: true };
    return seed().then(function (s) { return { fx: kv.fx || s.fx, st: kv.st || s.st, seeded: !!(kv.fx && kv.st) }; });
  });
  remote.then(function (d) { if (d.seeded) writeCache(d); fresh(d); }).catch(function () {});

  if (!cached) {
    seed();
    setTimeout(function () {
      if (started) return;
      seed().then(function (s) { start({ fx: s.fx, st: s.st, seeded: false }); }).catch(function () {
        document.getElementById('root').innerHTML = '<p style="padding:24px;font-family:sans-serif">No se pudo cargar la página. Revisa tu conexión y recarga.</p>';
      });
    }, 2500);
  }
})();
