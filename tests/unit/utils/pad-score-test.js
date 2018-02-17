import padScore from 'ember-pong/utils/pad-score';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | pad score', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it works', function(assert) {
    const result = padScore();
    assert.ok(result);
  });
});
