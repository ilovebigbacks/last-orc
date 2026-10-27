// Base res 1024x576 (FIT + CENTER_BOTH, pixelArt, roundPixels). Paths relative to game/index.html.
window.BASE = { w:1024, h:576 };
window.MENU_DIR = '../assets/menu/';
// Menu pieces from the art director (assets/menu/). Missing files => fallback to full mockups below.
window.MENU_PIECES = { background:'background.png', logo:'logo.png', orc_rock:'orc_on_rock.png', panel:'panel.png', panel_options:'panel_options.png', background_options:'background_options.png', logo_options:'logo_options.png', orc_options:'orc_options.png',
  cursor:'cursor_skull.png', cursor_options:'cursor_skull_options.png', slider_track:'slider_track.png', slider_fill:'slider_fill.png', slider_handle:'slider_handle.png',
  buttons:{ png:'buttons.png', json:'buttons.json' }, layout:'layout.json', palette:'palette.json' };
// Atlas frame suffixes + layout.json key names (map here if the art director renames anything)
window.FRAME = { normal:'_normal', hover:'_hover' };
window.LAYOUT_KEYS = { background:'background', logo:'logo', orc_rock:'orc_on_rock', panel:'panel', panel_options:'panel_options', background_options:'background_options', logo_options:'logo_options', orc_options:'orc_options', cursor:'cursor_skull', cursor_options:'cursor_skull_options',
  button:id=>'button_'+id, track:{music:'slider_track',sfx:'slider_track_sfx'}, handle:{music:'slider_handle',sfx:'slider_handle_sfx'}, fillInner:'slider_fill_inner' };
window.SLIDER = { trackW:240, fillH:39, handleW:39, handleMin:13, handleMax:188, redEnd:31 };
// All relative to the track's x. slider_fill.png red runs cols 21..218 (frame is opaque, no transparent pad).
// Handle left edge moves handleMin..handleMax. Skull body is opaque at handle cols 8..31 on the bar rows,
// so fill crop = handle.x - track.x + redEnd: red ends under the skull's right body edge (col 30), full (219) at 100.
// At value 0 the fill is hidden (any red there would sit under the skull anyway).
window.MENU_CURSOR_X = 60;  // main-menu skull x override (Options BACK skull stays at layout.json x)  // innerX/innerW overridden by layout.json slider_fill_inner if present
window.ORC_BOB_OPTIONS = 0;  // bob px on Options
window.ORC_BOB = { px:0, ms:1400 };  // idle bob for orc_on_rock (set px:0 to disable)
window.MENU_FALLBACK = { main:'../main_menu.jpg', options:'../options_menu.png' };
// Fallback layout (1024x576 space) matching the buttons/sliders baked into the mockups. layout.json overrides keys.
window.DEFAULT_LAYOUT = {
  buttons:{ new_game:{x:56,y:250,w:224,h:40}, continue:{x:56,y:296,w:224,h:40}, options:{x:56,y:342,w:224,h:40}, quit:{x:56,y:388,w:224,h:40} },
  sliders:{ music:{x:177,y:255,w:208,h:24}, sfx:{x:177,y:315,w:208,h:24} },
  back:{x:66,y:374,w:136,h:36} };

// ===================== OPEN WORLD (placeholders; all tuning here) =====================
// Orientation: desktop/landscape = 1024x576 FIT. Phones in portrait = 576x1024 base, EXPAND (fills 9:19.5) + safe-area insets.
// Force with ?orient=portrait|landscape. Portrait menu positions: assets/menu/layout_portrait.json (fallback: landscape layout.json).
window.PORTRAIT = { base:{w:576,h:1024}, layout:'layout_portrait.json', margin:28, orcTuck:44 };  // menu safe margin + how far the orc's faded rock tucks behind the panel
// Rage: sprite NOT approved yet -> neutral placeholder. Drop real art in by setting files (spritesheets) - keys stay the same.
window.RAGE = { keys:{ idle:'rage_idle', walk:'rage_walk', attack:'rage_attack', hit:'rage_hit', death:'rage_death', portrait:'rage_portrait' },
  files:{ idle:null, walk:null, attack:null, hit:null, death:null, portrait:null }, frameW:48, frameH:64, anchorY:0.9,
  hp:220, speed:190, dashSpeed:760, dashMs:160, dashCooldownMs:1200, invulnMs:450, pickupRadius:100, magnetSpeed:520, collectRadius:22 };
