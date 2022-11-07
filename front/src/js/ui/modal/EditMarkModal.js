import MarkModal from './MarkModal.js';


class EditMarkModal extends MarkModal {


  constructor(options) {
    super('edit', options);
  }


  _fillAttributes() {
    super._fillAttributes();
    // Update modal inputs
    this._rootElement.querySelector(`#${this._opts.type}-name`).value = this._opts.name;
    this._rootElement.querySelector(`#${this._opts.type}-desc`).value = this._opts.description;
    this._rating.currentRate = this._opts.rating + 1;
    this._rating.updateStars();
  }


  submit(event) {
    event.preventDefault();
    this._opts.name = this._name;
    this._opts.description = this._description;
    this._opts.rating = this._rating.currentRate;
    window.Evts.publish('onMarkEdited', this._opts);
  }


}


export default EditMarkModal;
