import { Scene } from './gw.js';

/**
 * Main Scene
 */
export class MainScreen extends Scene {
  constructor() {
    super('Main');
    // this.addDrawable();
  }

  onClick(x, y) {
    // this.goto('Welcome');
    console.log(x);
    console.log(y);
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
    ctx.strokeStyle = 'white';
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
    ctx.font = '36px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('== MAIN ==', 220, 90);
  }
}
