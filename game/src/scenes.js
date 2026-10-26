const W=BASE.w,H=BASE.h, hasSave=()=>!!localStorage.getItem('lastorc_save');
class Boot extends Phaser.Scene{constructor(){super('Boot')}
 preload(){const P=MENU_PIECES,D=MENU_DIR;this.load.on('loaderror',f=>console.warn('missing asset (fallback):',f.key));
  for(const k of['background','logo','orc_rock','panel','panel_options','background_options','logo_options','orc_options','cursor','cursor_options','slider_track','slider_fill','slider_handle'])this.load.image('menu_'+k,D+P[k]);
  this.load.atlas('menu_buttons',D+P.buttons.png,D+P.buttons.json);this.load.json('menu_layout',D+P.layout);
  this.load.image('fb_main',MENU_FALLBACK.main);this.load.image('fb_options',MENU_FALLBACK.options);
  for(const[k,a]of Object.entries(ASSETS))if(a.file){a.frameWidth?this.load.spritesheet(k,a.file,{frameWidth:a.frameWidth,frameHeight:a.frameHeight}):this.load.image(k,a.file)}}
 create(){const g=this.make.graphics({},false);
  if(!ASSETS.ground.file){const t=ASSETS.ground.tile;g.fillStyle(0x2b2a1f).fillRect(0,0,t,t);
   for(let i=0;i<40;i++){g.fillStyle([0x3a3826,0x24231a,0x3d2f22,0x2f3a22][i%4]).fillRect(Math.random()*t|0,Math.random()*t|0,4,4)}
   g.generateTexture('ground',t,t);g.clear()}
  if(!ASSETS.rage.file){const s=ASSETS.rage.frameWidth;g.fillStyle(0x000000,.4).fillEllipse(s/2,s-6,30,10);
   g.fillStyle(0x5a3a1e).fillRect(14,24,20,16);g.fillStyle(ASSETS.rage.color).fillRect(16,8,16,16);
   g.fillStyle(0xffffff).fillRect(18,20,3,4).fillRect(27,20,3,4);g.fillStyle(0xcc0000).fillRect(19,13,3,2).fillRect(26,13,3,2);
   g.fillStyle(0x9a9a9a).fillRect(36,14,6,22);g.generateTexture('rage',s,s);g.clear()}
  window.LJ=this.cache.json.get('menu_layout')||null;window.LAYOUT=DEFAULT_LAYOUT;
  window.PIECES=!!LJ&&['background','logo','panel','panel_options','buttons','slider_track','slider_fill','slider_handle'].every(k=>this.textures.exists('menu_'+k));
  this.scene.start('Menu')}}
const R=(s,r)=>s.add.rectangle(r.x+r.w/2,r.y+r.h/2,r.w,r.h,0xffffff,0);
const K=LAYOUT_KEYS,at=(s,key,tex,frame)=>{const r=LJ[key];return s.add.image(r.x,r.y,tex,frame).setOrigin(0)};
function drawBackdrop(s,fb,panelKey){if(!PIECES){s.add.image(W/2,H/2,fb).setDisplaySize(W,H);return}
 const opt=panelKey==='panel_options',pick=(k,base)=>opt&&s.textures.exists('menu_'+k)&&LJ[K[k]]?k:base,bob=opt?ORC_BOB_OPTIONS:ORC_BOB.px;
 const bg=pick('background_options','background'),lg=pick('logo_options','logo'),orc=pick('orc_options','orc_rock');
 at(s,K[bg],'menu_'+bg);
 if(s.textures.exists('menu_'+orc)&&LJ[K[orc]]){const o=at(s,K[orc],'menu_'+orc);if(bob)s.tweens.add({targets:o,y:o.y-bob,duration:ORC_BOB.ms,yoyo:true,repeat:-1,ease:'Sine.inOut'})}
 at(s,K[lg],'menu_'+lg);at(s,K[panelKey],'menu_'+panelKey)}
function pieceButton(s,id,cursor,onClick,off){const b=at(s,K.button(id),'menu_buttons',id+FRAME.normal);
 if(off){b.setAlpha(.35).setTint(0x888888);return b}
 b.setInteractive({useHandCursor:true}).on('pointerover',()=>{b.setFrame(id+FRAME.hover);if(cursor)cursor.setVisible(true).setY(b.y+(cursor.off??-7))})
  .on('pointerout',()=>b.setFrame(id+FRAME.normal)).on('pointerdown',onClick);return b}
