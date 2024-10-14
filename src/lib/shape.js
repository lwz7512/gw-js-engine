/**
 * Implement common shape drawing functions, by reference the API of `roughjs`
 *
 * @link https://github.com/rough-stuff/rough/wiki
 * @date 2024/10/07
 */

/**
 * TODO: will add more...
 */
const shapeDefaultStyles = {
  fillStyle: 'blue',
  strokeStyle: 'black',
  lineWidth: 2,
};

/**
 * demo data for `ShapeCmnd`
 */
const shapeDescExample = {
  /**
   * arc | circle | curve | ellipse | line | path | polygon | rectangle |
   */
  shape: 'line',
  operations: [
    {
      method: 'moveTo',
      coordinate: [100, 100],
    },
    {
      method: 'lineTo',
      coordinate: [200, 200],
    },
  ],
  styles: shapeDefaultStyles,
};

/**
 * Global shape enumeration
 */
export const SHAPES = {
  // == open structure ==
  ARC: 'arc',
  CURVE: 'curve',
  LINE: 'line',
  PATH: 'path',
  // == close structure ==
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  POLYGON: 'polygon',
  RECTANGLE: 'rectangle',
};

/**
 * canvas context method enumeration
 */
export const METHODS = {
  ARC: 'arc',
  ELLIPSE: 'ellipse',
  FILLRECT: 'fillRect',
  STRCRECT: 'strokeRect',
  MOVETO: 'moveTo',
  LINETO: 'lineTo',
};

/**
 * Shape drawing instructions including method name and coordinate(s).
 */
export class ShapeCmnd {
  /**
   * @type {string} canvas context method name such `moveTo`
   */
  _method = null;
  /**
   * @type {number[]} a pair of number to indicate the coordinate of one point
   */
  _coordinate = [0, 0];
  /**
   * TODO: Possibly useful in the future...
   */
  _coordinates = [];

  /**
   * construct a shape drawing command
   * @param {string} method shape drawing method to use.
   * @param {number[]} coord a pair of number, aka coordinate.
   */
  constructor(method, coord) {
    this._method = method;
    this._coordinate = coord;
  }

  get method() {
    return this._method;
  }

  get coordinate() {
    return this._coordinate;
  }

  get coordinates() {
    return this._coordinates;
  }
}

/**
 * Simple Shape Drawing Description
 */
export class ShapeDesc {
  /**
   * OPEN STRUCT: arc | line | path | curve |
   *
   * CLOSE STRUCT: circle | ellipse | polygon | rectangle |
   *
   * @type {string} shape name
   */
  _shape = null;
  /**
   * shape drawing commands
   * @type {ShapeCmnd[]} list of commands
   */
  _operations = [];
  /**
   * shape style to use
   */
  _styles = null;

  /**
   * Define a shape
   * @param {string} shape shape name
   * @param {object} styles shape style object
   */
  constructor(shape, styles = undefined) {
    this._shape = shape;
    this._styles = styles || shapeDefaultStyles;
  }
  /**
   * check shape type
   */
  get shape() {
    return this._shape;
  }
  /**
   * @type {object} style object
   */
  get styles() {
    return this._styles;
  }

  /**
   * set a group of commands
   * @type {ShapeCmnd[]} list of commands
   */
  set operations(opset) {
    this._operations = opset;
  }

  /** get commands to draw */
  get operations() {
    return this._operations;
  }

  /**
   * Add a command to shape description
   * @param {ShapeCmnd} operation one command
   */
  addOperation(operation) {
    this._operations.push(operation);
  }
}

/**
 * Draw a rectangle with gradient colors fill
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {string} colorStart gradient start color
 * @param {string} colorEnd gradient end color
 * @param {number} rectWidth gradient rect width
 * @param {number} rectHeight gradient rect height
 */
export const drawGradientRect = (
  ctx,
  colorStart,
  colorEnd,
  rectWidth,
  rectHeight
) => {
  // background sky, add linear gradient
  const grd = ctx.createLinearGradient(0, 0, 0, 150);
  // light blue
  grd.addColorStop(0, colorStart);
  // dark blue
  grd.addColorStop(1, colorEnd);

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, rectWidth, rectHeight);
};

/**
 * Draw a simple filled triangle without border
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {number[]} pt0 start point
 * @param {number[]} pt1 point 1
 * @param {number[]} pt2 point 2
 * @param {string} fillStyle file color
 */
