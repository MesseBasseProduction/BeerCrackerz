import BaseModal from './BaseModal.js';
import Utils from '../../utils/Utils.js';


class StartupHelpModal extends BaseModal {


  constructor(options) {
    super('startuphelp');
    this._opts = options;
    this._page = 0;
    this._footerQuitButton = null;
    this._footerQuitNoSeeButton = null;
  }


  _fillAttributes() {
    window.BeerCrackerz.nls.startupHelpModal(this._rootElement);
/*
    if (Utils.getPreference('poi-show-label') === 'true') {
      //this._rootElement.querySelector('#label-toggle').checked = true;
    }
*/
    this._footerQuitButton = this._rootElement.querySelector('#modal-quit');
    this._footerQuitNoSeeButton = this._rootElement.querySelector('#modal-quit-no-see');

    this._events();
  }


  _events() {
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector('#previous-page'), this._previousPage, this));
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector('#next-page'), this._nextPage, this));
    this._evtIds.push(window.Evts.addEvent('click', this._footerQuitButton, this._quitStartupHelp, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._footerQuitNoSeeButton, this._quitStartupHelp, this));
  }


  _previousPage() {
    if (this._page > 0) {
      this._rootElement.querySelector('#next-page').classList.remove('disabled');
      --this._page;
      this._rootElement.querySelectorAll('.page')[this._page].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      if (this._page === 0) {
        this._rootElement.querySelector('#previous-page').classList.add('disabled');
      }
      this._updatePageCounter();
    }
  }
  

  _nextPage() {
    if (this._page < 5) {
      this._rootElement.querySelector('#previous-page').classList.remove('disabled');
      ++this._page;
      this._rootElement.querySelectorAll('.page')[this._page].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      if (this._page === 4) {
        this._rootElement.querySelector('#next-page').classList.add('disabled');
      }
      this._updatePageCounter();
    }
  }


  _updatePageCounter() {
    const elements = this._rootElement.querySelector('.page-counter').children;
    for (let i = 0; i < elements.length; ++i) {
      if (i <= this._page) {
        elements[i].classList.add('active');
      } else {
        elements[i].classList.remove('active');        
      }
    }
  }


  _quitStartupHelp(e) {
    if (e.target.id === 'modal-quit-no-see') {
      Utils.setPreference('startup-help', 'false');
    }

    this.close(null, true);
  }


}


export default StartupHelpModal;
