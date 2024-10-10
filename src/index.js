/**
 * Game initialization with ESM way!
 */
import { Game, initStage, startGame } from './lib/gw.js';
import { WelcomeScreen } from './scenes/welcome.js';
import { MainScreen } from './scenes/main.js';

const width = 640,
  height = 480;
const screens = [new WelcomeScreen(), new MainScreen()];
const options = { width, height, showFancyCursor: true };
const game = new Game(screens, options);

initStage('gw-playground', width, height, true);
startGame(game);

console.log(`## GW game started with ESM way!`);
