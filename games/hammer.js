// ================ Hammer Implemenation Area =========================
import { Cursor } from '../src/lib/index.js';

const HammerState = {
  DOWN: 'DOWN',
  UP: 'UP',
};

/**
 * Hammer State Machine
 * @date 2024/10/06
 */
export class SimpleHammer extends Cursor {
  /**
   * UP | DOWN
   */
  currentState = 'UP';

  /** Dev mode to show reference dot */
  isDebugMode = false;

  constructor(debug = false) {
    super();
    this.isDebugMode = debug;
  }

  setState(upOrDn) {
    this.currentState = upOrDn;
  }

  setMouseDown() {
    this.setState(HammerState.DOWN);
  }

  setMouseUp() {
    this.setState(HammerState.UP);
  }

  drawRotatedRect(ctx, x, y, width, height, degrees) {
    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + width / 2, y + height / 2);
    // rotate the rect
    ctx.rotate((degrees * Math.PI) / 180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    // so the rect needs to be offset accordingly when drawn
    ctx.roundRect(-width / 2, -height / 2, width, height, [5]);

    ctx.fillStyle = 'gold';
    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();
  }

  paintHammerUp(ctx, mx, my) {
    // Draw the ellipse
    ctx.fillStyle = 'red';
    // Draw the ellipse
    ctx.beginPath();
    ctx.ellipse(mx + 12, my - 18, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx + 8, my - 12, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx + 4, my - 6, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx - 4, my + 6, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx - 8, my + 12, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx - 12, my + 18, 6, 20, -Math.PI / 3, 0, 2 * Math.PI);
    ctx.fill();

    this.drawRotatedRect(ctx, mx + 6, my + 22, 80, 10, 30);

    // draw hit reference green dot
    if (this.isDebugMode) {
      ctx.strokeStyle = '#000000';
      ctx.moveTo(mx, my);
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  paintHammerDown(ctx, mx, my) {
    // Draw the ellipse
    ctx.fillStyle = 'red';
    // Draw the ellipse
    ctx.beginPath();
    ctx.ellipse(mx, my - 8, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my - 2, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my + 4, 12, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my + 10, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my + 16, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my + 22, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(mx, my + 28, 6, 20, -Math.PI / 2, 0, 2 * Math.PI);
    ctx.fill();

    this.drawRotatedRect(ctx, mx + 6, my + 22, 80, 10, 15);

    // draw hit reference green dot
    if (this.isDebugMode) {
      ctx.strokeStyle = '#000000';
      ctx.moveTo(mx, my);
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(mx, my + 10, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * Draw star with spikes and radius
   *
   * EG: drawStar(175, 100, 12, 30, 15);
   * drawStar(75, 100, 5, 30, 15);
   * drawStar(175, 100, 12, 30, 10);
   * drawStar(75, 200, 6, 30, 15);
   * drawStar(175, 200, 20, 30, 25);
   *
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param {number} cx
   * @param {number} cy
   * @param {number} spikes
   * @param {number} outerRadius
   * @param {number} innerRadius
   */
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.save();
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    // ctx.strokeStyle='blue';
    ctx.strokeStyle = 'red';
    ctx.stroke();
    // ctx.fillStyle='skyblue';
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.restore();
  }

  onUpdate() {
    if (this.currentState == HammerState.DOWN) {
      // play hammer down sound
      this.playSound('hit');
    }
  }

  onDraw(ctx) {
    const [hammerX, hammerY] = [this.cursorX, this.cursorY];
    if (this.currentState === HammerState.UP) {
      this.paintHammerUp(ctx, hammerX, hammerY);
    } else {
      // check if hit the mole to draw star!
      // for now just draw star at each hit
      this.drawStar(ctx, hammerX - 10, hammerY + 30, 12, 30, 15);
      // then draw hammer
      this.paintHammerDown(ctx, hammerX, hammerY);
    }
  } // end of state rendering
} // end of SimpleHammerState
