import VisuHelper from './VisuHelper.js';
import Utils from '../utils/Utils.js';


class MarkPopup {


  constructor(options, cb) {
    this._opts = options;
    this._popup = null;
    this._cb = cb;
    this._evtIds = [];

    this._fetchTemplate()
      .then(this._init.bind(this))
      .then(this._events.bind(this))
      .finally(this._ready.bind(this));
  }


  destroy() {
    for (let i = 0; i < this._evtIds.length; ++i) {
      window.Evts.removeEvent(this._evtIds[i]);
    }

    this._opts = null;
    this._popup = null;
    this._cb = null;
    this._evtIds = [];
  }


  _fetchTemplate() {
    return new Promise((resolve, reject) => {
      window.BeerCrackerz.kom.getTemplate(`/popup/${this._opts.type}`).then(resolve).catch(reject);
    });
  }


  _init(dom) {
    return new Promise(resolve => {
      this._popup = document.createElement('DIV');
      this._popup.appendChild(dom);
      const user = this._opts.user || window.BeerCrackerz.user.username;
      const desc = Utils.stripDom(this._opts.description) || window.BeerCrackerz.nls.popup(`${this._opts.type}NoDesc`);
      if (!this._opts.creationDate) { // For new marker, we write date of today
        this._opts.creationDate = new Date().toISOString().slice(0, 10);
      }
      const date = new Intl.DateTimeFormat(window.BeerCrackerz.nls.fullLang, { dateStyle: 'long' }).format(new Date(this._opts.creationDate));
      window.BeerCrackerz.nls.markPopup(this._popup, {
        type: this._opts.type,
        name: this._opts.name,
        user: user,
        rate: this._opts.rate,
        desc: desc,
        date: date
      });
      // Fill mark rate (rating is in [0, 4] explaining the +1 in loop bound)
      const rate = this._popup.querySelector(`#${this._opts.type}-rating`);
      for (let i = 0; i < this._opts.rate + 1; ++i) {
        rate.children[i].classList.add('active');
      }
      // Remove picture icon if user is not in range
      const distance = Utils.getDistanceBetweenCoords(
        [ window.BeerCrackerz.user.lat, window.BeerCrackerz.user.lng ],
        [ this._opts.lat, this._opts.lng ]
      );
      if (distance > Utils.CIRCLE_RADIUS) {
        this._popup.querySelector('#popup-social').parentNode.removeChild(this._popup.querySelector('#popup-social'));
      }
      // Remove edition buttons if marker is not user's one, this does not replace a server test for edition...
      if (user !== window.BeerCrackerz.user.username) {
        this._popup.querySelector('#popup-edit').parentNode.removeChild(this._popup.querySelector('#popup-edit'));
      }
      // Append circle around marker
      this._opts.color = Utils[`${this._opts.type.toUpperCase()}_COLOR`];
      this._opts.circle = VisuHelper.drawCircle(this._opts);
      this._opts.circle.addTo(window.BeerCrackerz.map);
      // Create label for new marker
      this._opts.tooltip = window.L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'marker-tooltip',
        interactive: true
      }).setContent(this._opts.name)
        .setLatLng(this._opts.circle.getLatLng());
  
      this._opts.tooltip.addTo(window.BeerCrackerz.map);
      // Remove it if preference is to true
      if (Utils.getPreference('poi-marker-label') === 'false') {
        this._opts.tooltip.removeFrom(window.BeerCrackerz.map);
      }

      resolve();
    });
  }


  _events() {
    // Fire global event on buttons
    return new Promise(resolve => {
      if (this._opts.user === window.BeerCrackerz.user.username) {
        this._evtIds.push(window.Evts.addEvent('click', this._popup.querySelector('#edit-mark'), () => {
          window.Evts.publish('editMark', this._opts);
        }, this));

        this._evtIds.push(window.Evts.addEvent('click', this._popup.querySelector('#delete-mark'), () => {
          window.Evts.publish('deleteMark', this._opts);
        }, this));
      }

      this._evtIds.push(window.Evts.addEvent('click', this._opts.tooltip.getElement(), e => {
        e.preventDefault();
        e.stopPropagation();
        window.Evts.publish('centerOn', this._opts);
      }, this));

      resolve();
    });
  }


  _ready() {
    this._cb(this._popup);
  }


  get dom() {
    return this._popup;
  }


  get options() {
    return this._opts;
  }


}


export default MarkPopup;
