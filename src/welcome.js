import { Scene } from './gw.js';

/**
 * Welcome Scene
 */
export class WelcomeScreen extends Scene {
  constructor() {
    super('Welcome');
    // this.addDrawable();
  }

  onClick(x, y) {
    // this.goto('Main');
    console.log(x);
    console.log(y);
  }

  onCommit() {
    // console.log(`>>> welcome commit!`);
  }

  draBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
  }

  /**
   * paint assets on stage
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    this.draBackground(ctx);

    ctx.font = '36px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('== WELCOME ==', 160, 90);
  }
}
