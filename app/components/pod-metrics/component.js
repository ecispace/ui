import Component from '@ember/component';
import Metrics from 'shared/mixins/metrics';
import Grafana from 'shared/mixins/grafana';
import layout from './template';
import { get, set } from '@ember/object';

export default Component.extend(Grafana, Metrics, {
  layout,

  filters: { resourceType: 'pod' },

  projectScope:  true,

  init() {
    this._super(...arguments);
    set(this, 'metricParams', { podName: get(this, 'resourceId') });
  },
});