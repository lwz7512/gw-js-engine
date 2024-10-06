import { Game, Scene, initStage, startGame } from '../src/lib/index.js';
import { SimpleMoleState } from './mole.js';
import { SimpleHammer } from './hammer.js';

// ======= UI ASSETS: background and characters ==============

// ======= Main Scene ==================

class MainScreen extends Scene {
  grassPositions = [];
  molePositions = [];
  moles = [];

  hammer = null;

  constructor(width, height) {
    super('MainScene');
    super.width = width;
    super.height = height;

    this.initGrass();
    this.initMoleGrid(SimpleMoleState);
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
   * Moles grid to cache each state of mole
   * @param { SimpleMoleState } MoleStateClass
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
        const mole = new MoleStateClass(posX, posY, index);
        this.moles.push(mole);
        this.addDrawable(mole);
      }
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
    // background sky, add linear gradient
    const grd = ctx.createLinearGradient(0, 0, 0, 150);
    // light blue
    grd.addColorStop(0, '#448EE4');
    // dark blue
    grd.addColorStop(1, '#5ACAF9');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.width, this.height);

    // grassland
    ctx.fillStyle = '#bed742';
    ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
    ctx.beginPath();
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
      ctx.fillStyle = '#1d953f';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 8, startY - 30);
      ctx.lineTo(startX + 4, startY);
      ctx.fill();
    });
  }

  onMouseDown(x, y) {
    super.onMouseDown();
    console.log(`## mouse down on welcome scene!`);
  }

  onMouseUp(x, y) {
    super.onMouseUp();
    console.log(`## mouse up on welcome scene!`);
  }

  onEachSecond() {
    // console.log(`>>> one loopin second!`);
    // console.log(new Date().getTime());
  }
}

// start to prepare game assets ...

const width = 640,
  height = 480;
const screens = [new MainScreen(width, height)];
const cursor = new SimpleHammer();
const options = { width, height, cursor };
const game = new Game(screens, options);

initStage('wacm-stage', width, height);
startGame(game);

console.log(`## GW game started with ESM way!`);
