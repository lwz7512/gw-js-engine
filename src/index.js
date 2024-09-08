// ========= END OF GAME ENGINE IMPLEMENTATION =============
import { GW, Game } from './gw.js';
import { WelcomeScreen } from './welcome.js';
import { MainScreen } from './main.js';

/**
 * User implementation for game object!
 */
const width = 640,
  height = 480;
const screens = [new WelcomeScreen(), new MainScreen()];
const game = new Game(screens, { width, height });
GW.initStage('gw-playground', width, height);
GW.startGame(game);

console.log(`## GW game started!`);
