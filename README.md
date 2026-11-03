# Caribbean Tennis · caribbeantennis.com

Sitio del Circuito Amateur Caribbean Tennis: inscripciones a la próxima edición, resultados de cada edición, ranking Elo, récords y fichas de jugadores.

## Cómo está armado

- **Página:** HTML, CSS y JavaScript sin compilar (`index.html`, `style.css`, `app.js`). Cloudflare Pages la publica tal cual.
- **Base de datos:** Supabase (`db.js` y `config.js`). Las reglas de seguridad están en `supabase.sql`.
  - `kv`: resultados y datos del circuito. Todos los leen y solo el organizador los cambia.
  - `inscripciones`: cualquiera puede inscribirse, pero **solo el organizador puede leer** los datos (correo, teléfono y edad).
  - `inscripcion_config`: cupos por categoría e inscripciones abiertas o cerradas.
- **Datos iniciales:** `seed.json` tiene la 1ra y la 2da edición. Se usan hasta que el organizador guarde algo por primera vez.

## Organizador

Entra con el enlace **"Acceso organizador"** al final de la página, usando el correo y la contraseña creados en Supabase → Authentication → Users.

## Cambios

Cada cambio que se sube a la rama `main` de GitHub se publica solo en caribbeantennis.com en 1 o 2 minutos.
