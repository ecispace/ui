import Component from '@ember/component';
import { get, set } from '@ember/object';
import layout from './template';
import { inject as service } from '@ember/service';

const TABS = ['cluster', 'reservation', 'k8s', 'nodes'];

export default Component.extend({
  scope: service(),

  layout,

  mode: 'cluster',
  tabs: null,

  init() {
    this._super(...arguments);

    set(this, 'tabs', TABS.filter((tab) => get(this, 'scope.currentCluster.isRKE') || tab !== 'k8s'));
  },

  actions: {
    switchTab(mode)  {
      set(this, 'mode', mode);
    }
  }
});