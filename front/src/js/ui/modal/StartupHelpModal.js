import BaseModal from './BaseModal.js';
import Utils from '../../utils/Utils.js';


class StartupHelpModal extends BaseModal {


  constructor(options) {
    super('startuphelp');
    this._opts = options;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
  }


  _fillAttributes() {
//    window.BeerCrackerz.nls.hideShowModal(this._rootElement);

    if (Utils.getPreference('poi-show-label') === 'true') {
      //this._rootElement.querySelector('#label-toggle').checked = true;
    }

    this._events();
  }


  _events() {
    this._evtIds.push(window.Evts.addEvent('click', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerCancelButton, this.close, this));
  }


}


export default StartupHelpModal;
