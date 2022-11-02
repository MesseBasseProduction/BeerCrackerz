import BaseModal from './BaseModal.js';
import Rating from '../component/Rating.js';


class EditMarkModal extends BaseModal {


  constructor(options) {
    super(`edit${options.type}`);

    this._name = '';
    this._description = '';
    this._rating = null;
    
    this._footerCancelButton = null;
    this._footerSubmitButton = null;

    this._footerCancelEvtId = -1;
    this._footerSubmitEvtId = -1;

    this._opts = options;
  }


  destroy() {
    super.destroy();
    window.Evts.removeEvent(this._footerCancelEvtId);
    window.Evts.removeEvent(this._footerSubmitEvtId);
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------  MODAL INSTANTIATION SEQUENCE  ------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  _fillAttributes() {
    window.BeerCrackerz.nls.editMarkModal(this._rootElement, this._opts.type);

    this._name = this._rootElement.querySelector(`#${this._opts.type}-name`);
    this._description = this._rootElement.querySelector(`#${this._opts.type}-desc`);
    const rate = this._rootElement.querySelector(`#${this._opts.type}-rating`);
    this._rating = new Rating(rate, this._opts.rate);

    this._name.value = this._opts.name;
    this._description.value = this._opts.description;
    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector(`#${this._opts.type}-close`);
    this._footerSubmitButton = this._rootElement.querySelector(`#${this._opts.type}-submit`);
    this._events();
  }


  /** @method
   * @name _events
   * @private
   * @memberof WishModal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method will listen to any click on the submit button to process the textarea
   * content to send it to the backend if needed.</blockquote> **/
  _events() {
    this._footerCancelEvtId = window.Evts.addEvent('click', this._footerCancelButton, this.close, this);
    this._footerSubmitEvtId = window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this);
  }


  submit(e) {
    e.preventDefault();
    this._opts.name = this._name;
    this._opts.description = this._description;
    this._opts.rating = this._rating.currentRate;
    window.Evts.publish('onMarkEdited', this._opts);
  }


}


export default EditMarkModal;
