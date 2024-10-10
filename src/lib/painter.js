/**
 * shape painter by canvas context
 * @2024/10/08
 */

import { ShapeDesc, SHAPES, METHODS } from './shape';

export class GWPainter {
  /**
   * @type {CanvasRenderingContext2D} canvas context property
   */
  ctx = null;

  /**
   * construct a painter by canva context
   * @param {CanvasRenderingContext2D} ctx canvas context object
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Draw shape to canvas through description object
   * @param {ShapeDesc} shapeDesc shape description object
   */
  draw(shapeDesc) {
    const { lineWidth, strokeStyle } = shapeDesc.styles;
    const operation = shapeDesc.operations;
    switch (shapeDesc.shape) {
      // === DRAW LINE SEGEMENT ===
      case SHAPES.LINE: {
        const [cmd1, cmd2] = operation;
        this.ctx.save();
        this.ctx.beginPath();
        // step 1: moveTo, cmd1.method === METHODS.MOVETO
        const [x1, y1] = cmd1.coordinate;
        this.ctx[cmd1.method](x1, y1);
        // step 2: lineTo, cmd2.method === METHODS.LINETO
        const [x2, y2] = cmd2.coordinate;
        this.ctx[cmd2.method](x2, y2);
        // set stroke color
        this.ctx.strokeStyle = strokeStyle;
        // set stroke width
        this.ctx.lineWidth = lineWidth;
        // draw it
        this.ctx.stroke();
        // reset context
        this.ctx.restore();
        break;
      }
      // === DRAW PATH, MULTI-SEGMENTS ===
      case SHAPES.PATH: {
        // TODO:
        break;
      }
      // === DRAW RECTANGLE SHAPE ===
      case SHAPES.RECTANGLE: {
        // TODO:
        break;
      }
      // =============================
    }
  }
}
