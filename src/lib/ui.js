/**
 * UI components including:
 * - Button
 * - SimpleText
 * @date 2024/09/29
 */

import { drawRectWithStroke, drawTextWith, ShapeDesc } from './shape.js';

/**
 * Abstract class for display object such as `Character` and `Prop`
 */
export class Drawable {
  /**
   * unique id or name
   */
  _id = '';

  _type = 'Drawable';

  constructor(type = 'Drawable') {
    this._type = type;
  }

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

  /**
   * Drawable update before `onDraw` in next frame
   * @param {number} cursorX cursor x postion
   * @param {number} cursorY cursor y position
   */
  onChange(cursorX, cursorY) {
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
 * Drawable with shape description object which could be drew by painter
 */
export class ShapeDescribable extends Drawable {
  /**
   * @type {ShapeDesc} shape description
   */
  _shapeDesc = null;

  constructor(sd) {
    super('Describable');
    this._shapeDesc = sd;
  }

  /**
   * @param {ShapeDesc} sd shape desc object
   */
  set shapeDesc(sd) {
    this._shapeDesc = sd;
  }

  get shapeDesc() {
    return this._shapeDesc;
  }
}

/**
 * Interactive UI
 */
export class Interactivable extends Drawable {
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
  constructor(followCursor = false) {
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
   * Check if mouse is above current drawable object,
   * which is used for normal UI components such as Button
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
   * @param {number} posX cursor position horizontal
   * @param {number} posY cursor position vertical
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
 * Abstract cursor with `DOWN` | `UP` state
 */
export class Cursor extends Interactivable {
  constructor() {
    super();
  }
  /** abstract method */
  setState(stateName) {
    //
  }
  /** abstract method */
  setMouseDown() {
    //
  }
  /** abstract method */
  setMouseUp() {
    //
  }
}

/**
 * Abstract drawing method implementation by state
 */
export class DrawableState {
  /**
   * @type {string} state name
   */
  _stateName = null;

  /**
   * Create a custom state
   * @param {string} name current name
   */
  constructor(name) {
    this._stateName = name;
  }

  get name() {
    return this._stateName;
  }

  /**
   * * Abstract method to override
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param  {...any} args multiple args...
   */
  draw(ctx, ...args) {
    //
  }
}

/**
 * Character class that implements simple state machine behaviors.
 */
export class Character extends Interactivable {
  /** dynamic state */
  _currentState = null;

  /**
   * @type {DrawableState[]} character states
   */
  _states = [];

  /**
   * Build a character by states
   * @param {DrawableState[]} states character states
   */
  constructor(states) {
    super();
    this._states = states;
    // set default state
    this._currentState = states[0].name;
  }

  /**
   * update current state
   * @param {string} name next state name
   */
  changeState(name) {
    this._currentState = name;
  }

  /**
   * Get state implementation by current state name.
   * @returns {DrawableState | undefined}
   */
  findState() {
    const filter = (state) => state.name === this._currentState;
    return this._states.find(filter);
  }

  /**
   * Draw state by state name, this is good case of using shage description!
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onDraw(ctx) {
    const state = this.findState();
    if (!state) {
      console.warn(`State not found: ${this._currentState}`);
      return;
    }
    state.draw(ctx);
  }
}

/**
 * Stage Prop class that implements passive behavior such as mouse following,
 * the best example is custom cursor.
 */
export class StageProp extends Interactivable {
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

/**
 * Abstract Button class
 */
export class Button extends Interactivable {
  _style = {
    x: 10,
    y: 10,
    fontSize: 24,
    normalSkinColor: 'red',
    labelSkinColor: 'white',
    width: 100,
    height: 30,
    text: 'Enter',
  };

  _isMouseOver = false;
  _onClickCallback = undefined;

  /**
   * set up button unique id or name
   * @param {string} idOrName
   */
  constructor(style, onClick, idOrName) {
    super();
    super.id = this._style.text || idOrName;
    if (style) {
      this._style = { ...this._style, ...style };
    }
    this._onClickCallback = onClick;
  }

  /**
   * @param {string} text label text
   */
  set label(text) {
    this._style = { ...this._style, text };
  }

  onMouseOver() {
    this._isMouseOver = true;
  }

  onMouseOut() {
    this._isMouseOver = false;
  }

  onClick() {
    this._onClickCallback && this._onClickCallback();
  }

  /**
   * Draw button skin
   * @param {CanvasRenderingContext2D} ctx Canvas context
   */
  onDraw(ctx) {
    ctx.save();

    const { normalSkinColor, x, y, width, height, text, fontSize } =
      this._style;
    const strokeWidth = this._isMouseOver ? 3 : 1;
    const rectStyle = {
      fillStyle: normalSkinColor,
      strokeStyle: normalSkinColor,
      lineWidth: strokeWidth,
    };
    // draw background
    drawRectWithStroke(ctx, x, y, width, height, rectStyle);
    // draw text
    drawTextWith(ctx, x + 10, y + 4, text, 'white', fontSize);
    ctx.restore();
  }
}

/**
 * draw text on canvas
 */
export class SimpleText extends Drawable {
  _style = {
    x: 0,
    y: 0,
    text: 'Hello',
    fontSize: 12,
    color: 'white',
  };
  /**
   * construct text object
   * @param {string} text text content
   * @param {object} options style including x, y
   */
  constructor(text, options) {
    super();
    super.id = text;
    if (text) {
      this._style.text = text;
    }
    this._style = { ...this._style, ...(options || {}) };
  }

  /**
   * @param {string} txt text
   */
  set text(txt) {
    this._style.text = txt;
  }

  /**
   * draw text with drawing context
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onDraw(ctx) {
    ctx.save();
    const { fontSize, color } = this._style;
    const { x, y, text } = this._style;
    drawTextWith(ctx, x, y, text, color, fontSize);
    ctx.restore();
  }
}

/**
 * Fancy Cartoon Cursor created by Canvas API
 */
export class FancyCursor extends Cursor {
  constructor() {
    super(true);
  }

  /**
   * draw cursor skin
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onDraw(ctx) {
    const p0x = this.cursorX;
    const p0y = this.cursorY;
    const p1x = p0x + 10;
    const p1y = p0y + 34;
    const p2x = p0x + 16;
    const p2y = p0y + 22;
    const p3x = p0x + 30;
    const p3y = p0y + 20;

    // base shape
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.lineTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.lineTo(p3x, p3y);
    ctx.lineTo(p0x, p0y);
    ctx.closePath();
    // styling before stroke
    ctx.lineWidth = 2;
    ctx.lineCap = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.fillStyle = 'orange';
    // styling before fill
    ctx.fill();

    // highlight segments
    const hp0x = p0x + 6;
    const hp0y = p0y + 8;
    const hp1x = p0x + 18;
    const hp1y = p0y + 16;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.lineCap = 2;
    ctx.beginPath();
    ctx.moveTo(hp0x, hp0y);
    ctx.lineTo(hp1x, hp1y);
    ctx.stroke();
  }
}
