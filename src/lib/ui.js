/**
 * UI components including:
 * - Button
 * - SimpleText
 * @date 2024/09/29
 */

import { Drawable, Interactivable } from './gw';

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
