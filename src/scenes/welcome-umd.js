/**
 * Welcome Scene
 */
class WelcomeScreen extends GW.Scene {
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
    this._button = new GW.Button(style, btnOnClick);
    this.addDrawable(this._button);

    const options = { x: 160, y: 90, fontSize: 36 };
    this.addDrawable(new GW.SimpleText('== WELCOME ==', options));
  }
}

// mount to GW module
GW.WelcomeScreen = WelcomeScreen;
