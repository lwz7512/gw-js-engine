// ================= Statefull Mole Implementation Area ==============
import { Interactivable } from '../src/lib/index.js';

/**
 * Mole state implementation
 * @date 2024/10/06
 */
export class SimpleMoleState extends Interactivable {
  /** mole x coordinate */
  posX = 0;
  /** mole y coordinate */
  posY = 0;
  /** body z value */
  position = 0;
  index = 0;
  /** is mouse down */
  isHit = false;
  /** hammer x */
  hammerX = 0;
  /** hammer y */
  hammerY = 0;
  /** if being hit by the hammer  */
  isTouching = false;
  /** Dev mode to show reference dot */
  isDebugMode = false;

  // /** keep hit state counter */
  hitStayTimer = 0;

  constructor(x, y, sequence) {
    super();
    // position in canvas
    this.posX = x;
    this.posY = y;
    // position in queue
    this.index = sequence;
  }

  /**
   * TODO: to move this function out ... for user implementation!
   * @returns
   */
  checkCollision() {
    // const xOffset = 36;
    // const yOffset = 6;
    // const xDiff = this.posX - this.hammerX;
    // const yDiff = this.posY - this.hammerY;
    // const distance = Math.hypot(xDiff + xOffset, yDiff + yOffset);
    // // distance within this threshold considered hit success!
    // const threshold = 30;
    // console.log(distance);
    // return threshold > distance;
    return false;
  }

  /**
   * check if cucrent mole is visible
   * @returns if is showing up
   */
  checkIsVisible() {
    return this.index === this.position;
  }

  /**
   * Set mouse state flag to check later
   * @param {boolean} mouseDownFlag
   */
  setHitState(mouseDownFlag) {
    this.isHit = mouseDownFlag;
  }

  /**
   * Save the hammer position to check collision later
   * @param {number} mX hammer x
   * @param {number} mY hammer y
   */
  setMousePosition(mX, mY) {
    this.hammerX = mX;
    this.hammerY = mY;
  }

  /**
   * Pop up random mole by index of grid
   * @param {number} z index of mole grid
   */
  selectMoleAt(z) {
    this.position = z;
  }

  setDebugMode() {
    this.isDebugMode = true;
  }

  /**
   *
   * draw bigger hole as mask, with body position(0 ~ 45) above its burrow
   */
  drawMoleHoleWithDynaHead(ctx, posX, posY, position = 0) {
    // save each position to validate later
    // molePositions.push(position);

    // keep current unclipped context
    ctx.save();
    // hole diameter size
    const r = 36;
    // transparent mask
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX + 2 * r, posY);
    ctx.lineTo(posX + 2 * r, posY + 50);
    ctx.ellipse(posX + r, posY + 50, r, r * 0.3, 0, 0, Math.PI);
    ctx.fill();
    ctx.clip();

    // draw dark hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(posX + r, posY + 50, r, r * 0.3, 0, 0, 2 * Math.PI);
    ctx.fill();
    // mole head & body
    ctx.fillStyle = '#AD7223';
    ctx.strokeStyle = '#666666';
    ctx.beginPath();
    ctx.arc(posX + r, posY + 66 - position, 20, Math.PI * 0.75, 2.25 * Math.PI);
    ctx.lineTo(posX + (r * 5) / 3, posY + 120 - position);
    ctx.ellipse(
      posX + r,
      posY + 120 - position,
      (r * 2) / 3,
      10,
      0,
      0,
      Math.PI
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // === Eyes state change by hit flag ===
    if (this.isTouching) {
      ctx.beginPath();
      // left close eyes
      ctx.moveTo(posX + r - 12, posY + 56 - position);
      ctx.lineTo(posX + r - 6, posY + 60 - position);
      ctx.lineTo(posX + r - 12, posY + 64 - position);
      // right close eyes
      ctx.moveTo(posX + r + 12, posY + 56 - position);
      ctx.lineTo(posX + r + 6, posY + 60 - position);
      ctx.lineTo(posX + r + 12, posY + 64 - position);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#000000';
      // eyes is open
      ctx.beginPath();
      ctx.arc(posX + r - 10, posY + 62 - position, 3, 0, 2 * Math.PI);
      ctx.fill();
      // eyes is open
      ctx.beginPath();
      ctx.arc(posX + r + 10, posY + 62 - position, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // draw nose
    ctx.fillStyle = '#CFA049';
    ctx.beginPath();
    ctx.ellipse(
      posX + r,
      posY + 70 - position,
      r * 0.18,
      r * 0.2,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(posX + r, posY + 72 - position, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    ctx.ellipse(
      posX + r,
      posY + 65 - position,
      r * 0.14,
      r * 0.2,
      0,
      0,
      Math.PI
    );
    ctx.stroke();

    // draw mustache
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    // left part - 1
    ctx.moveTo(posX + r - 8, posY + 70 - position);
    ctx.lineTo(posX + r - 16, posY + 68 - position);
    // left part - 2
    ctx.moveTo(posX + r - 8, posY + 73 - position);
    ctx.lineTo(posX + r - 16, posY + 71 - position);
    // right part - 1
    ctx.moveTo(posX + r + 8, posY + 70 - position);
    ctx.lineTo(posX + r + 16, posY + 68 - position);
    // right part - 2
    ctx.moveTo(posX + r + 8, posY + 73 - position);
    ctx.lineTo(posX + r + 16, posY + 71 - position);
    ctx.stroke();

    // draw hit reference red dot
    const visible = this.checkIsVisible();
    if (this.isDebugMode && visible) {
      ctx.moveTo(posX, posY);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      // this is the hit detection coordinates
      ctx.arc(posX + 36, posY + 6, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // finish one session of drawing
    ctx.restore();
  }

  /**
   * Draw mole look by hit state
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onDraw(ctx) {
    const visible = this.checkIsVisible();
    const h = visible ? 45 : 0;

    // show hit state for 10 frames
    const stayTimeUp = this.hitStayTimer < 10;
    if (this.isTouching && stayTimeUp) {
      this.drawMoleHoleWithDynaHead(ctx, this.posX, this.posY, 20);
      this.hitStayTimer += 1;
      return;
    }

    // is showing and mouse down!
    if (visible && this.isHit) {
      const collided = this.checkCollision();
      if (collided) {
        this.isTouching = true;
        // play sound
        // ouchSoundTrack.currentTime = 0;
        // ouchSoundTrack.play();
        // console.log(`### Being hited!`);
        this.hitStayTimer = 0;
      }
    } else {
      this.isTouching = false;
    }
    // simulate the hit effect to move body down a bit
    const bodyY = this.isTouching ? 20 : h;
    this.drawMoleHoleWithDynaHead(ctx, this.posX, this.posY, bodyY);
  }
}
