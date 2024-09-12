import { Scene, Button, SimpleText } from '../lib/gw-esm.js';

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

    const options = { x: 160, y: 90, fontSize: 36 };
    this.addDrawable(new SimpleText('== WELCOME ==', options));
  }
}
