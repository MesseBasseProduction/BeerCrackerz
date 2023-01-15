import BaseModal from './BaseModal.js';
import VisuHelper from '../VisuHelper.js';
import DropElement from '../../utils/DropElement.js';
import Utils from '../../utils/Utils.js';


class UserModal extends BaseModal {


  constructor(options) {
    super('user');
    this._opts = options;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
  }


  _fillAttributes() {
    window.BeerCrackerz.nls.userProfileModal(this._rootElement);
    if (window.BeerCrackerz.user.pp) {
      this._rootElement.querySelector(`#user-pp`).src = window.BeerCrackerz.user.pp;
    }

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

    if (Utils.getPreference('dark-theme') === 'true') {
      this._rootElement.querySelector('#dark-theme-toggle').checked = true;
    }

    if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
      this._rootElement.querySelector('#debug-toggle').checked = true;
    }

    const options = this._rootElement.querySelector('#lang-select').getElementsByTagName('option');
    const lang = Utils.getPreference('selected-lang');
    for (let i = 0; i < options.length; ++i) {
      if (options[i].value === lang) {
        options[i].selected = 'selected';
      }
    }

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
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#high-accuracy-toggle'), window.BeerCrackerz.toggleHighAccuracy, window.BeerCrackerz));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#dark-theme-toggle'), VisuHelper.toggleDarkTheme, VisuHelper));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#debug-toggle'), VisuHelper.toggleDebug, VisuHelper));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#lang-select'), window.BeerCrackerz.updateLang, window.BeerCrackerz));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#update-pp'), this.updateProfilePicture, this));
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector('#user-pp'), this.updateProfilePicture, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._rootElement.querySelector('#user-pp'), this.updateProfilePicture, this));
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector('#logout'), this.logout, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._rootElement.querySelector('#logout'), this.logout, this));
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


  logout() {
    window.BeerCrackerz.kom.post('api/auth/logout/', null).then(() => {
      window.location = '/welcome'
    });
  }


}


export default UserModal;
