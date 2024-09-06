/**
 * ==== GW.js, a minimal JS 2D game engine ====
 * Specifically designed for desktop software `GameWeaver`.
 *
 * Engine Architecture:
 *
 * Game ==> Scence ==> Character
 *                 ==> Prop
 */

// ======= Global reference attached to window object
window.animationRunning = false;

// NOTE: only defined ONCE! as a global variable!
if (window.animRequestRef === undefined) {
  window.animRequestRef = 0;
}

/**
 * === Game object skeleton ===
 */
class Game extends EventTarget {
  /**
   * all the scense
   * @type { Scene[] }
   */
  allScenes = [];
  /**
   * current found from scenes
   * @type { Scene }
   */
  activeScene = null;

  clickEventHandler = null;

  /**
   * Inject all the scenes of game, and setup scene attributes
   *
   * @param {Scene[]} scenes scene list
   * @param {object} game attributes, { width, height }
   */
  constructor(scenes, options) {
    super(); // must to have for `EventTarget`

    const { width, height } = options;
    this.allScenes = scenes;
    // setup scene attributes through game options!
    this.allScenes.forEach((s) => {
      s.navigator = sceneNavigator;
      s.width = width;
      s.height = height;
    });
    // handle click event with scene
    this.clickEventHandler = (event) => {
      const tag = event.target.tagName;
      if (tag !== 'CANVAS') return;
      if (!this.activeScene) return;
      this.activeScene.onClick();
    };
    // listening mouse event...
    document.addEventListener('click', this.clickEventHandler);
  }

  /**
   * clean up event listener!
   */
  destroy() {
    document.removeEventListener('click', this.clickEventHandler);
  }

  /**
   * activate first screen
   */
  onStart() {
    if (!this.allScenes) return;
    this.allScenes[0].start();
  }

  /** re-calculate properties change */
  onUpdate() {
    const noScenes = this.allScenes.length == 0;
    if (noScenes) return;

    this.activeScene = this.allScenes.find((s) => s.isActive());

    // re-calculate properties changes
    this.activeScene.onCommit();
  }
  /**
   * render game with properties change at next frame.
   * @param {CanvasRenderingContext2D} ctx canvas context2D
   */
  onRender(ctx) {
    this.activeScene.onPaint(ctx);
  }
}

window.Game = Game;

/**
 * === Global scene navigator ===
 *  save the active scene
 */
const sceneNavigator = {
  activeScene: '',
};

/**
 * === Abstract Scene class ===
 * managed by Game object
 */
class Scene {
  sceneName = '';
  sceneNavigator = null;

  sceneWidth = 0;
  sceneHeight = 0;

  // assets: sounds,images ...

  /**
   * drawable thing: characters, props ...
   * @type {Drawable[]} display objects that can be drew through canvas API
   */
  drawables = [];

  /**
   * initialize scene with `name` and global `sceneNavigator`
   * @param {string} name scene name
   */
  constructor(name) {
    this.sceneName = name;
  }

  /**
   * inject `sceneNavigator` while scene instance being added to game
   * @param {object} nav
   */
  set navigator(nav) {
    this.sceneNavigator = nav;
  }

  set height(h) {
    this.sceneHeight = h;
  }

  get height() {
    return this.sceneHeight;
  }

  set width(w) {
    this.sceneWidth = w;
  }

  get width() {
    return this.sceneWidth;
  }

  /**
   * Add drawable object such as character or prop(for example hammer)
   * @param {Drawable} dbl drawble object
   */
  addDrawable(dbl) {
    this.drawables.push(dbl);
  }

  /**
   * Remove drawable by id
   * @param {string} id drawable id
   */
  removeDrawable(id) {
    const index = this.drawables.findIndex((d) => d.id == id);
    if (index > -1) {
      this.drawables.splice(index, 1);
    } else {
      console.warn(`## not found drawable ${id}`);
    }
  }

  isActive() {
    return this.sceneNavigator.activeScene == this.sceneName;
  }

  /**
   * click handler
   */
  onClick() {
    //
  }

  /**
   * update game props state
   */
  onCommit() {
    this.drawables.forEach((d) => d.onChange());
  }

  /**
   * paint assets on stage
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    this.drawables.forEach((d) => d.onDraw(ctx));
  }

  /**
   * switch scene by name
   * @param {string} name scene name
   */
  goto(name) {
    this.sceneNavigator.activeScene = name;
  }
  /**
   * activate current scene
   */
  start() {
    this.goto(this.sceneName);
  }
}

