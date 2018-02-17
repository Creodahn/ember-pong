import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | game canvas', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('win', function() {
      // noop
    });

    await render(hbs`{{game-canvas
      id="game-canvas"
      height=600
      fps=60
      paddleHeight=100
      paddleWidth=10
      speed=5
      width=800
      win=(action win)
    }}`);

    assert.ok(this.$('canvas'));
  });
});
