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

      this.aiSetup();
      this.ballSetup();
      this.set('context', canvasContext);
      this.playerSetup();

      setInterval(() => {
        this.movement();
        this.drawCanvas();
      }, 1000 / this.get('fps'));
    });
  },
  // functions
  aiMove() {
    const bY = this.get('ballCenterY'),
          speed = this.get('aiPaddleSpeed');
    let aiC = this.get('aiPaddleY');

    log(aiC, bY - 35, aiC < bY - 35, bY + 35, aiC > bY + 35);

    switch(true) {
      case aiC < bY:
        aiC += speed;
        break;
      case aiC > bY:
        aiC -= speed;
        break;
    }

    if(aiC + this.get('paddleHeight') < this.get('height') && aiC > 0) {
      this.set('aiPaddleY', aiC);
    }
  },
  aiSetup() {
    this.set('aiPaddleY', this.get('height') / 2 - this.get('paddleHeight') / 2);
    this.set('aiPaddleLeft', this.get('width') - this.get('paddleWidth'));
    this.set('aiPaddleSpeed', 6);
    this.set('aiScore', 0);
  },
  ballReset() {
    const radius = this.get('ballRadius');

    this.set('ballCenterX', this.get('width') / 2 - radius / 2);
    this.set('ballCenterY', this.get('height') / 2 - radius / 2);
  },
  ballSetup() {
    this.set('ballRadius', 10);

    this.ballReset();

    this.set('ballSpeedX', this.get('speed'));
    this.set('ballSpeedY', this.get('speed'));
  },
  drawCanvas() {
    const halfHeight = this.get('paddleHeight') / 2,
          newPlayPaddelY = this.get('movePaddle.dataYPos') - halfHeight;

    if(newPlayPaddelY + this.get('paddleHeight') < this.get('height') && this.get('movePaddle.dataYPos') - halfHeight > 0) {
      this.set('playerPaddleY', newPlayPaddelY);
    }

    // draw background
    this.drawRectangle(0, 0, this.get('width'), this.get('height'), 'black');

    // draw left paddle
    this.drawRectangle(0, this.get('playerPaddleY'), this.get('paddleWidth'), this.get('paddleHeight'), 'white');

    // draw right paddle
    this.drawRectangle(this.get('aiPaddleLeft'), this.get('aiPaddleY'), this.get('paddleWidth'), this.get('paddleHeight'), 'white');

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

    this.set('ballCenterX', bX + speedX);
    this.set('ballCenterY', bY + speedY);

    this.aiMove();

    bX = this.get('ballCenterX');
    bY = this.get('ballCenterY');

    switch(true) {
      case bX < 0: {
        const playerPaddleBottom = this.get('playerPaddleY') + this.get('paddleHeight'),
              playerPaddleTop = this.get('playerPaddleY');

        if(!(bY <= playerPaddleBottom && bY >= playerPaddleTop)) {
          this.ballReset();
          this.score('player');
        }

        this.set('ballSpeedX', -1 * speedX);

        break;
      }
      case bX > this.get('width'): {
        const aiPaddleBottom = this.get('aiPaddleY') + this.get('paddleHeight'),
              aiPaddleTop = this.get('aiPaddleY');

        if(!(bY <= aiPaddleBottom && bY >= aiPaddleTop)) {
          this.ballReset();
          this.score('ai');
        }

        this.set('ballSpeedX', -1 * speedX);

        break;
      }
    }

    switch(true) {
      case bY < 0:
        this.set('ballSpeedY', -1 * speedY);
        break;
      case bY > this.get('height'):
        this.set('ballSpeedY', -1 * speedY);
        break;
    }
  },
  playerSetup() {
    this.get('movePaddle').bindToMouse(this.get('id'));
    this.set('playerScore', 0);
  },
  score(player) {
    const label = `${player}Score`,
          score = this.get(label);

    this.set(label, score + 1);
  }
});
