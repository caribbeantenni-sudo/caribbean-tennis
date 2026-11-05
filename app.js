window.startApp=function(){
"use strict";
var SKEL='<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>';
var HEAD='<title>Caribbean Tennis</title><meta name="claude:viewport-fit-sides" content="cover"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Instrument+Sans:wght@400;500;600;700&display=swap">';
var SC='scr'+'ipt';
var EVENT_DAY='2026-11-01';
var CN=['','Wimbledon','Australian Open','US Open','Roland Garros'];
var NC=4, LT=7; /* canchas y turnos de liga del 1 de noviembre */
function d1(m){return m[5]===1}
/* marcador cuando paró la lluvia: se reanuda desde ahí */
function parcOf(id){return (FX.parc||{})[id]}
function parcTxt(id){var z=parcOf(id);if(!z||ST.r[id])return '';var p=players(id),w=z[0]>z[1]?p[0]:z[1]>z[0]?p[1]:null;return 'Se reanuda '+z[0]+'-'+z[1]+(w?' · va ganando '+w.split(' ')[0]:'')} /* jugado el 25 de octubre, antes de la lluvia */
var C=window.CT_CONFIG;
var FX=window.__FX;
var ST=window.__ST;
if(!ST.r)ST.r={}; if(!ST.here)ST.here={}; if(!ST.t)ST.t={};
var S=FX.s, ELO=FX.elo, SEED=FX.seed, P1=FX.p1||{}, PLAYERS=Object.keys(ELO);
if(!FX.reps)FX.reps={}; if(!FX.eloOut)FX.eloOut={};
/* ---------- 1ra edición (20 sep 2026) y circuito ---------- */
var P1D=FX.p1d, R1N={R1:'Ronda 1',R2:'Ronda 2',C:'Cuartos de final',S:'Semifinal',F:'Final'};
function wo1(m){return (m[4]===21&&m[5]===0)||(m[4]===0&&m[5]===21)}
function elo1(){var R={},md={};P1D.r.forEach(function(m){if(R[m[2]]==null)R[m[2]]=1000;if(R[m[3]]==null)R[m[3]]=1000});
  ['R1','R2','C','S','F'].forEach(function(rd){var pre={};Object.keys(R).forEach(function(k){pre[k]=R[k]});
    P1D.r.forEach(function(m){if(m[1]!==rd||wo1(m))return;var ea=1/(1+Math.pow(10,(pre[m[3]]-pre[m[2]])/400)),d=32*((m[4]>m[5]?1:0)-ea);R[m[2]]+=d;R[m[3]]-=d;md[m[0]]={a:d,b:-d,ea:ea}})});
  return {R:R,md:md}}
var E1=elo1();
function stage1(p){if(!E1.R.hasOwnProperty(p))return null;var lab=null;P1D.r.forEach(function(m){if(m[2]!==p&&m[3]!==p)return;var w=m[4]>m[5]?m[2]:m[3];if(m[1]==='F')lab=w===p?'Campeón':'Subcampeón';else if(!lab&&m[1]==='S'&&w!==p)lab='Semifinal';else if(!lab&&m[1]==='C'&&w!==p)lab='Cuartos'});
  if(lab)return lab;var i=-1;P1D.tab.forEach(function(x,k){if(x[0]===p)i=k});return 'Puesto '+(i+1)+'°'}
function stage2(p){if(!ELO.hasOwnProperty(p))return null;
  if(ST.close){if(winner('F')===p)return 'Campeón';if(loser('F')===p)return 'Subcampeón';var lab=null;
    [['S','Semifinal'],['C','Cuartos'],['O','Octavos'],['P','16vos']].forEach(function(z){if(lab)return;KO.forEach(function(r){if(r.id===z[0])r.list.forEach(function(x){if(loser(x[0])===p)lab=z[1]})})});
    if(lab)return lab;return 'Puesto '+(ST.close.indexOf(p)+1)+'°'}
  var j=0;table().forEach(function(x,k){if(x.p===p)j=k+1});return 'Puesto '+j+'°'}
function cElo(E,p){return E.R.hasOwnProperty(p)?E.R[p]:E1.R[p]}
function circList(E){var all={};Object.keys(E1.R).forEach(function(p){all[p]=1});ALLP().forEach(function(p){all[p]=1});
  return Object.keys(all).filter(function(p){var r=recTot(p);return r[0]+r[1]>0}).sort(function(a,b){return cElo(E,b)-cElo(E,a)||a.localeCompare(b)})}
function nm1(p){return '<span class="pn" data-p="'+esc(p)+'">'+esc(p)+'</span>'}
function inCirc(p){return E1.R.hasOwnProperty(p)||ELO.hasOwnProperty(p)||FX.eloOut[p]!=null}
/* ---------- ranking por puntos del circuito ---------- */
var PTS={'Campeón':100,'Subcampeón':70,'Semifinal':45,'Cuartos':25,'Octavos':15,'16vos':8}, PTS_BASE=3, PTS_WIN=2;
function lw1(p){var w=0;P1D.r.forEach(function(m){if((m[1]==='R1'||m[1]==='R2')&&!wo1(m)&&((m[2]===p&&m[4]>m[5])||(m[3]===p&&m[5]>m[4])))w++});return w}
function lw2(p){var w=0;S.forEach(function(m){var id='L'+m[0],r=ST.r[id];if(!r||r.wo)return;var a=eloName(m[3],id),b=eloName(m[4],id);if((a===p&&r.a>r.b)||(b===p&&r.b>r.a))w++});return w}
function pts1(p){if(!E1.R.hasOwnProperty(p))return null;return (PTS[stage1(p)]||PTS_BASE)+PTS_WIN*lw1(p)}
function pts2(p){if(ELO.hasOwnProperty(p))return (PTS[stage2(p)]||PTS_BASE)+PTS_WIN*lw2(p);if(FX.eloOut[p]!=null)return PTS_BASE+PTS_WIN*lw2(p);return null}
/* ---------- récords: partidos en orden cronológico, sin W.O. ---------- */
function allMatches(E){var out=[];
  P1D.r.forEach(function(m){if(wo1(m))return;var md=E1.md[m[0]];out.push({ed:1,lab:R1N[m[1]]+' · 1ra Edición',a:m[2],b:m[3],sa:m[4],sb:m[5],ea:md?md.ea:null,id:null})});
  var L2=S.slice().sort(function(x,y){return (d1(y)?1:0)-(d1(x)?1:0)||x[1]-y[1]||x[2]-y[2]}).map(function(m){return 'L'+m[0]});
  if(ST.close)KO.forEach(function(r){r.list.forEach(function(x){L2.push(x[0])})});
  L2.forEach(function(id){var r=ST.r[id];if(!r||r.wo)return;var pp=players(id);if(!pp[0]||!pp[1])return;var md=E.md[id];out.push({ed:2,lab:labelOf(id)+' · 2da Edición',a:eloName(pp[0],id),b:eloName(pp[1],id),sa:r.a,sb:r.b,ea:md?md.ea:null,id:id})});
  return out}
/* ---------- 3ra edición e inscripciones ---------- */
var PAGO={llave:'3225756567',cuenta:'91201825631',titular:'Mateo González',wa:'573225756567'};
var NEXT={n:'3ra Edición',date:'2026-12-13',dateTxt:'Domingo 13 de diciembre de 2026',place:'Parque de Raquetas',city:'Barranquilla',fee:110000,precio:110000,cats:[['4ta-mujeres','4ta mujeres',400000],['4ta-hombres','4ta hombres',null]],maps:'https://www.google.com/maps/search/?api=1&query=Parque+de+Raquetas+Barranquilla'};
function catName(k){var x=NEXT.cats.filter(function(c){return c[0]===k})[0];return x?x[1]:({'3ra':'3ra categoría','4ta':'4ta categoría'}[k]||k)}
function pagoBox(fn){var msg=encodeURIComponent('Hola, soy '+(insSent?insSent.n:'')+'. Me inscribí en '+catName(insSent?insSent.c:'')+' de la '+NEXT.n+' de Caribbean Tennis. Aquí va mi comprobante de pago.');
  var row=function(k,v,show){return '<div class="prow"><span>'+k+'</span><b>'+show+'</b><button type="button" class="btn sm" data-copy="'+v+'">Copiar</button></div>'};
  return '<div class="pagobox"><div class="ph">Datos para pagar</div>'+row('Llave',PAGO.llave,PAGO.llave.replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3'))+row('Cuenta Bancolombia',PAGO.cuenta,PAGO.cuenta)+'<div class="prow"><span>A nombre de</span><b>'+PAGO.titular+'</b></div><div class="prow"><span>Valor</span><b>'+money(NEXT.precio)+'</b></div>'+
    '<p>Cuando pagues, envía el comprobante por WhatsApp para confirmar tu cupo.</p><a class="btn primary" href="https://wa.me/'+PAGO.wa+'?text='+msg+'" target="_blank" rel="noopener">Enviar comprobante por WhatsApp</a></div>'}
function prize(v){return v==null?'por definir':money(v)}
var INSROWS=null, INSCFG=null, LLENAS={}, insFilter='', insSent=null; try{localStorage.removeItem('ct_ins');insSent=JSON.parse(sessionStorage.getItem('ct_ins')||'null')}catch(e){}
function daysTo(d){if(!TODAY)return null;var a=TODAY.split('-'),b=d.split('-');return Math.round((Date.UTC(+b[0],b[1]-1,+b[2])-Date.UTC(+a[0],a[1]-1,+a[2]))/864e5)}
function money(n){return '$'+n.toLocaleString('es-CO')}
/* reemplazos: el jugador nuevo toma el cupo y hereda el resultado del 25 oct; ese partido cuenta en el Elo del jugador original */
function REPS(){return FX.reps}
function ALLP(){return PLAYERS.concat(Object.keys(FX.reps).map(function(k){return FX.reps[k]}))}
function eloBase(p){return ELO.hasOwnProperty(p)?ELO[p]:FX.eloOut[p]}
function eloName(p,id){if(p&&FX.reps[p]&&id[0]==='L'&&d1(S[+id.slice(1)-1]))return FX.reps[p];return p}
var root=document.getElementById('root');
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var SS={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del:function(k){try{sessionStorage.removeItem(k)}catch(e){}}};
var me=null; /* la sección Mis partidos se quitó */
var TABS=[['circuito','Inicio'],['ranking','Ranking'],['p1','1ra Edición'],['inicio','2da Edición']];
var SUB=[['inicio','Resumen'],['liga','Liga'],['tabla','Tabla y cuadro'],['info','Info']];
var TABOF={panel:'inicio',resumen:'inicio',mis:'inicio',siguen:'inicio',destacados:'inicio',asistencia:'inicio',liga:'liga',tabla:'tabla',cuadro:'tabla',reglas:'info',patrocinadores:'info',lugar:'info',elo:'ranking',paradas:'circuito',proxima:'circuito',puntos:'circuito',records:'circuito',pasos:'circuito',nosotros:'circuito',top3:'circuito',p1res:'p1',p1tabla:'p1',p1cuadro:'p1',p1rondas:'p1',horas:'inicio',reemplazos:'inicio'};
var TODAY=(function(){try{var o={};new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});return o.year+'-'+o.month+'-'+o.day}catch(e){return ''}})();
var tab=LS.get('ct_tab'); if(['circuito','ranking','p1','inicio','liga','tabla','info'].indexOf(tab)<0)tab='circuito';
var OPEN={}, INSOPEN=false, RKQ='', RKN=20, FIRST=true;
var showAllPend=false, canOrg=false, orgOn=LS.get('ct2_org')==='1', art=null, busy=false, draftHere=null;

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hm(m){m=Math.round(m);var h=Math.floor(m/60),mm=m%60;return (h>12?h-12:h)+':'+(mm<10?'0':'')+mm}
function nm(p){if(!p)return '';if(!ELO.hasOwnProperty(p))return (E1.R.hasOwnProperty(p)||FX.eloOut[p]!=null?nm1(p):esc(p))+(FX.eloOut[p]!=null?' <span class="rep">cedió su cupo</span>':'');return '<span class="pn" data-p="'+esc(p)+'">'+esc(p)+'</span>'+(SEED[p]?' <span class="seed">('+SEED[p]+')</span>':'')+(FX.reps[p]?' <span class="rep" title="Reemplaza a '+esc(FX.reps[p])+'">reemplazo</span>':'')}
function norm(s){return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim()}
function f2(x){return x.toFixed(2).replace('.',',')}
function sgn(x,d){var v=d==null?Math.round(x):x.toFixed(d).replace('.',',');return (x>0.004?'+':'')+v}

/* ---------- standings ---------- */
function table(){
  var t={};PLAYERS.forEach(function(p){t[p]={p:p,pj:0,pg:0,pf:0,pc:0}});
  S.forEach(function(m){var r=ST.r['L'+m[0]];if(!r)return;var a=t[m[3]],b=t[m[4]];
    a.pj++;b.pj++;a.pf+=r.a;a.pc+=r.b;b.pf+=r.b;b.pc+=r.a;if(r.a>r.b)a.pg++;else b.pg++;});
  var L=PLAYERS.map(function(p){var x=t[p];x.dif=x.pf-x.pc;return x});
  L.sort(function(x,y){return y.pg-x.pg||y.dif-x.dif||y.pf-x.pf||x.pc-y.pc||x.p.localeCompare(y.p)});
  return L;
}
function ligaDone(){var n=0;S.forEach(function(m){if(ST.r['L'+m[0]])n++});return n}

/* ---------- clasificado / eliminado seguro (solo cuando es 100% matemático) ----------
   Cotas: lo peor para X es perder sus pendientes 0-21; lo mejor para Y es ganar los suyos 21-0.
   Un partido sin jugar o por W.O. queda siempre dentro de esas cotas. */
