import BaseModal from './BaseModal.js';
import VisuHelper from '../../ui/VisuHelper';
import Utils from '../../utils/Utils.js';


class HideShowModal extends BaseModal {


  /** @summary <h1>About modal</h1>
   * @extends Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This modal is made to allow the user to send a wish (under the form of a string) to the
   * instance administrators. This wish can be reviewed in the admin page, in the wishes sections. This way, users can
   * leave a feedback on the instance, straight from their account.</blockquote> **/
  constructor(options) {
    super('hideshow');

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
    window.BeerCrackerz.nls.hideShowModal(this._rootElement);


    if (Utils.getPreference('poi-marker-label') === 'true') {
      this._rootElement.querySelector('#label-toggle').checked = true;
    }
    
    if (Utils.getPreference('poi-show-circle') === 'true') {
      this._rootElement.querySelector('#circle-toggle').checked = true;
    }

    if (Utils.getPreference('poi-show-spot') === 'true') {
      this._rootElement.querySelector('#show-spots').checked = true;
    }

    if (Utils.getPreference('poi-show-shop') === 'true') {
      this._rootElement.querySelector('#show-shops').checked = true;
    }

    if (Utils.getPreference('poi-show-bar') === 'true') {
      this._rootElement.querySelector('#show-bars').checked = true;
    }

    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector('#cancel-close');
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
    this._rootElement.querySelector('#label-toggle').addEventListener('change', VisuHelper.toggleLabel.bind(VisuHelper));
    this._rootElement.querySelector('#circle-toggle').addEventListener('change', VisuHelper.toggleCircle.bind(VisuHelper));
    this._rootElement.querySelector('#show-spots').addEventListener('change', VisuHelper.toggleMarkers.bind(VisuHelper, 'spot'));
    this._rootElement.querySelector('#show-shops').addEventListener('change', VisuHelper.toggleMarkers.bind(VisuHelper, 'shop'));
    this._rootElement.querySelector('#show-bars').addEventListener('change', VisuHelper.toggleMarkers.bind(VisuHelper, 'bar'));

    this._rootElement.querySelector('#labels-toggle').addEventListener('mouseover', this._updateHelper.bind(this, 'labels'));
    this._rootElement.querySelector('#circles-toggle').addEventListener('mouseover', this._updateHelper.bind(this, 'circles'));
    this._rootElement.querySelector('#spots-toggle').addEventListener('mouseover', this._updateHelper.bind(this, 'spots'));
    this._rootElement.querySelector('#shops-toggle').addEventListener('mouseover', this._updateHelper.bind(this, 'shops'));      
    this._rootElement.querySelector('#bars-toggle').addEventListener('mouseover', this._updateHelper.bind(this, 'bars'));

    this._footerCancelEvtId = window.Evts.addEvent('click', this._footerCancelButton, this.close, this);
  }


  _updateHelper(type) {
    document.getElementById('nls-viewer-helper').innerHTML = window.BeerCrackerz.nls.modal(`${type}HelperHideShow`) || '';
  }


}


export default HideShowModal;
