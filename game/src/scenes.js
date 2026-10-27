const W=BASE.w,H=BASE.h, hasSave=()=>!!localStorage.getItem('lastorc_save');
class Boot extends Phaser.Scene{constructor(){super('Boot')}
 preload(){const P=MENU_PIECES,D=MENU_DIR;this.load.on('loaderror',f=>console.warn('missing asset (fallback):',f.key));
  for(const k of['background','logo','orc_rock','panel','panel_options','background_options','logo_options','orc_options','cursor','cursor_options','slider_track','slider_fill','slider_handle'])this.load.image('menu_'+k,D+P[k]);this.load.image('menu_logo_portrait','../assets/menu/logo_portrait_hd.png');
  this.load.atlas('menu_buttons',D+P.buttons.png,D+P.buttons.json);this.load.json('menu_layout',D+P.layout);this.load.json('menu_layout_portrait',D+PORTRAIT.layout);loadWorldAssets(this);
  this.load.image('fb_main',MENU_FALLBACK.main);this.load.image('fb_options',MENU_FALLBACK.options);
  for(const[k,a]of Object.entries(ASSETS))if(a.file){a.frameWidth?this.load.spritesheet(k,a.file,{frameWidth:a.frameWidth,frameHeight:a.frameHeight}):this.load.image(k,a.file)}}
 create(){const g=this.make.graphics({},false);
  if(!ASSETS.ground.file){const t=ASSETS.ground.tile;g.fillStyle(0x2b2a1f).fillRect(0,0,t,t);
   for(let i=0;i<40;i++){g.fillStyle([0x3a3826,0x24231a,0x3d2f22,0x2f3a22][i%4]).fillRect(Math.random()*t|0,Math.random()*t|0,4,4)}
   g.generateTexture('ground',t,t);g.clear()}

  window.LJ_L=this.cache.json.get('menu_layout')||null;window.LJ_P=this.cache.json.get('menu_layout_portrait')||null;window.LJ=LJ_L;genWorldTextures(this);if(this.textures.exists('menu_logo_portrait'))this.textures.get('menu_logo_portrait').setFilter(Phaser.Textures.FilterMode.LINEAR);for(const k of Object.keys(UI_DISP))if(this.textures.exists(k))this.textures.get(k).setFilter(Phaser.Textures.FilterMode.LINEAR);window.LAYOUT=DEFAULT_LAYOUT;
  window.PIECES=!!LJ&&['background','logo','panel','panel_options','buttons','slider_track','slider_fill','slider_handle'].every(k=>this.textures.exists('menu_'+k));
  this.scene.start('Menu')}}
// finger-sized hit area (>= TOUCH.minTap game px) centred on an origin-0 image
const padHit=(w,h,m=TOUCH.minTap)=>{const W2=Math.max(w,m),H2=Math.max(h,m);return new Phaser.Geom.Rectangle((w-W2)/2,(h-H2)/2,W2,H2)};
// same, for an image scaled by uiFit (hit areas are in texture px)
const padHitS=(img,w,h)=>{const r=padHit(w,h),k=1/img.scaleX;return new Phaser.Geom.Rectangle(r.x*k,r.y*k,r.width*k,r.height*k)};
// Skull slider (shared by Options + Pause). Handle centre = pointer x; red fill ends exactly at the handle centre; centre runs 32.5..219 (end of red channel) (red art starts at col 33 (iron collar 20-32) = centre at v=0, so 0 shows no red and there is no jump off zero).
function skullSlider(s,ch,tx,ty,hy){const S=SLIDER;window.SLIDERS=window.SLIDERS||{};
 const tr=s.add.image(tx,ty,'menu_slider_track').setOrigin(0),fill=s.add.image(tx,ty,'menu_slider_fill').setOrigin(0),h=s.add.image(0,hy,'menu_slider_handle').setOrigin(0);
 h.setInteractive({useHandCursor:true,draggable:true,hitArea:padHit(S.handleW,41),hitAreaCallback:Phaser.Geom.Rectangle.Contains});
 const hMin=tx+S.handleMin,hRange=S.handleMax-S.handleMin;
 const sync=()=>{const v=AUDIO.vol[ch],c=h.x-tx+S.handleW/2,w=v<=0?0:Phaser.Math.Clamp(Math.round(c),0,S.trackW);fill.setCrop(0,0,w,S.fillH).setVisible(w>0);SLIDERS[ch]={v,fillW:w,handleX:h.x,handleR:h.x+S.handleW,trackX:tx,handleY:h.y+(h.originY===0?20:0)}};
 const set=v=>{v=Phaser.Math.Clamp(v,0,1);AUDIO.setVol(ch,v);h.x=hMin+hRange*v;sync()};s.events.on('update',sync);set(AUDIO.vol[ch]);
 const fromX=x=>set((x-(hMin+S.handleW/2))/hRange);h.on('drag',p=>fromX(PX(p)));h.on('dragend',()=>ch==='sfx'&&AUDIO.blip());
 tr.setInteractive({useHandCursor:true,hitArea:padHit(S.trackW,S.fillH),hitAreaCallback:Phaser.Geom.Rectangle.Contains}).on('pointerdown',p=>{fromX(PX(p));if(ch==='sfx')AUDIO.blip()});return {track:tr,fill,handle:h,set}}
