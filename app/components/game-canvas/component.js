import Ember from 'ember';
const { service } = Ember.inject,
      { log } = Ember.Logger;

export default Ember.Component.extend({
  // attributes
  movePaddle: service(),
  tagName: '',
  // lifecycle hooks
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => {
      const canvas = $(`#${this.get('id')}`)[0],
            canvasContext = canvas.getContext('2d');

      this.set('aiPaddleCenter', this.get('height') / 2 - this.get('paddleHeight') / 2);
      this.set('aiPaddleLeft', this.get('width') - (this.get('paddleWidth') + this.get('paddleOffset')));
      this.set('ballCenterX', 50);
      this.set('ballCenterY', 50);
      this.set('ballRadius', 10);
      this.set('ballSpeedX', this.get('speed'));
      this.set('ballSpeedY', this.get('speed'));
      this.set('context', canvasContext);
      this.get('movePaddle').bindToMouse(this.get('id'));

      setInterval(() => {
        this.movement();
        this.drawCanvas();
      }, 1000 / this.get('fps'));
    });
  },
  // functions
  aiMove() {
    const bY = this.get('ballCenterY');
    let aiC = this.get('aiPaddleCenter');

    switch(true) {
      case aiC < bY - 35:
        aiC += 6;
        break;
      case aiC > bY + 35:
        aiC -= 6;
        break;
    }

    this.set('aiPaddleCenter', aiC);
  },
  drawCanvas() {
    const playerPaddleY = this.get('movePaddle.dataYPos') - (this.get('paddleHeight') / 2);

    // draw background
    this.drawRectangle(0, 0, this.get('width'), this.get('height'), 'black');

    // draw left paddle
    this.drawRectangle(this.get('paddleOffset'), playerPaddleY, this.get('paddleWidth'), this.get('paddleHeight'), 'white');

    // draw right paddle
    this.drawRectangle(this.get('aiPaddleLeft'), this.get('aiPaddleCenter'), this.get('paddleWidth'), this.get('paddleHeight'), 'white');

    // draw the ball
    this.drawCircle(this.get('ballCenterX'), this.get('ballCenterY'), this.get('ballRadius'), 'white');
  },
  drawRectangle(left, top, width, height, fill) {
    const ctx = this.get('context');

    ctx.fillStyle = fill;
    ctx.fillRect(left, top, width, height);
  },
  drawCircle(centerX, centerY, radius, fill) {
    const ctx = this.get('context');

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.fill();
  },
  movement() {
    const speedX = parseInt(this.get('ballSpeedX')),
          speedY = parseInt(this.get('ballSpeedY'));
    let bX = parseInt(this.get('ballCenterX')),
        bY = parseInt(this.get('ballCenterY'));

    this.aiMove();

    this.set('ballCenterX', bX + speedX);
    this.set('ballCenterY', bY + speedY);

    bX = this.get('ballCenterX');
    bY = this.get('ballCenterY');

    switch(true) {
      case bX < 0:
        this.set('ballSpeedX', -1 * speedX);
        break;
      case bX > this.get('width'):
        this.set('ballSpeedX', -1 * speedX);
        break;
    }

    switch(true) {
      case bY < 0:
        this.set('ballSpeedY', -1 * speedY);
        break;
      case bY > this.get('height'):
        this.set('ballSpeedY', -1 * speedY);
        break;
    }
  }
});
