import Service from '@ember/service';
import { run } from '@ember/runloop';
import $ from 'jquery';

export default Service.extend({
  paddleSpeed: 6,
  bindToKeyboard() {
    $('body').on('keydown', (e) => {
      const key = e.keyCode;
      let pos = this.get('dataYPos');

      switch(true) {
        case key === 38:
          // move up
          pos -= 6;
          break;
        case key === 40:
          // move down
          pos += 6;
          break;
      }

      console.log(pos);

      run(() => {
        this.set('dataYPos', pos);
      });
    });
  },
  calculatePaddleY(ball, width, paddleYStart) {
    const ballX = ball.x,
          ballY = ball.y,
          speed = this.get('paddleSpeed') * Math.abs((paddleYStart - ballY) / 100);
    let paddleYEnd = paddleYStart;

    if(ballX >= width * 0.75) {
      switch(true) {
        case paddleYStart < ballY:
          paddleYEnd += speed;
          break;
        case paddleYStart > ballY:
          paddleYEnd -= speed;
          break;
      }
    }

    return paddleYEnd;
  },
});
