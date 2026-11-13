// Genera las imágenes de una publicación a partir de su post.json.
// Uso: node instagram/render.js instagram/posts/<carpeta>
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');

const C = {navy:'#1F3B5C', logoBg:'#122A4E', azul:'#A9C8E8', rosa:'#F3C6D3', blanco:'#FAF7F6', gris:'#33506F'};
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.resolve(__dirname, '..', 'icono.png')).toString('base64');
const USER = '@paulacabrera.training';
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
const marca = (t, r) => r ? esc(t).replace(esc(r), `<span class="hl">${esc(r)}</span>`) : esc(t);

const css = (W,H) => `*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;font-family:'Inter Display','Inter',sans-serif;overflow:hidden}
.s{width:${W}px;height:${H}px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:${H>1500?'260px':'110px'} 96px}
.dark{background:${C.logoBg};color:${C.blanco}} .light{background:${C.blanco};color:${C.navy}}
.stripe{position:absolute;transform:rotate(32deg)}
.foot{position:absolute;left:96px;right:96px;bottom:${H>1500?'200px':'56px'};display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:600;opacity:.85}
.foot img{width:64px;height:64px;border-radius:14px}
.u{display:flex;align-items:center;gap:18px}
h1{font-weight:900;font-size:124px;line-height:.95;letter-spacing:-2px;text-transform:uppercase}
h2{font-weight:800;font-size:76px;line-height:1.02;letter-spacing:-1px;margin-bottom:44px}
.hl{color:${C.rosa}} .light .hl{color:${C.navy};background:linear-gradient(transparent 60%,${C.rosa} 60%)}
.sub{font-size:44px;font-weight:600;color:${C.azul};margin-top:48px;line-height:1.25}
.num{font-size:150px;font-weight:900;color:${C.rosa};line-height:1;margin-bottom:24px}
.txt{font-size:46px;line-height:1.38;color:${C.gris};font-weight:500} .txt strong{color:${C.navy};font-weight:800} .dark .txt strong{color:${C.rosa}}
.pts{display:flex;flex-direction:column;gap:34px}
.pt{display:flex;gap:28px;align-items:flex-start;font-size:46px;font-weight:600;line-height:1.25}
.pt svg{flex:none;margin-top:4px}
.pill{display:inline-block;margin-top:56px;background:${C.rosa};color:${C.navy};font-weight:800;font-size:40px;padding:26px 44px;border-radius:999px}
.logo{width:300px;height:300px;margin-bottom:56px}
.cierre{align-items:center;text-align:center}
.desliza{position:absolute;right:96px;bottom:150px;font-size:34px;font-weight:700;color:${C.rosa}}
.op{justify-content:flex-end;padding:110px 80px 170px}
.op.navy{background:${C.logoBg};color:${C.blanco}} .op.rosa{background:${C.rosa};color:${C.logoBg}} .op.azul{background:${C.azul};color:${C.logoBg}}
.op .big{position:absolute;right:50px;top:150px;font-weight:900;font-size:520px;line-height:.8;letter-spacing:-26px}
.op.navy .big{color:${C.gris}} .op.rosa .big{color:${C.blanco}} .op.azul .big{color:${C.blanco};opacity:.6}
.op .et{position:absolute;left:80px;top:90px;font-weight:800;font-size:32px;letter-spacing:2px;text-transform:uppercase;padding:14px 26px;border-radius:999px}
.op.navy .et{background:${C.rosa};color:${C.logoBg}} .op.rosa .et,.op.azul .et{background:${C.logoBg};color:${C.blanco}}
.op h2{font-weight:900;font-size:128px;line-height:.9;letter-spacing:-5px;text-transform:uppercase;margin:0 0 36px;position:relative}
.op.navy h2 .k{color:${C.rosa}} .op.rosa h2 .k,.op.azul h2 .k{color:${C.blanco};-webkit-text-stroke:3px ${C.logoBg}}
.op .tx{font-size:46px;line-height:1.3;font-weight:600;max-width:880px;position:relative}
.op .chips{display:flex;flex-wrap:wrap;gap:16px;margin-top:44px;position:relative}
.op .chip{font-size:34px;font-weight:800;padding:16px 28px;border-radius:999px;border:4px solid currentColor}
.op.navy .chip{border-color:${C.rosa};color:${C.rosa}}
.op .foot{opacity:.9}
.dm{background:${C.logoBg};color:${C.blanco};padding:110px 80px 170px;justify-content:center}
.dm .lg{width:120px;height:120px;border-radius:26px;margin-bottom:56px}
.dm h2{font-weight:900;font-size:118px;line-height:.9;letter-spacing:-4px;text-transform:uppercase;margin:0 0 36px}
.dm h2 .k{color:${C.rosa}}
.dm .tx{font-size:44px;line-height:1.3;font-weight:600;color:${C.azul};margin-bottom:70px}
.dm .lab{font-size:30px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.azul};margin-bottom:18px}
.dm .msg{display:flex;align-items:center;gap:24px;background:${C.blanco};border-radius:999px;padding:22px 22px 22px 48px}
.dm .msg b{flex:1;font-weight:900;font-size:66px;letter-spacing:2px;color:${C.logoBg}}
.dm .send{flex:none;width:104px;height:104px;border-radius:50%;background:${C.rosa};display:flex;align-items:center;justify-content:center}
.dm .rosa-band{position:absolute;right:-140px;top:-60px;width:420px;height:90px;background:${C.rosa};transform:rotate(32deg)}
.dm .azul-band{position:absolute;right:-170px;top:90px;width:420px;height:36px;background:${C.azul};transform:rotate(32deg)}
.pa{background:${C.rosa};color:${C.logoBg};padding:110px 80px 170px;justify-content:center}
.pa h2{font-weight:900;font-size:112px;line-height:.9;letter-spacing:-4px;text-transform:uppercase;margin:0 0 60px}
.pa h2 .k{color:${C.blanco};-webkit-text-stroke:3px ${C.logoBg}}
.pa .rows{display:flex;flex-direction:column;gap:24px}
.pa .row{display:flex;align-items:center;gap:32px;background:${C.logoBg};color:${C.blanco};border-radius:28px;padding:34px 40px}
.pa .n{flex:none;width:96px;height:96px;border-radius:50%;background:${C.rosa};color:${C.logoBg};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:52px}
.pa .row span{font-size:42px;font-weight:600;line-height:1.25} .pa .row strong{color:${C.rosa};font-weight:800}
.imp{background:${C.rosa};color:${C.logoBg};justify-content:flex-start;padding:90px 80px}
.imp .tag{align-self:flex-start;background:${C.logoBg};color:${C.rosa};font-weight:800;font-size:34px;padding:16px 28px;border-radius:12px;letter-spacing:1px;text-transform:uppercase}
.imp h1{color:${C.logoBg};margin-top:60px;line-height:.86;letter-spacing:-6px}
.imp .band{position:absolute;left:-60px;right:-60px;bottom:250px;transform:rotate(-6deg);background:${C.logoBg};color:${C.blanco};font-weight:900;font-size:64px;padding:30px 120px;text-transform:uppercase;letter-spacing:-1px}
.imp .band strong{color:${C.rosa}}
.sello{position:absolute;right:70px;bottom:70px;width:200px;height:200px;border-radius:50%;background:${C.blanco};color:${C.logoBg};display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:36px;line-height:1.05;transform:rotate(10deg);border:6px solid ${C.logoBg}}
.imp .foot,.preg .foot{color:${C.logoBg}} .imp .foot{right:320px}
.fot{background:${C.logoBg};justify-content:flex-end;padding:0 80px 150px}
.fot .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fot .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,42,78,0) 35%,rgba(18,42,78,.92) 68%,${C.logoBg} 100%)}
.fot .k{position:relative;align-self:flex-start;background:${C.rosa};color:${C.logoBg};font-weight:800;font-size:32px;padding:12px 24px;border-radius:10px;text-transform:uppercase}
.fot h1{position:relative;color:${C.blanco};font-size:150px;line-height:.9;letter-spacing:-6px;margin-top:28px}
.fot .foot{color:${C.blanco}}
.preg{background:${C.blanco};color:${C.logoBg}}
.preg .q{font-weight:800;font-size:96px;line-height:1.02;letter-spacing:-3px}
.preg .yes{font-weight:900;line-height:.8;letter-spacing:-20px;color:${C.rosa};margin-top:110px;-webkit-text-stroke:8px ${C.logoBg}}
.preg .why{font-size:46px;font-weight:600;color:${C.gris};margin-top:50px;line-height:1.3}
.preg .why strong{color:${C.logoBg};background:linear-gradient(transparent 60%,${C.rosa} 60%)}
.preg .desliza{color:${C.logoBg};bottom:56px;font-weight:900}
.mits{background:${C.logoBg};color:${C.blanco};justify-content:flex-start;padding:100px 80px}
.mits .tag{align-self:flex-start;background:${C.rosa};color:${C.logoBg};font-weight:800;font-size:34px;padding:14px 26px;border-radius:12px;letter-spacing:1px;text-transform:uppercase}
.mits .fr{margin-top:70px;display:flex;flex-direction:column;gap:26px}
.mits .fr div{font-weight:900;font-size:76px;line-height:1.02;letter-spacing:-2px;text-transform:uppercase;position:relative;align-self:flex-start}
.mits .fr div::after{content:'';position:absolute;left:-10px;right:-10px;top:50%;height:8px;background:${C.rosa};transform:rotate(-3deg)}
.mits .big{position:absolute;left:80px;bottom:150px;font-weight:900;font-size:120px;line-height:.9;letter-spacing:-4px;text-transform:uppercase;color:${C.azul}}
.mits .big strong{color:${C.rosa}}
.mits .foot{color:${C.blanco}}
.mito{padding:0;justify-content:flex-start;background:${C.logoBg}}
.mito .top{background:${C.rosa};color:${C.logoBg};padding:90px 80px 120px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%);min-height:560px;position:relative}
.mito .lab{display:inline-block;font-weight:900;font-size:34px;letter-spacing:2px;padding:12px 24px;border-radius:10px;text-transform:uppercase}
.mito .top .lab{background:${C.logoBg};color:${C.rosa}}
.mito .n{position:absolute;right:70px;top:50px;font-weight:900;font-size:110px;line-height:1;color:${C.logoBg};opacity:.25}
.mito .mt{margin-top:40px;font-weight:900;font-size:72px;line-height:1.05;letter-spacing:-2px}
.mito .mt span{text-decoration:line-through;text-decoration-thickness:5px;text-decoration-color:rgba(18,42,78,.55)}
.mito .bot{padding:30px 80px 0;color:${C.blanco}}
.mito .bot .lab{background:${C.azul};color:${C.logoBg}}
.mito .rt{margin-top:36px;font-size:50px;line-height:1.3;font-weight:600} .mito .rt strong{color:${C.rosa};font-weight:800}
.mito .src{margin-top:28px;font-size:28px;color:${C.azul};font-weight:600}
.mito .foot{color:${C.blanco}}`;