export const drawSolidTriangle = (ctx, pt0, pt1, pt2, fillStyle) => {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(pt0[0], pt0[1]);
  ctx.lineTo(pt1[0], pt1[1]);
  ctx.lineTo(pt2[0], pt2[1]);
  ctx.closePath();
  ctx.fill();
};

/**
 * Draw a rectangle with `fillStyle` color fill, no border.
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {number} x rect x position
 * @param {number} y rect y position
 * @param {number} width rect width
 * @param {number} height rect height
 * @param {string} fillStyle fill color
 */
export const drawFilledRectNoStroke = (ctx, x, y, width, height, fillStyle) => {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
  ctx.beginPath();
};

/**
 * Draw a simple rectangle with border
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {number} x rectangle x position
 * @param {number} y rectangle y position
 * @param {number} w rectangle width
 * @param {number} h rectangle height
 * @param {object} styleOpt rectangle object, { fillStyle, strokeStyle, lineWidth }
 */
export const drawRectWithStroke = (ctx, x, y, w, h, styleOpt = {}) => {
  const { fillStyle, strokeStyle, lineWidth } = styleOpt;
  ctx.fillStyle = fillStyle || 'red';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = strokeStyle || 'red';
  ctx.lineWidth = lineWidth || 2;
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
};

/**
 * Draw a simple text with style
 * @param {CanvasRenderingContext2D} ctx canvas context
 * @param {number} x text x position
 * @param {number} y text y position
 * @param {string} text text content
 * @param {string} color text color
 * @param {number} fontSize font size
 */
export const drawTextWith = (ctx, x, y, text, color, fontSize) => {
  ctx.font = `${fontSize || 14}px Arial`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = color || 'white';
  ctx.fillText(text, x, y);
};

// ======= OPEN STRUCTURE ================

export const createArc = () => {
  // TODO:
};

export const createCurve = () => {
  // TODO:
};

/**
 * Create line description object for painter `draw`
 *
 * @param {number} x1 start point x value
 * @param {number} y1 start point y value
 * @param {number} x2 end point x value
 * @param {number} y2 end point y value
 * @param {object} options plain style object
 * @returns {ShapeDesc} line description
 */
export const createLine = (x1, y1, x2, y2, options = undefined) => {
  const line = new ShapeDesc(SHAPES.LINE, options);
  const { MOVETO, LINETO } = METHODS;
  line.addOperation({ method: MOVETO, coordinate: [x1, y1] });
  line.addOperation({ method: LINETO, coordinate: [x2, y2] });
  return line;
};

/**
 * Create open path(mult-segments) with couple of points
 * @param {number[][]} points
 * @param {*} options
 */
export const createPath = (points, options = undefined) => {
  // TODO:
};

// ======== CLOSE STRUCTURE ==============

export const createCircle = () => {
  // TODO:
};

export const createEllipse = () => {
  // TODO:
};

export const createRectangle = () => {
  // TODO:
};

export const createPolygon = () => {
  // TODO:
};

// export interface Drawable {
//   shape: string;
//   options: ResolvedOptions;
//   sets: OpSet[];
// }

// line(x1: number, y1: number, x2: number, y2: number, options?: Options): Drawable {
//   const d = this.gen.line(x1, y1, x2, y2, options);
//   this.draw(d);
//   return d;
// }

// rectangle(x: number, y: number, width: number, height: number, options?: Options): Drawable {
//   const d = this.gen.rectangle(x, y, width, height, options);
//   this.draw(d);
//   return d;
// }

// ellipse(x: number, y: number, width: number, height: number, options?: Options): Drawable {
//   const d = this.gen.ellipse(x, y, width, height, options);
//   this.draw(d);
//   return d;
// }

// circle(x: number, y: number, diameter: number, options?: Options): Drawable {
//   const d = this.gen.circle(x, y, diameter, options);
//   this.draw(d);
//   return d;
// }

// linearPath(points: Point[], options?: Options): Drawable {
//   const d = this.gen.linearPath(points, options);
//   this.draw(d);
//   return d;
// }

// polygon(points: Point[], options?: Options): Drawable {
//   const d = this.gen.polygon(points, options);
//   this.draw(d);
//   return d;
// }

// arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): Drawable {
//   const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
//   this.draw(d);
//   return d;
// }

// curve(points: Point[] | Point[][], options?: Options): Drawable {
//   const d = this.gen.curve(points, options);
//   this.draw(d);
//   return d;
// }

// path(d: string, options?: Options): Drawable {
//   const drawing = this.gen.path(d, options);
//   this.draw(drawing);
//   return drawing;
// }
