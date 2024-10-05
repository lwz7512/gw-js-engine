/**
 * ==== GW.js, a minimal JS 2D game engine ====
 * Specifically designed for desktop software `GameWeaver`.
 *
 * Engine Architecture:
 *
 * Game ==> Scence ==> Character
 *                 ==> Prop
 */

/**
 * ======== Global game context info will change wile game running ===============
 * NOTE:
 * Vanilla GW object to be included in `gw-esm.js`!
 * @module GW game engine root
 */
const GW_APP = {
  canvas: null,
  canvasMouseX: 0,
  canvasMouseY: 0,
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
  gameInstance: null,
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
    // console.log(`>> run on each second!`);
  },
  /**
   * game implementation
   * @param {Game} game implemented game object
   */
  startGame: (game) => undefined,
  /** stop game */
  stopGame: () => undefined,
};

GW_APP.isGameRunning = function () {
  return window.animationRunning;
};

/**
 * Safe way to avoid repetitive event listening
 *
 * @param {string} event event name such as `mousemove`, `mousedown`
 * @param {Function} listener event handler, or callback
 */
const eventHandlerSafeListener = (event, listener) => {
  if (window[event]) {
    document.removeEventListener(event, window[event]);
  }
  document.addEventListener(event, listener);
  window[event] = listener;
};

const isElementCanvas = (htmlElmt) => htmlElmt.tagName === 'CANVAS';
const getCursorPositionInCanvas = (canvas) => {
  const canvasRect = canvas.getBoundingClientRect();
  const canvasX = GW_APP.globalMouseX - canvasRect.x;
  const canvasY = GW_APP.globalMouseY - canvasRect.y;
  return { canvasX, canvasY };
};

// listening mouse move...to save it's position:
const mouseMoveHandler = function (mouseEvent) {
  GW_APP.globalMouseX = mouseEvent.clientX;
  GW_APP.globalMouseY = mouseEvent.clientY;

  const isCanvas = isElementCanvas(mouseEvent.target);
  if (!isCanvas) {
    GW_APP.gameInstance && GW_APP.gameInstance.onMouseOut();
    return;
  }

  const canvas = mouseEvent.target;
  const { canvasX, canvasY } = getCursorPositionInCanvas(canvas);
  const x = (GW_APP.canvasMouseX = Math.round(canvasX));
  const y = (GW_APP.canvasMouseY = Math.round(canvasY));
  GW_APP.gameInstance && GW_APP.gameInstance.onMouseOver(x, y);
};

// listening mouse pressed
const mouseDownHandler = function (mouseEvent) {
  const isCanvas = isElementCanvas(mouseEvent.target);
  if (!isCanvas) return;

  GW_APP.isMouseDown = true;
};

// listening mouse up
const mouseUpHandler = function (mouseEvent) {
  const isCanvas = isElementCanvas(mouseEvent.target);
  if (!isCanvas) return;
  // lazy mouse up to extend mouse down state length
  setTimeout(() => {
    GW_APP.isMouseDown = false;
  }, 100);
};

/**
 * Listening user input:
 * - mouse move
 * - mouse down
 * - mouse up
 */
const initUserInputs = () => {
  eventHandlerSafeListener('mousemove', mouseMoveHandler);
  eventHandlerSafeListener('mousedown', mouseDownHandler);
  eventHandlerSafeListener('mouseup', mouseUpHandler);
};

/**
 * TODO: PUT TO WHERE?
 * Cleanup event listeners after left game stage
 */
const eventsHandlerCleaner = () => {
  if (window['mousemove']) {
    document.removeEventListener('mousemove', window['mousemove']);
  }
  if (window['mousedown']) {
    document.removeEventListener('mousedown', window['mousedown']);
  }
  if (window['mouseup']) {
    document.removeEventListener('mouseup', window['mouseup']);
  }
  console.log(`## event handlers cleaned up!`);
};

/**
 * setup canvas for game engine
 */
