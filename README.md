# GW.js, a minimal JS 2D game engine

Specifically designed for desktop software `GameWeaver`.

Created since 2024/09


## Engine Architecture:
 
```
Game ==> Scence ==> Character
                ==> Prop
```

## Usage:

```
const width = 640, height = 480;
const screens = [new WelcomeScreen(), new MainScreen()];
const game = new Game(screens, { width, height });
GW.initStage('gw-playground', width, height);
GW.startGame(game);
```