import { helper } from '@ember/component/helper';
import $ from 'jquery';

export function moveX(params/* , hash */) {
  const item = $(`#${params[0]}`).get(0),
        left = item.left;

  item.left = left + params[1];
}

export default helper(moveX);
