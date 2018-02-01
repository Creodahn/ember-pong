import { helper } from '@ember/component/helper';
import $ from 'jquery';

export function moveY(params/* , hash */) {
  const item = $(`#${params[0]}`).get(0),
        top = item.top;

  item.left = top + params[1];
}

export default helper(moveY);
