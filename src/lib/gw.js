/**
 * ==== GW.js, a minimal JS 2D game engine ====
 * Specifically designed for desktop software `GameWeaver`.
 *
 * Engine Architecture:
 *
 * Game ==> Scence ==> Character
 *                 ==> Prop
 */

import { GWPainter } from './painter';
import { FancyCursor, Cursor, Drawable, ShapeDescribable } from './ui';

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
  /**
   * sounds object
   * @type {{[name: string]: Audio}}
   */
  sounds: {},
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

  // mark global mouse state
  GW_APP.isMouseDown = true;
  // notify game instance
  const x = GW_APP.canvasMouseX;
  const y = GW_APP.canvasMouseY;
  GW_APP.gameInstance && GW_APP.gameInstance.onMouseDown(x, y);
};

// listening mouse up
const mouseUpHandler = function (mouseEvent) {
  const isCanvas = isElementCanvas(mouseEvent.target);
  if (!isCanvas) return;
  // lazy mouse up to extend mouse down state length
  setTimeout(() => {
    GW_APP.isMouseDown = false;
    // notify game instance
    const x = GW_APP.canvasMouseX;
    const y = GW_APP.canvasMouseY;
    GW_APP.gameInstance && GW_APP.gameInstance.onMouseUp(x, y);
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
 * setup canvas for game engine including cursor style
 *
 * @param {string} canvasId canvas element id
 * @param {number} canvasWidth canvas width
 * @param {number} canvasHeight canvas height
 * @param {boolean} showFancyCursor wether use fancy cursor, false by default
 * @returns {void} nothing
 */
const initStage = (
  canvasId,
  canvasWidth,
  canvasHeight,
  showFancyCursor = false
) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    return console.warn(`## No canvas found for: ${canvasId}`);
  }
  // hide cursor
  if (showFancyCursor) {
    canvas.style.cursor = 'none';
  }
  GW_APP.canvas = canvas;
  GW_APP.stage = canvas.getContext('2d');
  GW_APP.stageWidth = canvasWidth;
  GW_APP.stageHeight = canvasHeight;
  // add event listeners
  initUserInputs();
};

/**
 * load audio files by url
 * @param {{name: string, url: string, playbackRate: number}[]} sounds souds url list
 */
const initAudio = (sounds) => {
  sounds.forEach(({ name, url, playbackRate }) => {
    const audioTrack = new Audio(url);
    GW_APP.sounds[name] = audioTrack;
    if (playbackRate) {
      audioTrack.playbackRate = playbackRate;
    }
  });
};

/**
 * Get audio track by name
 * @param {string} name audio track name
 * @returns audio object
 */
const findAudio = (name) => {
  return GW_APP.sounds[name];
};

/**
 * open loop flag!
 * write the object to GW_APP, so use `GW_APP` rather than `this`!
 * @param {Game} game object
 */
const startGame = (game) => {
  if (!GW_APP.canvas) {
    return console.warn(`## No canvas to start game!`);
  }
  // global running flag
  window.animationRunning = true;

  if (GW_APP.gameInstance) {
    GW_APP.gameInstance.destroy();
  }
  GW_APP.gameInstance = game;
  GW_APP.gameInstance.onStart();
  // start game looping ...
  GW_APP.mainLoop();

  // === setup game instance ===
  // save engine instance
  game.root = GW_APP;
  // setup painter ...
  const ctx = GW_APP.stage;
  if (!ctx) throw new Error('No canvas context found!');
  game.painter = new GWPainter(ctx);
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
   * @type { GW_APP } engine object
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

  /**
   * click event handler on stage
   */
  clickEventHandler = null;

  /**
   * sound play event handelr
   */
  soundPlayHandler = null;

  /**
   * global cursor object
   * @type { Cursor }
   */
  cursor = null;
  /**
   * wether display builtin cursor
   */
  _hideCursor = false;
  /**
   * cursor position in stage
   */
  _stageX = 0;
  _stageY = 0;

  /**
   * @type {GWPainter} shape painter instance
   */
  painter = null;

  /**
   * Inject all the scenes of game, and setup scene attributes
   *
   * @param {Scene[]} scenes scene list
   * @param {object} options game attributes: { width, height, cursor, showFancyCursor? }
   */
  constructor(scenes, options) {
    // must to have for `EventTarget`
    super();

    // save all the scenes
    this.allScenes = scenes;

    // set game from options
    const { width, height, cursor, showFancyCursor } = options;

    // use fancy cursor: true by default
    this._hideCursor = !showFancyCursor;

    // set cursor object from option, FancyCursor by default.
    if (!this._hideCursor) {
      this.cursor = cursor || new FancyCursor();
    }

    // setup scene attributes through game options!
    this.allScenes.forEach((s) => {
      s.navigator = sceneNavigator;
      s.width = width;
      s.height = height;
      s.painter = this.painter;
      if (!this._hideCursor) {
        s.cursor = this.cursor;
      }
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

    this.soundPlayHandler = (event) => {
      const name = event.detail;
      // find and play
      if (!name) {
        return console.warn('## No name from sound request event!');
      }
      // trying to find sound track
      const soundTrack = findAudio(name);
      if (soundTrack) {
        soundTrack.currentTime = 0;
        soundTrack.play();
      } else {
        console.warn(`## No sound found for request name: ${name}`);
      }
    };
    // listen sound playing request...
    document.addEventListener('playSound', this.soundPlayHandler);
  }

  /**
   * clean up event listener!
   */
  destroy() {
    document.removeEventListener('click', this.clickEventHandler);
    document.removeEventListener('playSound', this.soundPlayHandler);
  }

  /**
   * activate first screen
   */
  onStart() {
    if (!this.allScenes) {
      return console.warn(`## No scenes defined for game!`);
    }
    this.allScenes[0].start();
  }

  /** re-calculate properties change */
  onUpdate() {
    const noScenes = this.allScenes.length == 0;
    if (noScenes) return;

    // cache current scene to update later
    this.activeScene = this.allScenes.find((s) => s.isActive());

    // update cursor first
    if (!this._hideCursor) {
      this.cursor.onChange(this._stageX, this._stageY);
    }

    // then update scene
    this.activeScene.onCommit();
  }
  /**
   * render game with properties change at next frame.
   * @param {CanvasRenderingContext2D} ctx canvas context2D
   */
  onRender(ctx) {
    // first render scene
    this.activeScene.onPaint(ctx);
    // then, render cursor!
    if (!this._hideCursor) {
      this.cursor.onDraw(ctx);
    }
  }

  /**
   * Mouse is pressed down in stage
   *
   * @param {number} x mouse x in stage
   * @param {number} y mouse y in stage
   */
  onMouseDown(x, y) {
    this.activeScene.onMouseDown(x, y);
    if (!this._hideCursor) {
      this.cursor.setMouseDown();
    }
  }

  /**
   * Mouse is released down in stage
   *
   * @param {number} x mouse x in stage
   * @param {number} y mouse y in stage
   */
  onMouseUp(x, y) {
    this.activeScene.onMouseUp(x, y);
    if (!this._hideCursor) {
      this.cursor.setMouseUp();
    }
  }

  /**
   * Mouse is moving in stage
   *
   * @param {number} x mouse x in stage
   * @param {number} y mouse y in stage
   */
  onMouseOver(x, y) {
    this._stageX = x;
    this._stageY = y;
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

  /** mouse x */
  _stageX = 0;
  /** mouse y */
  _stageY = 0;

  /**
   * @type {Cursor}
   */
  _cursor = null;

  _isMouseDown = false;

  // assets: sounds,images ...

  /**
   * Display objects that can be drew through canvas API
   * @type {(Drawable | ShapeDescribable)[]}
   */
  drawables = [];

  /**
   * painter from game instance
   * @type {GWPainter} game painter
   */
  _painter = null;

  /**
   * initialize scene with `name` and global `sceneNavigator`
   * @param {string} name scene name
   */
  constructor(name) {
    this.sceneName = name;
  }

  /**
   * @param {GWPainter} ptr game shape painter
   */
  set painter(ptr) {
    this._painter = ptr;
  }

  /**
   * Cache global cursor object
   * @param {Cursor} it custom cursor
   */
  set cursor(it) {
    this._cursor = it;
  }

  /**
   * Get injected cursor object from Game initialization
   */
  get cursor() {
    return this._cursor;
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

  get isMouseDown() {
    return this._isMouseDown;
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
   * Callback when mouse is being pressed in this scene,
   * set cursor state down from `Scene` class.
   * @param {number} x mouse x position in stage
   * @param {number} y mouse y position in stage
   */
  onMouseDown(x, y) {
    this._isMouseDown = true;
  }

  /**
   * Callback when mouse is being released in this scene,
   * set cursor state up from `Scene` class.
   * @param {number} x mouse x position in stage
   * @param {number} y mouse y position in stage
   */
  onMouseUp(x, y) {
    this._isMouseDown = false;
  }

  /**
   * inner update game props state, do not override this method in sub-scene class!
   */
  onCommit() {
    const x = this._stageX;
    const y = this._stageY;
    this.drawables.forEach((d) => d.onChange(x, y));
    // call sub-scene class commit!
    this.onSceneUpdate(x, y);
  }

  /**
   * abstract method for sub-scene class implementation use
   * @param {number} mouseX mouse x in stage
   * @param {number} mouseY mouse y in stage
   */
  onSceneUpdate(mouseX, mouseY) {
    //
  }

  /**
   * paint drawables(such as buttons) on stage, dont override this function in sub class!
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onPaint(ctx) {
    if (!ctx) return console.warn(`NO ctx passed into paint!`);
    this.drawBackground(ctx);
    // consider use `painter` do draw work!
    this.drawables.forEach((d) => {
      if (d.shapeDesc) {
        return this._painter.draw(d.shapeDesc);
      }
      // fallback to legacy callback
      d.onDraw(ctx);
    });
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

export { initStage, initAudio, findAudio, startGame, stopGame };
export { Game, Scene };
