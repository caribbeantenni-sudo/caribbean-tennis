/* Configuración del sitio. La llave "publishable" es pública por diseño:
   lo que protege los datos son las reglas (RLS) de la base de datos. */
window.CT_CONFIG = {
  supabaseUrl: 'https://ruysrsrlevqkfzfjlujc.supabase.co',
  supabaseKey: 'sb_publishable_6n2Qcvugd2OR4-zqWsgQkA_yBSxEehc',
  adminEmail: 'caribbean.tenni@gmail.com',
  edicionActual: 3,
  /* Llave pública de Wompi (empieza por pub_test_ o pub_prod_). Vacía = pago en línea apagado. */
  wompiPublicKey: ''
};
