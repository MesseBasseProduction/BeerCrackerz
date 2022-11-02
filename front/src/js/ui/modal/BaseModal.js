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
     * @member {number} - The event ID for the overlay clicked */
    this._overlayClickedEvtId = -1;
    /** @private
     * @member {object} - The close button, in the modal header */
    this._closeButton = null;
    /** @private
     * @member {number} - The event ID for the close button clicked */
    this._closeClickedEvtId = -1;
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
    // Must be overridden in child class to clean extension properties and events
    window.Evts.removeEvent(this._overlayClickedEvtId); // Might do nothing, as event is removed in close method
    window.Evts.removeEvent(this._closeClickedEvtId); // Same for this event
    delete this._url;
    delete this._rootElement;
    delete this._modalOverlay;
    delete this._overlayClickedEvtId;
    delete this._closeButton;
    delete this._closeClickedEvtId;
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
      this._modalOverlay = document.getElementById('overlay');
      // Get close button from template
      this._closeButton = this._rootElement.querySelector('#modal-close');
      this.open();
      this._fillAttributes();
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
    this._overlayClickedEvtId = window.Evts.addEvent('click', this._modalOverlay, this.close, this);
    this._closeClickedEvtId = window.Evts.addEvent('click', this._closeButton, this.close, this);

    this._modalOverlay.appendChild(this._rootElement);
    this._modalOverlay.style.display = 'flex';
    setTimeout(() => this._modalOverlay.style.opacity = 1, 50);
  }



  close(event, force) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    if (force === true || event.target.id === 'overlay' || event.target.id.indexOf('close') !== -1) {
      this._modalOverlay.style.opacity = 0;
      setTimeout(() => {
        this._modalOverlay.style.display = 'none';
        this._modalOverlay.innerHTML = '';
        this.destroy();
      }, 200);
    }
  }


}


export default BaseModal;
