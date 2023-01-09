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
    this._rating.updateRate(this._opts.rate);
    if (this._opts.price) {
      this._pricing.updateRate(this._opts.price);
    }
    requestAnimationFrame(() => {
      this._rating.updateVisu();      
      if (this._opts.price) {
        this._pricing.updateVisu();
      }
    });
  }


  submit(event) {
    if (super.submit(event)) {
      this._opts.name = this._name;
      this._opts.description = this._description;
      this._opts.types = this.getTypes();
      this._opts.modifiers = this.getModifiers();
      this._opts.rating = this._rating.currentRate;
      if (this._rootElement.querySelector(`#nls-${this._opts.type}-price`)) {
        this._opts.price = this._pricing.currentRate;
      }
      window.Evts.publish('onMarkEdited', this._opts);
    }
  }


}


export default EditMarkModal;
