import BaseModal from './BaseModal.js';
import ImageResizer from '../component/ImageResizer.js';


class UpdateProfilePictureModal extends BaseModal {


  /** @summary <h1>About modal</h1>
   * @extends Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This modal is made to allow the user to send a wish (under the form of a string) to the
   * instance administrators. This wish can be reviewed in the admin page, in the wishes sections. This way, users can
   * leave a feedback on the instance, straight from their account.</blockquote> **/
  constructor(options) {
    super('updatepp');

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
    window.BeerCrackerz.nls.updateProfilePictureModal(this._rootElement);
    this._rootElement.querySelector('#wip-pp').src = this._opts.b64;

    this._imageResizer = new ImageResizer({
      wrapper: this._rootElement.querySelector('#wip-pp-wrapper'),
      width: this._opts.image.width,
      height: this._opts.image.height
    });          

    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector('#update-pp-close');
    this._footerSubmitButton = this._rootElement.querySelector('#update-pp-submit');
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
    this._opts.imageResizer = this._imageResizer;
    window.Evts.publish('onProfilePictureUpdated', this._opts);
  }


}


export default UpdateProfilePictureModal;
