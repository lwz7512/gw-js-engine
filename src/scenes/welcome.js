import { Scene } from '../lib/gw.js';
import { Button, SimpleText, FancyCursor } from '../lib/ui.js';

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

    const options = { x: 160, y: 90, fontSize: 36 };
    this.addDrawable(new SimpleText('== WELCOME ==', options));

    const btnOnClick = () => this.goto('Main');
    this._button = new Button(style, btnOnClick);
    this.addDrawable(this._button);

    // last put a cursor on the top
    const cursor = new FancyCursor();
    this.addDrawable(cursor);
  }

  onEachSecond() {
    // console.log(`>>> one loopin second!`);
    // console.log(new Date().getTime());
  }
}