const initStage = (canvasId, canvasWidth, canvasHeight) => {
  const canvas = document.getElementById(canvasId);
  GW_APP.canvas = canvas;
  GW_APP.stage = canvas.getContext('2d');
  GW_APP.stageWidth = canvasWidth;
  GW_APP.stageHeight = canvasHeight;
  // add event listeners
  initUserInputs();
};

/**
 * open loop flag!
 * write the object to GW_APP, so use `GW_APP` rather than `this`!
 * @param {Game} game object
 */
const startGame = (game) => {
  window.animationRunning = true;
  if (GW_APP.gameInstance) {
    GW_APP.gameInstance.destroy();
  }
  GW_APP.gameInstance = game;
  GW_APP.gameInstance.onStart();
  GW_APP.mainLoop();
  // save engine instance
  game.root = GW_APP;
};

const stopGame = () => {
  window.animationRunning = false;
  window.cancelAnimationFrame(window.animRequestRef);
  eventsHandlerCleaner();
};

/**
 * main loop function:
 * read functions of `GW_APP`
 */
GW_APP.mainLoop = function () {
  // FLAG TO STOP LOOP
  if (!this.isGameRunning()) {
    return;
  }

  // increment
  this._loopCounter += 1;
  // schedule next run any way
  const loop = this.mainLoop.bind(GW_APP);
  window.animRequestRef = window.requestAnimationFrame(loop);
  // === onUpdate run first ===
  if (this._loopCounter % 2 == 1) {
    // run game scene `onUpdate` callback
    this.gameInstance.onUpdate();
    return;
  }
  // === onRender run later ===
  if (this._loopCounter % 2 == 0) {
    // run game scene `onRender` callback
    if (this.stage) {
      // clear first
      this.stage.clearRect(0, 0, this.stageWidth, this.stageHeight);
      // re-paint
      this.gameInstance.onRender(this.stage);
    }
  }
  // NOTE: only continue at each 1.0 second
  if (this._loopCounter % 60 !== 0) return;

  // update the mole position at each second
  this.stateUpdaterBySecond();

  // update scene from game instance
  this.gameInstance.stateUpdaterBySecond();
};
/**
 * TODO: ...
 * Game refresh by second implementation
 */
GW_APP.stateUpdaterBySecond = function () {
  //
};

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
   * GW engine app instance
   * @type {GW} engine object
   */
  root = null;
  /**
   * all the scense
   * @type { Scene[] }
   */
  allScenes = [];
  /**
   * current found from scenes
   * @type { Scene | null }
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
      // inject mouse coordinate from canvas
      const x = this.root.canvasMouseX;
      const y = this.root.canvasMouseY;
      this.activeScene.onClick(x, y);
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

  /**
   * Mouse is moving in stage
   *
   * @param {number} x mouse x in stage
   * @param {number} y mouse y in stage
   */
  onMouseOver(x, y) {
    this.activeScene.onMouseOver(x, y);
  }

  /**
   * Mouse left stage(canvas)
   */
  onMouseOut() {
    //
  }

  /**
   * call update function in active scene
   * @returns
   */
  stateUpdaterBySecond() {
    if (!this.activeScene) return;
    this.activeScene.onEachSecond();
  }
} // end of Game

