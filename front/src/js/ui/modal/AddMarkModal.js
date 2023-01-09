import MarkModal from './MarkModal.js';


class AddMarkModal extends MarkModal {


  constructor(options) {
    super('add', options);
  }


  submit(event) {
    if (super.submit(event)) {
      this._opts.name = this._name.value,
      this._opts.description = this._description.value;
      this._opts.types = this.getTypes();
      this._opts.modifiers = this.getModifiers();
      this._opts.rate = this._rating.currentRate;
      if (this._rootElement.querySelector(`#nls-${this._opts.type}-price`)) {
        this._opts.price = this._pricing.currentRate;
      }
      window.Evts.publish('onMarkAdded', this._opts);
      this.close(null, true);
    }
  }


  close(event, force) {
    if (force === true || event.target.id === 'overlay' || event.target.id.indexOf('close') !== -1) {
      // Clear temporary black marker
      this._opts.marker.isBeingDefined = false;
      this._opts.marker.removeFrom(window.BeerCrackerz.map);
    }
    super.close(event, force);
  }


}


export default AddMarkModal;
