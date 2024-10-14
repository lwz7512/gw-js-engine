// ================ Hammer Implemenation Area =========================
import {
  Cursor,
  drawStarWithStroke,
  drawRotatedFillRect,
  drawCircleWithFillStroke,
} from '../src/lib/index.js';

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

  /**
   * Draw hammer up skin
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param {number} mx mouse x
   * @param {number} my mouse y
   */
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

    drawRotatedFillRect(ctx, mx + 6, my + 22, 80, 10, 30);

    // draw hit reference green dot
    if (this.isDebugMode) {
      drawCircleWithFillStroke(ctx, mx, my, 4, '#00FF00', '#000000');
    }
  }

  /**
   * Draw hammer down skin
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param {number} mx start(mouse) x
   * @param {number} my start(mouse) y
   */
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

    drawRotatedFillRect(ctx, mx + 6, my + 22, 80, 10, 15);

    // draw hit reference green dot
    if (this.isDebugMode) {
      drawCircleWithFillStroke(ctx, mx, my + 10, 4, '#00FF00', '#000000');
    }
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
      drawStarWithStroke(ctx, hammerX - 10, hammerY + 30, 12, 30, 15);
      // then draw hammer
      this.paintHammerDown(ctx, hammerX, hammerY);
    }
  } // end of state rendering
} // end of SimpleHammerState
