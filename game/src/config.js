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
window.SLIDER = { innerX:181, innerW:198, fillPad:21, fillH:39, handleOffset:-0.5, fillExtra:18 };
window.MENU_CURSOR_X = 60;  // main-menu skull x override (Options BACK skull stays at layout.json x)  // innerX/innerW overridden by layout.json slider_fill_inner if present
window.ORC_BOB_OPTIONS = 0;  // bob px on Options
window.ORC_BOB = { px:0, ms:1400 };  // idle bob for orc_on_rock (set px:0 to disable)
window.MENU_FALLBACK = { main:'../main_menu.jpg', options:'../options_menu.png' };
// Fallback layout (1024x576 space) matching the buttons/sliders baked into the mockups. layout.json overrides keys.
window.DEFAULT_LAYOUT = {
  buttons:{ new_game:{x:56,y:250,w:224,h:40}, continue:{x:56,y:296,w:224,h:40}, options:{x:56,y:342,w:224,h:40}, quit:{x:56,y:388,w:224,h:40} },
  sliders:{ music:{x:177,y:255,w:208,h:24}, sfx:{x:177,y:315,w:208,h:24} },
  back:{x:66,y:374,w:136,h:36} };
window.ASSETS = { rage:{ file:null, frameWidth:48, frameHeight:48, scale:1, color:0x4f7a2a }, ground:{ file:null, tile:64 } };
window.TUNING = { worldSize:8000, speed:200, dashSpeed:820, dashMs:160, dashCooldownMs:1200 };
