// ===== Last Orc - open world scaffold (placeholders). Everything on screen is a sprite (Image/TileSprite/Container of Images). =====
// Graphics/canvas are used ONLY at boot to generate placeholder textures; no Graphics/Text objects live in the scenes.
const ORIENT_FORCE=new URLSearchParams(location.search).get('orient');
const wantPortrait=()=>ORIENT_FORCE?ORIENT_FORCE==='portrait':innerHeight>innerWidth;
const isPortrait=s=>s.scale.gh>s.scale.gw;
const FONT_X=4;const FONT_CHARS=' 0123456789:/-+.!ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function applyLayout(s){if(!isPortrait(s)||!window.LJ_P){window.LJ=LJ_L;return}
 // Portrait menu: fit to the real screen with safe margins. Logo scaled to fit the width and pinned to the top,
 // panel (+ its buttons/sliders, unscaled so slider math stays exact) pinned to the bottom, orc fitted in the gap
 // so his rock only tucks a little behind the panel top (no more cut-off legs/axe).
 const B=PORTRAIT.base,gw=s.scale.gw,gh=s.scale.gh,si=safeInsets(s),M=PORTRAIT.margin||28,ox=Math.round((gw-B.w)/2),m=Object.assign({},LJ_L);
 const lg=LJ_P.logo,lt=s.textures.exists(lg.tex)?s.textures.get(lg.tex).getSourceImage():{width:676,height:228};
 const ls=Math.min(lg.s||1,(gw-2*M-si.l-si.r)/lt.width),lw=lt.width*ls,lx=Math.round(si.l+(gw-si.l-si.r-lw)/2),ly=Math.round(si.t+M+Math.max(0,(gh-B.h)*0.25));
 const pBottom=gh-si.b-M,pdy=Math.round(pBottom-1016),pTop=690+pdy;
 const orc=LJ_P.orc_on_rock,ot=s.textures.exists(orc.tex)?s.textures.get(orc.tex).getSourceImage():{width:540,height:448},tuck=PORTRAIT.orcTuck||44;
 const top=ly+lt.height*ls+6,os=Math.min((orc.s||1)*1.2,(pTop+tuck-top)/ot.height,(gw-2*M)/ot.width),ow=ot.width*os,oxx=Math.round((gw-ow)/2),oyy=Math.round(pTop+tuck-ot.height*os);
 for(const[k,v]of Object.entries(LJ_P)){if(k[0]==='_')continue;if(typeof v!=='object'){m[k]=v+ox;continue}m[k]=Object.assign({},v);if(v.cover)continue;
  if(k.startsWith('logo')){m[k].x=lx;m[k].y=ly;m[k].s=ls}else if(k.startsWith('orc')){m[k].x=oxx;m[k].y=oyy;m[k].s=os}
  else{if('x'in v)m[k].x=v.x+ox;if('y'in v)m[k].y=v.y+pdy}}
 window.LJ=m}
// safe-area insets in game px
function safeInsets(s){let d=document.getElementById('safeprobe');if(!d){d=document.createElement('div');d.id='safeprobe';
  d.style.cssText='position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';document.body.appendChild(d)}
 const cs=getComputedStyle(d),k=(s.scale.displayScale.x||1)/RS,f=p=>Math.ceil((parseFloat(cs[p])||0)*k);
 return {t:f('paddingTop'),r:f('paddingRight'),b:f('paddingBottom'),l:f('paddingLeft')}}
const UI_MAP={ability_slot:'slot',pause_button:'pause_btn',joy_base:'joy_base',joy_knob:'joy_knob',hud_frame:'hud_frame',hud_portrait_rage:'hud_portrait_rage',hp_bar_frame:'hp_bar_frame',hp_fill:'bar_hp',xp_bar_frame:'xp_bar_frame',xp_fill:'bar_xp',
 icon_axe_cleave:'icon_axe_cleave',icon_whirlwind:'icon_whirlwind',icon_war_stomp:'icon_war_stomp',icon_rage_roar:'icon_rage_roar',panel_pause:'ui_panel_pause',button_home:'ui_button_home',button_home_hover:'ui_button_home_hover',
 menu_bg_portrait:'ui_menu_bg_portrait',orc_on_rock_portrait:'ui_orc_on_rock_portrait',fx_vignette_portrait:'fx_vignette_portrait',fx_ember:'fx_ember_single',chip_wave:'chip_wave',chip_timer:'chip_timer'};
function loadWorldAssets(s){const U='../assets/ui/';for(const[f,k]of Object.entries(UI_MAP)){if(UI_HD[f]){s.load.image(k,U+f+HD_TIER+'.png?v='+ASSET_V);UI_DISP[k]=UI_HD[f]}else s.load.image(k,U+f+'.png?v='+ASSET_V)}
for(const[k,f]of Object.entries(RAGE.files))if(f)s.load.spritesheet(RAGE.keys[k],f,{frameWidth:RAGE.frameW,frameHeight:RAGE.frameH});
 for(const m of Object.values(MOOD))if(m.file){if(m.frame)s.load.spritesheet(m.key,m.file,{frameWidth:m.frame,frameHeight:m.frame});else s.load.image(m.key,m.file)}}
