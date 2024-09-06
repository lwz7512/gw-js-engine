import { Scene } from './gw.js';

/**
 * Welcome Scene
 */
export class WelcomeScreen extends Scene {
  constructor() {
    super('Welcome');
    // this.addDrawable();
  }

  onClick() {
    this.goto('Main');
  }

  onCommit() {
    // console.log(`>>> welcome commit!`);
  }

  /**
   * paint assets on stage
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    // console.log(`>>> wecome paint!`);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
