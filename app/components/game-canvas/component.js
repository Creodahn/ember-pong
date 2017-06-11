import Ember from 'ember';

export default Ember.Component.extend({
  // lifecycle hooks
  didInsertElement() {
    Ember.run.scheduleOnce('afterRender', () => {
      const canvas = $('#game-canvas')[0],
            canvasContext = canvas.getContext('2d');

      canvasContext.fillStyle = 'black';
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    });
  }
});
