import { Scene } from '../lib/gw.js';
import { Button, SimpleText, FancyCursor } from '../lib/ui.js';

/**
 * Main Scene
 */
export class MainScreen extends Scene {
  /**
   * @type {Button} single button instance
   */
  _button = null;

  constructor() {
    super('Main');

    const style = {
      x: 250,
      y: 200,
      width: 150,
      text: 'Go Back',
      normalSkinColor: 'black',
    };
    const options = { x: 220, y: 90, fontSize: 36 };
    this.addDrawable(new SimpleText('== MAIN ==', options));

    const btnOnClick = () => this.goto('Welcome');
    this._button = new Button(style, btnOnClick);
    this.addDrawable(this._button);

    // last put a cursor on the top
    const cursor = new FancyCursor();
    this.addDrawable(cursor);
  }

  /**
   * if sub scene want to override `onCommit`,
   * call super.onCommit() is a must!
   */
  onCommit() {
    super.onCommit();
    // console.log(`>>> main commit!`);
  }

  drawBackground(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
  }
}
