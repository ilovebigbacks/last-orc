// Level-up upgrade pool (data-driven). Each entry: id, name, rarity c|r|e, max stacks, desc(nextLevel), optional ab (hotbar key),
// base (starting level, abilities only), plus (stronger version id offered once this one is maxed).
const RARITY={c:{col:0x6b5a40,frame:'lu_card_c',w:[70,55,45]},r:{col:0x9a3a28,frame:'lu_card_r',w:[25,33,38]},e:{col:0xc89040,frame:'lu_card_e',w:[5,12,17]}};
const UPG=[
 {id:'blood_fury',name:'Blood Fury',rarity:'c',max:5,desc:()=>'+12% damage'},
 {id:'stone_hide',name:'Stone Hide',rarity:'c',max:5,desc:()=>'+10% max HP, heal 20%'},
 {id:'iron_skin',name:'Iron Skin',rarity:'c',max:5,desc:()=>'take 6% less damage'},
 {id:'swift_hooves',name:'Swift Hooves',rarity:'c',max:4,desc:()=>'+8% move speed'},
 {id:'bone_magnet',name:'Bone Magnet',rarity:'c',max:3,desc:()=>'+30% pickup range'},
 {id:'thick_blood',name:'Thick Blood',rarity:'c',max:4,desc:()=>'regen 0.5 HP per sec'},
 {id:'war_drums',name:'War Drums',rarity:'r',max:4,desc:()=>'8% shorter cooldowns'},
 {id:'bloodthirst',name:'Bloodthirst',rarity:'r',max:3,desc:()=>'heal 1 HP per 8 kills'},
 {id:'savage_strikes',name:'Savage Strikes',rarity:'r',max:4,desc:()=>'crit +5% / dmg +25%'},
 {id:'trophy_hunter',name:'Trophy Hunter',rarity:'r',max:3,desc:()=>'+10% XP'},
 {id:'axe_cleave',name:'Axe Cleave',rarity:'c',max:5,base:1,ab:'Q',desc:n=>'Lv '+n+': wider arc, +20% dmg'},
 {id:'whirlwind',name:'Whirlwind',rarity:'r',max:5,base:0,ab:'W',desc:n=>n===1?'Unlock: spin and shred foes':'Lv '+n+': +dmg, wider spin'},
 {id:'war_stomp',name:'War Stomp',rarity:'r',max:5,base:0,ab:'E',desc:n=>n===1?'Unlock: stun slam':'Lv '+n+': +dmg, longer stun'},
 {id:'rage_roar',name:'Rage Roar',rarity:'e',max:5,base:0,ab:'R',desc:n=>n===1?'Unlock: fear burst, +dmg buff':'Lv '+n+': longer fear, +buff'},
 {id:'last_of_the_clan',name:'Last of the Clan',rarity:'e',max:1,desc:()=>'cheat death: 30% HP'},
 {id:'berserker_blood',name:'Berserker Blood',rarity:'e',max:1,desc:()=>'+40% dmg at low HP'},
];
// stronger versions: replace a maxed common/rare stack. Double effect, one tier rarer, max 3.
const PLUS_DESC={blood_fury:'+24% damage',stone_hide:'+20% max HP, heal 40%',iron_skin:'take 12% less damage',swift_hooves:'+16% move speed',bone_magnet:'+60% pickup range',
 thick_blood:'regen 1 HP per sec',war_drums:'16% shorter cooldowns',bloodthirst:'heal 2 HP per 8 kills',savage_strikes:'crit +10% / dmg +50%',trophy_hunter:'+20% XP'};
for(const u of UPG.slice()){if(!PLUS_DESC[u.id])continue;const p={id:u.id+'_plus',name:u.name+' II',rarity:u.rarity==='c'?'r':'e',max:3,icon:u.id,plusOf:u.id,desc:()=>PLUS_DESC[u.id]};u.plus=p.id;UPG.push(p)}
// endless fillers, only offered once every real upgrade is maxed
UPG.push({id:'second_wind',name:'Second Wind',rarity:'c',max:Infinity,filler:true,icon:'stone_hide',desc:()=>'heal 30% HP'},
 {id:'brute_force',name:'Brute Force',rarity:'c',max:Infinity,filler:true,icon:'blood_fury',desc:()=>'+3% damage'},
 {id:'thick_skull',name:'Thick Skull',rarity:'c',max:Infinity,filler:true,icon:'iron_skin',desc:()=>'+10 max HP'});
