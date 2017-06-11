import Ember from 'ember';

export function moveY(params/* , hash */) {
  const item = $(`#${params[0]}`).get(0),
        top = item.top;

  item.left = top + params[1];
}

export default Ember.Helper.helper(moveY);
