import BaseModal from './BaseModal.js';
import VisuHelper from '../../ui/VisuHelper';
import Utils from '../../utils/Utils.js';


class HideShowModal extends BaseModal {


  constructor(options) {
    super('hideshow');
    this._opts = options;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
  }


  _fillAttributes() {
    window.BeerCrackerz.nls.hideShowModal(this._rootElement);

    if (Utils.getPreference('poi-show-spot') === 'true') {
      this._rootElement.querySelector('#show-spots').checked = true;
    }

    if (Utils.getPreference('poi-show-shop') === 'true') {
      this._rootElement.querySelector('#show-shops').checked = true;
    }

    if (Utils.getPreference('poi-show-bar') === 'true') {
      this._rootElement.querySelector('#show-bars').checked = true;
    }

    this._footerCancelButton = this._rootElement.querySelector('#cancel-close');
    this._events();
  }


  _events() {
    // Toggles
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#show-spots'), VisuHelper.toggleMarkers, VisuHelper));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#show-shops'), VisuHelper.toggleMarkers, VisuHelper));
    this._evtIds.push(window.Evts.addEvent('change', this._rootElement.querySelector('#show-bars'), VisuHelper.toggleMarkers, VisuHelper));
    // Labels
    this._evtIds.push(window.Evts.addEvent('mouseover', this._rootElement.querySelector('#spots-toggle'), this._updateHelper, this));
    this._evtIds.push(window.Evts.addEvent('mouseover', this._rootElement.querySelector('#shops-toggle'), this._updateHelper, this));
    this._evtIds.push(window.Evts.addEvent('mouseover', this._rootElement.querySelector('#bars-toggle'), this._updateHelper, this));
    this._evtIds.push(window.Evts.addEvent('click', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerCancelButton, this.close, this));
  }


  _updateHelper(event) {
    const type = event.target.dataset.type;
    document.getElementById('nls-viewer-helper').innerHTML = window.BeerCrackerz.nls.modal(`${type}HelperHideShow`) || '';
  }


}


export default HideShowModal;