const UPG_BY=Object.fromEntries(UPG.map(u=>[u.id,u]));
// ability tuning per level (lv 1..5). Q keeps ABILITIES.Q at lv1 so desktop play is unchanged until it is upgraded.
const AB_DEF={
 Q:lv=>({cd:ABILITIES.Q.cooldownMs,r:ABILITIES.Q.radius+12*(lv-1),dmg:ABILITIES.Q.damage*(1+.2*(lv-1))}),
 W:lv=>({cd:7000-400*(lv-1),r:90+10*(lv-1),dmg:8+3*(lv-1),dur:1500,tick:250}),
 E:lv=>({cd:8000-300*(lv-1),r:140+10*(lv-1),dmg:20*(1+.15*(lv-1)),stun:1200+200*(lv-1)}),
 R:lv=>({cd:14000-500*(lv-1),r:220,fear:1500+300*(lv-1),buff:.25+.05*(lv-1),buffMs:4000}),
};
const AB_ICON={Q:'icon_axe_cleave',W:'icon_whirlwind',E:'icon_war_stomp',R:'icon_rage_roar'};
// current level of an upgrade in a state {ups:{id:n}, ab:{Q:lv..}}
const upLevel=(st,u)=>u.ab?st.ab[u.ab]:(st.ups[u.id]||0);
function eligible(st,u){if(u.filler)return false;const n=upLevel(st,u);if(n>=u.max)return false;if(u.plusOf&&upLevel(st,UPG_BY[u.plusOf])<UPG_BY[u.plusOf].max)return false;return true}
// roll `count` different eligible cards weighted by rarity. Level >=5 tilts toward rare; level >=10 guarantees >=1 rare-or-better.
function rollOffer(st,level,rnd=Math.random,count=3){const tier=level>=10?2:level>=5?1:0;let pool=UPG.filter(u=>eligible(st,u));const out=[];
 const pick=list=>{const tot=list.reduce((a,u)=>a+RARITY[u.rarity].w[tier],0);let r=rnd()*tot;for(const u of list){r-=RARITY[u.rarity].w[tier];if(r<0)return u}return list[list.length-1]};
 if(tier===2){const hi=pool.filter(u=>u.rarity!=='c');if(hi.length){const u=pick(hi);out.push(u);pool=pool.filter(x=>x!==u)}}
 while(out.length<count&&pool.length){const u=pick(pool);out.push(u);pool=pool.filter(x=>x!==u)}
 for(const f of UPG.filter(u=>u.filler))if(out.length<count)out.push(f);
 for(let i=out.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
// derived stats from stacks (unit-tested)
function computeMods(ups){const n=id=>ups[id]||0,p=id=>ups[id+'_plus']||0,st=id=>n(id)+2*p(id);
 return{dmg:1+.12*st('blood_fury')+.03*n('brute_force'),maxHp:1+.10*st('stone_hide')+10*n('thick_skull')/RAGE.hp,taken:Math.max(.4,1-.06*st('iron_skin')),speed:1+.08*st('swift_hooves'),pickup:1+.30*st('bone_magnet'),
  regen:.5*st('thick_blood'),cd:Math.max(.4,1-.08*st('war_drums')),killHeal:st('bloodthirst'),crit:.05*st('savage_strikes'),critDmg:1.5+.25*st('savage_strikes'),
  xp:1+.10*st('trophy_hunter'),lastStand:n('last_of_the_clan')>0,berserk:n('berserker_blood')>0}}
// level-up art (assets/ui/levelup, _hd 4x / _hd2 2x, drawn at display size, LINEAR)
const LU_DIR='../assets/ui/levelup/',LU_DISP={plate_c:[214,90],plate_r:[214,90],plate_e:[214,90],plate_focus:[214,90],card_c:[180,260],card_r:[180,260],card_e:[180,260],card_focus:[180,260],panel_levelup:[620,330],panel_levelup_portrait:[240,560],header_levelup:[300,86],pip_empty:[12,12],pip_full:[12,12]};
function loadLevelUpAssets(s){s.load.json('lu_json',LU_DIR+'levelup.json');for(const[k,d]of Object.entries(LU_DISP)){s.load.image('lu_'+k,LU_DIR+k+HD_TIER+'.png');UI_DISP['lu_'+k]=d}
 for(const u of UPG)if(!u.plusOf&&!u.filler){s.load.image('lu_icon_'+u.id,LU_DIR+'icon_up_'+u.id+HD_TIER+'.png');UI_DISP['lu_icon_'+u.id]=[64,64]}}
const LU_CARD={icon_cy:{c:87,r:86,e:93},text:[30,140,120,95],pip_y:230,pip_dy_e:-6,title_y:156,title_sc:15/13,desc_sc:11/13,desc_min:9/13,title_min:12/13,line:18,pip_step:16};
const LU_LAND={panel:{x:202,y:143},header:{cx:512,cy:143},cards:{x:222,y:184,gap:20}};
const LU_PORT={margin:20,headerHalf:43,padTop:54,padBot:72,gap:12};
// The overlay: a container over the live fight in the Game scene, behind a code-drawn 0.6 black scrim.
class LevelUpOverlay{
 constructor(s,offer,onPick){this.s=s;this.offer=offer;this.onPick=onPick;this.t0=performance.now();this.focus=Math.min(1,offer.length-1);this.done=false;
  const J=s.cache.json.get('lu_json'),cl=J&&J.card_layout_display;if(cl){if(cl.icon_center_y)Object.assign(LU_CARD.icon_cy,{c:cl.icon_center_y.card_c??87,r:cl.icon_center_y.card_r??86,e:cl.icon_center_y.card_e??93});if(cl.pip_row_y)LU_CARD.pip_y=cl.pip_row_y}
  const c=this.c=s.add.container(0,0).setScrollFactor(0).setDepth(3e6);
  this.scrim=s.add.rectangle(0,0,10,10,0x000000,.6).setOrigin(0).setInteractive();c.add(this.scrim);
  const pk=s.textures.exists('lu_panel_levelup')?'lu_panel_levelup':null;this.panel=pk?uiFit(s.add.image(0,0,pk).setOrigin(0)):null;
  this.panelP=s.textures.exists('lu_panel_levelup_portrait')?uiFit(s.add.image(0,0,'lu_panel_levelup_portrait').setOrigin(0)):null;
  for(const p of[this.panel,this.panelP])if(p)c.add(p);
  this.cards=[];this.mode=null;
  this.header=s.textures.exists('lu_header_levelup')?uiFit(s.add.image(0,0,'lu_header_levelup').setOrigin(.5)):spriteText(s,0,0,'LEVEL UP!',2.4,0xffd27a);c.add(this.header);
  const sf=o=>{o.setScrollFactor(0);if(o.list)o.list.forEach(sf)};sf(c);this.key=ev=>this.onKey(ev);s.input.keyboard.on('keydown',this.key);this.layout();this.setFocus(this.focus);window.LVLUP={open:true,offer:offer.map(u=>u.id),cards:this.cards.map(k=>k.info),mode:this.mode}}
 makeCard(u,i){const s=this.s,g=s.add.container(0,0),fk=s.textures.exists(RARITY[u.rarity].frame)?RARITY[u.rarity].frame:null;
  const bg=fk?uiFit(s.add.image(0,0,fk).setOrigin(0)):s.add.rectangle(0,0,180,260,0x1a1410).setOrigin(0).setStrokeStyle(3,0x6b5a40);g.add(bg);
  const st=s.lvState(),cur=upLevel(st,u),nxt=cur+1;
  // icon: level-up art > HUD ability icon > stand-in
  let ik='lu_icon_'+(u.icon||u.id),fb=false;if(!s.textures.exists(ik)){ik=u.ab?AB_ICON[u.ab]:AB_ICON.Q;if(!s.textures.exists(ik))ik='font';fb=true}
  const icy=LU_CARD.icon_cy[u.rarity],ic=s.add.image(90,icy,ik).setOrigin(.5);if(UI_DISP[ik])uiFit(ic);ic.setDisplaySize(64,64);g.add(ic);
  // text (HD font), fitted to the text panel
  const T=LU_CARD.text,tw=T[2];let ts=LU_CARD.title_sc,lines=[u.name.toUpperCase()];const W_=(str,sc)=>textW(str)*sc;
  if(W_(lines[0],ts)>tw){lines=wrap2(lines[0],w=>W_(w,ts)<=tw);while(lines.some(l=>W_(l,ts)>tw)&&ts>LU_CARD.title_min)ts-=.02}
  const tl=lines.map((l,j)=>{const t=spriteText(s,0,0,l,ts,0xecdec4);t.x=90-t.tw/2;t.y=LU_CARD.title_y+j*LU_CARD.line*ts/LU_CARD.title_sc;g.add(t);return t});
  const dy=LU_CARD.title_y+lines.length*LU_CARD.line*ts/LU_CARD.title_sc+8;let ds=LU_CARD.desc_sc,d=u.desc(nxt),dl;
  if(lines.length>1){while(W_(d,ds)>tw&&ds>LU_CARD.desc_min)ds-=.02;while(W_(d,ds)>tw&&d.length>3)d=d.slice(0,-3).trimEnd()+'..';dl=[d]}
  else{dl=W_(d,ds)<=tw?[d]:wrap2(d,w=>W_(w,ds)<=tw);while(dl.some(l=>W_(l,ds)>tw)&&ds>LU_CARD.desc_min)ds-=.02;dl=dl.map(l=>{while(W_(l,ds)>tw&&l.length>3)l=l.slice(0,-3).trimEnd()+'..';return l})}
  const dt=dl.map((l,j)=>{const t=spriteText(s,0,0,l,ds,0xc8baa0,{raw:true});t.x=90-t.tw/2;t.y=dy+j*15*ds/LU_CARD.desc_sc;g.add(t);return t});
  // pips = levels owned / max (none for the endless filler)
  const pips=[];if(isFinite(u.max)){const py=LU_CARD.pip_y+(u.rarity==='e'?LU_CARD.pip_dy_e:0),tot=u.max*LU_CARD.pip_step-4,sx=90-tot/2;
   for(let k=0;k<u.max;k++){const key=k<cur?'lu_pip_full':'lu_pip_empty',p=s.textures.exists(key)?uiFit(s.add.image(sx+k*LU_CARD.pip_step,py,key).setOrigin(0)):s.add.circle(sx+k*16+6,py+6,5,k<cur?0xc0392b:0x222222).setOrigin(.5);g.add(p);pips.push(p)}}
  const foc=s.textures.exists('lu_card_focus')?uiFit(s.add.image(0,0,'lu_card_focus').setOrigin(0)).setVisible(false):s.add.rectangle(0,0,180,260).setOrigin(0).setStrokeStyle(4,0xffc030).setVisible(false);g.add(foc);
  bg.setInteractive({useHandCursor:true}).on('pointerover',()=>this.setFocus(i)).on('pointerdown',()=>{this.setFocus(i);this.pick(i)});
  this.c.addAt(g,this.c.getIndex(this.header)>=0?this.c.getIndex(this.header):this.c.list.length);return{g,bg,foc,u,tl,dt,info:{id:u.id,rarity:u.rarity,title:lines,desc:dl,titleSc:ts,descSc:ds,cur,iconKey:ik,iconFallback:fb,pips:pips.length}}}
 layout(){const s=this.s,gw=s.scale.gw,gh=s.scale.gh;this.scrim.setSize(gw,gh);if(this.scrim.input)this.scrim.input.hitArea.setTo(0,0,gw,gh);
  const P=isPortrait(s),LJl=(window.LJ_L&&LJ_L.levelup)||LU_LAND,LJp=Object.assign({},LU_PORT,(window.LJ_P&&LJ_P.levelup)||{});
  const css=GAME.canvas.getBoundingClientRect().width/gw||1,mode=P?'p'+gw+'x'+gh+'@'+css.toFixed(3):'l';
  if(mode!==this.mode){this.cards.forEach(k=>k.g.destroy());this.mode=mode;
   if(!P)this.cards=this.offer.map((u,i)=>this.makeCard(u,i));else this.buildCardsP(LJp,css);
   const sf=o=>{o.setScrollFactor(0);if(o.list)o.list.forEach(sf)};this.cards.forEach(k=>sf(k.g));if(this.focus!=null)this.setFocus(this.focus);
   if(window.LVLUP&&LVLUP.open){LVLUP.cards=this.cards.map(k=>k.info);LVLUP.mode=mode}}
  if(!P){const L=LJl;if(this.panel)this.panel.setVisible(true).setPosition(L.panel.x,L.panel.y);if(this.panelP)this.panelP.setVisible(false);
   this.header.setPosition(L.header.cx,L.header.cy);this.cards.forEach((k,i)=>k.g.setPosition(L.cards.x+i*(180+L.cards.gap),L.cards.y).setScale(1));this.rects();return}
  const R=this.rowGeo;if(this.panelP){this.panelP.setVisible(true).setPosition(R.px,R.top).setDisplaySize(R.pw,R.ph)}if(this.panel)this.panel.setVisible(!this.panelP).setPosition(R.px,R.top).setDisplaySize(R.pw,R.ph);
  this.header.setPosition(R.cx,R.top).setScale(this.header.texture?uiS(this.header)*Math.min(1,(gw-2*LJp.margin)/300):this.header.scale);
  this.cards.forEach((k,i)=>k.g.setScale(R.k).setPosition(Math.round(R.rx+i*(R.cw+R.gap)),R.cy));this.rects()}
 // Portrait (build5): three desktop-style upright cards side by side, scaled to fit the width. Text sizes come from CSS font-px
 // targets (font em = 13 game units at scale 1): title >= title_px, description >= desc_px. If the text needs more room than the
 // card's text panel, the card is made taller (middle band of the frame stretched) instead of shrinking the text.
 buildCardsP(LJp,css){const s=this.s,gw=s.scale.gw,gh=s.scale.gh,si=safeInsets(s),n=this.offer.length,Q=LJp.cards_p||{};
  const M=Q.margin??6,SP=Q.side_pad??8,G=Q.gap??6,RW=gw-si.l-si.r-2*M-2*SP,cw=(RW-(n-1)*G)/n,k=cw/180;
  const tsL=Math.max(LU_CARD.title_sc,(Q.title_px||12)/(13*css*k)),dsL=Math.max(LU_CARD.desc_sc,(Q.desc_px||10)/(13*css*k)),tw=Q.text_w||124;
  const T=this.offer.map(u=>cardTextP(s.lvState(),u,tw,tsL,dsL));
  const E=Math.max(0,...T.map(t=>Math.ceil(t.h-(LU_CARD.pip_y+LU_CARD.pip_dy_e-2-LU_CARD.title_y)))),ch=(260+E)*k;
  this.cards=this.offer.map((u,i)=>this.makeCardP(u,i,T[i],E,tw));
  const padT=Q.padTop??58,padB=Q.padBot??26,ph=Math.round(padT+ch+padB),avail=gh-si.t-si.b,top=Math.round(si.t+(avail-ph)/2),pw=RW+2*SP,cx=Math.round(si.l+(gw-si.l-si.r)/2);
  this.rowGeo={top,ph,pw,px:cx-pw/2,cx,rx:cx-RW/2,cy:Math.round(top+padT),k,cw,ch,gap:G,E,tw,css,tsL,dsL}}
 makeCardP(u,i,T,E,tw){const s=this.s,g=s.add.container(0,0),fk=s.textures.exists(RARITY[u.rarity].frame)?RARITY[u.rarity].frame:null,st=s.lvState(),cur=upLevel(st,u),H=260+E;
  const bg=tallFrame(s,g,fk,E,0x1a1410);
  let ik='lu_icon_'+(u.icon||u.id),fb=false;if(!s.textures.exists(ik)){ik=u.ab?AB_ICON[u.ab]:AB_ICON.Q;if(!s.textures.exists(ik))ik='font';fb=true}
  const ic=s.add.image(90,LU_CARD.icon_cy[u.rarity],ik).setOrigin(.5);if(UI_DISP[ik])uiFit(ic);ic.setDisplaySize(64,64);g.add(ic);
  let y=LU_CARD.title_y;const tl=T.title.map(l=>{const t=spriteText(s,0,y,l,T.ts,0xecdec4);t.x=90-t.tw/2;y+=T.tLine;g.add(t);return t});y+=T.gap;
  const dt=T.desc.map(l=>{const t=spriteText(s,0,y,l,T.ds,0xc8baa0,{raw:true});t.x=90-t.tw/2;y+=T.dLine;g.add(t);return t});
  const pips=[];if(isFinite(u.max)){const py=LU_CARD.pip_y+E+(u.rarity==='e'?LU_CARD.pip_dy_e:0),tot=u.max*LU_CARD.pip_step-4,sx=90-tot/2;
   for(let q=0;q<u.max;q++){const key=q<cur?'lu_pip_full':'lu_pip_empty',p=s.textures.exists(key)?uiFit(s.add.image(sx+q*LU_CARD.pip_step,py,key).setOrigin(0)):s.add.circle(sx+q*16+6,py+6,5,q<cur?0xc0392b:0x222222).setOrigin(.5);g.add(p);pips.push(p)}}
  const foc=s.add.container(0,0).setVisible(false);tallFrame(s,foc,s.textures.exists('lu_card_focus')?'lu_card_focus':null,E,null);g.add(foc);
  bg.setInteractive({useHandCursor:true}).on('pointerover',()=>this.setFocus(i)).on('pointerdown',()=>{this.setFocus(i);this.pick(i)});
  this.c.addAt(g,this.c.getIndex(this.header));
  return{g,bg,foc,u,tl,dt,cardP:{w:180,h:H,tx0:90-tw/2,tw,textBot:y,pipTop:LU_CARD.pip_y+E+(u.rarity==='e'?LU_CARD.pip_dy_e:0)},info:{id:u.id,rarity:u.rarity,title:T.title,desc:T.desc,titleSc:T.ts,descSc:T.ds,cur,iconKey:ik,iconFallback:fb,pips:pips.length,extraH:E}}}
 // Portrait: each offer is a row = slim card (frame top + icon, frame bottom + pips) at left, large text on a plate at right.
 // Text sizes are set from CSS-px targets (cap height): title >= title_cap_css, description >= desc_cap_css.
 buildRows(LJp,css){const s=this.s,gw=s.scale.gw,gh=s.scale.gh,si=safeInsets(s),M=LJp.margin,n=this.offer.length,Q=LJp.rows||{};
  const capH=fontCapH(s),tsT=Math.max(LU_CARD.title_sc,(Q.title_cap_css||12.5)/css/capH),dsT=Math.max(LU_CARD.desc_sc,(Q.desc_cap_css||10.5)/css/capH);
  const avail=gh-si.t-si.b-2*M,fixed=LJp.headerHalf+LJp.padTop+LJp.padBot+(n-1)*LJp.gap,rhMax=Math.min(Q.max_h||330,(avail-fixed)/n);
  const RW=Math.round(gw-si.l-si.r-2*M-2*(Q.side_pad||22)),SH=LU_SLIM.h;
  // thumbnail scale: as large as the row height allows, but leave the text plate enough width for every line at full size
  let kt=Math.min(rhMax/SH,(RW*(Q.thumb_max_frac||.42))/180),fit;
  const plan=k=>{const tw=RW-180*k-(Q.gap||14)-2*(Q.plate_pad||14);return{tw,rows:this.offer.map(u=>rowText(s.lvState(),u,tw,tsT,dsT))}};
  for(;;){fit=plan(kt);if(fit.rows.every(r=>r.ok)||kt<=.6)break;kt-=.02}
  const rh=Math.max(Math.round(SH*kt),...fit.rows.map(r=>r.h+2*(Q.plate_pad||14)));
  this.cards=this.offer.map((u,i)=>this.makeRow(u,i,kt,rh,RW,fit.rows[i],Q));
  const V=fixed+rh*n,top=Math.round(si.t+M+(avail-V)/2)+LJp.headerHalf,ph=V-LJp.headerHalf,pw=RW+2*(Q.side_pad||22),cx=Math.round(si.l+(gw-si.l-si.r)/2);
  this.rowGeo={top,ph,pw,px:cx-pw/2,cx,rx:cx-RW/2,rh,RW,kt,tw:fit.tw,css,capH}}
 makeRow(u,i,kt,rh,RW,T,Q){const s=this.s,g=s.add.container(0,0),fk=s.textures.exists(RARITY[u.rarity].frame)?RARITY[u.rarity].frame:null,st=s.lvState(),cur=upLevel(st,u);
  const th=Math.round(LU_SLIM.h*kt),ty=Math.round((rh-th)/2),pp=Q.plate_pad||14,px=Math.round(180*kt+(Q.gap||14));
  const plate=luPlate(s,'lu_plate_'+u.rarity,px,0,RW-px,rh)||s.add.rectangle(px,0,RW-px,rh,0x120c08,.88).setOrigin(0).setStrokeStyle(2,RARITY[u.rarity].col||0x6b5a40);g.add(plate);
  const foc=s.add.container(0,0).setVisible(false),fp=luPlate(s,'lu_plate_focus',px-3,-3,RW-px+6,rh+6);
  foc.add(s.add.rectangle(-2,-2,RW+4,rh+4).setOrigin(0).setStrokeStyle(2,0xffc030,fp?.3:1));if(fp)foc.add(fp);g.add(foc);
  const t=s.add.container(0,ty).setScale(kt);g.add(t);const bg=slimFrame(s,t,fk);
  let ik='lu_icon_'+(u.icon||u.id),fb=false;if(!s.textures.exists(ik)){ik=u.ab?AB_ICON[u.ab]:AB_ICON.Q;if(!s.textures.exists(ik))ik='font';fb=true}
  const ic=s.add.image(90,LU_CARD.icon_cy[u.rarity],ik).setOrigin(.5);if(UI_DISP[ik])uiFit(ic);ic.setDisplaySize(64,64);t.add(ic);
  const pips=[];if(isFinite(u.max)){const py=LU_SLIM.pip_y+(u.rarity==='e'?LU_CARD.pip_dy_e:0),step=Math.min(LU_CARD.pip_step,140/u.max),tot=u.max*step-4,sx=90-tot/2;
   for(let k=0;k<u.max;k++){const key=k<cur?'lu_pip_full':'lu_pip_empty',p=s.textures.exists(key)?uiFit(s.add.image(sx+k*step,py,key).setOrigin(0)):s.add.circle(sx+k*step+6,py+6,5,k<cur?0xc0392b:0x222222).setOrigin(.5);t.add(p);pips.push(p)}}
  const x0=px+pp;let y=Math.round((rh-T.h)/2);const tl=T.title.map(l=>{const o=spriteText(s,x0,y,l,T.ts,0xecdec4);y+=T.tLine;g.add(o);return o});y+=T.gap;
  const dt=T.desc.map(l=>{const o=spriteText(s,x0,y,l,T.ds,0xc8baa0,{raw:true});y+=T.dLine;g.add(o);return o});
  for(const h of[plate,bg])h.setInteractive({useHandCursor:true}).on('pointerover',()=>this.setFocus(i)).on('pointerdown',()=>{this.setFocus(i);this.pick(i)});
  this.c.addAt(g,this.c.getIndex(this.header));
  return{g,bg,foc,u,tl,dt,row:{w:RW,h:rh,x0,tw:RW-px-2*pp,plate:{x:px,w:RW-px}},info:{id:u.id,rarity:u.rarity,title:T.title,desc:T.desc,titleSc:T.ts,descSc:T.ds,cur,iconKey:ik,iconFallback:fb,pips:pips.length,fits:T.ok}}}
 rects(){window.LVLUP_RECTS=this.cards.map(k=>k.cardP?{x:k.g.x,y:k.g.y,w:180*k.g.scaleX,h:k.cardP.h*k.g.scaleY}:k.row?{x:k.g.x,y:k.g.y,w:k.row.w,h:k.row.h}:{x:k.g.x,y:k.g.y,w:180*k.g.scaleX,h:260*k.g.scaleY});const P=this.panelP&&this.panelP.visible?this.panelP:this.panel;
  if(P)window.LVLUP_RECTS.panel={x:P.x,y:P.y,w:P.displayWidth,h:P.displayHeight};const h=this.header;window.LVLUP_RECTS.header={x:h.x-(h.displayWidth||0)/2,y:h.y-(h.displayHeight||0)/2,w:h.displayWidth||0,h:h.displayHeight||0}}
 setFocus(i){this.focus=i;this.cards.forEach((k,j)=>k.foc.setVisible(j===i));if(window.LVLUP)LVLUP.focus=i}
 onKey(ev){const k=ev.key,n=this.cards.length;if(k>='1'&&k<=String(n))return this.pick(+k-1);
  if(k==='ArrowLeft'||k==='ArrowUp')return this.setFocus((this.focus+n-1)%n);if(k==='ArrowRight'||k==='ArrowDown')return this.setFocus((this.focus+1)%n);
  if(k==='Enter'||k===' ')return this.pick(this.focus)}
 pick(i){if(this.done)return;if(performance.now()-this.t0<300){window.LVLUP&&(LVLUP.ignored=(LVLUP.ignored||0)+1);return}const k=this.cards[i];if(!k)return;this.done=true;this.close();this.onPick(k.u)}
 close(){this.s.input.keyboard.off('keydown',this.key);this.c.destroy();window.LVLUP={open:false}}}
// slim portrait card: frame rows 0..top and bottom..260 of the card art, stacked (drops the empty text panel)
const LU_SLIM={top:138,bot:222,get h(){return this.top+260-this.bot},get pip_y(){return LU_CARD.pip_y-(this.bot-this.top)}};
// 9-slice text plate: built at source-texture size (insets 12 display px * tier scale) then scaled down, so the rim maps 1:1 to source pixels.
function luPlate(s,key,x,y,w,h){if(!s.textures.exists(key))return null;const S=HD_TIER==='_hd'?4:2,I=12*S;
 return s.add.nineslice(x,y,key,null,Math.round(w*S),Math.round(h*S),I,I,I,I).setOrigin(0).setScale(1/S)}
function slimFrame(s,t,fk){if(!fk){const r=s.add.rectangle(0,0,180,LU_SLIM.h,0x1a1410).setOrigin(0).setStrokeStyle(3,0x6b5a40);t.add(r);return r}
 const a=uiFit(s.add.image(0,0,fk).setOrigin(0)),b=uiFit(s.add.image(0,0,fk).setOrigin(0)),f=a.frame.width/180;
 a.setCrop(0,0,a.frame.width,LU_SLIM.top*f);b.setCrop(0,LU_SLIM.bot*f,b.frame.width,(260-LU_SLIM.bot)*f);b.y=-(LU_SLIM.bot-LU_SLIM.top);t.add(a);t.add(b);
 const hit=s.add.rectangle(0,0,180,LU_SLIM.h,0,0).setOrigin(0);t.add(hit);return hit}
// cap height of the HD font in game units at scale 1 (white fill rows of 'H' in the generated atlas)
function fontCapH(s){if(window.FONT_CAP)return FONT_CAP;try{const src=s.textures.get('font').getSourceImage(),fw=src.width/FONT_CHARS.length,fh=src.height,c=document.createElement('canvas');c.width=fw;c.height=fh;const x=c.getContext('2d');
 x.drawImage(src,FONT_CHARS.indexOf('H')*fw,0,fw,fh,0,0,fw,fh);const d=x.getImageData(0,0,fw,fh).data;let t=1e9,b=-1;for(let y=0;y<fh;y++)for(let i=0;i<fw;i++){const k=(y*fw+i)*4;if(d[k]>200&&d[k+3]>200){t=Math.min(t,y);b=Math.max(b,y)}}
 window.FONT_CAP=b>=t?(b-t+1)/FONT_X:10.5}catch(e){window.FONT_CAP=10.5}return FONT_CAP}
// portrait row text: title at ts (wraps to 2 lines -> description forced to 1 line), description at ds (1-2 lines). ok=false if anything would not fit.
function rowText(st,u,tw,ts,ds){const W_=(str,sc)=>textW(str)*sc,name=u.name.toUpperCase(),d=u.desc(upLevel(st,u)+1);let title=[name],ok=true;
 if(W_(name,ts)>tw){title=wrap2(name,w=>W_(w,ts)<=tw);if(title.some(l=>W_(l,ts)>tw))ok=false}
 let desc;if(title.length>1){desc=[d];if(W_(d,ds)>tw)ok=false}else{desc=W_(d,ds)<=tw?[d]:wrap2(d,w=>W_(w,ds)<=tw);if(desc.some(l=>W_(l,ds)>tw))ok=false}
 const tLine=Math.round(17*ts),dLine=Math.round(17*ds),gap=Math.round(6*ds);return{title,desc,ts,ds,tLine,dLine,gap,ok,h:title.length*tLine+gap+desc.length*dLine-Math.round(3*ds)}}
function textW(str){let w=0;for(const ch of str)w+=FONT_ADV[ch]||9;return w}
function wrap2(str,fits){const w=str.split(' ');if(w.length<2)return[str];let best=null;for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' '),b=w.slice(i).join(' ');const ok=fits(a)&&fits(b),m=Math.max(textW(a),textW(b));if(!best||(ok&&!best.ok)||(ok===best.ok&&m<best.m))best={l:[a,b],ok,m}}return best.l}
// portrait tall card: frame image split at the text panel's middle band (TALL_BAND, display px) which is stretched by E
const TALL_BAND=[176,200];
function tallFrame(s,g,fk,E,fill){if(!fk){const r=s.add.rectangle(0,0,180,260+E,fill??0,fill==null?0:1).setOrigin(0).setStrokeStyle(fill==null?4:3,fill==null?0xffc030:0x6b5a40);g.add(r);return r}
 const [b0,b1]=TALL_BAND,mk=()=>uiFit(s.add.image(0,0,fk).setOrigin(0)),a=mk(),m=mk(),b=mk(),f=a.frame.width/180;
 a.setCrop(0,0,a.frame.width,b0*f);b.setCrop(0,b1*f,b.frame.width,(260-b1)*f);b.y=E;
 // middle band: a separate crop scaled vertically so it spans (b1-b0)+E display px
 m.setCrop(0,b0*f,m.frame.width,(b1-b0)*f);const sy=(b1-b0+E)/(b1-b0);m.scaleY*=sy;m.y=b0-b0*sy;
 g.add(a);g.add(m);g.add(b);const hit=s.add.rectangle(0,0,180,260+E,0,0).setOrigin(0);g.add(hit);return hit}
