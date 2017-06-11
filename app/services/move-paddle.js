import Ember from 'ember';

export default Ember.Service.extend({
  bindToMouse(id) {
    $(`#${id}`).get(0).addEventListener('mousemove', (e) => {
      const canvas = $(`#${id}`);

      this.set('dataYPos', this.calculateMouseYPos($(canvas).get(0).getBoundingClientRect(), e));
    });
  },
  calculateMouseYPos(rect, e) {
    const doc = document.documentElement;

    return e.clientY - rect.top - doc.scrollTop;
  }
});
