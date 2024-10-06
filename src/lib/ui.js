/**
 * UI components including:
 * - Button
 * - SimpleText
 * @date 2024/09/29
 */

/**
 * Abstract class for display object such as `Character` and `Prop`
 */
export class Drawable {
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

  /**
   * scene update properties in one frame interval
   */
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
 * Character class that implements some active behavoirs such as ...
 */
export class Character extends Interactivable {
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

    const { normalSkinColor, x, y, width, height, text } = this._style;
    const strokeWidth = this._isMouseOver ? 3 : 1;
    ctx.fillStyle = normalSkinColor;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = normalSkinColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    // draw text
    ctx.font = '24px Arial';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.fillText(text, x + 10, y + 4);

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

    const size = this._style.fontSize;
    const { x, y, text } = this._style;
    ctx.font = `${size}px Arial`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = this._style.color;
    ctx.fillText(text, x, y);

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
