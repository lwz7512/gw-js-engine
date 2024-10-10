/**
 * Game initialization with ESM way!
 */
import { Game, initStage, startGame } from './lib/gw.js';
import { MakerScreen } from './editor/main.js';

const width = 640,
  height = 480;
const screens = [new MakerScreen()];
const options = { width, height };
const game = new Game(screens, options);

initStage('gw-editor-stage', width, height);
startGame(game);

console.log(`## GW shape maker started with ESM way!`);
