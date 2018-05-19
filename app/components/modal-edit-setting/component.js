import { alias } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { normalizeName } from 'shared/settings/service';
import ModalBase from 'shared/mixins/modal-base';
import layout from './template';

export default Component.extend(ModalBase, {
  settings:   service(),
  growl:      service(),
  layout,
  classNames: ['span-8', 'offset-2'],

  value:        null,
  removing:     false,
  _boundChange: null,

  model:      alias('modalService.modalOpts'),

  init() {

    this._super(...arguments);
    this.set('value', this.get('model.obj.value') || '');

  },

  didInsertElement() {

    this.set('_boundChange', (event) => {

      this.change(event);

    });
    this.$('INPUT[type=file]').on('change', this.get('_boundChange'));
    next(() => {

      if ( this.isDestroyed || this.isDestroying ) {

        return;

      }

      const elem = this.$('.form-control')[0]

      if ( elem ) {

        setTimeout(() => {

          elem.focus();

        }, 250);

      }

    });

  },

  actions: {
    save(btnCb) {

      this.get('settings').set(normalizeName(this.get('model.key')), this.get('value'));
      this.get('settings').one('settingsPromisesResolved', () => {

        btnCb(true);
        this.send('done');

      });

    },

    done() {

      this.send('cancel');

    },

    upload() {

      this.$('INPUT[type=file]')[0].click();

    },
  },

  change(event) {

    var input = event.target;

    if ( input.files && input.files[0] ) {

      let file = input.files[0];

      var reader = new FileReader();

      reader.onload = (event2) => {

        var out = event2.target.result;

        this.set('value', out);
        input.value = '';

      };
      reader.readAsDataURL(file);

    }

  },
});
