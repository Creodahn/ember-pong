import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  // attributes
  movePaddle: service(),
  tagName: '',
  // lifecycle hooks
  didInsertElement() {
    scheduleOnce('afterRender', () => {
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
    let aiC = this.get('aiPaddleY');
    const bY = this.get('ballCenterY'),
          speed = this.get('aiPaddleSpeed') * Math.abs((aiC - bY) / 100);

    if(this.get('ballCenterX') >= this.get('width') * 0.75) {
      switch(true) {
        case aiC < bY:
          aiC += speed;
          break;
        case aiC > bY:
          aiC -= speed;
          break;
      }
    }

    switch(true) {
      case (aiC + this.get('paddleHeight') <= this.get('height') && aiC >= 0):
        this.set('aiPaddleY', aiC);
        break;
      case aiC + this.get('paddleHeight') > this.get('height'):
        this.set('aiPaddleY', this.get('height') - this.get('paddleHeight'));
        break;
      case aiC < 0:
        this.set('aiPaddleY', 0);
        break;
    }
  },
  aiSetup() {
    this.set('aiPaddleY', this.get('height') / 2 - this.get('paddleHeight') / 2);
    this.set('aiPaddleLeft', this.get('width') - this.get('paddleWidth'));
    this.set('aiPaddleSpeed', 6);
    this.set('aiScore', 0);
    this.set('aiScoreX', this.get('width') - 100);
    this.set('aiScoreY', 100);
  },
  ballReset() {
    const radius = this.get('ballRadius');

    this.set('ballCenterX', this.get('width') / 2 - radius / 2);
    this.set('ballCenterY', this.get('height') / 2 - radius / 2);

    this.set('ballSpeedX', this.randomizeSpeed());
    this.set('ballSpeedY', this.randomizeSpeed());
  },
  ballSetup() {
    this.set('ballRadius', 10);

    // bounce counts prevent the ball from getting stuck
    // on an edge of the screen if its impact speed takes
    // it too far past the boundary for a single frame
    // and the randomized speed to bring it back
    this.set('bounceCountY', 0);
    this.set('bounceCountX', 0);

    this.ballReset();
  },
  drawScore(player) {
    const ctx = this.get('context'),
          label = `${player}Score`;

    ctx.font = '40px arial';
    ctx.fillText(this.get(label), this.get(`${label}X`), this.get(`${label}Y`));
  },
  drawCanvas() {
    const halfHeight = this.get('paddleHeight') / 2,
          newPlayerPaddelY = this.get('movePaddle.dataYPos') - halfHeight;

    switch(true) {
      case (newPlayerPaddelY + this.get('paddleHeight') <= this.get('height') && this.get('movePaddle.dataYPos') - halfHeight >= 0):
        this.set('playerPaddleY', newPlayerPaddelY);
        break;
      case this.get('movePaddle.dataYPos') - halfHeight < 0:
        this.set('playerPaddleY', 0);
        break;
      case newPlayerPaddelY + this.get('paddleHeight') > this.get('height'):
        this.set('playerPaddleY', this.get('height') - this.get('paddleHeight'));
        break;
    }

    // draw background
    this.drawRectangle(0, 0, this.get('width'), this.get('height'), 'black');

    // draw the net
    this.drawNet();

    // draw left paddle
    this.drawRectangle(0, this.get('playerPaddleY'), this.get('paddleWidth'), this.get('paddleHeight'), 'white');

    // draw right paddle
    this.drawRectangle(this.get('aiPaddleLeft'), this.get('aiPaddleY'), this.get('paddleWidth'), this.get('paddleHeight'), 'white');

    // draw the ball
    this.drawCircle(this.get('ballCenterX'), this.get('ballCenterY'), this.get('ballRadius'), 'white');

    // draw player score
    this.drawScore('player');

    // draw AI score
    this.drawScore('ai');
  },
  drawCircle(centerX, centerY, radius, fill) {
    const ctx = this.get('context');

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.fill();
  },
  drawNet() {
    const left = this.get('width') / 2 - this.get('paddleWidth') / 2,
          interval = 50;

    for(let i = (interval / 4); i <= this.get('height'); i += interval) {
      this.drawRectangle(left, i, this.get('paddleWidth'), (interval / 2), 'white');
    }
  },
  drawRectangle(left, top, width, height, fill) {
    const ctx = this.get('context');

    ctx.fillStyle = fill;
    ctx.fillRect(left, top, width, height);
  },
  movement() {
    const bounceCountX = this.get('bounceCountX'),
          bounceCountY = this.get('bounceCountY'),
          speedX = this.get('ballSpeedX'),
          speedY = this.get('ballSpeedY');
    let bX = parseInt(this.get('ballCenterX')),
        bY = parseInt(this.get('ballCenterY'));

    this.set('ballCenterX', bX + speedX);
    this.set('ballCenterY', bY + speedY);

    this.aiMove();

    bX = this.get('ballCenterX');
    bY = this.get('ballCenterY');

    switch(true) {
      case bX - this.get('ballRadius') <= 0: {
        const playerPaddleBottom = this.get('playerPaddleY') + this.get('paddleHeight'),
              playerPaddleTop = this.get('playerPaddleY');

        if(!(bY - this.get('ballRadius') <= playerPaddleBottom && bY + this.get('ballRadius') >= playerPaddleTop)) {
          this.ballReset();
          this.score('ai');
        }

        if(bounceCountX === 0) {
          this.set('ballSpeedX', (speedX > 0 ? -1 : 1) * this.randomizeSpeed());
        }

        this.set('bounceCountX', bounceCountX + 1);
        break;
      }
      case bX + this.get('ballRadius') >= this.get('width'): {
        const aiPaddleBottom = this.get('aiPaddleY') + this.get('paddleHeight'),
              aiPaddleTop = this.get('aiPaddleY');

        if(!(bY - this.get('ballRadius') <= aiPaddleBottom && bY + this.get('ballRadius') >= aiPaddleTop)) {
          this.ballReset();
          this.score('player');
        }

        if(bounceCountX === 0) {
          this.set('ballSpeedX', (speedX > 0 ? -1 : 1) * this.randomizeSpeed());
        }

        this.set('bounceCountX', bounceCountX + 1);
        break;
      }
      default: this.set('bounceCountX', 0);
    }

    switch(true) {
      case bY - this.get('ballRadius') <= 0:
        if(bounceCountY === 0) {
          this.set('ballSpeedY', (speedY > 0 ? -1 : 1) * this.randomizeSpeed());
        }

        this.set('bounceCountY', bounceCountY + 1);
        break;
      case bY + this.get('ballRadius') >= this.get('height'):
        if(bounceCountY === 0) {
          this.set('ballSpeedY', (speedY > 0 ? -1 : 1) * this.randomizeSpeed());
        }

        this.set('bounceCountY', bounceCountY + 1);
        break;
      default: this.set('bounceCountY', 0);
    }
  },
  playerSetup() {
    this.get('movePaddle').bindToMouse(this.get('id'));
    this.set('playerScore', 0);
    this.set('playerScoreX', 100);
    this.set('playerScoreY', 100);
  },
  randomizeSpeed() {
    const min = 5,
          max = 10,
          speed = parseFloat(this.get('speed')) * (parseFloat(Math.floor(Math.random() * (max - min)) + min) / 10);

    return speed;
  },
  score(player) {
    const label = `${player}Score`,
          score = this.get(label);

    this.set(label, score + 1);
  }
});