const check = `<svg width="56" height="56" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="${C.azul}"/><path d="M4.5 8.2l2.2 2.2 4.8-4.8" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rayas = `<div class="stripe" style="width:150px;height:900px;background:${C.rosa};right:-120px;top:-330px"></div>
<div class="stripe" style="width:60px;height:900px;background:${C.azul};right:-230px;top:-250px"></div>`;

let DIR = '.';
function slide(d, i, n, H){
  if(H>1500) n = 1; // historias: sin numeración ni «Desliza»
  const foot = (modo) => `<div class="foot"><span class="u"><img src="${LOGO}">${USER}</span><span>${n>1&&modo!=='sin'?`${i+1}/${n}`:''}</span></div>`;
  switch(d.tipo){
    case 'portada': return `<div class="s dark">${rayas}<h1 style="position:relative;max-width:760px">${marca(d.titulo,d.resaltado)}</h1>${d.sub?`<p class="sub">${md(d.sub)}</p>`:''}${n>1?'<span class="desliza">Desliza →</span>':''}${foot(1)}</div>`;
    case 'mitos': { // D · portada de mitos: frases tachadas en rosa sobre azul marino
      return `<div class="s mits">${d.etiqueta?`<span class="tag">${esc(d.etiqueta)}</span>`:''}<div class="fr">${(d.frases||[]).map(x=>`<div>${esc(x)}</div>`).join('')}</div><div class="big">${md(d.titulo)}</div>${n>1?'<span class="desliza">DESLIZA →</span>':''}${foot('sin')}</div>`; }
    case 'mito': { // mito arriba (rosa, tachado) · realidad abajo (azul marino)
      return `<div class="s mito"><div class="top">${d.num?`<div class="n">${esc(d.num)}</div>`:''}<span class="lab">Mito</span><div class="mt"><span>«${esc(d.mito)}»</span></div></div><div class="bot"><span class="lab">Realidad</span><div class="rt">${md(d.realidad)}</div>${d.fuente?`<div class="src">${esc(d.fuente)}</div>`:''}</div>${foot()}</div>`; }
    case 'impacto': { // A · fondo rosa, letra enorme, franja y sello
      const ls = d.lineas||[]; const maxL = Math.max(...ls.map(x=>x.length),1);
      const fl = Math.min(150, Math.floor(1530/maxL)), fg = Math.min(310, Math.floor(1350/(d.grande||'x').length));
      return `<div class="s imp">${d.etiqueta?`<span class="tag">${esc(d.etiqueta)}</span>`:''}<h1>${ls.map(x=>`<div style="font-size:${fl}px">${esc(x)}</div>`).join('')}<div style="font-size:${fg}px;letter-spacing:${-Math.round(fg*0.04)}px">${esc(d.grande)}</div></h1>${d.franja?`<div class="band">${md(d.franja)}</div>`:''}${n>1?'<div class="sello">DESLIZA<br>→</div>':''}${foot('sin')}</div>`; }
    case 'foto': { // B · foto de Paula a toda la portada (d.foto = archivo dentro de la carpeta del post)
      const fp = path.join(DIR, d.foto); const ext = path.extname(fp).slice(1).toLowerCase().replace('jpg','jpeg');
      const src = `data:image/${ext};base64,`+fs.readFileSync(fp).toString('base64');
      return `<div class="s fot"><img class="bg" src="${src}" style="object-position:${d.posicion||'center'}"><div class="grad"></div>${d.etiqueta?`<span class="k">${esc(d.etiqueta)}</span>`:''}<h1>${marca(d.titulo,d.resaltado)}</h1>${foot(1)}</div>`; }
    case 'pregunta': { // C · pregunta + respuesta gigante, fondo claro
      const fy = Math.min(420, Math.floor(1530/(d.respuesta||'x').length));
      return `<div class="s preg"><div class="q">${esc(d.pregunta)}</div><div class="yes" style="font-size:${fy}px">${esc(d.respuesta)}</div>${d.texto?`<div class="why">${md(d.texto)}</div>`:''}${n>1?'<span class="desliza">DESLIZA →</span>':''}${foot('sin')}</div>`; }
    case 'opcion': { // opción de un menú: bloque de color, número gigante, título enorme y chips
      const col = d.color||'navy'; const t = esc(d.titulo).replace(esc(d.resaltado||'\u0000'), `<span class="k">${esc(d.resaltado||'')}</span>`);
      return `<div class="s op ${col}"><div class="big">${esc(d.num)}</div>${d.etiqueta?`<span class="et">${esc(d.etiqueta)}</span>`:''}<h2>${t}</h2>${d.texto?`<p class="tx">${md(d.texto)}</p>`:''}${(d.chips||[]).length?`<div class="chips">${d.chips.map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div>`:''}${foot()}</div>`; }
    case 'pasos': { // pasos numerados en tarjetas azul marino sobre rosa
      const t = esc(d.titulo).replace(esc(d.resaltado||'\u0000'), `<span class="k">${esc(d.resaltado||'')}</span>`);
      return `<div class="s pa"><h2>${t}</h2><div class="rows">${(d.pasos||[]).map((p,j)=>`<div class="row"><div class="n">${j+1}</div><span>${md(p)}</span></div>`).join('')}</div>${foot()}</div>`; }
    case 'cierre-dm': { // cierre con la caja de mensaje directo escribiendo la palabra clave
      const t = esc(d.titulo).replace(esc(d.resaltado||'\u0000'), `<span class="k">${esc(d.resaltado||'')}</span>`);
      const send = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${C.logoBg}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>`;
      return `<div class="s dm"><div class="rosa-band"></div><div class="azul-band"></div><img class="lg" src="${LOGO}"><h2>${t}</h2>${d.texto?`<p class="tx">${md(d.texto)}</p>`:''}<div class="lab">${esc(d.etiqueta||'Escríbeme por mensaje directo')}</div><div class="msg"><b>${esc(d.palabra||'EMPEZAR')}</b><div class="send">${send}</div></div>${foot()}</div>`; }
    case 'texto': return `<div class="s light">${d.num?`<div class="num">${esc(d.num)}</div>`:''}<h2>${marca(d.titulo,d.resaltado)}</h2><p class="txt">${md(d.texto)}</p>${foot()}</div>`;
    case 'lista': return `<div class="s light"><h2>${marca(d.titulo,d.resaltado)}</h2><div class="pts">${(d.puntos||[]).map(p=>`<div class="pt">${check}<span>${md(p)}</span></div>`).join('')}</div>${foot()}</div>`;
    case 'cierre': return `<div class="s dark cierre">${rayas}<img class="logo" src="${LOGO}" style="position:relative"><h2 style="position:relative">${marca(d.titulo,d.resaltado)}</h2>${d.texto?`<p class="txt" style="color:${C.azul};position:relative">${md(d.texto)}</p>`:''}<span class="pill" style="position:relative">${esc(d.boton||'Escríbeme EMPEZAR por mensaje')}</span>${foot(1)}</div>`;
    case 'testimonio': return `<div class="s light"><div style="font-size:260px;line-height:.7;font-weight:900;color:${C.rosa};margin-bottom:10px">“</div><p style="font-size:${(d.texto||'').length>220?46:56}px;line-height:1.3;font-weight:600;color:${C.navy}">${md(d.texto)}</p><p style="margin-top:56px;font-size:38px;font-weight:800;color:${C.navy}">— ${esc(d.autor||'Cliente')}</p>${d.detalle?`<p style="font-size:32px;font-weight:600;color:${C.gris};margin-top:8px">${esc(d.detalle)}</p>`:''}${foot()}</div>`;
    default: throw new Error('Tipo de diapositiva desconocido: '+d.tipo);
  }
}

(async()=>{
  const dir = process.argv[2]; DIR = dir;
  if(!dir) throw new Error('Indica la carpeta del post');
  const post = JSON.parse(fs.readFileSync(path.join(dir,'post.json'),'utf8'));
  const W = 1080, H = post.formato === 'historia' ? 1920 : 1350;
  const ds = post.diapositivas;
  if(post.formato==='carrusel' && (ds.length<2 || ds.length>10)) throw new Error('Un carrusel lleva de 2 a 10 diapositivas');
  for(const f of fs.readdirSync(dir)) if(/^slide-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(dir,f));
  const b = await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}); const p = await b.newPage({viewport:{width:W,height:H}});
  for(let i=0;i<ds.length;i++){
    await p.setContent(`<!doctype html><meta charset="utf-8"><style>${css(W,H)}</style><body>${slide(ds[i],i,ds.length,H)}</body>`);
    await p.waitForLoadState('networkidle');
    // Instagram solo acepta JPEG al publicar por la API
    await p.screenshot({path:path.join(dir,`slide-${i+1}.jpg`), type:'jpeg', quality:92});
  }
  await b.close();
  console.log(`${ds.length} imágenes en ${dir}`);
})().catch(e=>{console.error(e.message);process.exit(1)});
