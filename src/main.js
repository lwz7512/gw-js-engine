import { Scene } from './gw.js';

/**
 * Main Scene
 */
export class MainScreen extends Scene {
  constructor() {
    super('Main');
    // this.addDrawable();
  }

  onClick() {
    this.goto('Welcome');
  }

  onCommit() {
    // console.log(`>>> main commit!`);
  }

  /**
   * paint assets on stage
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    // console.log(`>>> main paint!`);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