const R=(s,r)=>s.add.rectangle(r.x+r.w/2,r.y+r.h/2,r.w,r.h,0xffffff,0);
const K=LAYOUT_KEYS,at=(s,key,tex,frame)=>{const r=LJ[key];if(r.cover){const i=s.add.image(s.scale.gw/2,s.scale.gh/2,tex,frame);i.setScale(Math.max(s.scale.gw/i.width,s.scale.gh/i.height));return i}const t=r.tex&&s.textures.exists(r.tex)?r.tex:tex,i=s.add.image(r.x,r.y,t,t===tex?frame:undefined).setOrigin(0).setScale(r.s||1);if(r.crop)i.setCrop(...r.crop);return i};
function drawBackdrop(s,fb,panelKey){if(!PIECES){s.add.image(W/2,H/2,fb).setDisplaySize(W,H);return}
 const opt=panelKey==='panel_options',pick=(k,base)=>opt&&s.textures.exists('menu_'+k)&&LJ[K[k]]?k:base,bob=opt?ORC_BOB_OPTIONS:ORC_BOB.px;
 const bg=pick('background_options','background'),lg=pick('logo_options','logo'),orc=pick('orc_options','orc_rock');
 if(isPortrait(s)&&s.textures.exists('ui_menu_bg_portrait')){const i=s.add.image(s.scale.gw/2,s.scale.gh/2,'ui_menu_bg_portrait');i.setScale(Math.max(s.scale.gw/i.width,s.scale.gh/i.height))}else at(s,K[bg],'menu_'+bg);
 if(s.textures.exists('menu_'+orc)&&LJ[K[orc]]){const o=at(s,K[orc],'menu_'+orc);if(bob)s.tweens.add({targets:o,y:o.y-bob,duration:ORC_BOB.ms,yoyo:true,repeat:-1,ease:'Sine.inOut'})}
 at(s,K[lg],'menu_'+lg);const pn=at(s,K[panelKey],'menu_'+panelKey);addBrackets(s,pn,panelKey)}
// painted HD iron brackets over the panel's old plates (LINEAR, uniform scale)
function addBrackets(s,pn,key){for(const[t,cx,cy]of(window.BRACKETS&&BRACKETS[key])||[]){const k='ui_bracket_'+t;if(!s.textures.exists(k))continue;const b=uiFit(s.add.image(pn.x+cx*pn.scaleX,pn.y+cy*pn.scaleY,k));b.setScale(b.scaleX*pn.scaleX,b.scaleY*pn.scaleY)}}
function pieceButton(s,id,cursor,onClick,off,pos){const b=pos?s.add.image(pos.x,pos.y,'menu_buttons',id+FRAME.normal).setOrigin(0):at(s,K.button(id),'menu_buttons',id+FRAME.normal);
 if(off){b.setAlpha(.35).setTint(0x888888);return b}
 b.setInteractive({useHandCursor:true,hitArea:padHit(b.width,b.height),hitAreaCallback:Phaser.Geom.Rectangle.Contains}).on('pointerover',()=>{b.setFrame(id+FRAME.hover);if(cursor)cursor.setVisible(true).setY(b.y+(cursor.off??-7))})
  .on('pointerout',()=>b.setFrame(id+FRAME.normal)).on('pointerdown',onClick);return b}
class Menu extends Phaser.Scene{constructor(){super('Menu')}
 create(){applyLayout(this);drawBackdrop(this,'fb_main','panel');
  const go=id=>()=>{AUDIO.start();AUDIO.blip();if(id==='new_game'){localStorage.setItem('lastorc_save','1');this.scene.start('Game')}if(id==='continue')this.scene.start('Game');if(id==='options')this.scene.start('Options');if(id==='quit')this.scene.start('Quit')};
  if(PIECES){let cur=null;const co=this.textures.exists('menu_cursor_options')&&LJ[K.cursor_options];if(co){const c=LJ[K.cursor_options];cur=this.add.image(LJ.menu_cursor_x??window.MENU_CURSOR_X??c.x,0,'menu_cursor_options').setOrigin(0);cur.off=c.y-LJ[K.button('back')].y}else if(this.textures.exists('menu_cursor')){cur=at(this,K.cursor,'menu_cursor');cur.off=-7}
   for(const id of['new_game','continue','options','quit'])pieceButton(this,id,cur,go(id),id==='continue'&&!hasSave());
   if(cur){const first=hasSave()?'continue':'new_game';cur.setY(LJ[K.button(first)].y+cur.off)}return}
  for(const id of['new_game','continue','options','quit']){const r=LAYOUT.buttons[id],off=id==='continue'&&!hasSave();
   let img=null;if(PIECES&&atlasOK(this)){img=this.add.image(r.x,r.y,'menu_buttons',id+'_normal').setOrigin(0).setDisplaySize(r.w,r.h)}
   const z=R(this,r).setInteractive({useHandCursor:!off});
   if(off){img?img.setAlpha(.4):this.add.rectangle(r.x+r.w/2,r.y+r.h/2,r.w-8,r.h-4,0,.6)}
   z.on('pointerover',()=>{if(off)return;img?img.setFrame(id+'_highlighted').setDisplaySize(r.w,r.h):z.setFillStyle(0xffd27a,.15)});
   z.on('pointerout',()=>{img?img.setFrame(id+'_normal').setDisplaySize(r.w,r.h):z.setFillStyle(0xffffff,0)});
   z.on('pointerdown',()=>{if(off)return;AUDIO.start();AUDIO.blip();
    if(id==='new_game'){localStorage.setItem('lastorc_save','1');this.scene.start('Game')}
    if(id==='continue')this.scene.start('Game');if(id==='options')this.scene.start('Options');if(id==='quit')this.scene.start('Quit')})}}}
