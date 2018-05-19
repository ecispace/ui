import layout from './template';
import PageHeader from 'ui/components/page-header/component';
import { inject as service } from '@ember/service';

export default PageHeader.extend({
  modalService: service('modal'),

  layout,

  actions: {
    showAbout() {

      this.get('modalService').toggleModal('modal-about', { closeWithOutsideClick: true });

    },
  }
});
