import EmberObject from '@ember/object';
import { get, set, observer } from '@ember/object'
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  intl: service(),

  layout,

  model: null,

  rules:   null,
  editing: null,

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs() {
    if ( !get(this, 'expandFn') ) {
      set(this, 'expandFn', (item) => {
        item.toggleProperty('expanded');
      });
    }
  },
});
