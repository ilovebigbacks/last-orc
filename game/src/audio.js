// Placeholder WebAudio: music = low drone loop, sfx = blip. Swap for real files later; keep setVol/blip API.
window.AUDIO={vol:JSON.parse(localStorage.getItem('lastorc_vol')||'{"music":0.5631,"sfx":0.4318}'),ctx:null,
 start(){if(this.ctx){this.ctx.resume();return}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=this.ctx=new C();
  this.mg=c.createGain();this.mg.gain.value=this.vol.music*.15;this.mg.connect(c.destination);
  this.sg=c.createGain();this.sg.gain.value=this.vol.sfx*.3;this.sg.connect(c.destination);
  for(const f of[55,82.4,110.5]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;const l=c.createBiquadFilter();l.frequency.value=400;o.connect(l).connect(this.mg);o.start()}},
 setVol(ch,v){this.vol[ch]=v;localStorage.setItem('lastorc_vol',JSON.stringify(this.vol));if(!this.ctx)return;(ch==='music'?this.mg:this.sg).gain.value=v*(ch==='music'?.15:.3)},
 blip(){if(!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(220,c.currentTime);o.frequency.exponentialRampToValueAtTime(60,c.currentTime+.15);
  g.gain.setValueAtTime(1,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.15);o.connect(g).connect(this.sg);o.start();o.stop(c.currentTime+.16)}};
