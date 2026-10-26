// HiDPI: render the canvas backing store at ~devicePixelRatio (integer render scale RS 1..3).
// Game size = layout size * RS and every camera is zoomed by RS (origin 0), so all layout code keeps working in
// layout px via scale.gw/gh, and pointer layout coords are p.x/RS (see PX/PY). World sprites stay pixelArt (NEAREST);
// HD UI textures (assets/ui/*_hd*.png) get LINEAR and are drawn at their display size (UI_HD in config.js).
// Mipmaps: Phaser 4.2.1 only builds mipmaps for power-of-two textures, so pre-shrunk 2x copies (*_hd2.png) are used at RS<=2.
(function(){const q=new URLSearchParams(location.search),dpr=window.devicePixelRatio||1;
 const port=(q.get('orient')||(innerHeight>innerWidth?'portrait':'landscape'))==='portrait',b=port?PORTRAIT.base:BASE;
 const eff=dpr*Math.min(innerWidth/b.w,innerHeight/b.h);
 window.RS=q.get('rs')?+q.get('rs'):Math.max(1,Math.min(3,Math.round(eff)));
 window.HD_TIER=RS>=3?'_hd':'_hd2';
 Object.defineProperty(Phaser.Scale.ScaleManager.prototype,'gw',{get(){return this.gameSize.width/RS}});
 Object.defineProperty(Phaser.Scale.ScaleManager.prototype,'gh',{get(){return this.gameSize.height/RS}});
 const add=Phaser.Cameras.Scene2D.CameraManager.prototype.add;
 Phaser.Cameras.Scene2D.CameraManager.prototype.add=function(){const c=add.apply(this,arguments);c.setOrigin(0,0).setZoom(RS);return c};
})();
window.PX=p=>p.x/RS;window.PY=p=>p.y/RS;
// size an HD UI image to its display size (keeps working after setTexture to a same-size hover frame)
window.uiS=img=>{const d=UI_DISP[img.texture.key];return d?d[0]/img.frame.width:1};
window.uiFit=img=>{const d=UI_DISP[img.texture.key];if(d)img.setScale(d[0]/img.frame.width,d[1]/img.frame.height);return img};
window.UI_DISP={};
// origin-0 zoom: Phaser's worldView/midPoint assume origin 0.5; correct them to the real visible rect.
(function(){const C=Phaser.Cameras.Scene2D.Camera.prototype,pr=C.preRender;
 C.preRender=function(){pr.apply(this,arguments);if(this.originX===0&&this.originY===0&&this.zoomX!==1){const w=this.width/this.zoomX,h=this.height/this.zoomY;
  this.worldView.setTo(this.scrollX,this.scrollY,w,h);this.midPoint.set(this.scrollX+w/2,this.scrollY+h/2)}}})();

// bundled HUD font (Pixelify Sans, SIL OFL 1.1) - loaded before the game boots; falls back to monospace on failure
window.HUD_FONT='LOHud';window.FONT_READY=(window.FontFace?new FontFace('LOHud','url(assets/fonts/PixelifySans.ttf?v='+window.ASSET_V+')',{weight:'400 700'}).load().then(f=>{document.fonts.add(f);return document.fonts.load('700 52px LOHud')}):Promise.resolve()).catch(e=>{console.warn('hud font failed',e);window.HUD_FONT=null});
// cache-busting: append ?v=ASSET_V to every loader URL that has none (menu art, json, audio, atlases)
(()=>{const P=Phaser.Loader.LoaderPlugin.prototype,o=P.addFile;P.addFile=function(f){for(const x of Array.isArray(f)?f:[f])if(x&&typeof x.url==='string'&&!x.url.startsWith('data:')&&!x.url.startsWith('blob:')&&!x.url.includes('?'))x.url+='?v='+window.ASSET_V;return o.call(this,f)}})();
