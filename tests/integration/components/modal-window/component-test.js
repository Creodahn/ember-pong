import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal window', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    await render(hbs`
      {{#modal-window static-backdrop=true}}
        template block text
      {{/modal-window}}
    `);

    assert.equal(this.$().text().replace(/\s+/gm, ' ').trim(), 'template block text');
  });
});