// ========== END OF Game ==============

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

  _stageX = 0;
  _stageY = 0;

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
   * draw screen background
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  drawBackground(ctx) {
    ctx.save();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);

    ctx.restore();
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
   * Scene click handler, dont override this function in sub class!
   * @param {number} x mouse x in canvas
   * @param {number} y mouse y in canvas
   */
  onClick(x, y) {
    this.drawables.forEach((d) => {
      if (!d.isOnMe) return;
      const isTouched = d.isOnMe(x, y);
      isTouched && d.onClick();
    });
  }

  /**
   * Callback while mouse is moving in stage, dont override this function in sub class!
   *
   * @param {number} x mouse x position in stage
   * @param {number} y mouse y position in stage
   */
  onMouseOver(x, y) {
    // console.log(`>>> mouse moving in screne...`);
    this.drawables.forEach((d) => {
      if (!d.isOnMe) return;
      const isTouched = d.isOnMe(x, y);
      isTouched && d.onMouseOver();
      !isTouched && d.onMouseOut();
    });
    // set movable cursor new position...
    this._stageX = x;
    this._stageY = y;
  }

  /**
   * update game props state
   */
  onCommit() {
    const x = this._stageX;
    const y = this._stageY;
    this.drawables.forEach((d) => d.onChange(x, y));
  }

  /**
   * paint drawables(such as buttons) on stage, dont override this function in sub class!
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    if (!ctx) return console.warn(`NO ctx passed into paint!`);
    this.drawBackground(ctx);
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

  /**
   * current scene callback on each second
   */
  onEachSecond() {
    //
  }
} // end of Scene

// ========= END OF Scene class ===============

/**
 * Abstract class for display object such as `Character` and `Prop`
 */
class Drawable {
  /**
   * unique id or name
   */
  _id = '';

  _type = 'Drawable';

  get type() {
    return this._type;
  }

  /**
   * @param {string} id display object id or name
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
 * Interactive UI
 */
class Interactivable extends Drawable {
  /**
   * display attribute
   */
  _style = {
    x: 0, // x value in canvas
    y: 0, // y value in canvas
    width: 100,
    height: 30,
  };

  _type = 'Interactivable';

  /**
   * wether follow cursor movement or not
   */
  _couldFollowCursor = false;

  _cursorX = 0;
  _cursorY = 0;

  /**
   *
   * @param {boolean} followCursor if follow cursor movement
   */
  constructor(followCursor) {
    super();
    this._couldFollowCursor = followCursor;
  }

  get type() {
    return this._type;
  }

  /**
   * check wheter follow cursor
   */
  get followCursor() {
    return this._couldFollowCursor;
  }

  set style(style) {
    this._style = style;
  }

  get style() {
    return this._style;
  }

  get cursorX() {
    return this._cursorX;
  }

  get cursorY() {
    return this._cursorY;
  }

  /**
   * Check if mouse is above current drawable object.
   *
   * @param {number} mouseX mouse in canvas horizontal coordinate
   * @param {number} mouseY mouse in canvas vertical coordinate
   */
  isOnMe(mouseX, mouseY) {
    const { x, y, width, height } = this._style;
    const beyondTL = mouseX > x && mouseY > y;
    const withinBR = mouseX < x + width && mouseY < y + height;
    return beyondTL && withinBR;
  }

  /**
   * Update current character position for next frame rendering
   * @param {number} posX position horizontal
   * @param {number} posY position vertical
   */
  onChange(posX, posY) {
    this._cursorX = posX;
    this._cursorY = posY;
  }

  onMouseOver() {
    //
  }

  onMouseOut() {
    //
  }

  onClick() {
    //
  }
}

/**
 * Character class that implements some active behavoirs such as ...
 */
class Character extends Interactivable {
  /**
   * set up character unique id or name
   * @param {string} idOrName
   */
  constructor(idOrName, style) {
    super();
    super.id = idOrName;
    if (style) {
      this.style = { ...this._style, ...style };
    }
  }

  onDraw(ctx) {
    //
  }
}

/**
 * Stage Prop class that implements passive behavior such as mouse following,
 * the best example is custom cursor.
 */
class StageProp extends Interactivable {
  /**
   * set up stage prop unique id or name
   * @param {string} idOrName
   */
  constructor(idOrName, style) {
    super();
    super.id = idOrName;
    if (style) {
      this.style = { ...this._style, ...style };
    }
  }

  onDraw(ctx) {
    //
  }
}

// =============== Put drawable display class under GW =====================

export { initStage, startGame, stopGame };
export { Game, Scene, Drawable, Interactivable, Character, StageProp };
