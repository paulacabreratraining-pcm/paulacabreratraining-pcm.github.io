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
.txt{font-size:46px;line-height:1.38;color:${C.gris};font-weight:500} .txt strong{color:${C.navy};font-weight:800}
.pts{display:flex;flex-direction:column;gap:34px}
.pt{display:flex;gap:28px;align-items:flex-start;font-size:46px;font-weight:600;line-height:1.25}
.pt svg{flex:none;margin-top:4px}
.pill{display:inline-block;margin-top:56px;background:${C.rosa};color:${C.navy};font-weight:800;font-size:40px;padding:26px 44px;border-radius:999px}
.logo{width:300px;height:300px;margin-bottom:56px}
.cierre{align-items:center;text-align:center}
.desliza{position:absolute;right:96px;bottom:150px;font-size:34px;font-weight:700;color:${C.rosa}}`;

const check = `<svg width="56" height="56" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="${C.azul}"/><path d="M4.5 8.2l2.2 2.2 4.8-4.8" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rayas = `<div class="stripe" style="width:150px;height:900px;background:${C.rosa};right:-120px;top:-330px"></div>
<div class="stripe" style="width:60px;height:900px;background:${C.azul};right:-230px;top:-250px"></div>`;

function slide(d, i, n, H){
  const foot = (dark) => `<div class="foot"><span class="u"><img src="${LOGO}">${USER}</span><span>${n>1?`${i+1}/${n}`:''}</span></div>`;
  switch(d.tipo){
    case 'portada': return `<div class="s dark">${rayas}<h1 style="position:relative;max-width:760px">${marca(d.titulo,d.resaltado)}</h1>${d.sub?`<p class="sub">${md(d.sub)}</p>`:''}${n>1?'<span class="desliza">Desliza →</span>':''}${foot(1)}</div>`;
    case 'texto': return `<div class="s light">${d.num?`<div class="num">${esc(d.num)}</div>`:''}<h2>${marca(d.titulo,d.resaltado)}</h2><p class="txt">${md(d.texto)}</p>${foot()}</div>`;
    case 'lista': return `<div class="s light"><h2>${marca(d.titulo,d.resaltado)}</h2><div class="pts">${(d.puntos||[]).map(p=>`<div class="pt">${check}<span>${md(p)}</span></div>`).join('')}</div>${foot()}</div>`;
    case 'cierre': return `<div class="s dark cierre">${rayas}<img class="logo" src="${LOGO}" style="position:relative"><h2 style="position:relative">${marca(d.titulo,d.resaltado)}</h2>${d.texto?`<p class="txt" style="color:${C.azul};position:relative">${md(d.texto)}</p>`:''}<span class="pill" style="position:relative">${esc(d.boton||'Escríbeme por WhatsApp · enlace en la bio')}</span>${foot(1)}</div>`;
    default: throw new Error('Tipo de diapositiva desconocido: '+d.tipo);
  }
}

(async()=>{
  const dir = process.argv[2];
  if(!dir) throw new Error('Indica la carpeta del post');
  const post = JSON.parse(fs.readFileSync(path.join(dir,'post.json'),'utf8'));
  const W = 1080, H = post.formato === 'historia' ? 1920 : 1350;
  const ds = post.diapositivas;
  if(post.formato==='carrusel' && (ds.length<2 || ds.length>10)) throw new Error('Un carrusel lleva de 2 a 10 diapositivas');
  for(const f of fs.readdirSync(dir)) if(/^slide-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(dir,f));
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:W,height:H}});
  for(let i=0;i<ds.length;i++){
    await p.setContent(`<!doctype html><meta charset="utf-8"><style>${css(W,H)}</style><body>${slide(ds[i],i,ds.length,H)}</body>`);
    await p.waitForLoadState('networkidle');
    // Instagram solo acepta JPEG al publicar por la API
    await p.screenshot({path:path.join(dir,`slide-${i+1}.jpg`), type:'jpeg', quality:92});
  }
  await b.close();
  console.log(`${ds.length} imágenes en ${dir}`);
})().catch(e=>{console.error(e.message);process.exit(1)});
