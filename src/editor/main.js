import { Scene } from '../lib/gw.js';
import { Button } from '../lib/ui.js';

/**
 * Maker Scene for Shape Maker
 */
export class MakerScreen extends Scene {
  _lineBtn = null;
  _pathBtn = null;
  _rectBtn = null;

  constructor() {
    super('ShapeMaker');

    const style = {
      x: 40,
      y: 30,
      width: 50,
      height: 20,
      text: 'Line',
      fontSize: 14,
    };

    const btnOnClick = () => null;
    this._lineBtn = new Button(style, btnOnClick);
    this.addDrawable(this._lineBtn);

    const pathStyle = { ...style, x: 100, text: 'Path' };
    this._pathBtn = new Button(pathStyle, btnOnClick);
    this.addDrawable(this._pathBtn);

    const rectStyle = { ...style, x: 160, text: 'Rect' };
    this._rectBtn = new Button(rectStyle, btnOnClick);
    this.addDrawable(this._rectBtn);
  }

  onMouseDown() {
    console.log(`## mouse down on welcome scene!`);
  }
}