function better(ka,kb,tie){
  if(ka[0]!==kb[0])return ka[0]>kb[0]; if(ka[1]!==kb[1])return ka[1]>kb[1]; if(ka[2]!==kb[2])return ka[2]>kb[2];
  if(ka[3]!==kb[3])return ka[3]<kb[3]; return tie;
}
function status(){
  var out={};
  if(ST.close){ST.close.forEach(function(p,i){out[p]=i<26?'C':'E'});return out}
  var st={};PLAYERS.forEach(function(p){st[p]={pg:0,dif:0,pf:0,pc:0,pend:0}});
  S.forEach(function(m){var r=ST.r['L'+m[0]],a=st[m[3]],b=st[m[4]];
    if(!r){a.pend++;b.pend++;return}
    a.dif+=r.a-r.b;b.dif+=r.b-r.a;a.pf+=r.a;b.pf+=r.b;a.pc+=r.b;b.pc+=r.a;if(r.a>r.b)a.pg++;else b.pg++;});
  var mx={},mn={};
  PLAYERS.forEach(function(p){var x=st[p];mx[p]=[x.pg+x.pend,x.dif+21*x.pend,x.pf+21*x.pend,x.pc];mn[p]=[x.pg,x.dif-21*x.pend,x.pf,x.pc+21*x.pend]});
  PLAYERS.forEach(function(X){
    if(st[X].pg>=2){out[X]='C';return} /* como máximo 22 jugadores pueden ganar 2 partidos */
    var up=0,down=0;
    PLAYERS.forEach(function(Y){if(Y===X)return;
      if(better(mx[Y],mn[X],true))up++;
      if(better(mn[Y],mx[X],false))down++;});
    if(up<=25)out[X]='C'; else if(down>=26)out[X]='E';
  });
  return out;
}
function need(p,SA){
  if(ST.close)return '';
  if(SA[p]==='C')return '<strong>Ya estás clasificado.</strong> Pase lo que pase en los demás partidos, estás entre los 26.';
  if(SA[p]==='E')return 'Matemáticamente ya no alcanzas los 26 primeros. ¡Gracias por jugar!';
  var ms=S.filter(function(m){return m[3]===p||m[4]===p}), played=[], pend=0;
  ms.forEach(function(m){var r=ST.r['L'+m[0]];if(!r){pend++;return}var my=m[3]===p?r.a:r.b, th=m[3]===p?r.b:r.a;played.push(my-th)});
  if(pend===2)return 'Con 1 victoria clasificas según la diferencia de puntos: en nuestras simulaciones, con +2 o más siempre alcanzó.';
  if(pend===1){var d=played[0];
    if(d>0){var L=d-2;return 'Si ganas el próximo, quedas clasificado seguro. Si lo pierdes, '+(L>=1?'intenta que sea por <strong>'+L+' punto'+(L===1?'':'s')+' o menos</strong>: con diferencia final de +2 o más, en nuestras simulaciones siempre clasificó.':'cualquier derrota te deja con 0 o menos de diferencia: lo más seguro es ganar.')}
    var W=2-d;return 'Necesitas ganar el próximo'+(W<=21?', idealmente por <strong>'+W+' o más</strong> (diferencia final de +2).':'.')+' Sin victorias es casi imposible clasificar.'}
  return '';
}

/* ---------- knockout ---------- */
var KO=[
 {id:'P',name:'16vos de final',start:685,list:[]},
 {id:'O',name:'Octavos de final',start:715,list:[['O1','s1','P10'],['O2','s2','P9'],['O3','s3','P8'],['O4','s4','P7'],['O5','s5','P6'],['O6','s6','P5'],['O7','P1','P4'],['O8','P2','P3']]},
 {id:'C',name:'Cuartos de final',start:735,list:[['C1','O1','O8'],['C2','O4','O5'],['C3','O2','O7'],['C4','O3','O6']]},
 {id:'S',name:'Semifinales',start:745,list:[['S1','C1','C2'],['S2','C3','C4']]},
 {id:'F',name:'Final',start:755,list:[['F','S1','S2']]}
];
for(var i=0;i<10;i++)KO[0].list.push(['P'+(i+1),'s'+(7+i),'s'+(26-i)]);
var KOBY={};KO.forEach(function(r){r.list.forEach(function(x,i){KOBY[x[0]]={r:r,i:i,a:x[1],b:x[2]}})});
function order(){return ST.close?ST.close:table().map(function(x){return x.p})}
function slotName(ref){if(ref[0]==='s'){if(!ST.close&&!ligaDone())return null;return order()[+ref.slice(1)-1]||null}return winner(ref)}
function players(id){if(id[0]==='L'){var m=S[+id.slice(1)-1];return [m[3],m[4]]}var k=KOBY[id];return [slotName(k.a),slotName(k.b)]}
function winner(id){var r=ST.r[id];if(!r)return null;var p=players(id);if(!p[0]||!p[1])return null;return r.a>r.b?p[0]:p[1]}
function loser(id){var w=winner(id);if(!w)return null;var p=players(id);return p[0]===w?p[1]:p[0]}
function slotLabel(ref){if(ref[0]==='s')return ref.slice(1)+'° de la tabla';return 'Ganador '+ref}
function schedOf(id){if(id[0]==='L'){var m=S[+id.slice(1)-1];return {t:600+(m[1]-1)*10,c:m[2],d1:d1(m)}}var k=KOBY[id];return {t:k.r.start+Math.floor(k.i/NC)*10,c:k.i%NC+1}}
function turnOf(id){if(id[0]==='L')return S[+id.slice(1)-1][1];var k=KOBY[id],base={P:8,O:11,C:13,S:14,F:15}[k.r.id];return base+Math.floor(k.i/NC)}
function whenOf(id){if(schedOf(id).d1)return 'Jugado el 25 oct';var t=schedOf(id).t,h=Math.floor(t/60),ap=h<12?'a. m.':'p. m.',hh=h>12?h-12:h;return t%60===0?hh+' '+ap:'A seguir de la'+(hh===1?'':'s')+' '+hh+' '+ap}
function labelOf(id){if(id[0]==='L')return 'Liga #'+id.slice(1);return KOBY[id].r.name+' · '+id}

/* ---------- Elo en vivo (K=32, por rondas, W.O. no cuenta) ---------- */
function eloRun(){
  var R={};ALLP().forEach(function(p){R[p]=eloBase(p)});
  var md={}, rounds=[[],[]];
  S.forEach(function(m){rounds[m[0]<=22?0:1].push('L'+m[0])});
  if(ST.close)KO.forEach(function(r){rounds.push(r.list.map(function(x){return x[0]}))});
  rounds.forEach(function(ids){
    var pre={};ALLP().forEach(function(p){pre[p]=R[p]});
    ids.forEach(function(id){var r=ST.r[id];if(!r||r.wo)return;var p=players(id);if(!p[0]||!p[1])return;p=[eloName(p[0],id),eloName(p[1],id)];
      var ea=1/(1+Math.pow(10,(pre[p[1]]-pre[p[0]])/400)), sa=r.a>r.b?1:0, d=32*(sa-ea);
      R[p[0]]+=d;R[p[1]]-=d;md[id]={a:d,b:-d,ea:ea};});
  });
  return {R:R,md:md};
}

/* ---------- reloj y horas estimadas ---------- */
function nowBog(){
  try{var o={};new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});
    return {d:o.year+'-'+o.month+'-'+o.day,m:(+o.hour)*60+(+o.minute)}}catch(e){return null}
}
function queue(){
  var q=[];
  if(!ST.close)S.slice().sort(function(x,y){return x[1]-y[1]||x[2]-y[2]}).forEach(function(m){if(!ST.r['L'+m[0]])q.push('L'+m[0])});
  KO.forEach(function(r){r.list.forEach(function(x){if(!ST.r[x[0]])q.push(x[0])})});
  return q;
}
function estimates(){
  var n=nowBog(), out={}, delay=0;
  if(!n||n.d!==EVENT_DAY||n.m<600)return {est:out,delay:0};
  var q=queue(), ligaLeft=0;q.forEach(function(id){if(id[0]==='L')ligaLeft++});
  q.forEach(function(id,k){
    var e=n.m+Math.floor(k/NC)*10; if(id[0]!=='L'&&ligaLeft>0)e+=15;
    var s=schedOf(id).t; if(e>s+4)out[id]=Math.ceil(e/5)*5;
    if(k===0)delay=Math.max(0,e-s);
  });
  return {est:out,delay:delay};
}

/* ---------- next up ---------- */
function nextUp(){
  var out=[];
  queue().forEach(function(id){if(out.length>=3)return;var p=players(id);if(p[0]&&p[1])out.push(id)});
  return out;
}
function hhmm(m){return (m<600?'0':'')+Math.floor(m/60)+':'+(m%60<10?'0':'')+m%60}
/* récord acumulado: 1ra edición + todos los partidos de esta edición (liga y eliminatoria) */
function rec1(p){var w=0,l=0;P1D.r.forEach(function(m){if(wo1(m))return;if(m[2]===p){if(m[4]>m[5])w++;else l++}else if(m[3]===p){if(m[5]>m[4])w++;else l++}});return [w,l]}
function rec2(p){var w=0,l=0;Object.keys(ST.r).forEach(function(id){var r=ST.r[id];if(r.wo)return;var pp=players(id);if(!pp[0]||!pp[1])return;var a=eloName(pp[0],id),b=eloName(pp[1],id);if(a===p){if(r.a>r.b)w++;else l++}else if(b===p){if(r.b>r.a)w++;else l++}});return [w,l]}
function recTot(p){var a=rec1(p),b=rec2(p);return [a[0]+b[0],a[1]+b[1]]}
function durOf(x){if(!x||!x.s||!x.e)return null;var f=function(v){var q=v.split(':');return +q[0]*60+(+q[1])};var d=f(x.e)-f(x.s);return d>=0?d:null}
var checkStarted=function(){return false}; /* asistencia desactivada */
function away(p){return checkStarted()&&!ST.here[p]}

/* ---------- destacados ---------- */
function highlights(E){
  var played=[];
  Object.keys(ST.r).forEach(function(id){var r=ST.r[id];var p=players(id);if(!p[0]||!p[1])return;played.push({id:id,r:r,a:p[0],b:p[1]})});
  var H=[];
  var up=null;played.forEach(function(x){if(x.r.wo)return;var w=x.r.a>x.r.b?x.a:x.b,l=w===x.a?x.b:x.a,g=ELO[l]-ELO[w];
    if(g>0&&(!up||g>up.g||(SEED[l]&&!SEED[w]&&!(SEED[up.l]&&!SEED[up.w]))))up={g:g,w:w,l:l,x:x}});
  var seedUps=played.filter(function(x){if(x.r.wo)return false;var w=x.r.a>x.r.b?x.a:x.b,l=w===x.a?x.b:x.a;return SEED[l]&&!SEED[w]});
  if(up)H.push(['Batacazo del día',nm(up.w)+' le ganó a '+nm(up.l),(up.x.r.a>up.x.r.b?up.x.r.a+'-'+up.x.r.b:up.x.r.b+'-'+up.x.r.a)+' · '+Math.round(up.g)+' puntos de Elo de diferencia'+(seedUps.length>1?' · '+seedUps.length+' sembrados han caído':'')]);
  var big=null;played.forEach(function(x){if(x.r.wo)return;var d=Math.abs(x.r.a-x.r.b);if(!big||d>big.d)big={d:d,x:x}});
  if(big){var w=big.x.r.a>big.x.r.b?big.x.a:big.x.b,l=w===big.x.a?big.x.b:big.x.a;H.push(['Mayor diferencia',nm(w)+' vs '+nm(l),Math.max(big.x.r.a,big.x.r.b)+'-'+Math.min(big.x.r.a,big.x.r.b)+' · '+labelOf(big.x.id)])}
  var tight=played.filter(function(x){return !x.r.wo&&Math.abs(x.r.a-x.r.b)===1});
  if(tight.length){var t=tight[tight.length-1];H.push(['Partidos al límite',tight.length+(tight.length===1?' partido se definió':' partidos se definieron')+' por 1 punto','El último: '+nm(t.a)+' vs '+nm(t.b)])}
  var best=null;ALLP().forEach(function(p){var d=E.R[p]-eloBase(p);if(d>0.004&&(!best||d>best.d))best={p:p,d:d}});
  if(best)H.push(['Mayor subida de Elo',nm(best.p),sgn(best.d,2)+' puntos · ahora '+f2(E.R[best.p])]);
  var L=table(),inv=L.filter(function(x){return x.pj===2&&x.pg===2}).length;
  if(ligaDone()>=23)H.push(['Invictos en la liga',inv+(inv===1?' jugador':' jugadores')+' con 2 victorias',ligaDone()+' de 44 partidos jugados']);
  var wos=played.filter(function(x){return x.r.wo}).length;
  if(wos)H.push(['W.O.',wos+(wos===1?' partido':' partidos')+' por W.O.','No cuentan para el Elo']);
  return H;
}

