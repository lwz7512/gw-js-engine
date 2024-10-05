# GW.js, a minimal JS 2D game engine

Specifically designed for desktop software `GameWeaver`.

Created since 2024/09


## Features

- Support multiple scene switching;
- Built-in components: 
  + Button, 
  + SimpleText, 
  + FancyCursor;


## Engine Architecture:
 
```
Game ==> Scence ==> Character
                ==> Prop
                ==> Button
                ==> SimpleText
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


## Version history

- `v0.0.2` change build tool to vite to support engine library `ESM`/`UMD` export, @2024/09/12;
- `v0.0.3` fix `SimpleText` bug and separate `ui.js` from `gw.js`.