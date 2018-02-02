import Controller from '@ember/controller';
import $ from 'jquery';

export default Controller.extend({
  actions: {
    win(player) {
      this.set('winner', player);

      $('#win-modal').modal('show');
    }
  }
});
