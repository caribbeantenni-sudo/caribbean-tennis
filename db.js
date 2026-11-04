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

  /* ---------- arranque: datos de Supabase o, si aún no existen, los iniciales ---------- */
  window.DB.loadKV(['fx', 'st']).then(function (kv) {
    if (kv.fx && kv.st) return { fx: kv.fx, st: kv.st, seeded: true };
    return fetch('seed.json').then(function (r) { return r.json(); }).then(function (s) {
      return { fx: kv.fx || s.fx, st: kv.st || s.st, seeded: false };
    });
  }).then(function (d) {
    window.__FX = d.fx; window.__ST = d.st; window.__SEEDED = d.seeded;
    window.__FX.logo = 'logo.webp';
    window.startApp();
  }).catch(function (e) {
    document.getElementById('root').innerHTML = '<p style="padding:24px;font-family:sans-serif">No se pudo cargar la página. Revisa tu conexión y recarga.</p>';
  });
})();
