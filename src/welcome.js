import { Scene, Button, SimpleText } from './gw.js';

/**
 * Welcome Scene
 */
export class WelcomeScreen extends Scene {
  _button = null;

  constructor() {
    super('Welcome');

    const style = {
      x: 250,
      y: 200,
      width: 150,
      text: 'Enter Game',
    };
    const btnOnClick = () => this.goto('Main');
    this._button = new Button(style, btnOnClick);
    this.addDrawable(this._button);

    this.addDrawable(new SimpleText());
  }

  onCommit() {
    // console.log(`>>> welcome commit!`);
  }

  /**
   * draw screen background
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  drawBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
    // and draw screen title
    ctx.font = '36px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('== WELCOME ==', 160, 90);
  }
}