const txt=(s,x,y,t,sz=28,c='#e8d8b0')=>s.add.text(x,y,t,{fontFamily:'monospace',fontSize:sz,color:c}).setOrigin(.5);
class Options extends Phaser.Scene{constructor(){super('Options')}
 create(){applyLayout(this);drawBackdrop(this,'fb_options','panel_options');AUDIO.start();this.input.keyboard.on('keydown-ESC',()=>this.scene.start('Menu'));
  if(PIECES){const S=SLIDER;window.SLIDERS={};
   for(const ch of['music','sfx']){const t=LJ[K.track[ch]],hh=LJ[K.handle[ch]];skullSlider(this,ch,t.x,t.y,hh.y)}
   const bc=this.textures.exists('menu_cursor_options')&&LJ[K.cursor_options]?at(this,K.cursor_options,'menu_cursor_options').setOrigin(0):null;pieceButton(this,'back',bc,()=>{AUDIO.blip();this.scene.start('Menu')});return}
  const pcs=PIECES&&this.textures.exists('menu_slider_track');
  for(const ch of['music','sfx']){const r=LAYOUT.sliders[ch],x1=r.x,x2=r.x+r.w,y=r.y+r.h/2;let fill,h;
   if(pcs){this.add.image(x1,y,'menu_slider_track').setOrigin(0,.5).setDisplaySize(r.w,r.h);fill=this.add.image(x1,y,'menu_slider_fill').setOrigin(0,.5);h=this.add.image(0,y,'menu_slider_handle')}
   else{this.add.rectangle((x1+x2)/2,y,r.w+28,50,0x1a1210);fill=this.add.rectangle(x1,y,1,10,0xa01818).setOrigin(0,.5);this.add.rectangle((x1+x2)/2,y,r.w,10).setStrokeStyle(2,0x777066);
    h=this.add.container(0,y,[this.add.circle(0,0,11,0xd8ccb0).setStrokeStyle(2,0x3a2a20),this.add.rectangle(-4,-2,3,4,0x1a1210),this.add.rectangle(4,-2,3,4,0x1a1210),this.add.rectangle(0,5,7,2,0x1a1210)])}
   const set=v=>{v=Phaser.Math.Clamp(v,0,1);AUDIO.setVol(ch,v);h.x=x1+v*r.w;pcs?fill.setDisplaySize(Math.max(1,v*r.w),r.h):fill.width=Math.max(1,v*r.w)};set(AUDIO.vol[ch]);
   const z=this.add.rectangle((x1+x2)/2,y,r.w+28,36,0,0).setInteractive({useHandCursor:true});
   const drag=p=>{if(p.isDown){set((p.x-x1)/r.w);if(ch==='sfx')AUDIO.blip()}};z.on('pointerdown',drag);z.on('pointermove',drag)}
  R(this,LAYOUT.back).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('Menu'));
  }}
class Quit extends Phaser.Scene{constructor(){super('Quit')}
 create(){this.cameras.main.setBackgroundColor('#000');txt(this,this.scale.gw/2,240,'LAST ORC',56,'#c0392b');
  txt(this,this.scale.gw/2,320,'Thanks for playing. Rage rests... for now.');txt(this,this.scale.gw/2,390,'click to return',20,'#888');
  this.input.once('pointerdown',()=>this.scene.start('Menu'))}}
window.FONT_READY.then(()=>{const P0=wantPortrait();window.GAME=new Phaser.Game({type:Phaser.AUTO,width:(P0?PORTRAIT.base.w:W)*RS,height:(P0?PORTRAIT.base.h:H)*RS,pixelArt:true,roundPixels:true,backgroundColor:'#000',
 scale:{mode:P0?Phaser.Scale.EXPAND:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade'},input:{activePointers:3},scene:[Boot,Menu,Options,Quit,Game,Pause]});
initOrientation(GAME);
});
