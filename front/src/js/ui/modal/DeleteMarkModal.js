import BaseModal from './BaseModal.js';


class DeleteMarkModal extends BaseModal {


  constructor(options) {
    super('deletemark');
    this._opts = options;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
  }


  _fillAttributes() {
    window.BeerCrackerz.nls.deleteMarkModal(this._rootElement);
    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector('#cancel-close');
    this._footerSubmitButton = this._rootElement.querySelector('#delete-close');
    this._events();
  }


  _events() {
    this._evtIds.push(window.Evts.addEvent('click', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerSubmitButton, this.submit, this));
  }


  submit(event) {
    event.preventDefault();
    window.Evts.publish('onMarkDeleted', this._opts);
  }


}


export default DeleteMarkModal;
