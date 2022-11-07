import BaseModal from './BaseModal.js';
import MarkTypes from '../../utils/MarkTypesEnum.js';
import Rating from '../component/Rating.js';
import Utils from '../../utils/Utils.js';


// Abstraction for addMark and editMark (as they share same content, not values)
class MarkModal extends BaseModal {


  constructor(action, options) { // action is add/edit, options.type is mark type
    super(`${action}${options.type}`);
    this._opts = options; // Save mark options    
    this._action = action; // add/edit
    this._name = '';
    this._description = '';
    this._rating = null;
    this._footerCancelButton = null;
    this._footerSubmitButton = null;
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
    this._footerCancelButton = this._rootElement.querySelector(`#${this._opts.type}-close`);
    this._footerSubmitButton = this._rootElement.querySelector(`#${this._opts.type}-submit`);
    this._opts.user = window.BeerCrackerz.user.username;
    // Generic mark modal section
    window.BeerCrackerz.nls.addMarkModal(this._rootElement, this._opts.type, this._action);
    // Specific mark modal section
    window.BeerCrackerz.nls[`add${Utils.capitalize(this._opts.type)}ModalContent`](this._rootElement);
    // Handle shop types
    const parent = this._rootElement.querySelector(`#${this._opts.type}-type`);
    const _typeChecked = e => {
      for (let i = 0; i < parent.children.length; ++i) {
        parent.children[i].classList.remove('selected');
        if (parent.children[i].dataset.type === e.target.dataset.type) {
          parent.children[i].classList.add('selected');
        }
      }
    };

    for (let i = 0; i < MarkTypes[this._opts.type].length; ++i) {
      const type = document.createElement('P');
      type.dataset.type = MarkTypes[this._opts.type][i];
      type.innerHTML = window.BeerCrackerz.nls[this._opts.type](`${MarkTypes[this._opts.type][i]}Type`);
      parent.appendChild(type);
      this._evtIds.push(window.Evts.addEvent('click', type, _typeChecked, this));
    }
    // Handle shop modifiers
    const modifiers = this._rootElement.querySelector(`#${this._opts.type}-modifiers`);
    const _modifierChecked = e => {
      if (e.target.closest('p').classList.contains('selected')) {
        e.target.closest('p').classList.remove('selected');
      } else {
        e.target.closest('p').classList.add('selected');
      }
    };

    for (let i = 0; i < modifiers.children.length; ++i) {
      this._evtIds.push(window.Evts.addEvent('click', modifiers.children[i], _modifierChecked, this));
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
    this._evtIds.push(window.Evts.addEvent('click', this._footerCancelButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('click', this._footerSubmitButton, this.submit, this));
  }


}


export default MarkModal;
