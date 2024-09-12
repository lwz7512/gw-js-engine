/**
 * Main Scene
 */
class MainScreen extends GW.Scene {
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
    const btnOnClick = () => this.goto('Welcome');
    this._button = new GW.Button(style, btnOnClick);
    this.addDrawable(this._button);
  }

  onCommit() {
    // console.log(`>>> main commit!`);
  }

  drawBackground(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
    ctx.font = '36px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('== MAIN ==', 220, 90);
  }
}

// mount to GW module
GW.MainScreen = MainScreen;
