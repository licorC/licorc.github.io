/* No Squarespace account, API, analytics or visitor runtime required. */
(()=>{
const header=document.querySelector('header');
function sizeHeader(){if(header)document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px')}
sizeHeader();window.addEventListener('resize',sizeHeader);
document.querySelectorAll('.header-nav-folder-title').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const p=b.closest('.header-nav-item--folder');if(p){p.classList.toggle('replica-open');b.setAttribute('aria-expanded',p.classList.contains('replica-open'))}}));
const burgers=[...document.querySelectorAll('.header-burger-btn')];if(burgers.length){const nav=document.createElement('nav');nav.className='replica-mobile-nav';nav.hidden=true;nav.setAttribute('aria-label','Mobile navigation');const seen=new Set();document.querySelectorAll('.header-nav a[href]').forEach(a=>{if(a.href.includes('#')||seen.has(a.getAttribute('href')))return;seen.add(a.getAttribute('href'));nav.append(a.cloneNode(true))});document.body.append(nav);function setMenu(open){nav.hidden=!open;burgers.forEach(b=>{b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close Menu':'Open Menu')});nav.style.top=(header?.getBoundingClientRect().height||80)+'px';header?.classList.remove('local-header-hidden')}burgers.forEach(b=>{b.setAttribute('aria-label','Open Menu');b.addEventListener('click',()=>setMenu(nav.hidden))});document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});addEventListener('resize',()=>{if(innerWidth>767)setMenu(false)})}
const dialog=document.createElement('dialog');dialog.className='replica-lightbox';dialog.innerHTML='<button aria-label="Close image">×</button><img alt="Enlarged artwork">';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.querySelectorAll('[data-lightbox-theme],.sqs-block-image .lightbox, .gallery-grid-item, .gallery-masonry-item').forEach(el=>{el.addEventListener('click',e=>{const img=el.querySelector('img')||el.closest('figure')?.querySelector('img');if(!img||el.closest('a[href]')&&!el.classList.contains('lightbox'))return;e.preventDefault();dialog.querySelector('img').src=img.src;dialog.querySelector('img').alt=img.alt||'Artwork';dialog.showModal()})});
document.querySelectorAll('img[data-src]').forEach(i=>{if(!i.getAttribute('src'))i.src=i.dataset.src});
document.querySelectorAll('.sqs-video-wrapper[data-html],.sqs-video-wrapper[data-provider-name]').forEach(w=>{if(w.dataset.html&&!w.querySelector('iframe')){const t=document.createElement('template');t.innerHTML=w.dataset.html;const f=t.content.querySelector('iframe');if(f){f.loading='lazy';w.replaceChildren(f)}}});
})();
(()=>{
function props(el){try{return JSON.parse(el.dataset.props||'{}')}catch{return {}}}
function ratio(el){const im=el.querySelector('img');const d=(im?.dataset.imageDimensions||'1x1').split('x').map(Number);return d[0]/d[1]||1}
function galleries(){
 document.querySelectorAll('.gallery-masonry').forEach(g=>{const p=props(g),w=g.querySelector('.gallery-masonry-wrapper');if(!w)return;const n=innerWidth<600?1:Number(p.numColumns||p.columns||2),gap=Number(p.gutter||20),cw=(w.clientWidth-gap*(n-1))/n,heights=Array(n).fill(0);w.querySelectorAll('.gallery-masonry-item').forEach(it=>{const c=heights.indexOf(Math.min(...heights)),h=cw/ratio(it);Object.assign(it.style,{left:(cw+gap)*c+'px',top:heights[c]+'px',width:cw+'px',height:h+'px'});heights[c]+=h+gap});w.style.height=Math.max(...heights)-gap+'px'});
 document.querySelectorAll('.gallery-strips').forEach(g=>{const p=props(g),w=g.querySelector('.gallery-strips-wrapper');if(!w)return;const gap=Number(p.gutter||20),target=Number(p.rowHeight||312),width=w.clientWidth;w.style.gap=gap+'px';let row=[],sum=0;function flush(last){const h=(width-gap*(row.length-1))/sum;row.forEach(it=>Object.assign(it.style,{width:h*ratio(it)+'px',height:h+'px'}));row=[];sum=0}w.querySelectorAll('.gallery-strips-item').forEach(it=>{row.push(it);sum+=ratio(it);if(sum*target+gap*(row.length-1)>=width)flush(false)});if(row.length)flush(true)});
 document.querySelectorAll('.gallery-reel').forEach(g=>{const h=Math.round(g.clientHeight),list=g.querySelector('.gallery-reel-list'),items=[...g.querySelectorAll('.gallery-reel-item')];items.forEach(it=>{it.style.width=Math.round(h*ratio(it))+'px';it.style.height=h+'px';const src=it.querySelector('.gallery-reel-item-src');if(src){src.dataset.loaded='true';src.dataset.visible='true'}});if(items.length){list.style.paddingLeft=Math.max(0,(g.clientWidth-items[0].clientWidth)/2)+'px';list.style.paddingRight=Math.max(0,(g.clientWidth-items[items.length-1].clientWidth)/2)+'px'}});
}
addEventListener('resize',galleries);addEventListener('load',galleries);galleries();
document.querySelectorAll('.gallery-reel').forEach(g=>{g.querySelectorAll('.gallery-reel-control-btn').forEach((b,i)=>b.addEventListener('click',()=>g.querySelector('.gallery-reel-list').scrollBy({left:g.clientWidth*(i?1:-1)*.8,behavior:'smooth'})))});
})();
(()=>{
// Rebuild marquee SVG geometry locally, without the hosted Squarespace controller.
let frames=[];function init(){frames=[];document.querySelectorAll('.Marquee').forEach(m=>{const svg=m.querySelector('svg'),path=m.querySelector('.Marquee-path'),tp=m.querySelector('textPath,textpath');if(!svg||!path||!tp)return;const h=m.querySelector('h1,h2,h3,p'),font=parseFloat(getComputedStyle(h||m).fontSize)||48,width=m.clientWidth||innerWidth,amp=Math.max(0,Number(m.dataset.waveIntensity||0)),freq=Math.max(1,Number(m.dataset.waveFrequency||2)),height=font*2+amp*2,id='local-marquee-'+m.dataset.blockId;let d='';for(let x=-width;x<=width*3;x+=8){let y=height/2+amp*Math.sin(x/width*Math.PI*freq);d+=(x===-width?'M':'L')+x+','+y}path.id=id;path.setAttribute('d',d);svg.style.width='100%';svg.style.height=height+'px';svg.setAttribute('viewBox',`0 0 ${width} ${height}`);tp.setAttribute('href','#'+id);tp.setAttribute('xlink:href','#'+id);let items=[];try{items=JSON.parse(m.dataset.marqueeItems||'[]')}catch{}let text=items.map(i=>i.text||'').join('   ');tp.textContent=(text+'   ').repeat(45);tp.style.fontSize=font+'px';tp.setAttribute('visibility','visible');m.querySelectorAll('.Marquee-measure,.Marquee-svg-group,.Marquee-hitbox,.Marquee-track').forEach(e=>e.style.display='none');frames.push({tp,width,speed:Number(m.dataset.animationSpeed||1),direction:m.dataset.animationDirection==='right'?1:-1})})}
init();addEventListener('resize',init);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function animate(t){frames.forEach(f=>f.tp.setAttribute('startOffset',String(reduced?0:(t/60*f.speed*f.direction)%f.width)));if(!reduced)requestAnimationFrame(animate)}requestAnimationFrame(animate);
})();
(()=>{function fit(){document.querySelectorAll('.sqsrte-scaled-text-container').forEach(c=>{const t=c.querySelector('.sqsrte-scaled-text');if(!t||!c.clientWidth)return;if(!t.textContent.trim()){c.classList.add('loaded');c.style.height='';t.style.cssText='';return}c.classList.add('loaded');Object.assign(t.style,{display:'inline-block',width:'max-content',maxWidth:'none',transform:'none',transformOrigin:'top left',whiteSpace:'pre'});t.querySelectorAll('h1,h2,h3,h4,p').forEach(e=>{e.style.whiteSpace='pre';e.style.margin='0'});const factor=c.clientWidth/Math.max(1,t.getBoundingClientRect().width),h=t.getBoundingClientRect().height;t.style.transform=`scale(${factor})`;c.style.height=h*factor+'px'})}document.fonts?.ready.then(fit);addEventListener('resize',fit);fit()})();

/* Independent, fail-open interaction restoration verified against the source. */
(()=>{
const style=document.createElement('style');style.textContent=`
header{transition:transform .25s ease!important}
header.local-header-hidden{transform:translateY(-102%)!important}
.sqs-button-element--secondary{border:1px solid #d7d7d7!important;border-radius:6.4px!important;background:transparent;color:#d7d7d7;box-sizing:border-box}
.sqs-button-element--secondary:hover{background:#d7d7d7;color:#000}
.gallery-reel-list{box-sizing:border-box;scrollbar-width:none;gap:0!important}
.gallery-reel-list::-webkit-scrollbar{display:none}
.gallery-reel-item{margin:0!important;scroll-snap-align:center}
.gallery-reel-item-wrapper,.gallery-reel-item-src{display:block!important;position:relative!important;opacity:1!important;transform:none!important;visibility:visible!important}
.gallery-reel-item img{opacity:1!important}
.replica-mobile-nav{box-sizing:border-box;bottom:0}
`;document.head.append(style);
const h=document.querySelector('header');let last=scrollY;
function show(){h?.classList.remove('local-header-hidden')}
addEventListener('scroll',()=>{const y=scrollY,menu=document.querySelector('.replica-mobile-nav');if(y<100||y<last-3||menu&&!menu.hidden)show();else if(y>last+3&&y>180&&!h?.matches(':focus-within'))h?.classList.add('local-header-hidden');last=y},{passive:true});
document.addEventListener('mousemove',e=>{if(e.clientY<60)show()});h?.addEventListener('focusin',show);
document.querySelectorAll('.gallery-reel').forEach(g=>{const list=g.querySelector('.gallery-reel-list');g.querySelectorAll('.gallery-reel-control-btn').forEach(b=>b.addEventListener('click',()=>{const max=list.scrollWidth-list.clientWidth;if(b.getAttribute('aria-label')==='Next Slide'&&list.scrollLeft>=max-4)list.scrollTo({left:0,behavior:'smooth'});if(b.getAttribute('aria-label')==='Previous Slide'&&list.scrollLeft<=4)list.scrollTo({left:max,behavior:'smooth'})}));list.tabIndex=0;list.setAttribute('aria-label','Image gallery. Swipe or use arrow keys.');list.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();list.scrollBy({left:g.clientWidth*.8*(e.key==='ArrowRight'?1:-1),behavior:'smooth'})}})});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
const pending=new Set(),observer=new IntersectionObserver(entries=>{entries.forEach(({target:e,isIntersecting})=>{if(!isIntersecting)return;e.style.setProperty('opacity','1','important');e.style.setProperty('translate','0 0','important');pending.delete(e);observer.unobserve(e)})},{threshold:0.05});
document.querySelectorAll('main .sqs-block-image,main .sqs-html-content,main .sqs-block-button-container,.gallery-strips-item-wrapper,.gallery-masonry-item-wrapper').forEach(e=>{if(e.getBoundingClientRect().top<innerHeight*.95)return;e.style.setProperty('opacity','0','important');e.style.setProperty('translate','0 24px','important');e.style.transition='opacity .45s ease, translate .45s ease';pending.add(e);observer.observe(e)});
addEventListener('pageshow',()=>pending.forEach(e=>{if(e.getBoundingClientRect().top<innerHeight){e.style.setProperty('opacity','1','important');e.style.setProperty('translate','0 0','important')}}));
}
})();
