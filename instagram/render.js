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
.preg .desliza{color:${C.logoBg};bottom:56px;font-weight:900}`;

const check = `<svg width="56" height="56" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="${C.azul}"/><path d="M4.5 8.2l2.2 2.2 4.8-4.8" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rayas = `<div class="stripe" style="width:150px;height:900px;background:${C.rosa};right:-120px;top:-330px"></div>
<div class="stripe" style="width:60px;height:900px;background:${C.azul};right:-230px;top:-250px"></div>`;

let DIR = '.';
function slide(d, i, n, H){
  if(H>1500) n = 1; // historias: sin numeración ni «Desliza»
  const foot = (modo) => `<div class="foot"><span class="u"><img src="${LOGO}">${USER}</span><span>${n>1&&modo!=='sin'?`${i+1}/${n}`:''}</span></div>`;
  switch(d.tipo){
    case 'portada': return `<div class="s dark">${rayas}<h1 style="position:relative;max-width:760px">${marca(d.titulo,d.resaltado)}</h1>${d.sub?`<p class="sub">${md(d.sub)}</p>`:''}${n>1?'<span class="desliza">Desliza →</span>':''}${foot(1)}</div>`;
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
    case 'texto': return `<div class="s light">${d.num?`<div class="num">${esc(d.num)}</div>`:''}<h2>${marca(d.titulo,d.resaltado)}</h2><p class="txt">${md(d.texto)}</p>${foot()}</div>`;
    case 'lista': return `<div class="s light"><h2>${marca(d.titulo,d.resaltado)}</h2><div class="pts">${(d.puntos||[]).map(p=>`<div class="pt">${check}<span>${md(p)}</span></div>`).join('')}</div>${foot()}</div>`;
    case 'cierre': return `<div class="s dark cierre">${rayas}<img class="logo" src="${LOGO}" style="position:relative"><h2 style="position:relative">${marca(d.titulo,d.resaltado)}</h2>${d.texto?`<p class="txt" style="color:${C.azul};position:relative">${md(d.texto)}</p>`:''}<span class="pill" style="position:relative">${esc(d.boton||'Escríbeme EMPEZAR por mensaje')}</span>${foot(1)}</div>`;
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
