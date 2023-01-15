class BaseModal {


  constructor(type) {
    /** @private
     * @member {string} - The modal type */
    this._type = type;
    /** @private
     * @member {string} - The HTML template url to fetch */
    this._url = `/modal/${this._type}`;
    /** @private
     * @member {object} - The template root DOM element */
    this._rootElement = null;
    /** @private
     * @member {object} - The overlay that contains the modal, full viewport size and close modal on click */
    this._modalOverlay = null;
    /** @private
     * @member {object} - The close button, in the modal header */
    this._closeButton = null;
    /** @private
     * @member {array} - The event IDs */
    this._evtIds = [];

    // Modal building sequence:
    // - get HTML template from server;
    // - parse template response to become DOM object;
    // - append DOM element to global overlay;
    // - open modal by adding overlay to the body;
    // - let child class fill attributes and register its events.
    this._loadTemplate();
  }


  /** @method
   * @name destroy
   * @public
   * @memberof Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method must be overridden in child class. It only destroys the <code>Modal.js</code>
   * properties and close event subscription. The developer must remove its abstracted properties and events after
   * calling this method, to make the destruction process complete.</blockquote> **/
  destroy() {
    for (let i = 0; i < this._evtIds.length; ++i) {
      window.Evts.removeEvent(this._evtIds[i]);
    }
    Object.keys(this).forEach(key => {
      delete this[key];
    });
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------  MODAL INSTANTIATION SEQUENCE  ------------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name _loadTemplate
   * @private
   * @async
   * @memberof Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method creates the modal overlay, fetch the HTML template using the <code>Kom.js
   * </code> component, it then build the modal DOM, append it to the overlay, open the modal and call <code>
   * _fillAttributes()</code> that must be overridden in the child class. It is asynchronous because of the fetch call,
   * so the child class constructor can be fully executed.</blockquote> **/
  _loadTemplate() {
    window.BeerCrackerz.kom.getTemplate(this._url).then(response => {
      // Create DOM from fragment and tweak url to only keep modal type as css class
      this._rootElement = response.firstElementChild;
      this._rootElement.classList.add(`${this._type}-modal`);
      // Create overlay modal container
      this._modalOverlay = document.createElement('DIV');
      this._modalOverlay.id = 'overlay';
      this._modalOverlay.classList.add('overlay');
      document.body.appendChild(this._modalOverlay);
      // Get close button from template
      this._closeButton = this._rootElement.querySelector('#modal-close');
      this.open();
      this._fillAttributes(); // Override in child class to process modal UI
    }).catch(error => {
      console.error(error);
    });
  }


  /** @method
   * @name _fillAttributes
   * @private
   * @memberof Modal
   * @author Arthur Beaulieu
   * @since November 2020
   * @description <blockquote>This method doesn't implement anything. It must be overridden in child class, to use the
   * template DOM elements to build its interactions. It is called once the template is successfully fetched from the
   * server.</blockquote> **/
  _fillAttributes() {
    // Must be overridden in child class to build modal with HTML template attributes
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------  MODAL VISIBILITY MANIPULATION  -----------------------------------------  */
  /*  --------------------------------------------------------------------------------------------------------------- */


  open() {
    this._evtIds.push(window.Evts.addEvent('click', this._modalOverlay, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._modalOverlay, this.close, this));
    this._evtIds.push(window.Evts.addEvent('click', this._closeButton, this.close, this));
    this._evtIds.push(window.Evts.addEvent('touchend', this._closeButton, this.close, this));
    this._modalOverlay.appendChild(this._rootElement);
    this._modalOverlay.style.display = 'flex';
    setTimeout(() => this._modalOverlay.style.opacity = 1, 50);
  }



  close(event, force) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    if (force === true || event.target.id === 'overlay' || event.target.id.indexOf('close') !== -1) {
      if (event && event.type === 'touchend' && event.preventDefault) {
        event.preventDefault();
      }
  
      this._modalOverlay.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(this._modalOverlay);
        this.destroy();
      }, 200);
    }
  }


}


export default BaseModal;