function genWorldTextures(s){const T=s.textures,g=s.make.graphics({},false),mk=(k,w,h,fn)=>{if(T.exists(k))return;g.clear();fn(g);g.generateTexture(k,w,h)};
 const cv=(k,w,h,fn)=>{if(T.exists(k))return T.get(k);const t=T.createCanvas(k,w,h);fn(t.getContext());t.refresh();return t};
 // Rage neutral placeholder (grey capsule + facing notch), same art for every key until real sheets arrive
 const rageArt=gg=>{gg.fillStyle(0x000000,.35).fillEllipse(24,58,34,10);gg.fillStyle(0x7d8078).fillRoundedRect(10,10,28,48,12);gg.fillStyle(0xa9aca3).fillRoundedRect(14,14,20,16,8);gg.fillStyle(0x34362f).fillRect(30,30,8,6)};
 for(const k of Object.values(RAGE.keys).filter(k=>k!==RAGE.keys.portrait))mk(k,RAGE.frameW,RAGE.frameH,rageArt);
 mk(RAGE.keys.portrait,56,56,gg=>{gg.fillStyle(0x7d8078).fillCircle(28,28,26);gg.fillStyle(0xa9aca3).fillCircle(28,22,12)});
 for(const[id,e]of Object.entries(ENEMIES)){const[w,h]=e.size,art=(gg,c)=>{gg.fillStyle(0x000000,.35).fillEllipse(w/2,h-4,w*.9,8);gg.fillStyle(c).fillRoundedRect(2,2,w-4,h-8,6);gg.fillStyle(0x111111).fillRect(w*.3,h*.2,3,3).fillRect(w*.6,h*.2,3,3);
   if(id==='demon'){gg.fillStyle(c).fillTriangle(0,10,8,2,8,22).fillTriangle(w,10,w-8,2,w-8,22)}};mk('en_'+id,w,h,gg=>art(gg,e.color));mk('en_'+id+'_w',w,h,gg=>art(gg,0xffffff))}
 mk('prop_rock',40,26,gg=>{gg.fillStyle(0x4a4740).fillEllipse(20,15,38,22);gg.fillStyle(0x5e5a51).fillEllipse(16,11,18,10)});
 mk('prop_tree',44,80,gg=>{gg.fillStyle(0x000000,.3).fillEllipse(22,76,30,8);gg.fillStyle(0x3a2617).fillRect(19,50,6,28);gg.fillStyle(0x1f2b1a).fillTriangle(22,0,2,56,42,56)});
 mk('prop_bones',26,12,gg=>{gg.fillStyle(0xbdb59d).fillRect(2,5,22,3).fillCircle(4,6,3).fillCircle(22,6,3)});
 mk('prop_torch',12,40,gg=>{gg.fillStyle(0x3a2617).fillRect(5,10,3,30);gg.fillStyle(0xff7a1a).fillCircle(6,7,5);gg.fillStyle(0xffd060).fillCircle(6,8,2)});
 mk('prop_canopy',220,140,gg=>{gg.fillStyle(0x0b0d08,1).fillEllipse(110,70,220,140)});
 mk('xp_gem',12,16,gg=>{gg.fillStyle(0x2fd35a).fillTriangle(6,0,0,8,12,8).fillTriangle(0,8,12,8,6,16);gg.fillStyle(0xb8ffcb).fillRect(5,4,2,3)});
 mk('slash',72,72,gg=>{gg.lineStyle(6,0xffe0c0,1).beginPath().arc(36,36,30,-1.1,1.1).strokePath();gg.lineStyle(2,0xff3020,1).beginPath().arc(36,36,24,-.9,.9).strokePath()});
 mk('ring',128,128,gg=>{gg.lineStyle(6,0xff4020,.9).strokeCircle(64,64,60)});
 // HUD
 mk('hud_frame',68,68,gg=>{gg.fillStyle(0x1a1210).fillRect(0,0,68,68);gg.lineStyle(3,0x8a8070).strokeRect(2,2,64,64)});
 mk('hud_badge',30,30,gg=>{gg.fillStyle(0x1a1210).fillCircle(15,15,14);gg.lineStyle(2,0xc9a24a).strokeCircle(15,15,13)});
 mk('bar_bg',224,24,gg=>{gg.fillStyle(0x120c0a).fillRect(0,0,224,24);gg.lineStyle(2,0x8a8070).strokeRect(1,1,222,22)});
 mk('bar_hp',220,20,gg=>{gg.fillStyle(0xa01818).fillRect(0,0,220,20);gg.fillStyle(0xd83a2a).fillRect(0,2,220,4)});
 mk('bar_xp',220,8,gg=>{gg.fillStyle(0xd59a1e).fillRect(0,0,220,8);gg.fillStyle(0xffd060).fillRect(0,1,220,2)});
 mk('hud_chip',64,30,gg=>{gg.fillStyle(0x1a1210,.9).fillRect(0,0,64,30);gg.lineStyle(2,0x6a6050).strokeRect(1,1,62,28)});
 mk('slot',72,72,gg=>{gg.fillStyle(0x1a1210).fillRect(0,0,72,72);gg.lineStyle(3,0x8a8070).strokeRect(2,2,68,68)});
 if(!T.exists('slot_cd')){const N=CD_SWEEP.frames,c=T.createCanvas('slot_cd',72*N,72),x=c.getContext();x.fillStyle='rgba(0,0,0,'+CD_SWEEP.alpha+')';
  for(let i=0;i<N;i++){const f=1-i/N;x.save();x.beginPath();x.rect(i*72+4,4,64,64);x.clip();x.beginPath();x.moveTo(i*72+36,36);x.arc(i*72+36,36,60,-Math.PI/2,-Math.PI/2+f*Math.PI*2*(CD_SWEEP.clockwise?1:-1),!CD_SWEEP.clockwise);x.closePath();x.fill();x.restore();c.add(i,0,i*72,0,72,72)}c.refresh()}
 mk('ab_cleave',56,56,gg=>{gg.lineStyle(7,0xd82a1a).beginPath().arc(28,28,20,-2.4,0.8).strokePath()});
 mk('ab_locked',56,56,gg=>{gg.fillStyle(0x3a3430).fillRect(18,26,20,18);gg.lineStyle(4,0x3a3430).strokeCircle(28,24,8)});
 mk('pause_btn',66,66,gg=>{gg.fillStyle(0x1a1210,.9).fillRoundedRect(0,0,66,66,10);gg.lineStyle(3,0x8a8070).strokeRoundedRect(2,2,62,62,9);gg.fillStyle(0xe8d8b0).fillRect(22,18,8,30).fillRect(37,18,8,30)});
 mk('joy_base',128,128,gg=>{gg.fillStyle(0x000000,.35).fillCircle(64,64,62);gg.lineStyle(3,0xe8d8b0,.6).strokeCircle(64,64,60)});
 mk('joy_knob',60,60,gg=>{gg.fillStyle(0xe8d8b0,.75).fillCircle(30,30,28);gg.lineStyle(3,0x1a1210,.8).strokeCircle(30,30,26)});
 mk('px',4,4,gg=>{gg.fillStyle(0xffffff).fillRect(0,0,4,4)});
 mk(MOOD.embers.key,4,4,gg=>{gg.fillStyle(0xff8a2a).fillRect(0,0,4,4)});
 cv(MOOD.vignette.key,256,144,c=>{const r=c.createRadialGradient(128,72,40,128,72,150);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=r;c.fillRect(0,0,256,144)});
 // placeholder pause-panel HOME button (menu-ish serif lettering) normal/hover
 for(const[k,col]of[['ph_home_normal','#cdbb98'],['ph_home_hover','#fff2cc']])cv(k,84,32,c=>{c.font='bold 22px Georgia,serif';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#1a1210';c.strokeText('HOME',4,17);c.fillStyle=col;c.fillText('HOME',4,17)});
 // sprite font sheet: baked at 4x (FONT_X) with an outline, drawn at 1/FONT_X with LINEAR so it stays crisp at device DPR
 const X=FONT_X,fw=12*X,fh=16*X,ff=window.HUD_FONT?`700 ${13*X}px ${HUD_FONT}`:`bold ${13*X}px monospace`;window.FONT_ADV={};
 const ft=cv('font',fw*FONT_CHARS.length,fh,c=>{c.font=ff;c.textBaseline='middle';c.textAlign='center';c.lineJoin='round';c.lineWidth=3*X;c.strokeStyle='#000';c.fillStyle='#fff';
  [...FONT_CHARS].forEach((ch,i)=>{const cx=i*fw+fw/2,cy=fh/2+X*0.5;c.strokeText(ch,cx,cy);c.fillText(ch,cx,cy);FONT_ADV[ch]=Math.ceil(c.measureText(ch).width/X)+1})});
 FONT_ADV[' ']=5;{const m=Math.max(...[...'0123456789'].map(d=>FONT_ADV[d]));for(const d of '0123456789')FONT_ADV[d]=m}[...FONT_CHARS].forEach((ch,i)=>{if(!ft.has('c'+i))ft.add('c'+i,0,i*fw,0,fw,fh)});ft.setFilter(Phaser.Textures.FilterMode.LINEAR);g.destroy()}
// sprite text: container of glyph images
function spriteText(s,x,y,str,scale=1,tint=0xffffff){const c=s.add.container(x,y);c.sc=scale;c.tint=tint;c.setText=t=>{t=String(t).toUpperCase();if(t===c.txt)return c;c.txt=t;
  while(c.list.length<t.length)c.add(s.add.image(0,0,'font','c0').setOrigin(0));
  let ax=0;c.list.forEach((im,i)=>{if(i<t.length){const j=Math.max(0,FONT_CHARS.indexOf(t[i])),adv=FONT_ADV[t[i]]||9;im.setFrame('c'+j).setVisible(true).setPosition((ax+adv/2-6)*c.sc,0).setScale(c.sc/FONT_X).setTint(c.tint);ax+=adv}else im.setVisible(false)});c.tw=ax*c.sc;c.th=14*c.sc;return c};return c.setText(str)}
const fmtT=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
function hash(a,b){let h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return()=>{h=(h+0x6D2B79F5)|0;let t=Math.imul(h^(h>>>15),1|h);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}

class Game extends Phaser.Scene{constructor(){super('Game')}
 create(){AUDIO.start();const R_=RAGE;this.st={hp:R_.hp,xp:0,level:1,need:XP.base,wave:1,waveT:0,elapsed:0,kills:0,spawned:0,gemsDropped:0,gemsCollected:0,hits:0,dmg:0,queue:0,spawnAcc:0,waveLog:[]};
  this.physics.world.setBounds(-1e7,-1e7,2e7,2e7);
  this.rage=this.physics.add.sprite(0,0,R_.keys.idle).setOrigin(.5,R_.anchorY);this.rage.body.setSize(28,16).setOffset(10,R_.frameH*R_.anchorY-14);
  const cam=this.cameras.main;cam.startFollow(this.rage,true,WORLD.camLerp,WORLD.camLerp);cam.setFollowOffset(this.scale.gw/2,this.scale.gh/2);cam.setRoundPixels(true);
  this.chunks=new Map();this.chunkPool=[];this.propPool=[];
  this.enemies=[];this.enemyPool=[];this.gems=[];this.gemPool=[];this.fxPool=[];this.numPool=[];
  // parallax foreground canopy (scrollFactor>1), recycled around the camera
  this.canopy=[];for(let i=0;i<5;i++)this.canopy.push(this.add.image(0,0,'prop_canopy').setScrollFactor(1.25).setAlpha(.22).setDepth(9e5));
  this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ESC,P');
  this.dashUntil=0;this.dashReady=0;this.face=new Phaser.Math.Vector2(1,0);this.atkCd=0;this.abCd={Q:ABILITIES.Q.cooldownMs*0.5};this.invuln=0;
  this.buildHUD();this.buildJoystick();this.buildMood();
  this.keys.ESC.on('down',()=>this.openPause());this.keys.P.on('down',()=>this.openPause());
  this.scale.on('resize',this.onResize,this);this.events.once('shutdown',()=>this.scale.off('resize',this.onResize,this));
  this.events.on('resume',()=>{this.joyEnd()});
  this.fpsS=[];window.WSTATS=this.st;window.WORLD_SCENE=this;
  this.updateChunks(true);this.st.queue=this.waveCount(1);this.st.waveLog.push({wave:1,count:this.st.queue,hpMul:1,speedMul:1})}
 onResize(){this.cameras.main.setFollowOffset(this.scale.gw/2,this.scale.gh/2);this.layoutHUD()}
 openPause(){if(this.over||this.scene.isPaused())return;this.joyEnd();this.scene.pause();this.scene.launch('Pause');AUDIO.blip()}
 waveCount(w){return WAVES.baseCount+WAVES.countPerWave*(w-1)}
 mul(w){return{hp:1+WAVES.hpMulPerWave*(w-1),sp:Math.min(WAVES.maxSpeedMul,1+WAVES.speedMulPerWave*(w-1))}}
 // ---------- HUD (all sprites, scrollFactor 0) ----------
 buildHUD(){const D=1e6,a=(x,y,k)=>uiFit(this.add.image(x,y,k)).setOrigin(0).setScrollFactor(0).setDepth(D);
  const h=this.hud={};h.frame=a(0,0,'hud_frame');h.face=a(0,0,this.textures.exists('hud_portrait_rage')?'hud_portrait_rage':RAGE.keys.portrait);h.frame.setDepth(D+0.5);h.badge=a(0,0,'hud_badge');h.lvl=spriteText(this,0,0,'1',1,0xffd060).setScrollFactor(0).setDepth(D+1);
  h.hpBg=a(0,0,'hp_bar_frame');h.hp=a(0,0,'bar_hp');h.hpTxt=spriteText(this,0,0,'',1,0xffffff).setScrollFactor(0).setDepth(D+1);h.xpBg=a(0,0,'xp_bar_frame');h.xp=a(0,0,'bar_xp');h.hp.setDepth(D+0.2);h.xp.setDepth(D+0.2);
  h.waveBg=a(0,0,this.textures.exists('chip_wave')?'chip_wave':'hud_chip');h.wave=spriteText(this,0,0,'WAVE 1',1,0xe8d8b0).setScrollFactor(0).setDepth(D+1);
  h.timeBg=a(0,0,this.textures.exists('chip_timer')?'chip_timer':'hud_chip');h.time=spriteText(this,0,0,'00:00',1,0xe8d8b0).setScrollFactor(0).setDepth(D+1);
  h.pause=a(0,0,'pause_btn');h.pause.setInteractive({useHandCursor:true,hitArea:padHitS(h.pause,66,66),hitAreaCallback:Phaser.Geom.Rectangle.Contains}).on('pointerdown',(p,x,y,ev)=>{ev&&ev.stopPropagation&&ev.stopPropagation();this.openPause()});
  h.slots=['Q','W','E','R'].map(k=>{const A=ABILITIES[k],s={k,bg:a(0,0,'slot'),icon:a(0,0,A.icon).setAlpha(A.id==='locked'?0.45:1),cd:a(0,0,'slot_cd').setVisible(false)};return s});
  this.layoutHUD()}
 layoutHUD(){const W=this.scale.gw,H=this.scale.gh,P=isPortrait(this),L=HUD[P?'portrait':'landscape'],si=P?safeInsets(this):{t:0,r:0,b:0,l:0},h=this.hud;
  const X=o=>o.right!=null?W-si.r-o.right:si.l+o.x,Y=(o,hh)=>o.bottom!=null?H-si.b-o.bottom-hh:si.t+o.y;
  const px=si.l+L.portrait.x,py=si.t+L.portrait.y;h.frame.setPosition(px,py);h.face.setPosition(px+11,py+7).setDisplaySize(50,52);h.badge.setPosition(px-6,py+46).setVisible(!this.textures.exists('hud_portrait_rage'));h.lvlC=[px+72.5,py+60];h.lvl.setPosition(Math.round(px+72.5-h.lvl.tw/2),Math.round(py+60-8));
  h.hpBg.setPosition(si.l+L.hp.x,si.t+L.hp.y);h.hp.setPosition(si.l+L.hp.x,si.t+L.hp.y);h.hpTxt.setPosition(si.l+L.hp.x+70,si.t+L.hp.y+3);
  h.xpBg.setPosition(si.l+L.xp.x,si.t+L.xp.y);h.xp.setPosition(si.l+L.xp.x,si.t+L.xp.y);
  const cW=h.waveBg.displayWidth,cT=h.timeBg.displayWidth,cH=h.waveBg.displayHeight;
  if(P){h.waveBg.setPosition(W-si.r-12-cW,si.t+12);h.timeBg.setPosition(W-si.r-12-cT,si.t+12+cH+6)}
  const pb=L.pause;h.pause.setPosition(W-si.r-pb.right-66,pb.bottom!=null?H-si.b-pb.bottom-66:si.t+pb.y);
  if(!P){const cy=Math.round(h.pause.y+33-cH/2);h.timeBg.setPosition(h.pause.x-8-cT,cy);h.waveBg.setPosition(h.timeBg.x-8-cW,cy)}
  this.centerChips();
  const S=L.slots,sz=S.size,sc=sz/72,n=4,tw=n*sz+(n-1)*S.gap,x0=S.cx!=null?Math.round(W*S.cx-tw/2):si.l+S.left,y0=H-si.b-S.bottom-sz-14;
  h.slots.forEach((s,i)=>{const x=x0+i*(sz+S.gap);s.bg.setPosition(x,y0).setScale(sc*uiS(s.bg));s.icon.setPosition(x+8*sc,y0+8*sc).setScale(sc*uiS(s.icon));s.cd.setPosition(x,y0).setScale(sc)});
  this.hudRect={slotsTop:y0};if(this.vig&&this.vig.scene){const vk=P&&this.textures.exists('fx_vignette_portrait')?'fx_vignette_portrait':MOOD.vignette.key;this.vig.setTexture(vk).setDisplaySize(W,H).setPosition(W/2,H/2)}}
 centerChips(){const h=this.hud;for(const[bg,t]of[[h.waveBg,h.wave],[h.timeBg,h.time]])t.setPosition(Math.round(bg.x+(bg.displayWidth-t.tw)/2),Math.round(bg.y+(bg.displayHeight-16)/2))}
 updateHUD(){const st=this.st,h=this.hud;h.hp.setCrop(0,0,Math.round(h.hp.frame.width*Math.max(0,st.hp)/RAGE.hp),h.hp.frame.height);h.hpTxt.setText(Math.ceil(Math.max(0,st.hp))+'/'+RAGE.hp);h.hpTxt.setPosition(Math.round(h.hpBg.x+(h.hpBg.displayWidth-h.hpTxt.tw)/2),Math.round(h.hpBg.y+(h.hpBg.displayHeight-16)/2));
  h.xp.setCrop(0,0,Math.round(h.xp.frame.width*Math.min(1,st.xp/st.need)),h.xp.frame.height);h.lvl.setText(st.level);if(h.lvlC)h.lvl.setPosition(Math.round(h.lvlC[0]-h.lvl.tw/2),Math.round(h.lvlC[1]-8));h.wave.setText('WAVE '+st.wave);h.time.setText(fmtT(st.elapsed));this.centerChips();
  for(const s of h.slots){const A=ABILITIES[s.k];if(!A.cooldownMs){s.cd.setVisible(false);continue}const f=Math.max(0,this.abCd[s.k]||0)/A.cooldownMs,N=CD_SWEEP.frames,i=Math.min(N-1,Math.floor((1-f)*N));s.cd.setVisible(f>0).setFrame(i);s.sweepFrame=f>0?i:-1}}
 // ---------- touch joystick ----------
 buildJoystick(){const D=1e6+5;this.joy={base:uiFit(this.add.image(0,0,'joy_base')).setScrollFactor(0).setDepth(D).setVisible(false),knob:uiFit(this.add.image(0,0,'joy_knob')).setScrollFactor(0).setDepth(D+1).setVisible(false),v:new Phaser.Math.Vector2(),ptr:null};
  this.input.on('pointerdown',(p,over)=>{if(over.length||this.joy.ptr)return;if(isPortrait(this)&&PY(p)<this.scale.gh*TOUCH.portraitZoneFrom)return;
   const j=this.joy;j.ptr=p;j.ox=PX(p);j.oy=PY(p);j.base.setPosition(j.ox,j.oy).setVisible(true);j.knob.setPosition(j.ox,j.oy).setVisible(true);j.v.set(0,0)});
  this.input.on('pointermove',p=>{const j=this.joy;if(j.ptr!==p)return;let dx=PX(p)-j.ox,dy=PY(p)-j.oy;const d=Math.hypot(dx,dy),R=TOUCH.joyRadius;if(d>R){dx*=R/d;dy*=R/d}
   j.knob.setPosition(j.ox+dx,j.oy+dy);const m=Math.min(1,d/R);j.v.set(m<TOUCH.deadzone?0:dx/R,m<TOUCH.deadzone?0:dy/R)});
  const end=p=>{if(this.joy.ptr===p)this.joyEnd()};this.input.on('pointerup',end);this.input.on('pointerupoutside',end)}
 joyEnd(){const j=this.joy;if(!j)return;j.ptr=null;j.v.set(0,0);j.base.setVisible(false);j.knob.setVisible(false)}
 // ---------- mood hooks (sprite vignette + sprite embers) ----------
 buildMood(){const V=MOOD.vignette;this.vig=null;if(V.enabled){this.vig=this.add.image(0,0,V.key).setScrollFactor(0).setDepth(9.5e5).setAlpha(V.alpha);if(V.tint!=null)this.vig.setTint(V.tint)}
  this.embers=[];this.emberAcc=0;if(this.hud)this.layoutHUD()}
 updateEmbers(dt){const E=MOOD.embers;if(!E.enabled)return;const cam=this.cameras.main;this.emberAcc+=dt*E.perSec/1000;
  while(this.emberAcc>=1){this.emberAcc--;let e=this.embers.find(x=>!x.visible);if(!e){e=this.add.image(0,0,E.key).setDepth(9.4e5);this.embers.push(e)}e.setFrame(Math.floor(Math.random()*4)%(this.textures.get(E.key).frameTotal-1||1));
   e.setPosition(cam.worldView.x+Math.random()*(cam.width/cam.zoom),cam.worldView.bottom).setVisible(true).setAlpha(E.alpha);e.life=Phaser.Math.Between(...E.lifeMs);e.t=0;e.vy=-Phaser.Math.Between(...E.rise);e.vx=Phaser.Math.Between(-12,12)}
  for(const e of this.embers)if(e.visible){e.t+=dt;e.x+=e.vx*dt/1000;e.y+=e.vy*dt/1000;e.setAlpha(E.alpha*(1-e.t/e.life));if(e.t>=e.life)e.setVisible(false)}}
 // ---------- endless chunked ground ----------
 updateChunks(){const C=WORLD.chunk,cam=this.cameras.main,v=cam.worldView,pad=WORLD.chunkPad,
   x0=Math.floor((this.rage.x-(cam.width/cam.zoom)/2)/C)-pad,x1=Math.floor((this.rage.x+(cam.width/cam.zoom)/2)/C)+pad,y0=Math.floor((this.rage.y-(cam.height/cam.zoom)/2)/C)-pad,y1=Math.floor((this.rage.y+(cam.height/cam.zoom)/2)/C)+pad,need=new Set();
  for(let cx=x0;cx<=x1;cx++)for(let cy=y0;cy<=y1;cy++){const k=cx+','+cy;need.add(k);if(this.chunks.has(k))continue;
   const rnd=hash(cx,cy),ts=this.chunkPool.pop()||this.add.tileSprite(0,0,C,C,'ground').setOrigin(0).setDepth(-1e7);ts.setPosition(cx*C,cy*C).setVisible(true);
   const shade=0xd0+Math.floor(rnd()*0x30);ts.setTint(Phaser.Display.Color.GetColor(shade,shade,shade));const props=[];
   const n=Math.floor(rnd()*WORLD.propsPerChunk);for(let i=0;i<n;i++){const kind=['prop_rock','prop_tree','prop_bones','prop_torch','prop_rock','prop_tree'][Math.floor(rnd()*6)],
     pr=(this.propPool.pop()||this.add.image(0,0,'px')).setTexture(kind).setOrigin(.5,1).setVisible(true),px=cx*C+rnd()*C,py=cy*C+rnd()*C;pr.setPosition(Math.round(px),Math.round(py)).setDepth(py);props.push(pr)}
   this.chunks.set(k,{ts,props})}
  for(const[k,c]of this.chunks)if(!need.has(k)){c.ts.setVisible(false);this.chunkPool.push(c.ts);for(const p of c.props){p.setVisible(false);this.propPool.push(p)}this.chunks.delete(k)}
  this.st.chunks=this.chunks.size;this.st.chunkPool=this.chunkPool.length;
  // canopy wrap
  const cw=(cam.width/cam.zoom),ch=(cam.height/cam.zoom);this.canopy.forEach((c,i)=>{const sx=cam.scrollX*1.25,sy=cam.scrollY*1.25,span=cw+400;let x=((i*397-sx)%span+span)%span-200,y=((i*233-sy)%(ch+300)+(ch+300))%(ch+300)-150;
   c.setPosition(Math.round(x+sx),Math.round(y+sy))})}
 // ---------- enemies ----------
 pickType(){const w=this.st.wave,list=Object.entries(ENEMIES).filter(([,e])=>w>=e.unlockWave),tot=list.reduce((a,[,e])=>a+e.weight,0);let r=Math.random()*tot;for(const[id,e]of list){r-=e.weight;if(r<=0)return id}return list[0][0]}
 spawn(){if(this.enemies.length>=WAVES.maxAlive)return false;const id=this.pickType(),E=ENEMIES[id],m=this.mul(this.st.wave),cam=this.cameras.main,
   rad=Math.hypot((cam.width/cam.zoom),(cam.height/cam.zoom))/2+WORLD.spawnMargin,a=Math.random()*Math.PI*2;
  const e=(this.enemyPool.pop()||this.add.image(0,0,'en_'+id).setOrigin(.5,.9));e.setTexture('en_'+id).setVisible(true).setAlpha(1).setScale(1).setActive(true);
  e.setPosition(this.rage.x+Math.cos(a)*rad,this.rage.y+Math.sin(a)*rad);Object.assign(e,{type:id,hp:E.hp*m.hp,maxHp:E.hp*m.hp,spd:E.speed*m.sp,dmgv:E.dmg,xpv:E.xp,flash:0,dead:false,ccd:0,kx:0,ky:0,jit:(Math.random()-.5)*.6});
  this.enemies.push(e);this.st.spawned++;return true}
 hitEnemy(e,dmg){if(e.dead)return;e.hp-=dmg;this.st.hits++;this.st.dmg+=dmg;e.flash=ATTACK.flashMs;e.setTexture('en_'+e.type+'_w');
  const dx=e.x-this.rage.x,dy=e.y-this.rage.y,d=Math.hypot(dx,dy)||1;e.kx+=dx/d*ATTACK.knockback;e.ky+=dy/d*ATTACK.knockback;this.dmgNum(e.x,e.y-e.height,Math.round(dmg));
  if(e.hp<=0)this.kill(e)}
 kill(e){e.dead=true;this.st.kills++;this.dropGem(e.x,e.y,e.xpv);this.tweens.add({targets:e,alpha:0,scaleY:.2,duration:220,onComplete:()=>{e.setVisible(false).setActive(false);this.enemies.splice(this.enemies.indexOf(e),1);this.enemyPool.push(e)}})}
 dmgNum(x,y,n){let c=this.numPool.pop();if(!c)c=spriteText(this,0,0,'',DMG_NUM.scale,0xffe0a0);c.setText(String(n)).setPosition(Math.round(x-c.tw/2),Math.round(y)).setVisible(true).setAlpha(1).setDepth(9e5);
  this.tweens.add({targets:c,y:y-DMG_NUM.rise,alpha:0,duration:DMG_NUM.ms,onComplete:()=>{c.setVisible(false);this.numPool.push(c)}})}
 fx(key,x,y,rot,ms,scaleTo){const f=(this.fxPool.pop()||this.add.image(0,0,key)).setTexture(key).setPosition(x,y).setRotation(rot).setAlpha(1).setScale(1).setVisible(true).setDepth(y+1);
  this.tweens.add({targets:f,alpha:0,scale:scaleTo||1.2,duration:ms,onComplete:()=>{f.setVisible(false);this.fxPool.push(f)}})}
 dropGem(x,y,v){const g=(this.gemPool.pop()||this.add.image(0,0,'xp_gem'));g.setPosition(x,y-6).setVisible(true).setDepth(y-30);g.val=v*XP.gemValue;g.mag=false;this.gems.push(g);this.st.gemsDropped++}
 nearest(range){let best=null,bd=range*range;for(const e of this.enemies){if(e.dead)continue;const d=(e.x-this.rage.x)**2+(e.y-this.rage.y)**2;if(d<bd){bd=d;best=e}}return best}
 fireAbility(k,manual){const A=ABILITIES[k];if(!A||A.id==='locked'||(this.abCd[k]||0)>0)return false;
  if(A.id==='cleave'){const r2=A.radius**2;let n=0;for(const e of this.enemies.slice())if(!e.dead&&(e.x-this.rage.x)**2+(e.y-this.rage.y)**2<r2){this.hitEnemy(e,A.damage);n++}
   if(!manual&&!n)return false;this.fx('ring',this.rage.x,this.rage.y-20,0,300,A.radius/60);this.st.abilityUses=(this.st.abilityUses||0)+1}
  this.abCd[k]=A.cooldownMs;return true}
 gainXp(v){const st=this.st;st.xp+=v;while(st.xp>=st.need){st.xp-=st.need;st.level++;st.need=Math.round(XP.base*Math.pow(XP.growth,st.level-1));this.cameras.main.flash(120,255,200,80)}}
 gameOver(){this.over=true;this.rage.setVelocity(0,0).setAlpha(.4);const W=this.scale.gw,H=this.scale.gh,t=spriteText(this,0,0,'RAGE HAS FALLEN',3,0xd83a2a).setScrollFactor(0).setDepth(2e6);t.setPosition(Math.round(W/2-t.tw/2),Math.round(H/2-20));
  this.time.delayedCall(2200,()=>this.scene.start('Menu'))}
 update(t,dtRaw){if(this.over)return;const dt=Math.min(50,dtRaw)*DEBUG.timeScale,st=this.st,k=this.keys,r=this.rage;st.elapsed+=dt;
  this.fpsS.push(this.game.loop.actualFps);if(this.fpsS.length>600)this.fpsS.shift();st.fps=Math.round(this.game.loop.actualFps);
  // move (keyboard + joystick), dash (space)
  const v=new Phaser.Math.Vector2((k.D.isDown||k.RIGHT.isDown)-(k.A.isDown||k.LEFT.isDown),(k.S.isDown||k.DOWN.isDown)-(k.W.isDown||k.UP.isDown));
  if(!v.lengthSq()&&this.joy.v.lengthSq())v.copy(this.joy.v);const mag=Math.min(1,v.length());if(mag)this.face=v.clone().normalize();
  if(Phaser.Input.Keyboard.JustDown(k.SPACE)&&st.elapsed>=this.dashReady){this.dashUntil=st.elapsed+RAGE.dashMs;this.dashReady=st.elapsed+RAGE.dashCooldownMs;this.cameras.main.shake(80,.003);AUDIO.blip()}
  const dashing=st.elapsed<this.dashUntil,sp=(dashing?RAGE.dashSpeed:RAGE.speed*mag)*DEBUG.timeScale,d=dashing?this.face:(mag?v.clone().normalize():v);
  r.setVelocity(d.x*sp,d.y*sp).setAlpha(dashing?.6:(this.invuln>0?.7:1)).setDepth(r.y);if(v.x)r.setFlipX(v.x<0);st.moving=mag>0;st.rx=Math.round(r.x);st.ry=Math.round(r.y);
  this.updateChunks();this.updateEmbers(dt);
  // waves
  st.waveT+=dt;if(st.waveT>=WAVES.durationS*1000){st.waveT=0;st.wave++;st.queue+=this.waveCount(st.wave);const m=this.mul(st.wave);st.waveLog.push({wave:st.wave,count:this.waveCount(st.wave),hpMul:+m.hp.toFixed(2),speedMul:+m.sp.toFixed(2),atS:Math.round(st.elapsed/1000)})}
  st.spawnAcc+=dt*this.waveCount(st.wave)/(WAVES.durationS*600);while(st.queue>0&&st.spawnAcc>=1){st.spawnAcc-=1/WAVES.burst;if(!this.spawn())break;st.queue--}
  // enemies
  const s=dt/1000,cam=this.cameras.main;this.invuln-=dt;
  for(const e of this.enemies){if(e.dead)continue;if(e.flash>0){e.flash-=dt;if(e.flash<=0)e.setTexture('en_'+e.type)}
   let dx=r.x-e.x,dy=r.y-e.y;const dd=Math.hypot(dx,dy)||1;if(dd>WORLD.despawnDist){const a=Math.random()*Math.PI*2,rad=Math.hypot((cam.width/cam.zoom),(cam.height/cam.zoom))/2+WORLD.spawnMargin;e.setPosition(r.x+Math.cos(a)*rad,r.y+Math.sin(a)*rad);continue}
   const c=Math.cos(e.jit),sn=Math.sin(e.jit),ux=(dx*c-dy*sn)/dd,uy=(dx*sn+dy*c)/dd;e.x+=(ux*e.spd+e.kx)*s;e.y+=(uy*e.spd+e.ky)*s;e.kx*=.85;e.ky*=.85;e.setDepth(e.y);if(ux)e.setFlipX(ux<0);
   e.ccd-=dt;if(dd<26&&e.ccd<=0&&this.invuln<=0){e.ccd=WAVES.contactCdMs;this.invuln=RAGE.invulnMs;if(!DEBUG.god)st.hp-=e.dmgv;st.hurt=(st.hurt||0)+1;r.setTint(0xff6060);this.time.delayedCall(90,()=>r.clearTint())}}
  st.alive=this.enemies.filter(e=>!e.dead).length;st.maxAlive=Math.max(st.maxAlive||0,st.alive);
  // auto attack
  this.atkCd-=dt;if(this.atkCd<=0){const e=this.nearest(ATTACK.range);if(e){this.atkCd=ATTACK.cooldownMs;this.fx('slash',(r.x+e.x)/2,(r.y+e.y)/2-18,Math.atan2(e.y-r.y,e.x-r.x),ATTACK.slashMs);this.hitEnemy(e,ATTACK.damage)}}
  // abilities (auto)
  for(const kk of Object.keys(this.abCd)){this.abCd[kk]-=dt;if(this.abCd[kk]<=0&&ABILITIES[kk].auto)this.fireAbility(kk,false)}
  // gems
  for(let i=this.gems.length-1;i>=0;i--){const g=this.gems[i],dx=r.x-g.x,dy=(r.y-14)-g.y,d=Math.hypot(dx,dy);if(d<RAGE.pickupRadius)g.mag=true;
   if(g.mag){const m=RAGE.magnetSpeed*s;g.x+=dx/d*Math.min(m,d);g.y+=dy/d*Math.min(m,d)}
   if(d<RAGE.collectRadius){g.setVisible(false);this.gems.splice(i,1);this.gemPool.push(g);st.gemsCollected++;this.gainXp(g.val)}}
  st.gemsOnGround=this.gems.length;this.updateHUD();if(st.hp<=0)this.gameOver()}}

class Pause extends Phaser.Scene{constructor(){super('Pause')}
 create(){const W=this.scale.gw,H=this.scale.gh;window.SLIDERS={};
  this.add.image(W/2,H/2,'px').setDisplaySize(W,H).setTint(0).setAlpha(.6).setInteractive();
  const pw=416,ph=315,px=Math.round((W-pw)/2),py=Math.round((H-ph)/2);this.panel={x:px,y:py};
  if(window.PIECES){uiFit(this.add.image(px,py,this.textures.exists('ui_panel_pause')?'ui_panel_pause':'menu_panel_options')).setOrigin(0);
   skullSlider(this,'music',px+140,py+99,py+98);skullSlider(this,'sfx',px+140,py+158,py+156);
   const cur=this.add.image(px+48,py+216,'menu_cursor_options').setOrigin(0);cur.off=-6;
   this.back=pieceButton(this,'back',cur,()=>this.resume(),false,{x:px+96,y:py+222});this.back.on('pointerover',()=>cur.setX(px+48));
   const HK=this.textures.exists('ui_button_home')?{n:'ui_button_home',h:'ui_button_home_hover'}:{n:'ph_home_normal',h:'ph_home_hover'};const hm=this.home=uiFit(this.add.image(px+262,py+222,HK.n)).setOrigin(0);hm.setInteractive({useHandCursor:true,hitArea:padHitS(hm,84,32),hitAreaCallback:Phaser.Geom.Rectangle.Contains});
   hm.on('pointerover',()=>{hm.setTexture(HK.h);cur.setPosition(hm.x-46,hm.y-6)}).on('pointerout',()=>hm.setTexture(HK.n)).on('pointerdown',()=>this.goHome())}
  this.input.keyboard.on('keydown-ESC',()=>this.resume());this.input.keyboard.on('keydown-P',()=>this.resume());
  this.scale.on('resize',this.relayout,this);this.events.once('shutdown',()=>this.scale.off('resize',this.relayout,this))}
 relayout(){this.time.delayedCall(0,()=>this.scene.restart())}
 resume(){AUDIO.blip();this.scene.stop();this.scene.resume('Game')}
 goHome(){AUDIO.blip();this.scene.stop('Game');this.scene.start('Menu')}}

// live orientation switching
function initOrientation(game){let last=null;const apply=()=>{const p=wantPortrait(),S=game.scale;
  if(p!==(S.scaleMode===Phaser.Scale.EXPAND)){last=p;S.scaleMode=p?Phaser.Scale.EXPAND:Phaser.Scale.FIT;S.setGameSize((p?PORTRAIT.base.w:BASE.w)*RS,(p?PORTRAIT.base.h:BASE.h)*RS);}
  S.refresh();for(const s of game.scene.getScenes(true))if(['Menu','Options','Quit'].includes(s.scene.key))s.scene.restart()};
 let tm;const on=()=>{clearTimeout(tm);tm=setTimeout(apply,120)};addEventListener('resize',on);addEventListener('orientationchange',on);
 last=game.scale.gh>game.scale.gw}
