# GW.js, a minimal JS 2D game engine

Specifically designed for desktop software `GameWeaver`.

Created since 2024/09


## Features

- Support multiple scene switching;
- Built-in components in `UI` module: 
  + Button;
  + SimpleText;
  + FancyCursor as global cursor setting in game `options`;
  + statefull `Character`;
- Built-in drawing functions in `shape` module:
  + drawCircleWithFillStroke;
  + drawRotatedFillRect;
  + drawGradientRect;
  + drawSolidTriangle;
  + drawFilledRectNoStroke;
  + drawRectWithStroke;
  + drawStarWithStroke;
  + drawTextWith;
- Sound loader & playing support:
  + `initAudio` with multple sound config object
  + `playSound` in sub-class of `Cursor` & `Character`
- Complete game:
  + whac-a-mole;


## Engine Architecture:
 
```
Game ==> Scence ==> Character
                ==> Prop
                ==> Button
                ==> SimpleText
                ==> FancyCursor
```

## Usage in ESM way:

```
import { Game, initStage, startGame } from './lib/gw.js';
import { WelcomeScreen } from './scenes/welcome.js';
import { MainScreen } from './scenes/main.js';

const width = 640, height = 480;
const screens = [new WelcomeScreen(), new MainScreen()];
const game = new Game(screens, { width, height });

initStage('gw-playground', width, height);
startGame(game);
```


## Usage in UMD way:

```
const width = 640, height = 480;
const screens = [new GW.WelcomeScreen(), new GW.MainScreen()];
const game = new GW.Game(screens, { width, height });
GW.initStage('gw-playground', width, height);
GW.startGame(game);
```

## Get Started Now

```
$ npm run dev
```

then visit demo game: `http://localhost:5173/`


To use shape maker:

visit: `http://localhost:5173/shape-maker.html`


## Version history

- `v0.0.2` change build tool to vite to support engine library `ESM`/`UMD` export, @2024/09/12;
- `v0.0.3` fix `SimpleText` bug and separate `ui.js` from `gw.js`;
- `v0.0.4` Implement `FancyCursor` for mouse cursor replacement in `ui.js`;
- `v0.0.5` Implement multipe basic shape drawing function & sounds load & play API;