# Last Orc – main menu assets (1024x576 base, Phaser Scale.FIT, pixelArt: true)
All positions in layout.json are top-left x,y in 1024x576 space -> use setOrigin(0,0). @2x/ = NEAREST 2x copies (same names).

| file | what |
|---|---|
| background.png | scene, panel+logo removed (sky clone-filled), orc still painted in |
| logo.png | LAST ORC stone logo (alpha) |
| orc_on_rock.png | orc + rock cutout (alpha) – optional, bg already contains him (use for parallax/idle) |
| panel.png | empty main-menu wooden panel (text wiped) |
| panel_options.png | empty, larger options panel |
| buttons.png + buttons.json | Phaser atlas (JSON hash). frames: new_game_normal/_hover, continue_*, options_*, quit_*, back_* |
| button_*.png / button_*_hover.png | same frames as single files (text only, transparent) |
| cursor_skull.png | skull pointer; place left of the hovered button (x=62, y=button.y-7) |
| slider_track.png / slider_fill.png / slider_handle.png | slider parts |
| palette.json | 24 most common source colours |
| preview.png | recomposite check |

```js
this.load.image('menu_bg','assets/menu/background.png');
this.load.image('logo','assets/menu/logo.png'); // panel, panel_options, cursor_skull, slider_* likewise
this.load.atlas('buttons','assets/menu/buttons.png','assets/menu/buttons.json');
const L = this.cache.json.get('menu_layout'); // load.json('menu_layout','assets/menu/layout.json')
const b = this.add.image(L.button_new_game.x, L.button_new_game.y,'buttons','new_game_normal').setOrigin(0).setInteractive();
b.on('pointerover',()=>b.setFrame('new_game_hover')).on('pointerout',()=>b.setFrame('new_game_normal'));
```
Draw order: background, (orc_on_rock), logo, panel, buttons, cursor.
Navigation: OPTIONS -> options scene (panel_options + sliders + BACK); BACK -> main menu.

Slider: track at slider_track (MUSIC) / slider_track_sfx (SFX). Fill = same position, `fill.setCrop(0,0,8+210*value,28)`.
Handle draggable on x between 174-20 and 384-20 (centre over fill end), y = track.y-8; value = (handle.x+20-174)/210.
Labels MUSIC / SFX were wiped from panel_options – draw them with a bitmap/pixel font at ~(70,262) and (70,320).

## Update 2026-10-26 (options re-cut from options_target.png)
- background.png = main_menu.jpg scaled to 1024x576 (NEAREST); all menu pieces now match it pixel-for-pixel. Old patchwork sky / red marks gone.
- Options pieces cut from options_target.png (1672x941 -> 1024x576 NEAREST):
  - slider_track.png / slider_fill.png: 240x39 RGBA, empty dark track / full red fill, no baked skull. Placed at x160 y254 (music) / y313 (sfx). Inner bar x181..379 (w198), fill crop pad 21, crop height 39.
  - slider_handle.png: 39x41 horned skull (full, unsquashed), centred on track. Handle centre = fill end + 19.
  - panel_options.png: target pixels, skull handles painted out, crest horns restored; MUSIC/SFX/BACK lettering and BACK skull are baked in (as in target).
- New: label_music.png, label_sfx.png (pixel lettering, identical to baked), cursor_skull_options.png (red-eyed BACK skull). Keys in layout.json.
- preview.png = menu | options side by side (2048x576).
- New (options exact-match): background_options.png (= options_target scaled, 0,0), logo_options.png (268,0), orc_options.png (440,128); same sizes/alpha as logo/orc_on_rock, pixels from options_target.