// greedy word wrap into any number of lines; a word wider than the line is hyphenated (preferred split points first)
const LU_HYPH={BLOODTHIRST:['BLOOD','THIRST'],WHIRLWIND:['WHIRL','WIND'],BERSERKER:['BERSERK','ER'],COOLDOWNS:['COOL','DOWNS']};
function wrapN(str,fits){const tk=[];// tokens {t,j}: j=true -> hyphen piece, may join the next piece with no space
 for(const w of str.split(' ')){if(fits(w)){tk.push({t:w});continue}const h=LU_HYPH[w.toUpperCase()];let r=w;
  if(h&&fits(w.slice(0,h[0].length)+'-')){tk.push({t:w.slice(0,h[0].length),j:true});r=w.slice(h[0].length)}
  while(!fits(r)){let i=r.length-1;while(i>1&&!fits(r.slice(0,i)+'-'))i--;tk.push({t:r.slice(0,i),j:true});r=r.slice(i)}tk.push({t:r})}
 const out=[];let cur=null,pj=false;
 for(const k of tk){if(cur===null){cur=k.t;pj=k.j;continue}const cand=pj?cur+k.t:cur+' '+k.t;
  if(fits(cand+(k.j?'-':''))){cur=cand;pj=k.j}else{out.push(pj?cur+'-':cur);cur=k.t;pj=k.j}}
 if(cur!==null)out.push(cur);return out}
function cardTextP(st,u,tw,ts,ds){const W_=(str,sc)=>textW(str)*sc,name=u.name.toUpperCase(),d=u.desc(upLevel(st,u)+1);
 const title=wrapN(name,w=>W_(w,ts)<=tw),desc=wrapN(d,w=>W_(w,ds)<=tw),tLine=Math.round(18*ts/LU_CARD.title_sc),dLine=Math.round(15*ds/LU_CARD.desc_sc),gap=8;
 const ok=[...title.map(l=>W_(l,ts)),...desc.map(l=>W_(l,ds))].every(w=>w<=tw+.01);
 return{title,desc,ts,ds,tLine,dLine,gap,ok,h:title.length*tLine+gap+desc.length*dLine}}
