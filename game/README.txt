LAST ORC v0 (Phaser 4.2.1, 1024x576 FIT, pixelArt, roundPixels)
Run from /workspace/last_orc:  python3 -m http.server 8090   then open http://localhost:8090/game/
Menu pieces: drop files into ../assets/menu/ (names in src/config.js MENU_PIECES). layout.json keys (1024x576, top-left x/y/w/h):
 background, logo, orc_rock, panel, buttons:{new_game,continue,options,quit}, sliders:{music,sfx}, back.
 buttons.json atlas frames: <id>_normal / <id>_highlighted. Until background+panel exist, full main_menu.jpg/options_menu.png mockups are used.
Controls: WASD/Arrows move, Space dash, Esc menu.
