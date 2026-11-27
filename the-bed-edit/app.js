(()=>{'use strict';
const {concepts}=window.BED_DATA;const manifest=window.BED_IMAGE_MANIFEST;const legacy=window.BED_LEGACY_IMAGES;
const seasons={summer:{label:'SUMMER',heading:'Cool & pared back',desc:'Crisp percale sheets, silk cases and the lightweight wool duvet. Fold back the duvet when needed; the already-owned quilt can be stored.',chips:['Percale sheets','Silk pillowcases','Light wool duvet','Quilt stored']},transitional:{label:'SPRING / FALL',heading:'Softly layered',desc:'The same sheets and duvet, with the included quilt folded at the foot and pulled up when the evening turns cool. No second collection to buy.',chips:['Percale sheets','Silk pillowcases','Light wool duvet','Quilt at foot']},winter:{label:'WINTER',heading:'Warmth without heaviness',desc:'Layer the already-included cotton quilt over the lightweight wool duvet. Lauren can add her personal weighted blanket on her side; Matt can fold back extra layers.',chips:['Percale sheets','Silk pillowcases','Light wool duvet','Quilt layered']}};
const angles=['hero','side','detail'];const state={concept:0,season:'summer',angle:'hero',favorite:null};
const $=id=>document.getElementById(id);const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);const cents=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
const total=c=>c.products.reduce((v,p)=>({lo:v.lo+p.pricing.lo,hi:v.hi+p.pricing.hi}),{lo:0,hi:0});
const price=t=>money(t.lo)+(Math.round(t.lo)===Math.round(t.hi)?'':'–'+money(t.hi));
function el(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e}
function loadImage(img,concept,season,angle,notice){
 const i=concepts.indexOf(concept),j=angles.indexOf(angle),fallback=legacy[i][j];const actualSeason=season==='winter'?'winter':'summer';
 const expected=manifest[concept.id][actualSeason][angle];let usedFallback=false;
 if(window.BED_IMAGES_APPROVED!==true){img.onerror=null;img.src=fallback;if(notice)notice.textContent=(season==='transitional'?'Spring / Fall styling guide · ':'')+'Illustrative concept study · seasonal photography pending approval';img.alt=concept.name+' bedding direction, '+angle+' view. Illustrative concept study, not exact product photography.';return;}
 img.onerror=()=>{if(usedFallback)return;usedFallback=true;img.onerror=null;img.src=fallback;if(notice)notice.textContent=(season==='transitional'?'Spring / Fall styling guide · ':'')+'Illustrative concept study · seasonal photography pending approval';};
 img.onload=()=>{if(!usedFallback&&notice)notice.textContent=(season==='transitional'?'Spring / Fall uses summer imagery with transitional layering guidance · ':'')+'Seasonal styling image · illustrative, not verified product photography';};
 img.alt=concept.name+' bedding direction, '+angle+' view, '+(season==='transitional'?'spring/fall styling reference':season+' styling')+'. Concept illustration, not verified retail product photo.';
 img.src=expected;
}
function buttons(){
 const node=$('conceptSwitch');concepts.forEach((c,i)=>{const b=el('button','',('0'+(i+1))+' / '+c.name);b.type='button';b.dataset.concept=String(i);b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>choose(i,false));node.append(b)});
 document.querySelectorAll('[data-season]').forEach(b=>b.addEventListener('click',()=>{state.season=b.dataset.season;render()}));
 document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>{state.angle=b.dataset.angle;render()}));
}
function overview(){
 const node=$('overview');concepts.forEach((c,i)=>{const card=el('article','overview-card');card.dataset.card=String(i);
 const img=el('img','overview-image');img.loading=i===0?'eager':'lazy';img.width=640;img.height=480;loadImage(img,c,'summer','hero');
 const body=el('div','overview-body');body.append(el('span','eyebrow','0'+(i+1)+' / '+c.eyebrow),el('h3','',c.name),el('p','',c.description),el('div','price',price(total(c))),el('small','','Complete all-season purchase · estimate'));
 const b=el('button','quiet-button','Explore this look');b.type='button';b.addEventListener('click',()=>{choose(i,true)});body.append(b);card.append(img,body);node.append(card)});
}
function comparison(){
 const node=$('comparison');concepts.forEach((c,i)=>{const card=el('article','compare-card');card.dataset.compare=String(i);
 const b=el('button','quiet-button','Choose as our favorite');b.type='button';b.addEventListener('click',()=>{state.favorite=i;state.concept=i;render()});
 card.append(el('span','eyebrow','0'+(i+1)+' / '+c.eyebrow),el('h3','',c.name),el('div','price',price(total(c))),el('p','',c.description),el('p','',c.cat),b);node.append(card)});
}
function choose(i,scroll){state.concept=i;render();if(scroll){$('explorer').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}}
function render(){
 const c=concepts[state.concept],t=total(c),season=seasons[state.season];
 document.querySelectorAll('[data-season]').forEach(b=>b.setAttribute('aria-pressed',String(state.season===b.dataset.season)));
 document.querySelectorAll('[data-angle]').forEach(b=>b.setAttribute('aria-pressed',String(state.angle===b.dataset.angle)));
 document.querySelectorAll('[data-concept]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.concept)===state.concept)));
 document.querySelectorAll('[data-card]').forEach(b=>b.classList.toggle('active',Number(b.dataset.card)===state.concept));
 $('selectedNumber').textContent='0'+(state.concept+1)+' / THE SELECTED LOOK';$('selectedName').textContent=c.name;$('selectedDesc').textContent=c.description;
 $('swatches').replaceChildren(...c.palette.map(color=>{const s=el('span');s.style.backgroundColor=color;s.title='Material palette '+color;return s}));
 $('seasonLabel').textContent=season.label;$('seasonHeading').textContent=season.heading;$('seasonDesc').textContent=season.desc;
 $('layerChips').replaceChildren(...season.chips.map(x=>el('span','',x)));
 $('selectedPrice').textContent=price(t);loadImage($('mainImage'),c,state.season,state.angle,$('photoNotice'));
 $('shoppingName').textContent=c.name;$('shoppingTotal').textContent=price(t);$('tableTotal').textContent=price(t);
 const tbody=$('productRows');tbody.replaceChildren();
 c.products.forEach((p,i)=>{const tr=el('tr');const th=el('th');th.scope='row';th.append(el('span','',p.name+' · Qty '+p.qty));th.append(el('p','',p.description));th.append(el('small','',p.note));
 const td=el('td','',price(p.pricing));const linkTd=el('td');const a=el('a','','View item ↗');a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';linkTd.append(a);tr.append(th,td,linkTd);tbody.append(tr)});
 document.querySelectorAll('[data-compare]').forEach(card=>{const i=Number(card.dataset.compare);card.classList.toggle('favorite',state.favorite===i);card.querySelector('button').textContent=state.favorite===i?'✓ Our favorite':'Choose as our favorite'});
 $('favoriteStatement').textContent=state.favorite===null?'Choose your favorite direction.':'Our favorite: '+concepts[state.favorite].name+'.';
 $('copyButton').textContent=state.favorite===null?'Copy selected look shopping list':'Copy favorite shopping list';
}
async function copyList(){
 const c=concepts[state.favorite===null?state.concept:state.favorite];
 const message='THE BED EDIT — '+c.name+'\nComplete all-season Queen collection · planning estimate '+price(total(c))+' (USD, before tax/shipping)\n\n'+c.products.map((p,i)=>(i+1)+'. '+p.name+' — quantity '+p.qty+' — '+price(p.pricing)+'\n'+p.url+'\n'+p.note).join('\n\n')+'\n\nVerify Queen sizes, stock and current prices before buying.';
 try{await navigator.clipboard.writeText(message);$('copyStatus').textContent='Shopping list copied.'}catch(err){const area=el('textarea');area.value=message;area.style.position='fixed';area.style.left='-9999px';document.body.append(area);area.select();const success=document.execCommand('copy');area.remove();$('copyStatus').textContent=success?'Shopping list copied.':'Unable to copy automatically; use your browser copy controls.'}
}
buttons();overview();comparison();$('copyButton').addEventListener('click',copyList);render();
})();