class Menu extends Phaser.Scene{constructor(){super('Menu')}
 create(){drawBackdrop(this,'fb_main','panel');
  const go=id=>()=>{AUDIO.start();AUDIO.blip();if(id==='new_game'){localStorage.setItem('lastorc_save','1');this.scene.start('Game')}if(id==='continue')this.scene.start('Game');if(id==='options')this.scene.start('Options');if(id==='quit')this.scene.start('Quit')};
  if(PIECES){let cur=null;const co=this.textures.exists('menu_cursor_options')&&LJ[K.cursor_options];if(co){const c=LJ[K.cursor_options];cur=this.add.image(window.MENU_CURSOR_X??c.x,0,'menu_cursor_options').setOrigin(0);cur.off=c.y-LJ[K.button('back')].y}else if(this.textures.exists('menu_cursor')){cur=at(this,K.cursor,'menu_cursor');cur.off=-7}
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
 create(){drawBackdrop(this,'fb_options','panel_options');AUDIO.start();this.input.keyboard.on('keydown-ESC',()=>this.scene.start('Menu'));
  if(PIECES){const fi=LJ[K.fillInner]||{},S=Object.assign({},SLIDER,fi.x!=null?{innerX:fi.x}:{},fi.w!=null?{innerW:fi.w}:{});
   for(const ch of['music','sfx']){    const tr=at(this,K.track[ch],'menu_slider_track'),fill=at(this,K.track[ch],'menu_slider_fill'),h=at(this,K.handle[ch],'menu_slider_handle').setInteractive({useHandCursor:true,draggable:true});
    const set=v=>{v=Phaser.Math.Clamp(v,0,1);AUDIO.setVol(ch,v);fill.setCrop(0,0,S.fillPad+S.innerW*v+S.fillExtra,S.fillH);h.x=S.innerX+S.innerW*v+S.handleOffset};set(AUDIO.vol[ch]);
    const fromX=x=>set((x-S.innerX)/S.innerW);h.on('drag',p=>fromX(p.x));h.on('dragend',()=>ch==='sfx'&&AUDIO.blip());
    tr.setInteractive({useHandCursor:true}).on('pointerdown',p=>{fromX(p.x);if(ch==='sfx')AUDIO.blip()})}
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
 create(){this.cameras.main.setBackgroundColor('#000');txt(this,W/2,240,'LAST ORC',56,'#c0392b');
  txt(this,W/2,320,'Thanks for playing. Rage rests... for now.');txt(this,W/2,390,'click to return',20,'#888');
  this.input.once('pointerdown',()=>this.scene.start('Menu'))}}
class Game extends Phaser.Scene{constructor(){super('Game')}
 create(){AUDIO.start();const S=TUNING.worldSize;this.physics.world.setBounds(0,0,S,S);
  this.add.tileSprite(0,0,S,S,'ground').setOrigin(0);
  for(let i=0;i<600;i++){const x=Math.random()*S,y=Math.random()*S;this.add.rectangle(x,y,8+Math.random()*24,6+Math.random()*12,[0x1e1d15,0x3b3b33,0x402a1c][i%3])}
  this.rage=this.physics.add.sprite(S/2,S/2,'rage').setScale(ASSETS.rage.scale).setCollideWorldBounds(true);
  const c=this.cameras.main;c.startFollow(this.rage,true,.12,.12);c.setBounds(0,0,S,S);c.setZoom(1);
  this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,Q,E,R,ESC');
  this.dashUntil=0;this.dashReady=0;this.face=new Phaser.Math.Vector2(1,0);
  this.hud=this.add.text(16,16,'',{fontFamily:'monospace',fontSize:14,color:'#e8d8b0',backgroundColor:'#0008',padding:{x:8,y:4}}).setScrollFactor(0);
  this.keys.ESC.on('down',()=>this.scene.start('Menu'))}
 update(t){const k=this.keys,v=new Phaser.Math.Vector2((k.D.isDown||k.RIGHT.isDown)-(k.A.isDown||k.LEFT.isDown),(k.S.isDown||k.DOWN.isDown)-(k.W.isDown||k.UP.isDown));
  if(v.lengthSq())this.face=v.clone().normalize();
  if(Phaser.Input.Keyboard.JustDown(k.SPACE)&&t>=this.dashReady){this.dashUntil=t+TUNING.dashMs;this.dashReady=t+TUNING.dashCooldownMs;this.cameras.main.shake(80,.003);AUDIO.blip()}
  const dashing=t<this.dashUntil;const sp=dashing?TUNING.dashSpeed:TUNING.speed;
  const d=dashing?this.face:v.normalize();this.rage.setVelocity(d.x*sp,d.y*sp).setAlpha(dashing?.6:1);
  if(v.x)this.rage.setFlipX(v.x<0);
  const cd=Math.max(0,this.dashReady-t);this.hud.setText(`RAGE  |  WASD/Arrows move  Space dash ${cd?(cd/1000).toFixed(1)+'s':'READY'}  |  Q/W/E/R: soon  |  Esc menu`)}}
new Phaser.Game({type:Phaser.AUTO,width:W,height:H,pixelArt:true,roundPixels:true,backgroundColor:'#000',
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade'},scene:[Boot,Menu,Options,Quit,Game]});