window.Scene = Scene;

/**
 * Abstract class for display object such as `Character` and `Prop`
 */
class Drawable {
  _id = '';

  /**
   * @param {string} id display object id
   */
  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  onChange() {
    //
  }
  /**
   * paint me with canvas API
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onDraw(ctx) {
    //
  }
}

/**
 * Character class
 */
class Character extends Drawable {
  /**
   * set up character
   * @param {string} id
   */
  constructor(id) {
    super.id = id;
  }

  onChange() {
    //
  }
  onDraw(ctx) {
    //
  }
}

window.Character = Character;

/**
 * Stage Prop class
 */
class StageProp extends Drawable {
  /**
   * set up stage prop
   * @param {string} id
   */
  constructor(id) {
    super.id = id;
  }

  onChange() {
    //
  }
  onDraw(ctx) {
    //
  }
}

window.StageProp = StageProp;

// ======== Global game context info will change wile game running ===============
const GW = {
  // hammer: null, // to init later
  globalMouseX: 0,
  globalMouseY: 0,
  isMouseDown: false,
  // MoleClass: null,
  /** count down seconds to display */
  countDownSeconds: 60,
  /** game state: [0]-running | [1]-success | [-1]-failed */
  state: 0,
  /** game looping counter */
  _loopCounter: 0,
  /**
   * global game object
   * @type {Game | null}
   */
  game: null,
  /**
   * canvas context
   * @type { CanvasRenderingContext2D | undefined }
   */
  stage: undefined,
  /** stage width */
  stageWidth: 0,
  /** stage height */
  stageHeight: 0,
  /** check game running */
  isGameRunning: () => undefined,
  /**
   * initialize game stage with canvas settings
   * @param {string} canvasId html canvas element id
   * @param {number} canvasWidth html canvas element width in pixel
   * @param {number} canvasHeight html canvas element height in pixel
   */
  initStage: (canvasId, canvasWidth, canvasHeight) => undefined,
  /** == Interface declarations == */
  mainLoop: () => undefined,
  /** run on each second */
  stateUpdaterBySecond: () => {
    console.log(`>> run on each second!`);
  },
  /**
   * game implementation
   * @param {Game} game implemented game object
   */
  startGame: (game) => undefined,
  /** stop game */
  stopGame: () => undefined,
};

/** save to global */
window.GW = GW;

GW.isGameRunning = function () {
  return window.animationRunning;
};

/**
 * setup canvas for game engine
 */
GW.initStage = function (canvasId, canvasWidth, canvasHeight) {
  const canvas = document.getElementById(canvasId);
  GW.stage = canvas.getContext('2d');
  GW.stageWidth = canvasWidth;
  GW.stageHeight = canvasHeight;
};

/**
 * open loop flag!
 * write the object to GW, so use `GW` rather than `this`!
 * @param {Game} game object
 */
GW.startGame = function (game) {
  window.animationRunning = true;
  if (GW.game) {
    GW.game.destroy();
  }
  GW.game = game;
  GW.game.onStart();
  GW.mainLoop();
};

GW.stopGame = function () {
  window.animationRunning = false;
  window.cancelAnimationFrame(window.animRequestRef);
};

/**
 * main loop function:
 * read functions of `GW`
 */
GW.mainLoop = function () {
  // FLAG TO STOP LOOP
  if (!this.isGameRunning()) {
    return;
  }

  // increment
  this._loopCounter += 1;
  // schedule next run any way
  const loop = this.mainLoop.bind(GW);
  window.animRequestRef = window.requestAnimationFrame(loop);

  if (this._loopCounter % 2 == 1) {
    // run game scene `onUpdate` callback
    this.game.onUpdate();
    return;
  }
  if (this._loopCounter % 2 == 0) {
    // run game scene `onRender` callback
    if (this.stage) {
      // clear first
      this.stage.clearRect(0, 0, this.stageWidth, this.stageHeight);
      // re-paint
      this.game.onRender(this.stage);
    }
  }
  // NOTE: only continue at each 1.0 second
  if (this._loopCounter % 40 !== 0) return;

  // update the mole position at each second
  this.stateUpdaterBySecond();

  // if (typeof this.mainScenePainter !== 'undefined') {}
  // console.log(`>> Tick/sec!`);
};
/**
 * TODO: ...
 * Game refresh by second implementation
 */
GW.stateUpdaterBySecond = function () {
  //
};

export { GW, Game, Scene };
