import BaseModal from './BaseModal.js';
import MarkTypes from '../../utils/MarkTypesEnum.js';
import Rating from '../component/Rating.js';


class AddMarkModal extends BaseModal {


  /** @summary <h1>About modal</h1>
   * @extends Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This modal is made to allow the user to send a wish (under the form of a string) to the
   * instance administrators. This wish can be reviewed in the admin page, in the wishes sections. This way, users can
   * leave a feedback on the instance, straight from their account.</blockquote> **/
  constructor(options) {
    super(`new${options.type}`);
    
    this._name = '';
    this._description = '';
    this._rating = null;
    
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
    this._name = this._rootElement.querySelector(`#${this._opts.type}-name`);
    this._description = this._rootElement.querySelector(`#${this._opts.type}-desc`);
    this._rating = new Rating(this._rootElement.querySelector(`#${this._opts.type}-rating`));
    // The modal doesn't contain any interaction with user inputs
    this._footerCancelButton = this._rootElement.querySelector(`#${this._opts.type}-cancel`);
    this._footerSubmitButton = this._rootElement.querySelector(`#${this._opts.type}-submit`);
    this._opts.user = window.BeerCrackerz.user.username;

    window.BeerCrackerz.nls.addMarkModal(this._rootElement, this._opts.type);
    if (this._opts.type === 'spot') {
      this._addSpotModalContent();
    } else if (this._opts.type === 'shop') {
      this._addShopModalContent();
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
    this._footerCancelEvtId = window.Evts.addEvent('click', this._footerCancelButton, this.close, this);
    this._footerSubmitEvtId = window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this);
  }


  _addSpotModalContent() {
    window.BeerCrackerz.nls.addSpotModalContent(this._rootElement);
    // Handle spot types
    const parent = this._rootElement.querySelector('#spot-type');
    const _typeChecked = e => {
      for (let i = 0; i < parent.children.length; ++i) {
        parent.children[i].classList.remove('selected');
        if (parent.children[i].dataset.type === e.target.dataset.type) {
          parent.children[i].classList.add('selected');
        }
      }
    };

    for (let i = 0; i < MarkTypes.spot.length; ++i) {
      const type = document.createElement('P');
      type.dataset.type = MarkTypes.spot[i];
      type.innerHTML = window.BeerCrackerz.nls.spot(`${MarkTypes.spot[i]}Type`);
      parent.appendChild(type);
      type.addEventListener('click', _typeChecked.bind(this));
    }
    // Handle spot modifiers
    const modifiers = this._rootElement.querySelector('#spot-modifiers');
    const _modifierChecked = e => {
      if (e.target.closest('p').classList.contains('selected')) {
        e.target.closest('p').classList.remove('selected');
      } else {
        e.target.closest('p').classList.add('selected');
      }
    };

    for (let i = 0; i < modifiers.children.length; ++i) {
      modifiers.children[i].addEventListener('click', _modifierChecked.bind(this));
    }
  }


  _addShopModalContent() {
    window.BeerCrackerz.nls.addShopModalContent(this._rootElement);
    // Handle shop types
    const parent = this._rootElement.querySelector('#shop-type');
    const _typeChecked = e => {
      for (let i = 0; i < parent.children.length; ++i) {
        parent.children[i].classList.remove('selected');
        if (parent.children[i].dataset.type === e.target.dataset.type) {
          parent.children[i].classList.add('selected');
        }
      }
    };

    for (let i = 0; i < MarkTypes.shop.length; ++i) {
      const type = document.createElement('P');
      type.dataset.type = MarkTypes.shop[i];
      type.innerHTML = window.BeerCrackerz.nls.shop(`${MarkTypes.shop[i]}Type`);
      parent.appendChild(type);
      type.addEventListener('click', _typeChecked.bind(this));
    }
    // Handle shop modifiers
    const modifiers = this._rootElement.querySelector('#shop-modifiers');
    const _modifierChecked = e => {
      if (e.target.closest('p').classList.contains('selected')) {
        e.target.closest('p').classList.remove('selected');
      } else {
        e.target.closest('p').classList.add('selected');
      }
    };

    for (let i = 0; i < modifiers.children.length; ++i) {
      modifiers.children[i].addEventListener('click', _modifierChecked.bind(this));
    }
  }



  submit(e) {
    e.preventDefault();
    this._name.classList.remove('error');
    if (this._name.value === '') {
      this._name.classList.add('error');
      window.BeerCrackerz.notification.raise(this.nls.notif('markNameEmpty'));
    } else {
      this._opts.name = this._name.value,
      this._opts.description = this._description.value;
      this._opts.rate = this._rating.currentRate;
      window.Evts.publish('onMarkAdded', this._opts);
      this.close(null, true);
    }
  }


  close(event, force) {
    this._opts.marker.isBeingDefined = false;
    this._opts.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
    super.close(event, force);
  }


}


export default AddMarkModal;