/* ---------- render ---------- */
function render(){
  var L=table(), done=ligaDone(), koDone=Object.keys(ST.r).filter(function(k){return k[0]!=='L'}).length;
  var posOf={};L.forEach(function(x,i){posOf[x.p]=i+1});
  var E=eloRun(), ES=estimates(), est=ES.est, SA=status();
  var ups=nextUp(), upIds={};ups.forEach(function(u){upIds[u]=1});
  var champ=ST.close?winner('F'):null, here=Object.keys(ST.here).length;
  var h='';
  h+='<header><svg class="lines" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="3"><rect x="560" y="40" width="400" height="320"/><line x1="560" y1="80" x2="960" y2="80"/><line x1="560" y1="320" x2="960" y2="320"/><line x1="760" y1="40" x2="760" y2="360" stroke-dasharray="6 8"/><line x1="660" y1="80" x2="660" y2="320"/><line x1="860" y1="80" x2="860" y2="320"/><line x1="660" y1="200" x2="860" y2="200"/></g></svg>';
  var CL=circList(E), pts=0;P1D.r.forEach(function(m){if(!wo1(m))pts+=m[4]+m[5]});Object.keys(ST.r).forEach(function(id){var r=ST.r[id];if(!r.wo)pts+=r.a+r.b});
  h+='<div class="wrap"><div class="brand"><img class="logo" src="'+FX.logo+'" alt="Caribbean Tennis" width="84" height="84"><div class="eyebrow">Circuito Amateur · Barranquilla</div></div><h1>Caribbean<br><span>Tennis</span></h1>';
  h+='<p class="tagline">Torneos de tenis amateur en Barranquilla. Juega, suma Elo y sube en el ranking del circuito.</p>';
  h+='<div class="stats"><div class="stat"><b data-count="2">2</b><small>Ediciones</small></div><div class="stat"><b data-count="'+CL.length+'">'+CL.length+'</b><small>Jugadores</small></div><div class="stat"><b data-count="'+(P1D.r.length+Object.keys(ST.r).length)+'">'+(P1D.r.length+Object.keys(ST.r).length)+'</b><small>Partidos</small></div><div class="stat"><b data-count="'+pts+'">'+pts.toLocaleString('es-CO')+'</b><small>Puntos jugados</small></div></div></div></header>';
  var topT=['inicio','liga','tabla','info'].indexOf(tab)>=0?'inicio':tab;
  h+='<nav class="tabs" aria-label="Secciones"><div class="wrap main" role="tablist">'+TABS.map(function(t){return '<button type="button" role="tab" data-tab="'+t[0]+'" aria-selected="'+(t[0]===topT)+'">'+t[1]+'</button>'}).join('')+'</div><div class="wrap subtabs"'+(topT==='inicio'?'':' hidden')+'>'+SUB.map(function(t){return '<button type="button" data-tab="'+t[0]+'" aria-selected="'+(t[0]===tab)+'">'+t[1]+'</button>'}).join('')+'</div></nav>';
  h+='<main><div class="wrap">';

  /* ---------- próxima edición e inscripción ---------- */
  var cfgOpen=!INSCFG||INSCFG.abiertas!==false, cupo=(INSCFG&&INSCFG.cupo)||48, dleft=daysTo(NEXT.date);
  var allFull=NEXT.cats.every(function(c){return LLENAS[c[0]]}), canIns=cfgOpen&&!allFull;
  var showForm=INSOPEN||!!insSent||!canIns;
  h+='<section id="proxima"><div class="nexted"><div class="ey"><span class="dot'+(canIns?' on':'')+'"></span>Próxima edición · Inscripciones '+(!cfgOpen?'cerradas':allFull?'cerradas: cupos llenos':'abiertas')+'</div><div class="big">'+NEXT.n+'</div>';
  if(dleft!=null&&dleft>0)h+='<div class="countdown"><b>'+dleft+'</b><span>'+(dleft===1?'día':'días')+' para el torneo</span></div>';
  h+='<div class="nfacts"><div><span>Fecha</span><strong>'+NEXT.dateTxt.replace(' de 2026','')+'</strong></div><div><span>Sede</span><strong>'+NEXT.place+'</strong></div><div><span>Inscripción</span><strong>'+money(NEXT.precio)+'</strong></div><div><span>Cupos</span><strong>'+cupo+' por categoría</strong></div></div>';
  h+='<div class="prizes">'+NEXT.cats.map(function(c){return '<div><span>Premio '+c[1]+'</span><b'+(c[2]==null?' class="tbd"':'')+'>'+(c[2]==null?'Por definir':money(c[2]))+'</b></div>'}).join('')+'</div>';
  h+='<div class="nacts">'+(canIns?'<button type="button" class="btn wa" id="openIns" aria-expanded="'+showForm+'">'+(insSent?'Inscribir a otra persona':showForm?'Cerrar formulario':'Inscribirme')+'</button>':'')+'<a class="btn ghost" href="'+NEXT.maps+'" target="_blank" rel="noopener">Cómo llegar</a></div></div>';
  h+='<div id="inscripcion"'+(showForm?' class="open"':' hidden')+'>';
  if(!canIns)h+='<div class="insform"><h3 class="rhead">Inscripciones cerradas</h3><p class="sub" style="margin:0">'+(allFull?'Se llenaron los cupos de las dos categorías.':'Las inscripciones no están abiertas en este momento.')+'</p></div>';
  else if(insSent){var fn=esc(String(insSent.n).split(' ')[0]),paid=!!insSent.paid,canPay=!!(insSent.ref&&C.wompiPublicKey);
    h+='<div class="insok'+(paid?'':' due')+'"><b>'+(paid?'¡Pago confirmado, '+fn+'! Tu cupo en '+esc(catName(insSent.c))+' está asegurado.':'¡Listo, '+fn+'! Tu inscripción en '+esc(catName(insSent.c))+' quedó registrada.')+'</b>'+
      (paid?'<span>Te esperamos el '+NEXT.dateTxt.charAt(0).toLowerCase()+NEXT.dateTxt.slice(1)+' en el '+NEXT.place+'.</span>':
        '<span>Para asegurar tu cupo paga la inscripción: <strong>'+money(NEXT.precio)+'</strong>. '+(canPay?'Puedes pagar con Nequi, PSE, Bancolombia o tarjeta.':'')+'</span>'+(canPay?'':pagoBox(fn))+
        (canPay?'<div class="nacts"><button type="button" class="btn primary" id="payBtn">Pagar '+money(NEXT.precio)+'</button></div><div class="insmsg" id="payMsg" aria-live="polite"></div>':''))+
      '<button type="button" class="linkbtn" id="insAgain" style="justify-self:start">Inscribir a otra persona</button></div>'}
  else h+='<form class="insform" id="insF" novalidate><div><h3 class="rhead">Inscríbete</h3><p class="sub" style="margin:2px 0 0">Llena tus datos y escoge tu categoría. Tus datos solo los ve la organización.</p></div>'+
    '<div class="grid"><label>Nombre completo<input name="nombre" autocomplete="name" maxlength="80" required></label>'+
    '<label>Correo electrónico<input name="correo" type="email" autocomplete="email" maxlength="120" required></label>'+
    '<label>Teléfono (WhatsApp)<input name="telefono" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="300 123 4567" required></label>'+
    '<label>Edad<input name="edad" type="number" inputmode="numeric" min="8" max="99" required></label></div>'+
    '<fieldset class="cats"><legend>Categoría</legend>'+NEXT.cats.map(function(c){var f=LLENAS[c[0]];return '<label class="cat'+(f?' full':'')+'"><input type="radio" name="categoria" value="'+c[0]+'"'+(f?' disabled':'')+'><span><b>'+c[1]+'</b><span>Premio '+prize(c[2])+(f?' · Categoría llena':'')+'</span></span></label>'}).join('')+'</fieldset>'+
    '<label class="consent"><input type="checkbox" name="acepto"> <span>Autorizo a Caribbean Tennis a usar mis datos solo para gestionar mi inscripción y enviarme información del torneo.</span></label>'+
    '<div class="insmsg" id="insMsg" aria-live="polite"></div><div class="nacts" style="align-items:center"><button class="btn primary" type="submit" id="insBtn">Inscribirme</button><span class="sub" style="margin:0">Valor: '+money(NEXT.precio)+'</span></div></form>';
  h+='</div>';
  if(canOrg&&orgOn)h+=orgIns(cfgOpen,cupo);
  h+='</section>';
  h+='<section id="pasos" class="rv"><div><h2>Cómo participar</h2></div><ol class="steps3">'+
    '<li><b>1</b><div><h3>Inscríbete</h3><p>Llena el formulario con tus datos y escoge tu categoría.</p></div></li>'+
    '<li><b>2</b><div><h3>Paga tu inscripción</h3><p>'+money(NEXT.precio)+' por transferencia. Al inscribirte te mostramos los datos para pagar. Así aseguras tu cupo.</p></div></li>'+
    '<li><b>3</b><div><h3>Juega</h3><p>'+NEXT.dateTxt.replace(' de 2026','')+' en el '+NEXT.place+'. Sigue tus partidos en vivo en esta página.</p></div></li></ol></section>';

  /* ---------- circuito: ediciones ---------- */
  var F1=P1D.r.filter(function(m){return m[1]==='F'})[0], ch1=F1[4]>F1[5]?F1[2]:F1[3], sb1=ch1===F1[2]?F1[3]:F1[2], sf1=P1D.r.filter(function(m){return m[1]==='S'}).map(function(m){return m[4]>m[5]?m[3]:m[2]});
  var sco=function(a,b){return Math.max(a,b)+'-'+Math.min(a,b)};
  var ndt=NEXT.date.split('-'), nshort=(+ndt[2])+' dic';
  /* ---------- 1ra edición ---------- */
  h+='<section id="p1res"><div><h2>1ra Edición</h2><p class="sub">Domingo 20 de septiembre de 2026 · Parque de Raquetas · 32 jugadores. Toca un nombre para ver su ficha.</p><details class="howto"><summary>¿Cómo fue el formato?</summary><p>Cada jugador jugó 2 partidos de 21 puntos en total y los 8 mejores pasaron a cuartos de final. Desde cuartos ganaba el primero en llegar a 11, y la final fue a 21.</p></details></div><div class="podium">';
  h+='<div class="pod gold"><img class="podlogo" src="'+FX.logo+'" alt="" width="56" height="56"><small>Campeón</small><b>'+nm1(ch1)+'</b><span>'+sco(F1[4],F1[5])+' en la final</span></div><div class="pod"><small>Subcampeón</small><b>'+nm1(sb1)+'</b></div><div class="pod"><small>Semifinalistas</small><b>'+sf1.map(nm1).join('<br>')+'</b></div></div></section>';
  h+='<section id="p1tabla"><div><h2>Clasificación</h2><p class="sub">Tabla final tras los 2 partidos de cada jugador. Desempate: partidos ganados, diferencia de puntos y puntos a favor. La columna Elo es el Elo con el que cada jugador terminó la 1ra edición.</p></div><div class="tablewrap clip'+(OPEN.p1t?' open':'')+'" data-clip="8"><table><thead><tr><th>Pos.</th><th style="text-align:left">Jugador</th><th>PJ</th><th>PG</th><th>PP</th><th>PF</th><th>PC</th><th>Dif.</th><th>Elo</th><th>Pasa a</th></tr></thead><tbody>';
  P1D.tab.forEach(function(x,i){var k=i+1,d=E1.R[x[0]]-1000;h+='<tr class="'+(k<=8?'z1':'z3')+(k===8?' cut':'')+(x[0]===me?' me':'')+'"><td class="pos">'+k+'</td><td class="n">'+nm1(x[0])+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td>'+x[3]+'</td><td>'+x[4]+'</td><td>'+x[5]+'</td><td>'+(x[6]>0?'+':'')+x[6]+'</td><td>'+f2(E1.R[x[0]])+(Math.abs(d)>=0.05?' <em class="'+(d>=0?'up':'dn')+'">'+sgn(d,1)+'</em>':'')+'</td><td>'+(k<=8?'<span class="zone o">Cuartos</span>':'—')+'</td></tr>'});
  h+='</tbody></table></div>'+moreBtn('p1t',P1D.tab.length,8,'Ver la tabla completa')+'</section>';
  var card1=function(m){var w=m[4]>m[5];return '<div class="k'+(m[1]==='F'?' final':'')+(me&&(m[2]===me||m[3]===me)?' mine':'')+'"><div class="top"><span>'+m[0]+(wo1(m)?' · W.O.':'')+'</span><span>'+R1N[m[1]]+'</span></div><div class="pl'+(w?'':' lose')+'"><span>'+nm1(m[2])+'</span><span class="sc">'+m[4]+'</span></div><div class="pl'+(w?' lose':'')+'"><span><em>vs</em> '+nm1(m[3])+'</span><span class="sc">'+m[5]+'</span></div></div>'};
  h+='<section id="p1cuadro"><div><h2>Fase final</h2><p class="sub">Cuartos: 1° vs 8°, 2° vs 7°, 3° vs 6° y 4° vs 5°.</p></div><div class="rounds">'+[['C','Cuartos de final'],['S','Semifinales'],['F','Final']].map(function(z){return '<div class="round"><h3>'+z[1]+'</h3><div class="ko">'+P1D.r.filter(function(m){return m[1]===z[0]}).map(card1).join('')+'</div></div>'}).join('')+'<div class="champ"><span class="tag live">Campeón</span><b>'+nm1(ch1)+'</b></div></div></section>';
  var mc1=function(m){var w=m[4]>m[5];return '<div class="m done'+(me&&(m[2]===me||m[3]===me)?' mine':'')+'"><div class="c"><span>'+m[0]+'</span><span>'+(wo1(m)?'<span class="wo">W.O.</span>':'')+'</span></div><div class="pl '+(w?'win':'lose')+'"><span>'+nm1(m[2])+'</span><span class="sc">'+m[4]+'</span></div><div class="vs">vs</div><div class="pl '+(w?'lose':'win')+'"><span>'+nm1(m[3])+'</span><span class="sc">'+m[5]+'</span></div></div>'};
  h+='<section id="p1rondas"><div><h2>Fase de grupos</h2><p class="sub">La Ronda 1 salió del sorteo. En la Ronda 2, el ganador de cada partido jugó contra el perdedor del siguiente. Los W.O. quedaron 21-0.</p></div>';
  [['R1','Ronda 1'],['R2','Ronda 2']].forEach(function(z){var L1=P1D.r.filter(function(m){return m[1]===z[0]});h+='<details class="acc" data-acc="p1'+z[0]+'"'+(OPEN['p1'+z[0]]?' open':'')+'><summary><span>'+z[1]+'</span><small>'+L1.length+' partidos</small></summary><div class="played">'+L1.map(mc1).join('')+'</div></details>'});
  h+='</section>';

  /* panel del organizador */
  if(canOrg&&orgOn){
    var q=queue(), ready=q.filter(function(id){var p=players(id);return p[0]&&p[1]}), lig=44-done, koP=q.filter(function(id){return id[0]!=='L'}).length;
    h+='<section id="panel" class="panel"><div><h2>Panel del organizador</h2><p class="sub">Solo lo ves tú y quien tenga permiso de edición.</p></div>';
    h+='<div class="pstats"><div><small>Liga</small><b>'+done+'/44</b><span>'+(lig?lig+' por cargar':'Completa')+'</span></div>'+
       '<div><small>Eliminatoria</small><b>'+koDone+'/25</b><span>'+(ST.close?(koP?koP+' por jugar':'Terminada'):'Liga sin cerrar')+'</span></div>'+
       '<div><small>Atraso</small><b>'+(ES.delay>=5?Math.round(ES.delay/5)*5+' min':'—')+'</b><span>'+(ES.delay>=5?'vs. horario':'Al día o sin empezar')+'</span></div>'+
       '<div><small>En juego</small><b>'+Object.keys(ST.t).filter(function(id){return ST.t[id].s&&!ST.r[id]}).length+'</b><span>partidos en cancha</span></div></div>';
    var alerts=[];ups.forEach(function(id){players(id).forEach(function(p){if(p&&away(p))alerts.push('<strong>'+esc(p)+'</strong> ('+esc(labelOf(id))+')')})});
    if(alerts.length)h+='<div class="palert">Posible W.O.: no han llegado '+alerts.join(', ')+'.</div>';
    var durs=[];Object.keys(ST.t).forEach(function(id){var d=durOf(ST.t[id]);if(d!=null)durs.push(d)});
    if(durs.length)h+='<div class="pinfo">Duración promedio de los partidos: <strong>'+Math.round(durs.reduce(function(s,x){return s+x},0)/durs.length)+' min</strong> ('+durs.length+' con hora de inicio y fin · el más largo: '+Math.max.apply(null,durs)+' min).</div>';
    if(!ST.close&&lig===0)h+='<div class="pinfo">Están los 44 resultados de liga. Usa <strong>Cerrar liga y armar cuadro</strong> en la barra de abajo.</div>';
    if(ready.length){
      var list=showAllPend?ready:ready.slice(0,6);
      h+='<div><h3 class="ph3">Resultados pendientes</h3><div class="plist">';
      list.forEach(function(id,k){var p=players(id),sc=schedOf(id);
        var ts=(ST.t[id]||{}).s;
        h+='<div class="pend'+(k<3?' now':'')+(ts?' live':'')+'"><span class="pt">'+esc(labelOf(id))+' · '+'Turno '+turnOf(id)+' · '+whenOf(id)+' · '+CN[sc.c]+'</span><span class="pp">'+esc(p[0])+(away(p[0])?' <span class="away">sin llegar</span>':'')+' <em>vs</em> '+esc(p[1])+(away(p[1])?' <span class="away">sin llegar</span>':'')+'</span><span class="pact">'+(ts?'<span class="since">En juego desde '+ts+'</span><button type="button" class="btn sm" data-unstart="'+id+'">Deshacer</button>':'<button type="button" class="btn sm" data-start="'+id+'">Empezar</button>')+'<button type="button" class="pgo" data-pend="'+id+'">'+(ts?'Terminar':'Cargar')+'</button></span></div>'});
      h+='</div>'+(ready.length>6?'<button type="button" class="linkbtn" id="morePend">'+(showAllPend?'Ver menos':'Ver todos ('+ready.length+')')+'</button>':'')+'</div>';
    } else if(ST.close&&!champ)h+='<div class="pinfo">No hay partidos listos para cargar: faltan ganadores de la ronda anterior.</div>';
    h+='</section>';
  }

  /* resumen final */
  if(champ){
    var sub=loser('F'), semis=[loser('S1'),loser('S2')].filter(Boolean);
    var rk=PLAYERS.slice().sort(function(a,b){return E.R[b]-E.R[a]}).slice(0,10);
    h+='<section id="resumen"><div><h2>Resumen de la 2da edición</h2><p class="sub">Así terminó el torneo.</p></div><div class="podium">';
    h+='<div class="pod gold"><img class="podlogo" src="'+FX.logo+'" alt="" width="56" height="56"><small>Campeón</small><b>'+nm(champ)+'</b><span>'+(ST.r.F.a>ST.r.F.b?ST.r.F.a+'-'+ST.r.F.b:ST.r.F.b+'-'+ST.r.F.a)+' en la final</span></div>';
    h+='<div class="pod"><small>Subcampeón</small><b>'+nm(sub)+'</b></div>';
    h+='<div class="pod"><small>Semifinalistas</small><b>'+semis.map(nm).join('<br>')+'</b></div></div>';
    h+='<div class="rk"><h3>Ranking Elo actualizado · top 10</h3><ol>'+rk.map(function(p){var d=E.R[p]-ELO[p];return '<li><span>'+nm(p)+'</span><span><strong>'+f2(E.R[p])+'</strong> <em class="'+(d>=0?'up':'dn')+'">'+sgn(d,1)+'</em></span></li>'}).join('')+'</ol><p class="sub" style="margin:0">Provisional hasta que la organización publique el ranking oficial.</p></div></section>';
  }

  /* siguen */
  if(ups.length){
    h+='<section id="siguen"><div><h2>Siguen <span class="tag live">En vivo</span></h2><p class="sub">Los próximos partidos en entrar a cancha.</p></div><div class="next">';
    ups.forEach(function(id){var p=players(id),sc=schedOf(id);h+='<div class="nx"><div class="top"><span>'+esc(labelOf(id))+'</span><span>'+'Turno '+turnOf(id)+' · '+whenOf(id)+' · '+CN[sc.c]+'</span></div>'+(parcTxt(id)?'<div class="parc">'+esc(parcTxt(id))+'</div>':'')+'<div class="p">'+nm(p[0])+(away(p[0])?' <span class="away">sin llegar</span>':'')+'</div><div class="p"><span class="sub" style="margin:0">vs</span> '+nm(p[1])+(away(p[1])?' <span class="away">sin llegar</span>':'')+'</div></div>'});
    h+='</div></section>';
  }

  /* el dia */
  var steps=[['9:30','Llegada y calentamiento','Confirma tu asistencia en la mesa de organización.'],['10:00','Fase de liga · 44 partidos','7 turnos en 4 canchas. Cada jugador juega 2 partidos contra rivales distintos.'],['11:15','Cierre de la tabla','Se publican la clasificación y el cuadro de eliminatoria.'],['11:25','16vos de final','Del 7° al 26° de la tabla: 7° vs 26°, 8° vs 25° y así sucesivamente.'],['11:55','Octavos de final','Entran los 6 primeros de la tabla.'],['12:15','Cuartos de final',''],['12:25','Semifinales',''],['12:35','Gran final','',1],['1:00','Premiación y foto oficial','',1]];

  /* destacados */
  var HL=highlights(E);
  if(HL.length){
    h+='<section id="destacados"><div><h2>Destacados <span class="tag live">En vivo</span></h2></div><div class="hls">';
    HL.forEach(function(x){h+='<div class="hl"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>'});
    h+='</div></section>';
  }

  /* liga */
  h+='<section id="liga"><div><h2>Fase de liga</h2><p class="sub">'+done+' de 44 resultados cargados. Arriba, los 26 partidos del domingo 1 de noviembre en 4 canchas; abajo, los 18 que se jugaron el 25 de octubre, antes de la lluvia. Los números entre paréntesis son la siembra según el ranking Elo de la 1ra edición. Toca un nombre para ver su ficha.</p></div>';
  h+='<div class="legend"><span><i style="background:var(--surface);border-color:var(--sun)"></i>Sigue en cancha</span>'+(me?'<span><i style="background:var(--hl)"></i>Tus partidos</span>':'')+(checkStarted()?'<span><i class="awaykey"></i>Sin llegar</span>':'')+'</div>';
  h+='<div class="courts-head"><span>Turno</span>'+CN.slice(1).map(function(c){return '<span>'+c+'</span>'}).join('')+'</div><div class="board">';
  for(var t=1;t<=LT;t++){
    if((t-1)%6===0)h+='<div class="hourdiv"><span>'+hm(600+(t-1)*10).replace(':00','')+(t<13?' a. m.':' p. m.')+'</span></div>';
    else h+='<div class="seguir"><span>A seguir</span></div>';
    h+='<div class="turn"><div class="t"><b>Turno '+t+'</b></div>';
    for(var c=1;c<=NC;c++){
      var m=null;S.forEach(function(x){if(!d1(x)&&x[1]===t&&x[2]===c)m=x});
      if(!m){h+='<div class="m empty"><div class="c"><span>'+CN[c]+'</span></div><div class="vs">Libre</div></div>';continue}
      var id='L'+m[0], r=ST.r[id], cls='m'+(r?' done':'')+(upIds[id]?' up':'')+(me&&(m[3]===me||m[4]===me)?' mine':'')+(orgOn&&canOrg?' edit':'');
      var tag=(orgOn&&canOrg)?'button':'div';
      var pl=function(p,sc,win){return '<div class="pl'+(r?(win?' win':' lose'):'')+(!r&&away(p)?' awayp':'')+'"><span>'+nm(p)+'</span>'+(r?'<span class="sc">'+sc+'</span>':'')+'</div>'};
      h+='<'+tag+' class="'+cls+'" data-id="'+id+'"'+(tag==='button'?' type="button" aria-label="Cargar resultado del partido '+m[0]+'"':'')+'><div class="c"><span>'+CN[c]+''+'</span><span>'+(r&&r.wo?'<span class="wo">W.O.</span> ':'')+'#'+m[0]+'</span></div>';
      h+=pl(m[3],r&&r.a,r&&r.a>r.b)+'<div class="vs">vs</div>'+pl(m[4],r&&r.b,r&&r.b>r.a)+(parcTxt(id)?'<div class="parc">'+esc(parcTxt(id))+'</div>':'')+(!r&&(ST.t[id]||{}).s?'<div class="inplay">En juego</div>':'')+'</'+tag+'>';
    }
    h+='</div>';
  }
  h+='</div>';
  /* jugados el 25 de octubre */
  var D1=S.filter(d1);
  if(D1.length){
    h+='<details class="acc" data-acc="d1"'+(OPEN.d1?' open':'')+'><summary><span>Jugados el 25 de octubre</span><small>'+D1.length+' partidos antes de la lluvia</small></summary><div class="played">';
    D1.forEach(function(m){var id='L'+m[0], r=ST.r[id], tag=(orgOn&&canOrg)?'button':'div', cls='m'+(r?' done':'')+(me&&(m[3]===me||m[4]===me)?' mine':'')+(orgOn&&canOrg?' edit':'');
      var pl=function(p,sc,win){return '<div class="pl'+(r?(win?' win':' lose'):'')+'"><span>'+nm(p)+'</span>'+(r?'<span class="sc">'+sc+'</span>':'')+'</div>'};
      h+='<'+tag+' class="'+cls+'" data-id="'+id+'"'+(tag==='button'?' type="button" aria-label="Corregir resultado del partido '+m[0]+'"':'')+'><div class="c"><span>25 oct</span><span>'+(r&&r.wo?'<span class="wo">W.O.</span> ':'')+'#'+m[0]+'</span></div>'+pl(m[3],r&&r.a,r&&r.a>r.b)+'<div class="vs">vs</div>'+pl(m[4],r&&r.b,r&&r.b>r.a)+'</'+tag+'>'});
    h+='</div></details>';
  }
  h+='</section>';

  /* tabla */
  h+='<section id="tabla"><div><h2>Tabla de posiciones '+(ST.close?'':'<span class="tag live">En vivo</span>')+'</h2><p class="sub">'+(ST.close?'Liga cerrada. Esta es la clasificación final.':(done?'Se actualiza con cada resultado.':'Aún no hay resultados: por ahora el orden es alfabético.'))+' Desempate: partidos ganados, diferencia de puntos, puntos a favor y menos puntos en contra. El Elo no cuenta para la tabla. <strong>Clasificado</strong> y <strong>Eliminado</strong> solo aparecen cuando es 100% seguro, pase lo que pase en los partidos que faltan.</p></div>';
  h+='<div class="tablewrap clip'+(OPEN.t2?' open':'')+'" data-clip="12"><table><thead><tr><th>Pos.</th><th style="text-align:left">Jugador</th><th>PJ</th><th>PG</th><th>PP</th><th>PF</th><th>PC</th><th>Dif.</th><th>Elo</th><th>Pasa a</th></tr></thead><tbody>';
  var shown=ST.close?ST.close.map(function(p){var x=null;L.forEach(function(y){if(y.p===p)x=y});return x}):L;
  var tied=function(u,v){return u&&v&&u.pj>0&&u.pg===v.pg&&u.dif===v.dif&&u.pf===v.pf&&u.pc===v.pc};
  shown.forEach(function(x,i){var k=i+1,d=E.R[x.p]-ELO[x.p],isT=!ST.close&&(tied(x,shown[i-1])||tied(x,shown[i+1]));h+='<tr class="'+(k<=6?'z1':k<=26?'z2':'z3')+(k===6||k===26?' cut':'')+(x.p===me?' me':'')+'"><td class="pos">'+k+'</td><td class="n">'+nm(x.p)+(isT?' <span class="zone tie">Empate</span>':'')+(SA[x.p]==='C'?' <span class="zone ok">Clasificado</span>':SA[x.p]==='E'?' <span class="zone out">Eliminado</span>':'')+(away(x.p)?' <span class="away">sin llegar</span>':'')+'</td><td>'+x.pj+'</td><td>'+x.pg+'</td><td>'+(x.pj-x.pg)+'</td><td>'+x.pf+'</td><td>'+x.pc+'</td><td>'+(x.dif>0?'+':'')+x.dif+'</td><td>'+f2(E.R[x.p])+(Math.abs(d)>0.004?' <em class="'+(d>=0?'up':'dn')+'">'+sgn(d,1)+'</em>':'')+'</td><td>'+(SA[x.p]==='E'?'—':(k<=6?'<span class="zone o">Octavos</span>':k<=26?'<span class="zone s">16vos</span>':'—'))+'</td></tr>'});
  h+='</tbody></table></div>'+moreBtn('t2',shown.length,12,'Ver la tabla completa')+'</section>';

  /* cuadro */
  h+='<section id="cuadro"><div><h2>Eliminatoria '+(ST.close?'':'<span class="tag proj">Proyección</span>')+'</h2><p class="sub">'+(ST.close?'Cuadro definitivo. Los ganadores avanzan solos.':(ligaDone()?'Así quedaría el cuadro si la liga terminara ahora. Se confirma al cerrar la tabla, a las 11:15.':'Los nombres aparecen cuando haya resultados de liga. El cuadro definitivo se arma al cerrar la tabla, a las 11:15.'))+'</p></div><div class="rounds">';
  KO.forEach(function(r){
    h+='<div class="round"><h3>'+r.name+'<time>'+(function(){var f=turnOf(r.list[0][0]),l=turnOf(r.list[r.list.length-1][0]);return f===l?'Turno '+f:'Turnos '+f+' a '+l})()+'</time></h3><div class="ko">';
    r.list.forEach(function(x,i){
      var p=players(x[0]), res=ST.r[x[0]], can=orgOn&&canOrg&&ST.close&&p[0]&&p[1], tag=can?'button':'div';
      var line=function(j){var ref=j?x[2]:x[1];var who=p[j]?nm(p[j]):'<em>'+slotLabel(ref)+'</em>';var cls=res&&p[0]&&p[1]?((j?res.b>res.a:res.a>res.b)?'':' lose'):'';
        var sc=res&&p[0]&&p[1]?'<span class="sc">'+(j?res.b:res.a)+'</span>':'';return '<div class="pl'+cls+'"><span>'+(j?'<em>vs</em> ':'')+who+'</span>'+sc+'</div>'};
      h+='<'+tag+' class="k'+(x[0]==='F'?' final':'')+(can?' edit':'')+(me&&(p[0]===me||p[1]===me)?' mine':'')+'" data-id="'+x[0]+'"'+(can?' type="button"':'')+'><div class="top"><span>'+x[0]+(res&&res.wo?' · W.O.':'')+'</span><span>'+'Turno '+turnOf(x[0])+' · '+whenOf(x[0])+' · '+CN[i%NC+1]+'</span></div>'+line(0)+line(1)+'</'+tag+'>';
    });
    h+='</div></div>';
  });
  if(champ)h+='<div class="champ"><span class="tag live">Campeón</span><b>'+nm(champ)+'</b></div>';
  h+='</div></section>';

  /* ranking elo del circuito */
  h+='<section id="elo"><div><h2>Ranking Elo del circuito</h2><p class="sub">Suma las dos ediciones. Toca un nombre para ver su ficha.</p><details class="howto"><summary>¿Cómo funciona el Elo?</summary><p>Todos arrancan en 1.000. Ganarle a alguien con más Elo suma más y perder con alguien con menos Elo resta más (K = 32). Los W.O. no cuentan para el Elo ni para el récord, y solo aparecen los jugadores con al menos un partido jugado.</p></details></div>';
  h+='<div class="podium3">'+CL.slice(0,3).map(function(p,i){return '<button type="button" class="p3 p3-'+(i+1)+'" data-p="'+esc(p)+'"><span class="medal">'+(i+1)+'</span><b>'+esc(p)+'</b><span>Elo '+f2(cElo(E,p))+'</span></button>'}).join('')+'</div>';
  h+='<div class="rksearch"><input id="rkq" type="search" placeholder="Busca un jugador" autocomplete="off" value="'+esc(RKQ)+'" aria-label="Buscar jugador en el ranking"></div><ol class="rklist" id="rklist">';
  CL.forEach(function(p,i){var r2=rec2(p),d=(r2[0]+r2[1]>0)?E.R[p]-eloBase(p):E1.R[p]-1000,rt=recTot(p),st1=stage1(p),st2=FX.eloOut[p]!=null?'Liga':stage2(p);
    h+='<li class="rkrow'+(p===me?' me':'')+'" data-name="'+esc(p.toLowerCase())+'" data-i="'+i+'"><span class="pos">'+(i+1)+'</span><button type="button" class="who" data-p="'+esc(p)+'"><b>'+esc(p)+'</b><small>'+rt[0]+'-'+rt[1]+' en el circuito'+(st2?' · 2da: '+st2:st1?' · 1ra: '+st1:'')+'</small></button><span class="elo"><b>'+f2(cElo(E,p))+'</b>'+(Math.abs(d)>0.004?'<em class="'+(d>=0?'up':'dn')+'">'+(d>=0?'▲ ':'▼ ')+sgn(d,1).replace('-','')+'</em>':'')+'</span></li>'});
  h+='</ol><button type="button" class="btn more" id="rkMore"'+(CL.length>RKN?'':' hidden')+'>Ver más jugadores</button><p class="sub" id="rkNone" hidden>No hay jugadores con ese nombre.</p></section>';


  /* récords del circuito */
  var AM=allMatches(E), RC=[];
  (function(){
    var wins={},pf={};AM.forEach(function(m){var w=m.sa>m.sb?m.a:m.b;wins[w]=(wins[w]||0)+1;pf[m.a]=(pf[m.a]||0)+m.sa;pf[m.b]=(pf[m.b]||0)+m.sb});
    var top=function(o){var mx=-1,who=[];Object.keys(o).forEach(function(k){if(o[k]>mx){mx=o[k];who=[k]}else if(o[k]===mx)who.push(k)});return {v:mx,who:who}};
    var lst=function(a){return a.slice(0,3).map(nm1).join(', ')+(a.length>3?' y '+(a.length-3)+' más':'')};
    var w=top(wins);if(w.v>0)RC.push(['Más victorias',lst(w.who),w.v+' partidos ganados en el circuito']);
    var pc=CL.map(function(p){var r=recTot(p);return {p:p,n:r[0]+r[1],w:r[0]}}).filter(function(x){return x.n>=5}).sort(function(a,b){return b.w/b.n-a.w/a.n||b.n-a.n});
    if(pc.length){var b0=pc[0],bs=pc.filter(function(x){return x.w/x.n===b0.w/b0.n&&x.n===b0.n}).map(function(x){return x.p});RC.push(['Mejor porcentaje de victorias',lst(bs),Math.round(b0.w/b0.n*100)+'% · '+b0.w+'-'+(b0.n-b0.w)+' (mínimo 5 partidos)'])}
    var cur={},best={};AM.forEach(function(m){var w=m.sa>m.sb?m.a:m.b,l=w===m.a?m.b:m.a;cur[w]=(cur[w]||0)+1;cur[l]=0;if(cur[w]>(best[w]||0))best[w]=cur[w]});
    var s=top(best);if(s.v>1)RC.push(['Racha más larga',lst(s.who),s.v+' victorias seguidas']);
    var big=null;AM.forEach(function(m){var d=Math.abs(m.sa-m.sb);if(!big||d>big.d)big={d:d,m:m}});
    if(big){var m=big.m,wn=m.sa>m.sb?m.a:m.b,ls=wn===m.a?m.b:m.a;RC.push(['Mayor paliza',nm1(wn)+' a '+nm1(ls),Math.max(m.sa,m.sb)+'-'+Math.min(m.sa,m.sb)+' · '+esc(m.lab)])}
    var up=null;AM.forEach(function(m){if(m.ea==null)return;var pw=m.sa>m.sb?m.ea:1-m.ea;if(!up||pw<up.pw)up={pw:pw,m:m}});
    if(up&&up.pw<0.5){var m2=up.m,w2=m2.sa>m2.sb?m2.a:m2.b,l2=w2===m2.a?m2.b:m2.a;RC.push(['Mayor batacazo',nm1(w2)+' le ganó a '+nm1(l2),'Según el Elo tenía '+Math.round(up.pw*100)+'% de probabilidad · '+Math.max(m2.sa,m2.sb)+'-'+Math.min(m2.sa,m2.sb)+' · '+esc(m2.lab)])}
    var tp=top(pf);if(tp.v>0)RC.push(['Más puntos ganados',lst(tp.who),tp.v+' puntos en el circuito']);
    var gain=null;CL.forEach(function(p){var g=cElo(E,p)-1000;if(!gain||g>gain.g)gain={p:p,g:g}});
    if(gain&&gain.g>0)RC.push(['Mayor subida de Elo',nm1(gain.p),'+'+f2(gain.g)+' desde que entró al circuito · hoy '+f2(cElo(E,gain.p))]);
    var lng=null,sht=null;AM.forEach(function(m){if(!m.id)return;var d=durOf(ST.t[m.id]);if(d==null||d<3)return;if(!lng||d>lng.d)lng={d:d,m:m};if(!sht||d<sht.d)sht={d:d,m:m}});
    if(lng)RC.push(['Partido más largo',nm1(lng.m.a)+' vs '+nm1(lng.m.b),lng.d+' minutos · '+lng.m.sa+'-'+lng.m.sb+' · '+esc(lng.m.lab)]);
    if(sht&&sht!==lng)RC.push(['Partido más corto',nm1(sht.m.a)+' vs '+nm1(sht.m.b),sht.d+' minutos · '+sht.m.sa+'-'+sht.m.sb+' · '+esc(sht.m.lab)]);
  })();
  if(RC.length){h+='<section id="records" class="rv"><div class="shead"><h2>Récords del circuito</h2><span class="carnav"><button type="button" class="cbtn" data-car="-1" aria-label="Anterior">‹</button><button type="button" class="cbtn" data-car="1" aria-label="Siguiente">›</button></span></div><p class="sub" style="margin-top:-6px">Contando las dos ediciones. Desliza para ver más.</p><div class="car" id="car">';
    RC.forEach(function(x,i){h+='<div class="hl card'+(i%3)+'"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>'});h+='</div><div class="cdots">'+RC.map(function(x,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('')+'</div></section>'}
  /* quiénes somos */
  var ORG=[
    ['img/mateo.webp','Mateo González Ayala','Organizador','18 años · juega tenis desde los 8',
     ['Top 12 de Colombia y <strong>número 1 de la región Caribe</strong> en todas las categorías','Participación en el <strong>Mundial Juvenil de Tenis</strong>','Sumó <strong>puntos ITF</strong> y entró al ranking mundial','Más de <strong>70 títulos</strong> nacionales','Finalista de un <strong>Sudamericano COSAT</strong>','<strong>UTR 10</strong>, clasificación usada en todo el mundo','Dos medallas de oro en sus primeros ASCUN regionales','Jugó los <strong>Juegos Nacionales</strong> en Pereira a los 15 años','Medalla de oro en los Intercolegiados regionales']],
    ['img/andres.webp','Andrés Rodríguez Ávila','Organizador','21 años · juega tenis desde los 7',
     ['Participación en el <strong>Mundial Juvenil de Tenis</strong>','<strong>Número 1 de la Costa durante 7 años</strong> en la categoría 2005','Más de <strong>100 campeonatos</strong> a nivel nacional','Títulos en el <strong>circuito nacional francés</strong>, con clasificación 5/6','Medallista de oro y plata en todas sus participaciones en los <strong>Juegos ASCUN</strong> regionales (2024, 2025 y 2026)','Ha jugado torneos internacionales avalados por la <strong>ITF</strong>']]
  ];
  h+='<section id="nosotros" class="rv"><div><h2>Quiénes somos</h2></div><div class="story"><p>Crecimos compitiendo y sabemos lo que se siente jugar un buen torneo. Por eso creamos Caribbean Tennis: para que los jugadores amateur de la Costa vivan esa misma experiencia. Queremos que cualquier jugador, sin importar su nivel, sienta la emoción de competir en un torneo bien organizado: con cuadro, ranking y resultados en vivo, hidratación, caddies y una comunidad que crece en cada edición.</p>'+
    '<div class="miles"><div><b>26 ago</b><span>Lanzamiento</span></div><div><b>20 sep</b><span>1ra edición</span></div><div><b>25 oct</b><span>2da edición</span></div><div><b>'+(+NEXT.date.split('-')[2])+' dic</b><span>'+NEXT.n+'</span></div></div></div>';
  h+='<div class="orgs">'+ORG.map(function(o,i){return '<article class="orgc"><img class="orgph" src="'+o[0]+'" alt="'+o[1]+' jugando tenis" width="800" height="600" loading="lazy"><div class="orgh"><div><b>'+o[1]+'</b><small>'+o[2]+' · '+o[3]+'</small></div></div><ul>'+o[4].slice(0,OPEN['org'+i]?99:3).map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'+(o[4].length>3?'<button type="button" class="linkbtn" data-more="org'+i+'">'+(OPEN['org'+i]?'Ver menos':'Ver toda la trayectoria')+'</button>':'')+'</article>'}).join('')+'</div></section>';

  /* reemplazos (organizador) */
  if(canOrg&&orgOn){
    var canRep=PLAYERS.filter(function(p){return S.some(function(m){return (m[3]===p||m[4]===p)&&!d1(m)&&!ST.r['L'+m[0]]})}).sort();
    h+='<section id="reemplazos"><div><h2>Reemplazos</h2><p class="sub">Si un jugador no puede venir el 1 de noviembre, otro jugador toma su cupo. El reemplazo hereda el resultado del 25 de octubre y juega los partidos que faltan. Ese primer partido sigue contando en el Elo del jugador original; al reemplazo solo le cuentan los partidos que él juegue.</p></div>';
    var rk=Object.keys(FX.reps);
    if(rk.length)h+='<div class="plist">'+rk.map(function(n){return '<div class="pend"><span class="pp">'+esc(n)+' <em>reemplaza a</em> '+esc(FX.reps[n])+'</span><span class="pact"><button type="button" class="btn sm" data-unrep="'+esc(n)+'">Deshacer</button></span></div>'}).join('')+'</div>';
    h+='<div class="repf"><label>Jugador que no puede venir<select id="repOld"><option value="">Elige…</option>'+canRep.map(function(p){return '<option>'+esc(p)+'</option>'}).join('')+'</select></label><label>Nombre del reemplazo<input id="repNew" placeholder="Nombre y apellido" autocomplete="off"></label><label>Elo inicial del reemplazo<input id="repElo" type="number" inputmode="decimal" value="1000" step="0.01"></label><button class="btn primary" id="repGo">Hacer reemplazo</button><div class="err" id="repErr" aria-live="polite"></div></div></section>';
  }

  /* reglas */
  h+='<section id="reglas"><h2>Reglas del día</h2><div class="rules">';
  [['21','Liga','En la fase de liga se juegan 21 puntos en total. Gana quien sume más, por ejemplo 13-8. No hay empates.'],
   ['11','Eliminatoria','De 16vos a semifinales gana el primero en llegar a 11 puntos, por ejemplo 11-7.'],
   ['21','Final','La final la gana el primero en llegar a 21 puntos, por ejemplo 21-17.'],
   ['W.O.','No presentarse','Si un jugador no se presenta cuando lo llaman a cancha, pierde por W.O.: 11-0 en liga y eliminatoria, 21-0 en la final. Un W.O. no cuenta para el Elo.'],
   ['4','Criterios de desempate','1) Partidos ganados 2) diferencia de puntos 3) puntos a favor 4) menos puntos en contra. El ranking Elo no cuenta. Si aun así hay empate, lo define la organización.'],
   ['26','Clasificación','Del 1° al 6° van directo a octavos. Del 7° al 26° juegan 16vos: 7° vs 26°, 8° vs 25° y así sucesivamente.'],
   ['( )','Siembras','Los 8 mejores del ranking Elo de la 1ra edición son cabezas de serie. En la liga no se enfrentan entre ellos.'],
   ['Elo','Ranking del circuito','Todos parten de 1.000. Ganarle a alguien con más Elo suma más; perder con alguien con menos Elo resta más (K = 32). En esta página se calcula en vivo y es provisional.'],
   ['→','Cancha libre','El orden de los partidos se respeta, pero la cancha puede cambiar: entra el siguiente partido en la primera cancha que se libere.']
  ].forEach(function(x){h+='<div class="rule"><b>'+x[0]+'</b><h3>'+x[1]+'</h3><p>'+x[2]+'</p></div>'});
  h+='</div></section>';

  /* patrocinadores + lugar */
  h+='<section id="patrocinadores"><div><h2>Patrocinadores</h2><p class="sub">Gracias a las marcas que hacen posible esta edición.</p></div><div class="spons">';
  h+='<div class="sp"><small>Aliado oficial</small><b>Sunset Tennis House</b><span class="sub" style="margin:0">Sede de la 2da edición</span></div>';
  h+='<div class="sp"><small>Patrocinador</small><b>Muncher</b></div>';
  h+='<div class="sp"><small>Patrocinador</small><b>SQ Studios</b></div>';
  h+='<div class="sp"><small>Patrocinador</small><b>XIX</b><a href="https://www.instagram.com/diecinueve.sh/" target="_blank" rel="noopener">@diecinueve.sh</a></div>';
  h+='</div></section>';
  h+='<section id="lugar"><h2>Cómo llegar</h2><div class="place"><div><b>Sunset Tennis House</b><div class="sub" style="margin:2px 0 0">Barranquilla, Atlántico</div></div><a class="btn primary" href="https://maps.app.goo.gl/bqrMEdqhPPCKuHk26" target="_blank" rel="noopener">Abrir en Google Maps</a></div></section>';
  h+='</div></main><footer><div class="wrap"><span class="fbrand"><img src="'+FX.logo+'" alt="" width="28" height="28">Organiza Caribbean Tennis · @caribeantennis</span><span>Resultados oficiales del Circuito Amateur'+(canOrg?'':' · <button type="button" class="linkbtn" id="orgLogin" style="color:inherit">Acceso organizador</button>')+'</span></div></footer>';

  /* organizer bar */
  if(canOrg){
    h+='<div class="orgbar"><div class="wrap"><span style="display:flex;gap:10px;align-items:center"><label class="switch"><input type="checkbox" id="orgsw"'+(orgOn?' checked':'')+'> Modo organizador</label><button type="button" class="btn sm" id="orgOut">Cerrar sesión</button></span>';
    if(orgOn){
      h+='<span class="st">Inscripciones de la '+NEXT.n+': en la pestaña Circuito. Resultados de la 2da: toca un partido.</span>';
      h+=ST.close?'<button class="btn" id="reopen"'+(koDone?' disabled title="Ya hay resultados de eliminatoria"':'')+'>Reabrir liga</button>':'<button class="btn primary" id="closeL">Cerrar liga y armar cuadro</button>';
    }
    h+='</div></div>';
  }
  root.innerHTML=h;
  bind();
}

/* ---------- inscritos (solo organizador) ---------- */
function fdate(x){try{var d=new Date(x);return d.toLocaleDateString('es-CO',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function waNum(t){var d=String(t).replace(/\D/g,'');if(d.length===10&&d[0]==='3')d='57'+d;return d}
function orgIns(cfgOpen,cupo){
  var h='<div class="panel" style="display:grid;margin-top:14px"><div><h3 class="rhead">Inscritos <span class="tag proj">Solo organizador</span></h3><p class="sub" style="margin:2px 0 0">Esta lista y los datos de contacto solo los ves tú.</p></div>';
  if(INSROWS===null)return h+'<p class="sub">Cargando inscritos…</p></div>';
  var cnt={},paid={};NEXT.cats.forEach(function(c){cnt[c[0]]=0;paid[c[0]]=0});
  INSROWS.forEach(function(r){cnt[r.categoria]=(cnt[r.categoria]||0)+1;if(r.pagado)paid[r.categoria]=(paid[r.categoria]||0)+1});
  var np=INSROWS.filter(function(r){return r.pagado}).length;
  h+='<div class="pstats">'+NEXT.cats.map(function(c){return '<div><small>'+c[1]+'</small><b>'+cnt[c[0]]+'/'+cupo+'</b><span>'+paid[c[0]]+' pagaron</span></div>'}).join('')+'<div><small>Total</small><b>'+INSROWS.length+'</b><span>'+np+' pagaron</span></div><div><small>Recaudo confirmado</small><b style="font-size:20px">'+money(np*NEXT.fee)+'</b></div></div>';
  h+='<div class="repf"><label>Cupos por categoría<input id="cfgCupo" type="number" inputmode="numeric" min="0" value="'+cupo+'"></label><label>Inscripciones<select id="cfgOpen"><option value="1"'+(cfgOpen?' selected':'')+'>Abiertas</option><option value="0"'+(cfgOpen?'':' selected')+'>Cerradas</option></select></label><button class="btn" id="cfgSave" type="button">Guardar</button><button class="btn" id="insCsv" type="button">Descargar Excel (CSV)</button><button class="btn" id="insReload" type="button">Actualizar lista</button><div class="err" id="cfgErr" aria-live="polite"></div></div>';
  h+='<div class="nacts" style="gap:6px">'+[['','Todas']].concat(NEXT.cats.map(function(c){return [c[0],c[1]]})).map(function(f){return '<button type="button" class="btn sm'+(insFilter===f[0]?' primary':'')+'" data-insf="'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>';
  var L=INSROWS.filter(function(r){return !insFilter||r.categoria===insFilter});
  if(!L.length)return h+'<p class="sub" style="margin:0">Todavía no hay inscritos'+(insFilter?' en esta categoría':'')+'.</p></div>';
  h+='<div class="tablewrap"><table class="otable"><thead><tr><th>#</th><th>Nombre</th><th>Cat.</th><th>Teléfono</th><th>Correo</th><th>Edad</th><th>Inscrito</th><th>Pago</th><th></th></tr></thead><tbody>'+
    L.map(function(r,i){return '<tr><td>'+(i+1)+'</td><td class="n">'+esc(r.nombre)+'</td><td>'+esc(catName(r.categoria))+'</td><td><a href="https://wa.me/'+waNum(r.telefono)+'" target="_blank" rel="noopener">'+esc(r.telefono)+'</a></td><td><a href="mailto:'+esc(r.correo)+'">'+esc(r.correo)+'</a></td><td>'+esc(r.edad)+'</td><td>'+fdate(r.created_at)+'</td><td><button type="button" class="btn sm" data-pay="'+esc(r.id)+'">'+(r.pagado?'<span class="oktag">Pagó'+(r.pago_metodo?' · '+metodoTxt(r.pago_metodo):'')+'</span>':(r.pago_estado&&r.pago_estado!=='APPROVED'?'<span class="pdtag">'+estadoTxt(r.pago_estado)+'</span> ':'')+'Marcar pago')+'</button></td><td><button type="button" class="btn sm danger" data-idel="'+esc(r.id)+'" aria-label="Borrar inscripción de '+esc(r.nombre)+'">✕</button></td></tr>'}).join('')+'</tbody></table></div>';
  return h+'</div>';
}
function loadIns(){if(!canOrg)return;DB.inscritos().then(function(r){INSROWS=r||[];keepRender()}).catch(function(e){INSROWS=[];keepRender();toast('No se pudieron cargar los inscritos.',5000)})}
function loadPublic(){Promise.all([DB.config(),DB.llenas()]).then(function(x){INSCFG=x[0];LLENAS=x[1]||{};if(!typing())keepRender()})}
function smooth(){return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}
function applyRk(){var q=norm(RKQ||''),n=0,shown=0;root.querySelectorAll('#rklist .rkrow').forEach(function(li){var hit=q?norm(li.getAttribute('data-name')).indexOf(q)>=0:(+li.getAttribute('data-i')<RKN);li.hidden=!hit;if(hit)shown++;n++});
  var m=document.getElementById('rkMore');if(m)m.hidden=!!q||RKN>=n;var z=document.getElementById('rkNone');if(z)z.hidden=shown>0}
function intro(){var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=root.querySelectorAll('.rv');if(rm||!('IntersectionObserver' in window)){els.forEach(function(x){x.classList.add('in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(x){io.observe(x)});
  root.querySelectorAll('[data-count]').forEach(function(b){var to=+b.getAttribute('data-count');if(!(to>0))return;var t0=null,d=900;
    var f=function(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/d),v=Math.round(to*(1-Math.pow(1-k,3)));b.textContent=v.toLocaleString('es-CO');if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function moreBtn(k,n,lim,txt){if(n<=lim)return '';return '<button type="button" class="btn more" data-more="'+k+'">'+(OPEN[k]?'Ver menos':txt+' ('+n+')')+'</button>'}
function keepRender(){var y=window.scrollY;render();window.scrollTo(0,y)}
function typing(){var f=document.getElementById('insF');if(!f)return false;return [].some.call(f.elements,function(e){return (e.type==='checkbox'||e.type==='radio')?e.checked:!!e.value})}
/* ---------- pago en línea (Wompi) ---------- */
function newRef(){var a=new Uint8Array(10);crypto.getRandomValues(a);return 'CT'+C.edicionActual+'-'+Array.prototype.map.call(a,function(b){return ('0'+b.toString(16)).slice(-2)}).join('')}
function saveSent(){try{sessionStorage.setItem('ct_ins',JSON.stringify(insSent))}catch(e){}}
function metodoTxt(m){return {CARD:'Tarjeta',NEQUI:'Nequi',PSE:'PSE',BANCOLOMBIA_TRANSFER:'Bancolombia',BANCOLOMBIA_QR:'QR Bancolombia',BANCOLOMBIA_COLLECT:'Bancolombia',DAVIPLATA:'Daviplata'}[m]||m}
function estadoTxt(e){return {DECLINED:'Pago rechazado',ERROR:'Error en el pago',VOIDED:'Pago anulado',PENDING:'Pago en proceso',MONTO_INCORRECTO:'Pagó un valor distinto'}[e]||e}
function loadWompi(){return new Promise(function(res,rej){if(window.WidgetCheckout)return res();var x=document.createElement('script');x.src='https://checkout.wompi.co/widget.js';x.onload=function(){res()};x.onerror=function(){rej(new Error('widget'))};document.head.appendChild(x)})}
function pagar(){
  if(!insSent||!insSent.ref||!C.wompiPublicKey)return;
  var m=document.getElementById('payMsg'),b=document.getElementById('payBtn'),say=function(t,e){if(m){m.className='insmsg'+(e?' err':'');m.textContent=t}};
  if(b)b.disabled=true;say('Preparando el pago…');
  Promise.all([loadWompi(),fetch('/api/firma',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({referencia:insSent.ref})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw j;return j})})]).then(function(x){
    var f=x[1],cd={email:insSent.correo,fullName:insSent.n},tel=String(insSent.tel||'').replace(/\D/g,'');
    if(tel.length===10){cd.phoneNumber=tel;cd.phoneNumberPrefix='+57'}
    var w=new WidgetCheckout({currency:f.currency,amountInCents:f.amountInCents,reference:insSent.ref,publicKey:C.wompiPublicKey,signature:{integrity:f.integrity},redirectUrl:location.origin+'/?pago='+insSent.ref,customerData:cd});
    if(b)b.disabled=false;say('');
    w.open(function(res){var t=res&&res.transaction;if(!t)return;
      if(t.status==='APPROVED'){say('Pago aprobado. Confirmando tu cupo…');checkPago(insSent.ref,8)}
      else if(t.status==='DECLINED'||t.status==='ERROR'||t.status==='VOIDED')say('El pago no se aprobó. Puedes intentarlo de nuevo.',true);
      else{say('Tu pago está en proceso. Te avisamos aquí apenas se apruebe.');checkPago(insSent.ref,12)}});
  }).catch(function(e){if(b)b.disabled=false;
    if(e&&e.error==='ya_pago'){insSent.paid=true;saveSent();keepRender();return}
    say('No se pudo abrir el pago. Inténtalo de nuevo en un momento.',true)});
}
function checkPago(ref,tries){
  var again=function(){if(tries>1)setTimeout(function(){checkPago(ref,tries-1)},5000)};
  fetch('/api/estado?ref='+encodeURIComponent(ref)).then(function(r){return r.json()}).then(function(j){
    if(j&&j.pagado){if(insSent&&insSent.ref===ref){insSent.paid=true;saveSent()}if(canOrg)loadIns();keepRender();toast('¡Pago confirmado! Tu cupo está asegurado.',4000)}else again()}).catch(again);
}
function loginSheet(){
  sheet('<h3>Acceso organizador</h3><form id="lgF" class="lgf"><label>Correo<input name="e" type="email" autocomplete="username" required></label><label>Contraseña<input name="p" type="password" autocomplete="current-password" required></label><div class="err" id="lgErr" aria-live="polite"></div><div class="acts"><button type="button" class="btn" data-x>Cancelar</button><button class="btn primary" type="submit">Entrar</button></div></form>',function(s,close){
    var f=s.querySelector('#lgF'),er=s.querySelector('#lgErr');f.e.focus();
    f.onsubmit=function(ev){ev.preventDefault();er.textContent='Entrando…';
      DB.login(f.e.value.trim(),f.p.value).then(function(email){
        if(email!==String(C.adminEmail).toLowerCase()){er.textContent='Esta cuenta no es de organizador.';DB.logout();return}
        close();canOrg=true;orgOn=true;LS.set('ct2_org','1');INSROWS=null;loadIns();keepRender();toast('Sesión iniciada',2500);
      }).catch(function(){er.textContent='Correo o contraseña incorrectos.'})};
  });
}

/* ---------- ficha del jugador ---------- */
function ficha(p){
  var E=eloRun(), in1=E1.R.hasOwnProperty(p), in2=ELO.hasOwnProperty(p), out2=FX.eloOut[p]!=null;
  if(!in1&&!in2&&!out2)return;
  var rt=recTot(p);
  var li=function(lab,riv,my,th,w,ed,pend){return '<li><span>'+lab+'<br>vs '+riv+'</span><span class="'+(pend?'':(my>th?'w':'l'))+'">'+(pend?pend:my+'-'+th+(w?' W.O.':'')+(ed!=null?'<br><small>Elo '+sgn(ed,1)+'</small>':''))+'</span></li>'};
  var rows1=in1?P1D.r.filter(function(m){return m[2]===p||m[3]===p}).map(function(m){var isA=m[2]===p,ed=E1.md[m[0]];return li('<strong>'+R1N[m[1]]+'</strong> · '+m[0],nm1(isA?m[3]:m[2]),isA?m[4]:m[5],isA?m[5]:m[4],wo1(m),ed?(isA?ed.a:ed.b):null)}).join(''):'';
  var rows2='';
  if(in2){var ids=[];S.forEach(function(m){if(m[3]===p||m[4]===p)ids.push('L'+m[0])});
    if(ST.close)Object.keys(KOBY).forEach(function(k){var pp=players(k);if(pp[0]===p||pp[1]===p)ids.push(k)});
    rows2=ids.map(function(id){var pp=players(id),r=ST.r[id],isA=pp[0]===p,riv=isA?pp[1]:pp[0],old=id[0]==='L'&&d1(S[+id.slice(1)-1]),ed=(FX.reps[p]&&old)?null:E.md[id];
      return li('<strong>'+labelOf(id)+'</strong>'+(old?' · 25 oct':''),riv?nm(riv):'<em>por definir</em>',r?(isA?r.a:r.b):0,r?(isA?r.b:r.a):0,r&&r.wo,ed?(isA?ed.a:ed.b):null,r?null:'Por jugar')}).join('')}
  else if(out2){var rp=Object.keys(FX.reps).filter(function(k){return FX.reps[k]===p})[0];
    rows2=S.filter(function(m){return d1(m)&&(m[3]===rp||m[4]===rp)}).map(function(m){var id='L'+m[0],r=ST.r[id];if(!r)return '';var isA=m[3]===rp,ed=E.md[id];return li('<strong>'+labelOf(id)+'</strong> · 25 oct',nm(isA?m[4]:m[3]),isA?r.a:r.b,isA?r.b:r.a,r.wo,ed?(isA?ed.a:ed.b):null)}).join('')+'<li><span>Cedió su cupo a '+nm1(rp)+' para el 1 de noviembre</span><span></span></li>'}
  var s1=in1?stage1(p):'—', s2=in2?stage2(p):(out2?'Cedió su cupo':'—');
  sheet('<h3>'+esc(p)+'</h3>'+
    '<div class="fstats"><div><small>Elo</small><b>'+f2(cElo(E,p))+'</b></div><div><small>Récord total</small><b>'+rt[0]+'-'+rt[1]+'</b></div><div><small>1ra Edición</small><b style="font-size:17px">'+s1+'</b></div><div><small>2da Edición</small><b style="font-size:17px">'+s2+'</b></div></div>'+
    '<p class="sub" style="margin:0">'+(SEED[p]?'Cabeza de serie '+SEED[p]+' en la 2da Edición. ':'')+(FX.reps[p]?'En la 2da Edición reemplazó a <strong>'+esc(FX.reps[p])+'</strong> y heredó su resultado del 25 de octubre. ':'')+'Los W.O. no cuentan para el récord ni para el Elo.</p>'+
    (rows1?'<h4 class="fh">1ra Edición · 20 sep</h4><ul class="flist">'+rows1+'</ul>':'')+(rows2?'<h4 class="fh">2da Edición · 1 nov</h4><ul class="flist">'+rows2+'</ul>':'')+
    '<div class="acts"><span></span><button class="btn" data-x>Cerrar</button></div>',function(){});
}

/* ---------- interactions ---------- */
function applyTab(){
  root.querySelectorAll('main section[id]').forEach(function(s){s.hidden=(TABOF[s.id]||'inicio')!==tab});
  var top=['inicio','liga','tabla','info'].indexOf(tab)>=0?'inicio':tab;
  root.querySelectorAll('.tabs .main [data-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.getAttribute('data-tab')===top))});
  root.querySelectorAll('.tabs .subtabs [data-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.getAttribute('data-tab')===tab))});
  var st=root.querySelector('.tabs .subtabs');if(st)st.hidden=top!=='inicio';
}
function setTab(t,scroll){tab=t;LS.set('ct_tab',t);applyTab();if(scroll){var n=root.querySelector('.tabs');if(n&&window.scrollY>n.offsetTop)window.scrollTo(0,n.offsetTop)}}
function bind(){
  applyTab();
  root.querySelectorAll('[data-copy]').forEach(function(b){b.onclick=function(){var v=b.getAttribute('data-copy'),ok=function(){b.textContent='Copiado';setTimeout(function(){b.textContent='Copiar'},1500)};if(navigator.clipboard)navigator.clipboard.writeText(v).then(ok,function(){toast(v,4000)});else toast(v,4000)}});
  var oi=document.getElementById('openIns');if(oi)oi.onclick=function(){if(insSent){insSent=null;try{sessionStorage.removeItem('ct_ins')}catch(e){}INSOPEN=true}else INSOPEN=!INSOPEN;keepRender();if(INSOPEN){var f=document.getElementById('inscripcion');if(f){f.scrollIntoView({block:'start',behavior:smooth()});var n=f.querySelector('input[name=nombre]');if(n)setTimeout(function(){n.focus({preventScroll:true})},350)}}};
  root.querySelectorAll('[data-more]').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-more');OPEN[k]=!OPEN[k];var w=b.previousElementSibling;if(w&&w.classList.contains('clip'))w.classList.toggle('open',!!OPEN[k]);var y=b.getBoundingClientRect().top;keepRender();if(!OPEN[k]){var s=b.closest('section');if(s)s.scrollIntoView({block:'start'})}}});
  root.querySelectorAll('details[data-acc]').forEach(function(d){d.addEventListener('toggle',function(){OPEN[d.getAttribute('data-acc')]=d.open})});
  var rq=document.getElementById('rkq');if(rq){rq.oninput=function(){RKQ=rq.value;applyRk()};applyRk()}
  var rm=document.getElementById('rkMore');if(rm)rm.onclick=function(){RKN+=20;applyRk()};
  var car=document.getElementById('car');if(car){var dots=root.querySelectorAll('.cdots i');
    var step=function(){var c=car.querySelector('.hl');return c?c.getBoundingClientRect().width+12:300};
    root.querySelectorAll('[data-car]').forEach(function(b){b.onclick=function(){car.scrollBy({left:step()*+b.getAttribute('data-car'),behavior:smooth()})}});
    car.addEventListener('scroll',function(){var i=Math.round(car.scrollLeft/step());dots.forEach(function(d,k){d.className=k===i?'on':''})},{passive:true})}
  if(FIRST){FIRST=false;intro()}else root.querySelectorAll('.rv').forEach(function(x){x.classList.add('in')});
  root.querySelectorAll('.tabs [data-tab]').forEach(function(b){b.onclick=function(){setTab(b.getAttribute('data-tab'),true)}});
  root.querySelectorAll('[data-go]').forEach(function(b){b.onclick=function(){setTab(b.getAttribute('data-go'),true);if(b.hasAttribute('data-top')){var x=document.getElementById('proxima');if(x)x.scrollIntoView({block:'start'})}}});
  var insF=document.getElementById('insF');if(insF)insF.onsubmit=function(ev){ev.preventDefault();
    var f=insF,m=document.getElementById('insMsg'),b=document.getElementById('insBtn'),ce=f.querySelector('input[name=categoria]:checked');
    var d={nombre:f.nombre.value.replace(/\s+/g,' ').trim(),correo:f.correo.value.trim().toLowerCase(),telefono:f.telefono.value.trim(),edad:parseInt(f.edad.value,10),categoria:ce?ce.value:''};
    var bad=function(t){m.className='insmsg err';m.textContent=t};
    if(d.nombre.length<5||d.nombre.indexOf(' ')<0)return bad('Escribe tu nombre y apellido.');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.correo))return bad('Revisa tu correo.');
    if(!/^[0-9+ ()-]{7,20}$/.test(d.telefono)||d.telefono.replace(/\D/g,'').length<7)return bad('Revisa tu número de teléfono.');
    if(isNaN(d.edad)||d.edad<8||d.edad>99)return bad('Escribe tu edad.');
    if(!d.categoria)return bad('Escoge tu categoría.');
    if(!f.acepto.checked)return bad('Para inscribirte debes autorizar el uso de tus datos.');
    b.disabled=true;m.className='insmsg';m.textContent='Enviando…';
    d.referencia=C.wompiPublicKey?newRef():null;
    DB.inscribir(d).then(function(){insSent={n:d.nombre,c:d.categoria,ref:d.referencia,correo:d.correo,tel:d.telefono};saveSent();if(canOrg)loadIns();render();var x=document.getElementById('inscripcion');if(x)x.scrollIntoView({block:'start'});if(document.getElementById('payBtn'))pagar()})
    .catch(function(e){b.disabled=false;var t=String(e&&e.message||'');
      if(e&&e.code==='23505')return bad('Ese correo ya está inscrito en esta edición.');
      if(/cupo_lleno/.test(t)){DB.llenas().then(function(x){LLENAS=x||{}});return bad('Esa categoría se acaba de llenar.')}
      if(/inscripciones_cerradas/.test(t))return bad('Las inscripciones están cerradas.');
      bad('No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.')})};
  var pb=document.getElementById('payBtn');if(pb)pb.onclick=pagar;
  var ia=document.getElementById('insAgain');if(ia)ia.onclick=function(){insSent=null;INSOPEN=true;try{sessionStorage.removeItem('ct_ins')}catch(e){}keepRender()};
  root.querySelectorAll('[data-insf]').forEach(function(b){b.onclick=function(){insFilter=b.getAttribute('data-insf');keepRender()}});
  root.querySelectorAll('[data-pay]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-pay'),r=INSROWS.filter(function(x){return x.id===id})[0];if(!r)return;b.disabled=true;
    DB.setPagado(id,!r.pagado).then(function(){r.pagado=!r.pagado;keepRender();toast(r.pagado?'Pago confirmado: '+r.nombre:'Pago quitado: '+r.nombre,2500)}).catch(function(){b.disabled=false;toast('No se pudo guardar el pago.',5000)})}});
  root.querySelectorAll('[data-idel]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-idel'),r=INSROWS.filter(function(x){return x.id===id})[0];if(!r)return;
    sheet('<h3>Borrar inscripción</h3><p class="sub" style="margin:0">¿Borrar la inscripción de <strong>'+esc(r.nombre)+'</strong> ('+esc(catName(r.categoria))+' categoría)? Esto no se puede deshacer.</p><div class="acts"><button class="btn" data-x>Cancelar</button><button class="btn primary" id="okd">Borrar</button></div>',function(s,close){s.querySelector('#okd').onclick=function(){
      DB.borrar(id).then(function(){INSROWS=INSROWS.filter(function(x){return x.id!==id});close();keepRender();toast('Inscripción borrada',2500)}).catch(function(){toast('No se pudo borrar.',5000)})}})}});
  var cs=document.getElementById('cfgSave');if(cs)cs.onclick=function(){var c=parseInt(document.getElementById('cfgCupo').value,10),o=document.getElementById('cfgOpen').value==='1',er=document.getElementById('cfgErr');
    if(isNaN(c)||c<0){er.textContent='Escribe un número de cupos válido.';return}
    DB.setConfig(c,o).then(function(){INSCFG={edicion:C.edicionActual,cupo:c,abiertas:o};return DB.llenas()}).then(function(x){LLENAS=x||{};keepRender();toast('Inscripciones actualizadas',2500)}).catch(function(){er.textContent='No se pudo guardar.'})};
  var cv=document.getElementById('insCsv');if(cv)cv.onclick=function(){var q=function(v){v=String(v==null?'':v);return /[",;\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
    var rows=[['Nombre','Categoría','Correo','Teléfono','Edad','Pagó','Medio de pago','Referencia','Fecha de inscripción']].concat(INSROWS.map(function(r){return [r.nombre,catName(r.categoria),r.correo,r.telefono,r.edad,r.pagado?'Sí':'No',r.pago_metodo?metodoTxt(r.pago_metodo):(r.pagado?'Manual':''),r.referencia||'',fdate(r.created_at)]}));
    var blob=new Blob(['﻿'+rows.map(function(r){return r.map(q).join(';')}).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download='inscritos-3ra-edicion.csv';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
  var ir=document.getElementById('insReload');if(ir)ir.onclick=function(){INSROWS=null;keepRender();loadIns()};
  var lg=document.getElementById('orgLogin');if(lg)lg.onclick=loginSheet;
  var lo=document.getElementById('orgOut');if(lo)lo.onclick=function(){DB.logout().then(function(){canOrg=false;orgOn=false;INSROWS=null;keepRender();toast('Sesión cerrada',2500)})};
  root.querySelectorAll('a[href^="#"]').forEach(function(l){var id=l.getAttribute('href').slice(1);if(TABOF[id])l.addEventListener('click',function(){setTab(TABOF[id],false)})});
  var q=document.getElementById('q');
  if(q){q.addEventListener('change',pick);q.addEventListener('input',function(){var v=q.value;if(ELO.hasOwnProperty(v))pick();else{var hits=PLAYERS.filter(function(p){return norm(p).indexOf(norm(v))>=0});document.getElementById('qmsg').textContent=v.length<2?'Elige tu nombre de la lista y la página lo recordará en este celular.':(hits.length?hits.length+' coincidencias: elige la tuya de la lista.':'No encontramos ese nombre. Prueba con tu apellido.')}})}
  function pick(){var v=q.value;var hit=PLAYERS.filter(function(p){return norm(p)===norm(v)})[0];if(hit){me=hit;LS.set('ct2_me',me);render();var el=document.getElementById('mis');if(el)el.scrollIntoView({block:'start'})}}
  var chg=document.getElementById('chg');if(chg)chg.onclick=function(){me=null;LS.set('ct2_me','');render();var x=document.getElementById('q');if(x)x.focus()};
  var sw=document.getElementById('orgsw');if(sw)sw.onchange=function(){orgOn=sw.checked;LS.set('ct2_org',orgOn?'1':'0');render()};
  root.querySelectorAll('[data-start]').forEach(function(el){el.onclick=function(){var id=el.dataset.start,n=nowBog();if(!n)return;var prev=JSON.stringify(ST);ST.t[id]=Object.assign({},ST.t[id]||{},{s:hhmm(n.m)});save(prev,'Inicio registrado: '+labelOf(id))}});
  root.querySelectorAll('[data-unstart]').forEach(function(el){el.onclick=function(){var id=el.dataset.unstart,prev=JSON.stringify(ST);if(ST.t[id]){delete ST.t[id].s;if(!ST.t[id].e)delete ST.t[id]}save(prev,'Inicio deshecho: '+labelOf(id))}});
  var rg=document.getElementById('repGo');if(rg)rg.onclick=function(){
    var o=document.getElementById('repOld').value,n=document.getElementById('repNew').value.replace(/\s+/g,' ').trim(),e=parseFloat(String(document.getElementById('repElo').value).replace(',','.')),er=document.getElementById('repErr');
    if(!o){er.textContent='Elige el jugador que no puede venir.';return}
    if(n.length<3){er.textContent='Escribe el nombre del reemplazo.';return}
    if(ALLP().some(function(p){return norm(p)===norm(n)})){er.textContent='Ese nombre ya está en el torneo.';return}
    if(isNaN(e))e=1000;
    sheet('<h3>Confirmar reemplazo</h3><p class="sub" style="margin:0"><strong>'+esc(n)+'</strong> toma el cupo de <strong>'+esc(o)+'</strong>: hereda su resultado del 25 de octubre y juega sus partidos del 1 de noviembre. '+esc(o)+' sale de la tabla.</p><div class="acts"><button class="btn" data-x>Cancelar</button><button class="btn primary" id="okr">Confirmar</button></div>',function(s){s.querySelector('#okr').onclick=function(){
      var prev=JSON.stringify(ST),pfx=JSON.stringify(FX);
      S.forEach(function(m){if(m[3]===o)m[3]=n;if(m[4]===o)m[4]=n});
      FX.eloOut[o]=ELO[o];var ne={};Object.keys(ELO).forEach(function(k){ne[k===o?n:k]=k===o?Math.round(e*100)/100:ELO[k]});FX.elo=ELO=ne;
      if(!FX.seedOut)FX.seedOut={};if(SEED[o]){FX.seedOut[o]=SEED[o];delete SEED[o]}FX.reps[n]=o;PLAYERS=Object.keys(ELO);
      if(ST.here[o]){delete ST.here[o]}
      save(prev,'Reemplazo hecho: '+n+' por '+o,pfx)}})};
  root.querySelectorAll('[data-unrep]').forEach(function(el){el.onclick=function(){var n=el.dataset.unrep,o=FX.reps[n];
    if(S.some(function(m){return (m[3]===n||m[4]===n)&&!d1(m)&&ST.r['L'+m[0]]})){toast('No se puede deshacer: '+n+' ya tiene resultados del 1 de noviembre. Bórralos primero.',6000);return}
    var prev=JSON.stringify(ST),pfx=JSON.stringify(FX);
    S.forEach(function(m){if(m[3]===n)m[3]=o;if(m[4]===n)m[4]=o});
    var ne={};Object.keys(ELO).forEach(function(k){ne[k===n?o:k]=k===n?FX.eloOut[o]:ELO[k]});FX.elo=ELO=ne;delete FX.eloOut[o];if(FX.seedOut&&FX.seedOut[o]){SEED[o]=FX.seedOut[o];delete FX.seedOut[o]}delete FX.reps[n];PLAYERS=Object.keys(ELO);
    if(ST.here[n])delete ST.here[n];
    save(prev,'Reemplazo deshecho',pfx)}});
  root.querySelectorAll('[data-pend]').forEach(function(el){el.onclick=function(){openEditor(el.getAttribute('data-pend'))}});
  var mp=document.getElementById('morePend');if(mp)mp.onclick=function(){var y=window.scrollY;showAllPend=!showAllPend;render();window.scrollTo(0,y)};
  root.querySelectorAll('.edit[data-id]').forEach(function(el){el.onclick=function(){openEditor(el.dataset.id)}});
  root.querySelectorAll('.pn').forEach(function(el){el.setAttribute('tabindex','0');el.setAttribute('role','button')});
  var cl=document.getElementById('closeL');if(cl)cl.onclick=function(){var pend=44-ligaDone();
    var TL=table(),cuts=[];[6,26].forEach(function(c){var u=TL[c-1],v=TL[c];if(u&&v&&u.pg===v.pg&&u.dif===v.dif&&u.pf===v.pf&&u.pc===v.pc)cuts.push(esc(u.p)+' y '+esc(v.p)+' (puestos '+c+' y '+(c+1)+')')});
    sheet('<h3>Cerrar liga</h3>'+(cuts.length?'<div class="palert">Empate sin resolver en un corte: '+cuts.join('; ')+'. Defínelo antes de cerrar; la página los ordena alfabéticamente.</div>':'')+'<p class="sub" style="margin:0">'+(pend?'Faltan '+pend+' resultados de liga. Si cierras ahora, el cuadro se arma con la tabla actual.':'Están los 44 resultados.')+' La clasificación queda fija y se arma el cuadro de eliminatoria.</p><div class="acts"><button class="btn" data-x>Cancelar</button><button class="btn primary" id="okc">Cerrar liga</button></div>',function(s){s.querySelector('#okc').onclick=function(){var prev=JSON.stringify(ST);ST.close=table().map(function(x){return x.p});save(prev,'Liga cerrada')}})};
  var ro=document.getElementById('reopen');if(ro)ro.onclick=function(){var prev=JSON.stringify(ST);ST.close=null;save(prev,'Liga reabierta')};
  root.querySelectorAll('[data-here]').forEach(function(el){el.onchange=function(){var y=window.scrollY;draftHere=draftHere||JSON.parse(JSON.stringify(ST.here));if(el.checked)draftHere[el.dataset.here]=1;else delete draftHere[el.dataset.here];render();window.scrollTo(0,y)}});
  var sh=document.getElementById('saveHere');if(sh)sh.onclick=function(){var prev=JSON.stringify(ST);ST.here=draftHere;draftHere=null;save(prev,'Asistencia guardada')};
  var ch=document.getElementById('clearHere');if(ch)ch.onclick=function(){var y=window.scrollY;draftHere={};render();window.scrollTo(0,y)};
  var uh=document.getElementById('undoHere');if(uh)uh.onclick=function(){var y=window.scrollY;draftHere=null;render();window.scrollTo(0,y)};
}
root.addEventListener('click',function(e){var el=e.target.closest('[data-p]');if(!el)return;if(el.closest('.edit'))return;e.preventDefault();ficha(el.getAttribute('data-p'))});
root.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('pn')&&!e.target.closest('.edit')){e.preventDefault();ficha(e.target.getAttribute('data-p'))}});
function sheet(inner,setup){
  var d=document.createElement('div');d.className='modal';d.innerHTML='<div class="sheet" role="dialog" aria-modal="true">'+inner+'</div>';
  document.body.appendChild(d);
  var close=function(){d.remove()};d.addEventListener('click',function(e){if(e.target===d||e.target.hasAttribute('data-x'))close()});
  d.addEventListener('click',function(e){var el=e.target.closest('.pn');if(el){close();ficha(el.getAttribute('data-p'))}});
  document.addEventListener('keydown',function k(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',k)}});
  setup(d.querySelector('.sheet'),close);
}
function openEditor(id){
  var p=players(id),pa=p[0],pb=p[1],title=labelOf(id);
  var r=ST.r[id]||{};
  /* liga: 21 puntos en total. 16vos a semis: gana el primero en llegar a 11. Final: el primero en llegar a 21 */
  var LG=id[0]==='L', T=id==='F'?21:11, W=LG?11:T;
  sheet('<h3>'+esc(title)+'</h3><div class="who">'+(LG?'21 puntos en total':'Gana el primero en llegar a '+T)+' · W.O. = '+W+'-0'+(parcOf(id)?' · Iba '+parcOf(id)[0]+'-'+parcOf(id)[1]+' cuando paró por lluvia; carga el marcador final':'')+'</div>'+
   '<div class="score"><label for="sa">'+esc(pa)+'</label><input id="sa" type="number" inputmode="numeric" min="0" max="'+(LG?21:T)+'" value="'+(r.a!=null?r.a:'')+'"></div>'+
   '<div class="score"><label for="sb">'+esc(pb)+'</label><input id="sb" type="number" inputmode="numeric" min="0" max="'+(LG?21:T)+'" value="'+(r.b!=null?r.b:'')+'"></div>'+
   '<div class="wob"><button class="btn" id="woa">W.O. gana '+esc(pa.split(' ')[0])+'</button><button class="btn" id="wob">W.O. gana '+esc(pb.split(' ')[0])+'</button></div>'+
   '<div class="tms"><label>Empezó<input id="ts" type="time" value="'+((ST.t[id]||{}).s||'')+'"></label><label>Terminó<input id="te" type="time" value="'+((ST.t[id]||{}).e||(nowBog()&&!r.a&&r.a!==0?hhmm(nowBog().m):''))+'"></label></div>'+
   '<div class="err" id="err" aria-live="polite"></div>'+
   '<div class="acts">'+(ST.r[id]?'<button class="btn danger" id="del">Borrar resultado</button>':'<button class="btn" data-x>Cancelar</button>')+'<button class="btn primary" id="ok">Guardar</button></div>',
  function(s){
    var a=s.querySelector('#sa'),b=s.querySelector('#sb'),err=s.querySelector('#err'),wo=!!r.wo;
    a.focus();
    a.oninput=function(){wo=false;var v=parseInt(a.value,10);if(LG&&!isNaN(v)&&v>=0&&v<=21)b.value=21-v};
    b.oninput=function(){wo=false;var v=parseInt(b.value,10);if(LG&&!isNaN(v)&&v>=0&&v<=21)a.value=21-v};
    s.querySelector('#woa').onclick=function(){a.value=W;b.value=0;wo=true;err.textContent='W.O.: '+W+'-0 para '+pa+'. Toca Guardar.'};
    s.querySelector('#wob').onclick=function(){a.value=0;b.value=W;wo=true;err.textContent='W.O.: '+W+'-0 para '+pb+'. Toca Guardar.'};
    var del=s.querySelector('#del');if(del)del.onclick=function(){
      if(id[0]==='L'&&ST.close){err.textContent='La liga ya está cerrada. Reábrela para cambiar resultados de liga.';return}
      if(dependsOn(id)){err.textContent='Primero borra los resultados de la siguiente ronda que dependen de este partido.';return}
      var prev=JSON.stringify(ST);delete ST.r[id];save(prev,'Resultado borrado')};
    s.querySelector('#ok').onclick=function(){
      var x=parseInt(a.value,10),y=parseInt(b.value,10);
      if(isNaN(x)||isNaN(y)){err.textContent='Escribe los puntos de los dos jugadores.';return}
      var isWo=wo&&((x===W&&y===0)||(x===0&&y===W));
      if(!isWo&&!LG&&!((x===T&&y>=0&&y<T)||(y===T&&x>=0&&x<T))){err.textContent='Gana el primero en llegar a '+T+': uno debe tener '+T+' y el otro entre 0 y '+(T-1)+' (por ejemplo '+T+'-'+(T-4)+').';return}
      if(!isWo&&LG&&x+y!==21){err.textContent='Los puntos deben sumar 21 (van '+(x+y)+'). Si fue W.O., usa los botones de W.O.';return}
      if(id[0]==='L'&&ST.close){err.textContent='La liga ya está cerrada. Reábrela para cambiar resultados de liga.';return}
      if(ST.r[id]&&dependsOn(id)&&((ST.r[id].a>ST.r[id].b)!==(x>y))){err.textContent='Cambiaría el ganador y ya hay resultados en la ronda siguiente. Bórralos primero.';return}
      var prev=JSON.stringify(ST);ST.r[id]={a:x,b:y};if(isWo)ST.r[id].wo=1;var tsv=s.querySelector('#ts').value,tev=s.querySelector('#te').value;if(tsv||tev){ST.t[id]={};if(tsv)ST.t[id].s=tsv;if(tev)ST.t[id].e=tev}else delete ST.t[id];save(prev,'Resultado guardado');
    };
  });
}
function dependsOn(id){var dep=false;Object.keys(KOBY).forEach(function(k){var x=KOBY[k];if((x.a===id||x.b===id)&&ST.r[k])dep=true});return dep}

/* ---------- guardar en la base de datos ---------- */
function fxOut(){var o={};Object.keys(FX).forEach(function(k){if(k!=='logo')o[k]=FX[k]});return o}
function toast(t,ms){var o=document.querySelector('.toast');if(o)o.remove();var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);if(ms!==0)setTimeout(function(){d.remove()},ms||4000)}
function save(prev,msg,prevFX){
  if(busy)return;busy=true;
  document.querySelectorAll('.modal').forEach(function(m){m.remove()});
  ST.at=new Date().toISOString();
  keepRender();toast('Guardando…',0);
  var rows=[{key:'st',value:ST}];if(prevFX||!window.__SEEDED)rows.push({key:'fx',value:fxOut()});
  DB.saveKV(rows).then(function(){busy=false;window.__SEEDED=true;keepRender();toast(msg,2500)}).catch(function(e){
    busy=false;ST=JSON.parse(prev);if(prevFX){var o=JSON.parse(prevFX);Object.keys(o).forEach(function(k){FX[k]=o[k]});S=FX.s;ELO=FX.elo;SEED=FX.seed;PLAYERS=Object.keys(ELO)}
    keepRender();
    toast(/jwt|auth|permission|row-level|security/i.test(String(e&&e.message))?'Tu sesión expiró o no tienes permiso. Vuelve a entrar como organizador.':'No se pudo guardar. Revisa la conexión e inténtalo de nuevo.',6000);
  });
}

/* ---------- boot ---------- */
render();
var sy=SS.get('ct2_scroll'), sm=SS.get('ct2_msg');
if(sy){SS.del('ct2_scroll');window.scrollTo(0,+sy)} if(sm){SS.del('ct2_msg');toast(sm,2500)}
window.__applyST=function(st){if(!st||JSON.stringify(st)===JSON.stringify(ST))return;ST=st;if(!ST.r)ST.r={};if(!ST.here)ST.here={};if(!ST.t)ST.t={};if(!typing()&&!document.querySelector('.modal'))keepRender()};
setInterval(function(){var ae=document.activeElement;if(document.querySelector('.modal')||busy||draftHere||(ae&&(ae.tagName==='INPUT'||ae.tagName==='SELECT'))||typing())return;
  DB.loadKV(['st']).then(function(kv){if(kv.st&&JSON.stringify(kv.st)!==JSON.stringify(ST)){ST=kv.st;if(!ST.r)ST.r={};if(!ST.here)ST.here={};if(!ST.t)ST.t={}}keepRender()})},60000);
loadPublic();
(function(){try{var q=new URLSearchParams(location.search),ref=q.get('pago');if(ref){history.replaceState(null,'',location.pathname);toast('Verificando tu pago…',3000);checkPago(ref,8)}}catch(e){}})();
DB.sessionEmail().then(function(e){if(e&&e===String(C.adminEmail).toLowerCase()){canOrg=true;loadIns();keepRender()}});
};
