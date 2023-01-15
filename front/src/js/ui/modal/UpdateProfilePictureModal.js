import BaseModal from './BaseModal.js';
import ImageResizer from '../component/ImageResizer.js';


class UpdateProfilePictureModal extends BaseModal {


  constructor(options) {
    super('updatepp');
    this._opts = options;
    this._imageResizer = null;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
  }


  destroy() {
    this._imageResizer.destroy();
    super.destroy();
  }


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


  _events() {
    this._evtIds.push(window.Evts.addEvent('click', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerSubmitButton, this.submit, this));
  }


  submit(event) {
    event.preventDefault();
    this._opts.imageResizer = this._imageResizer;
    window.Evts.publish('onProfilePictureUpdated', this._opts);
  }


}


export default UpdateProfilePictureModal;
