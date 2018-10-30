import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, set, observer, computed } from '@ember/object';
import { once } from '@ember/runloop';

export default Controller.extend({
  router: service(),

  queryParams:       ['duration'],
  selectedContainer: null,

  duration:          'hour',

  monitoringEnalbed: true,

  actions: {
    select(container) {
      set(this, 'selectedContainer', container);
    },
  },

  containerDidChange: observer('model.containers.[]', function() {
    once(() => set(this, 'selectedContainer', get(this, 'model.containers.firstObject')));
  }),

  podStateDidChange: observer('model.state', function() {
    if ( get(this, 'model.state') === 'removed' && get(this, 'router.currentRouteName') === 'container' ) {
      const workloadId = get(this, 'model.workloadId');

      if ( workloadId ) {
        this.transitionToRoute('workload', workloadId);
      } else {
        this.transitionToRoute('authenticated.project.index');
      }
    }
  }),
  displayEnvironmentVars: computed('selectedContainer', function() {
    var envs = [];
    var environment = this.get('selectedContainer.environment') || {};

    Object.keys(environment).forEach((key) => {
      envs.pushObject({
        key,
        value: environment[key]
      })
    });

    return envs;
  }),

});
