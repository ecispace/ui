import { get, set, observer, computed } from '@ember/object';
import Component from '@ember/component';
import ViewNewEdit from 'shared/mixins/view-new-edit';
import OptionallyNamespaced from 'shared/mixins/optionally-namespaced';
import layout from './template';
import { alias } from '@ember/object/computed';
import  { PRESETS_BY_NAME } from  'ui/models/dockercredential';

export default Component.extend(ViewNewEdit, OptionallyNamespaced, {
  layout,
  model: null,

  titleKey: 'cruRegistry.title',

  scope: 'project',
  namespace: null,
  asArray: null,
  artifactoryWorkload: null,
  publicEndpoints: alias('artifactoryWorkload.publicEndpoints'),

  init() {
    this._super(...arguments);
    set(this, 'asArray', JSON.parse(JSON.stringify(get(this,'model.asArray')||[])));
  },

  artifactoryUrl: computed('publicEndpoints.@.{address,port}', function () {
    const endpoint = (get(this, 'publicEndpoints') || []).get('firstObject');
    if (!endpoint) {
      return null;
    }
    const address = (get(endpoint, 'addresses') || []).get('firstObject');
    const port = get(endpoint, 'port');

    if (!address || !port) {
      return null;
    }

    return `${address}:${port}`;
  }),

  arrayChanged: observer('asArray.@each.{preset,address,username,password,auth}', function() {
    const registries = {};

    get(this, 'asArray').forEach((obj) => {
      const preset = get(obj, 'preset');
      let key = get(obj, 'address');
      if ( PRESETS_BY_NAME[preset] ) {
        key = PRESETS_BY_NAME[preset];
      }

      if ( preset === 'artifactory' ) {
        key = get(this, 'artifactoryUrl');
      }

      let val = {};
      ['username','password','auth'].forEach((k) => {
        let v = get(obj,k);
        if ( v ) {
          val[k] = v;
        }
      });

      registries[key] = val;
    });

    set(this, 'model.registries', registries);

    return this._super(...arguments);
  }),

  projectType: 'dockerCredential',
  namespacedType: 'namespacedDockerCredential',
  doSave() {
    let self = this;
    let sup = self._super;
    return this.namespacePromise().then(() => {
      return sup.apply(self,arguments);
    });
  },

  doneSaving() {
    this.sendAction('cancel');
  },
});
