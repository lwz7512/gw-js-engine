import {
  Game,
  Scene,
  initStage,
  initAudio,
  startGame,
  drawGradientRect,
  drawFilledRectNoStroke,
  drawSolidTriangle,
} from '../src/lib/index.js';
import { SimpleMole } from './mole.js';
import { SimpleHammer } from './hammer.js';

// ======= UI ASSETS: background and characters ==============

// ======= Main Scene ==================

class GrassBackground extends Scene {
  // random grass triangle position
  grassPositions = [];

  constructor(name, width, height) {
    super(name);
    super.width = width;
    super.height = height;

    this.initGrass();
  }

  initGrass() {
    // STEP - 1: build grass list
    for (let i = 0; i < 100; i += 1) {
      const startX = this.width * Math.random();
      const startY = this.height / 2 + (this.height / 2) * Math.random();
      this.grassPositions.push({
        startX,
        startY,
      });
    }
  }

  /**
   * draw screen background
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  drawBackground(ctx) {
    this.drawSkyAndGrassland(ctx);
  }

  /**
   * STEP - 2: build sky background and grassland
   * draw screen background
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  drawSkyAndGrassland(ctx) {
    // background sky: add linear gradient,
    // light_blue: '#448EE4', dark_blue: '#5ACAF9'
    drawGradientRect(ctx, '#448EE4', '#5ACAF9', this.width, this.height);

    // grassland
    drawFilledRectNoStroke(
      ctx,
      0,
      this.height / 2,
      this.width,
      this.height / 2,
      '#bed742'
    );

    // hill
    ctx.ellipse(
      this.width / 2,
      this.height / 2,
      this.width / 1.8,
      this.height / 3,
      0,
      0,
      Math.PI,
      true
    );
    ctx.fill();

    // weed from positions
    this.grassPositions.forEach(({ startX, startY }) => {
      drawSolidTriangle(
        ctx,
        [startX, startY],
        [startX + 8, startY - 30],
        [startX + 4, startY],
        '#1d953f'
      );
    });
  }
}

class MainScreen extends GrassBackground {
  /**
   * all the moles in stage
   * @type { SimpleMole[] } cached moles list
   */
  moles = [];

  // random position to update
  globalRandomMole = 0;

  _debug = false;

  constructor(width, height, debug = false) {
    super('MainScene', width, height);
    this._debug = debug;
    this.initMoleGrid(SimpleMole);
  }

  /**
   * Moles grid to cache each state of mole
   * @param { SimpleMole } MoleStateClass
   * @returns
   */
  initMoleGrid(MoleStateClass) {
    // PARAMETERS USED IN THIS DRAWING:
    const mSize = 4;
    const mStartX = 36;
    const mStartY = 100;
    const mWidth = 100;
    const mHeight = 64;
    for (let row = 0; row < mSize; row += 1) {
      for (let col = 0; col < mSize; col += 1) {
        const posX = col * mWidth + mStartX;
        const posY = row * mHeight + mStartY;
        const index = row * mSize + col;
        const mole = new MoleStateClass(posX, posY, index, this._debug);
        this.moles.push(mole);
        this.addDrawable(mole);
      }
    }
  }

  /**
   * Update characters in scene
   * @param {number} mouseX
   * @param {number} mouseY
   */
  onSceneUpdate(mouseX, mouseY) {
    this.moles.forEach((m) => {
      m.selectMoleAt(this.globalRandomMole);
      m.setHitState(this.isMouseDown);
      m.setMousePosition(mouseX, mouseY);
    });
  }

  onEachSecond() {
    // updage random position
    this.globalRandomMole = Math.floor(Math.random() * 16);
  }
}

// start to prepare game assets ...

const width = 640,
  height = 480;
const screens = [new MainScreen(width, height, true)];
const cursor = new SimpleHammer(true);
const options = { width, height, cursor, showFancyCursor: true };
const game = new Game(screens, options);

const sourceRepo =
  'https://raw.githubusercontent.com/lwz7512/game-weaver-ast/master/';
const hitSoundFile = `${sourceRepo}assets/sound/punch-hit-pixabay-cut.mp3`;
const ouchSoundFile = '../assets/sounds/ohh-mouse-squirrel-cartoon.mp3';
// const ouchSoundFile = `${sourceRepo}assets/sound/ough-pixabay-cut.mp3`;

initStage('wacm-stage', width, height, true);
initAudio([
  { name: 'hit', url: hitSoundFile, playbackRate: 2 },
  { name: 'ouch', url: ouchSoundFile },
]);
startGame(game);

console.log(`## GW game started with ESM way!`);
