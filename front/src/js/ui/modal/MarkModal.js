import BaseModal from './BaseModal.js';
import MarkInfosEnum from '../../utils/enums/MarkInfosEnum.js';
import Rating from '../component/Rating.js';


// Abstraction for addMark and editMark (as they share same content, not values)
class MarkModal extends BaseModal {


  constructor(action, options) { // action is add/edit, options.type is mark type
    super(`${action}${options.type}`);
    this._opts = options; // Save mark options    
    this._action = action; // add/edit
    this._name = '';
    this._description = '';
    this._rating = null;
    this._pricing = null;
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
    this._opts.user = window.BeerCrackerz.user.username;
    // Generic mark modal section
    window.BeerCrackerz.nls.addMarkModal(this._rootElement, this._opts.type, this._action);
    // Type and modifier handling
    const _elementChecked = event => {
      if (event.target.closest('p').classList.contains('selected')) {
        event.target.closest('p').classList.remove('selected');
      } else {
        event.target.closest('p').classList.add('selected');
      }
    };
    // Mark title
    this._name = this._rootElement.querySelector(`#${this._opts.type}-name`);
    // Handle mark types
    const types = this._rootElement.querySelector(`#${this._opts.type}-types`);  
    for (let i = 0; i < MarkInfosEnum[this._opts.type].types.length; ++i) {
      const type = document.createElement('P');
      const icon = document.createElement('IMG');
      type.dataset.type = MarkInfosEnum[this._opts.type].types[i];
      icon.dataset.type = type.dataset.type;
      icon.src = `/static/img/logo/${MarkInfosEnum[this._opts.type].types[i]}.svg`;
      type.innerHTML = window.BeerCrackerz.nls[this._opts.type](`${MarkInfosEnum[this._opts.type].types[i]}Type`);
      if (this._opts.types && this._opts.types.indexOf(MarkInfosEnum[this._opts.type].types[i]) !== -1) {
        type.classList.add('selected');
      }
      type.insertBefore(icon, type.firstChild);
      types.appendChild(type);
      this._evtIds.push(window.Evts.addEvent('click', type, _elementChecked, this));
    }
    // Mark description
    this._description = this._rootElement.querySelector(`#${this._opts.type}-desc`);
    // Handle mark modifiers
    const modifiers = this._rootElement.querySelector(`#${this._opts.type}-modifiers`);
    for (let i = 0; i < MarkInfosEnum[this._opts.type].modifiers.length; ++i) {
      const modifier = document.createElement('P');
      const icon = document.createElement('IMG');
      modifier.dataset.type = MarkInfosEnum[this._opts.type].modifiers[i];
      icon.dataset.type = modifier.dataset.type;
      icon.src = `/static/img/logo/${MarkInfosEnum[this._opts.type].modifiers[i]}.svg`;
      modifier.innerHTML = window.BeerCrackerz.nls[this._opts.type](`${MarkInfosEnum[this._opts.type].modifiers[i]}Modifier`);
      if (this._opts.modifiers && this._opts.modifiers.indexOf(MarkInfosEnum[this._opts.type].modifiers[i]) !== -1) {
        modifier.classList.add('selected');
      }
      modifier.insertBefore(icon, modifier.firstChild);
      modifiers.appendChild(modifier);
      this._evtIds.push(window.Evts.addEvent('click', modifier, _elementChecked, this));
    }
    // Rating and pricing if any
    this._rating = new Rating(this._rootElement.querySelector(`#${this._opts.type}-rating`));
    if (this._rootElement.querySelector(`#nls-${this._opts.type}-price`)) {
      this._pricing = new Rating(this._rootElement.querySelector(`#${this._opts.type}-pricing`));      
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
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector(`#${this._opts.type}-close`), this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._rootElement.querySelector(`#${this._opts.type}-close`), this.close, this));
    this._evtIds.push(window.Evts.addEvent('click', this._rootElement.querySelector(`#${this._opts.type}-submit`), this.submit, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._rootElement.querySelector(`#${this._opts.type}-submit`), this.submit, this));
  }


  submit(event) {
    event.preventDefault();
    let allowed = true;
    this._rootElement.querySelector(`#nls-${this._opts.type}-name`).classList.remove('error');
    this._name.classList.remove('error');
    this._rootElement.querySelector(`#nls-${this._opts.type}-type`).classList.remove('error');
    this._rootElement.querySelector(`#nls-${this._opts.type}-rate`).classList.remove('error');
    if (this._rootElement.querySelector(`#nls-${this._opts.type}-price`)) {
      this._rootElement.querySelector(`#nls-${this._opts.type}-price`).classList.remove('error');      
    }
    if (this._name.value === '') {
      this._rootElement.querySelector(`#nls-${this._opts.type}-name`).classList.add('error');
      this._name.classList.add('error');
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif('markNameEmpty'));
      allowed = false;
    } else if (this.getTypes().length === 0) {
      this._rootElement.querySelector(`#nls-${this._opts.type}-type`).classList.add('error');
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif('markTypeEmpty'));
      allowed = false;
    } else if (this._rating.currentRate === -1) {
      this._rootElement.querySelector(`#nls-${this._opts.type}-rate`).classList.add('error');
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif('markRateEmpty'));
      allowed = false;
    } else if (this._pricing !== null && this._pricing.currentRate === -1) {
      this._rootElement.querySelector(`#nls-${this._opts.type}-price`).classList.add('error');
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif('markPriceEmpty'));
      allowed = false;
    }
    return allowed;
  }


  getTypes() {
    const output = [];
    const types = this._rootElement.querySelector(`#${this._opts.type}-types`);  
    for (let i = 0; i < types.children.length; ++i) {
      if (types.children[i].classList.contains('selected')) {
        output.push(types.children[i].dataset.type);
      }
    }
    return output;
  }


  getModifiers() {
    const output = [];
    const modifiers = this._rootElement.querySelector(`#${this._opts.type}-modifiers`);  
    for (let i = 0; i < modifiers.children.length; ++i) {
      if (modifiers.children[i].classList.contains('selected')) {
        output.push(modifiers.children[i].dataset.type);
      }
    }
    return output;
  }


}


export default MarkModal;
