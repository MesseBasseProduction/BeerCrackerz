import BaseModal from './BaseModal.js';
import VisuHelper from '../VisuHelper.js';
import DropElement from '../../utils/DropElement.js';
import Utils from '../../utils/Utils.js';


class UserModal extends BaseModal {


  constructor(options) {
    super('user');

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
    window.BeerCrackerz.nls.userProfileModal(this._rootElement);
    this._rootElement.querySelector(`#user-pp`).src = window.BeerCrackerz.user.pp;
    this._rootElement.querySelector(`#user-name`).innerHTML = window.BeerCrackerz.user.username;
    this._rootElement.querySelector(`#user-email`).innerHTML = window.BeerCrackerz.user.email;

    new DropElement({
      target: this._rootElement.querySelector('#update-pp-wrapper'),
      onDrop: this.updateProfilePicture.bind(this)
    });
    new DropElement({
      target: this._rootElement.querySelector('#drop-user-pp'),
      onDrop: this.updateProfilePicture.bind(this)
    });

    // Init modal checkbox state according to local storage preferences
    if (Utils.getPreference('map-high-accuracy') === 'true') {
        this._rootElement.querySelector('#high-accuracy-toggle').checked = true;
    }

    if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
        this._rootElement.querySelector('#debug-toggle').checked = true;
    }

    document.getElementById('high-accuracy-toggle').addEventListener('change', window.BeerCrackerz.toggleHighAccuracy.bind(window.BeerCrackerz));
    document.getElementById('debug-toggle').addEventListener('change', VisuHelper.toggleDebug.bind(VisuHelper));
    document.getElementById('update-pp').addEventListener('change', this.updateProfilePicture.bind(this));
    document.getElementById('user-pp').addEventListener('click', this.updateProfilePicture.bind(this));
    document.getElementById('logout').addEventListener('click', () => {
      window.BeerCrackerz.kom.post('api/auth/logout/', null).then(() => {
        window.location = '/welcome'
      })
    });

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
    //this._footerCancelEvtId = window.Evts.addEvent('click', this._footerCancelButton, this.close, this);
    //this._footerSubmitEvtId = window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this);
  }


  updateProfilePicture(event) {
    if (event.type === 'click') { // Clicked on actual pp
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      document.getElementById('update-pp').dispatchEvent(evt);
      return;
    }

    const fileInput = document.getElementById('update-pp');
    let files = { files: fileInput.files }; // From input change
    if (event.files && event.files.length === 1) { // From drop
      files = { files: event.files };
    }

    if (files.files && files.files.length === 1) {
      // Check if file is conform to what's expected
      if (files.files[0].size > 2621440) { // 2.5Mo
        document.getElementById('update-pp').value = '';
        document.getElementById('update-pp').classList.add('error');
        document.getElementById('update-pp-error').innerHTML = window.BeerCrackerz.nls.modal('updatePPSizeError');
        return;
      }

      if (FileReader) {
        const fr = new FileReader();
        fr.onload = () => {
          var image = new Image();
          image.src = fr.result;
          image.onload = () => {
            if (image.width < 512 || image.height < 512) {
              document.getElementById('update-pp').value = '';
              document.getElementById('update-pp').classList.add('error');
              document.getElementById('update-pp-error').innerHTML = window.BeerCrackerz.nls.modal('updatePPDimensionError');
              return;
            } else {
              window.Evts.publish('updateProfile', {
                image: image,
                b64: fr.result
              });
            }
          };
        };
        fr.readAsDataURL(files.files[0]);
      } else {
        console.error('Couldnt read file');
      }
    }
  }


}


export default UserModal;