window.WORLD = { chunk:512, tile:64, chunkPad:1, propsPerChunk:7, camLerp:0.12, spawnMargin:90, despawnDist:1600 };
// Enemy placeholder types (size = placeholder texture w,h). unlockWave = first wave it can appear, weight = spawn odds.
window.ENEMIES = {
  skeleton:{ hp:20, speed:68, dmg:6,  xp:1, size:[26,40], color:0xd8d0b8, unlockWave:1, weight:5 },
  ghoul:   { hp:34, speed:54, dmg:9,  xp:2, size:[30,40], color:0x6f8f4a, unlockWave:2, weight:3 },
  wolf:    { hp:16, speed:120,dmg:5,  xp:1, size:[42,26], color:0x5c5c66, unlockWave:3, weight:3 },
  demon:   { hp:120,speed:46, dmg:18, xp:6, size:[50,58], color:0x9a1e1e, unlockWave:5, weight:1 } };
window.WAVES = { durationS:20, baseCount:8, countPerWave:5, burst:3, hpMulPerWave:0.15, speedMulPerWave:0.04, maxSpeedMul:1.8, maxAlive:240, contactCdMs:500 };
window.ATTACK = { range:150, cooldownMs:420, damage:12, flashMs:70, knockback:70, slashMs:140 };
// Abilities fire automatically on cooldown (Brotato-style); tap the slot on mobile / press key on desktop to fire early when ready.
// All abilities are fully automatic on cooldown (Brotato-style). No keys, no tap-to-fire.
window.CD_SWEEP = { frames:36, alpha:0.65, clockwise:true };
window.ABILITIES = { Q:{ id:'cleave', icon:'icon_axe_cleave', auto:true, cooldownMs:5000, radius:130, damage:28 },
  W:{ id:'locked', icon:'icon_whirlwind' }, E:{ id:'locked', icon:'icon_war_stomp' }, R:{ id:'locked', icon:'icon_rage_roar' } };
window.XP = { base:5, growth:1.35, gemValue:1 };
window.DMG_NUM = { ms:600, rise:34, scale:2 };
// HUD layouts (game px). Portrait anchors are inside safe-area insets; abilities + pause sit in thumb reach.
window.HUD = {
  landscape:{ portrait:{x:12,y:10}, hp:{x:84,y:14,w:220,h:20}, xp:{x:84,y:38,w:220,h:8}, wave:{right:150,y:12}, timer:{right:84,y:12}, pause:{right:10,y:8},
              slots:{cx:0.5,bottom:14,size:64,gap:10} },
  portrait: { portrait:{x:12,y:12}, hp:{x:84,y:16,w:220,h:20}, xp:{x:84,y:40,w:220,h:8}, wave:{right:150,y:14}, timer:{right:84,y:14}, pause:{right:14,bottom:20},
              slots:{left:14,bottom:20,size:72,gap:10} } };
// Touch: floating joystick (landscape: anywhere not on UI; portrait: lower third only). minTap = 44 CSS px at phone scale (~0.68).
window.TOUCH = { minTap:66, joyRadius:52, deadzone:0.15, portraitZoneFrom:2/3 };
// Mood hooks (later): sprite vignette/lighting overlay + sprite ember layer. Set file to real art; enabled toggles.
window.MOOD = { vignette:{ enabled:true, key:'fx_vignette', file:'../assets/ui/fx_vignette.png', alpha:0.45, tint:null },
  embers:{ enabled:true, key:'fx_ember', file:'../assets/ui/fx_ember_strip.png', frame:8, perSec:10, lifeMs:[1800,3200], rise:[30,70], alpha:0.55 } };
window.DEBUG = { god:false, timeScale:1 };
window.ASSETS = { ground:{ file:null, tile:64 } };
// HD UI set (assets/ui/ui_hd.json + hud_portrait_rage): display size in layout px. Files: <name>_hd.png (4x) / <name>_hd2.png (2x pre-shrunk).
window.UI_HD={"hud_frame":[83,71],"hp_bar_frame":[220,20],"hp_fill":[220,20],"xp_bar_frame":[220,8],"xp_fill":[220,8],"ability_slot":[72,72],"pause_button":[66,66],"panel_pause":[416,315],"button_home":[84,32],"button_home_hover":[84,32],"joy_base":[128,128],"joy_knob":[60,60],"icon_axe_cleave":[56,56],"icon_whirlwind":[56,56],"icon_war_stomp":[56,56],"icon_rage_roar":[56,56],"chip_wave":[120,28],"chip_timer":[62,28],"hud_portrait_rage":[50,52]};

// bump when art in ../assets/ui changes so browsers/CDNs refetch (appended as ?v=)
window.ASSET_V='20261026-logo2';
