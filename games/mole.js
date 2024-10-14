// ================= Statefull Mole Implementation Area ==============
import { Character, DrawableState } from '../src/lib/index.js';

/** hidden state */
class IdleMole extends DrawableState {
  constructor(name = 'idle') {
    super(name);
  }
  /**
   * draw bigger hole as mask, with body position(0 ~ 45) above its burrow
   *
   * @param {CanvasRenderingContext2D} ctx canvas context
   * @param {number} posX mole position x
   * @param {number} posY mole position y
   * @param {number} position mole index in list
   * @param {boolean} openEyes if mole open eyes
   * @param {boolean} showDebugDot if display debug dot on mole's head
   */
  drawMoleHoleWithDynaHead(ctx, posX, posY, position = 0, openEyes = true) {
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
    if (openEyes) {
      ctx.fillStyle = '#000000';
      // eyes is open
      ctx.beginPath();
      ctx.arc(posX + r - 10, posY + 62 - position, 3, 0, 2 * Math.PI);
      ctx.fill();
      // eyes is open
      ctx.beginPath();
      ctx.arc(posX + r + 10, posY + 62 - position, 3, 0, 2 * Math.PI);
      ctx.fill();
    } else {
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

    // finish one session of drawing
    ctx.restore();
  }

  draw(ctx, posX, posY) {
    this.drawMoleHoleWithDynaHead(ctx, posX, posY, 0);
  }
}

/**
 * stand out state
 */
class StandMole extends IdleMole {
  _debug = false;
  _dotOffsetX = 0;
  _dotOffsetY = 0;
  constructor(debug = false, dotOffsetX = 0, dotOffsetY = 0) {
    super('stand');
    this._debug = debug;
    this._dotOffsetX = dotOffsetX;
    this._dotOffsetY = dotOffsetY;
  }

  drawDebugDot(ctx, posX, posY) {
    if (!this._debug) return;
    ctx.moveTo(posX, posY);
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    // this is the hit detection coordinates
    ctx.arc(
      posX + this._dotOffsetX,
      posY + this._dotOffsetY,
      4,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  draw(ctx, posX, posY) {
    this.drawMoleHoleWithDynaHead(ctx, posX, posY, 45, true);
    this.drawDebugDot(ctx, posX, posY);
  }
}

/** being hit state */
class HitedMole extends IdleMole {
  constructor() {
    super('hited');
  }
  draw(ctx, posX, posY) {
    this.drawMoleHoleWithDynaHead(ctx, posX, posY, 20, false);
  }
}

const MOLE_HIT_SPOT = {
  offsetX: 36,
  offsetY: 6,
};

/**
 * Mole state implementation
 * TODO: modify this class with state machine ...
 * @date 2024/10/06
 */
export class SimpleMole extends Character {
  /** mole x coordinate */
  posX = 0;
  /** mole y coordinate */
  posY = 0;
  /** mole index currently stand */
  position = 0;
  /** mole index */
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

  _hitSpotOffsetX = 36;
  _HITSpotOffsetY = 6;

  constructor(x, y, sequence, debug = false) {
    const { offsetX, offsetY } = MOLE_HIT_SPOT;
    // init mole states
    super([
      new IdleMole(),
      new StandMole(debug, offsetX, offsetY),
      new HitedMole(),
    ]);
    // position in canvas
    this.posX = x;
    this.posY = y;
    // position in queue
    this.index = sequence;
  }

  /**
   * check two red dots distance
   * @returns
   */
  checkCollision() {
    const { offsetX, offsetY } = MOLE_HIT_SPOT;
    const xDiff = this.posX - this.hammerX;
    const yDiff = this.posY - this.hammerY;
    const distance = Math.hypot(xDiff + offsetX, yDiff + offsetY);
    // distance within this threshold considered hit success!
    const threshold = 30;
    // console.log(distance);
    return threshold > distance;
    // return false;
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
   * standing state
   * @returns
   */
  onUpdate() {
    const visible = this.checkIsVisible();
    // is visible and mouse down, check collistion:
    if (visible && this.isHit) {
      const collided = this.checkCollision();
      if (collided) {
        this.playHitSoundAndMarkScore4Once();
        this.changeState('hited');
        return;
      }
    }
    // normal state switching
    if (visible) {
      this.changeState('stand');
    } else {
      this.changeState('idle');
    }
  }

  /**
   * TODO: add score display...
   */
  playHitSoundAndMarkScore4Once() {
    if (this.currentState !== 'hited') {
      this.playSound('ouch');
      // console.log(`play sound!`);
      // console.log(`### Being hited!`);
    }
  }

  /**
   * Draw mole skin by looking for its state
   * @param {DrawableState} state current state
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  onStateDraw(state, ctx) {
    // draw mole by state
    state.draw(ctx, this.posX, this.posY);
  }
}
