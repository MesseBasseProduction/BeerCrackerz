import BaseModal from './BaseModal.js';


class DeleteMarkModal extends BaseModal {


  /** @summary <h1>About modal</h1>
   * @extends Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This modal is made to allow the user to send a wish (under the form of a string) to the
   * instance administrators. This wish can be reviewed in the admin page, in the wishes sections. This way, users can
   * leave a feedback on the instance, straight from their account.</blockquote> **/
  constructor(options) {
    super('deletemark');

    this._footerCancelButton = null;
    this._footerSubmitButton = null;

    this._footerCancelEvtId = -1;
    this._footerSubmitEvtId = -1;

    this._opts = options;
  }


  /** @method
   * @name destroy
   * @public
   * @memberof AboutModal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method will destroy the Modal parent (see documentation).</blockquote> **/
  destroy() {
    super.destroy();
    window.Evts.removeEvent(this._footerCancelEvtId);
    window.Evts.removeEvent(this._footerSubmitEvtId);
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------  MODAL INSTANTIATION SEQUENCE  ------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _fillAttributes
   * @private
   * @memberof AboutModal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method doesn't do anything, the about modal is only for reading.</blockquote> **/
  _fillAttributes() {
    window.BeerCrackerz.nls.deleteMarkModal(this._rootElement);
    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector('#cancel-close');
    this._footerSubmitButton = this._rootElement.querySelector('#delete-close');
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
    window.Evts.publish('onMarkDeleted', this._opts);
  }


}


export default DeleteMarkModal;
