import VisuHelper from './VisuHelper.js';
import Utils from '../utils/Utils.js';
import ColorEnum from '../utils/enums/ColorEnum.js';
import MapEnum from '../utils/enums/MapEnum.js';


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
    return new Promise(resolve => {
      resolve(window.BeerCrackerz.domTemplate.popup[this._opts.type]);
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
      // Handle mark types
      const types = this._popup.querySelector(`#${this._opts.type}-types`);  
      for (let i = 0; i < this._opts.types.length; ++i) {
        const type = document.createElement('P');
        const icon = document.createElement('IMG');
        type.dataset.type = this._opts.types[i];
        icon.dataset.type = type.dataset.type;
        icon.src = `/static/img/logo/${this._opts.types[i]}.svg`;
        type.innerHTML = window.BeerCrackerz.nls[this._opts.type](`${this._opts.types[i]}Type`);
        type.insertBefore(icon, type.firstChild);
        types.appendChild(type);
      }
      // Handle mark modifiers
      const modifiers = this._popup.querySelector(`#${this._opts.type}-modifiers`);
      for (let i = 0; i < this._opts.modifiers.length; ++i) {
        const modifier = document.createElement('P');
        const icon = document.createElement('IMG');
        modifier.dataset.type = this._opts.modifiers[i];
        icon.dataset.type = modifier.dataset.type;
        icon.src = `/static/img/logo/${this._opts.modifiers[i]}.svg`;
        modifier.innerHTML = window.BeerCrackerz.nls[this._opts.type](`${this._opts.modifiers[i]}Modifier`);
        modifier.insertBefore(icon, modifier.firstChild);
        modifiers.appendChild(modifier);
      }
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
      if (distance > MapEnum.socialMarkRange) {
        this._popup.querySelector('#popup-social').parentNode.removeChild(this._popup.querySelector('#popup-social'));
      }
      // Remove edition buttons if marker is not user's one, this does not replace a server test for edition...
      if (user !== window.BeerCrackerz.user.username) {
        if (!window.BeerCrackerz.user.isStaff) {
          this._popup.querySelector('#popup-edit').parentNode.removeChild(this._popup.querySelector('#popup-edit'));
        }
      }
      // Append circle around marker
      this._opts.color = ColorEnum[this._opts.type];
      this._opts.circle = VisuHelper.drawCircle(this._opts);
      this._opts.circle.addTo(window.BeerCrackerz.map);

      this._popupElement = window.L.popup({
        maxWidth: 900
      }).setContent(this._popup);

      resolve();
    });
  }


  _events() {
    // Fire global event on buttons
    return new Promise(resolve => {
      if (this._opts.user === window.BeerCrackerz.user.username || window.BeerCrackerz.user.isStaff) {
        this._evtIds.push(window.Evts.addEvent('click', this._popup.querySelector('#edit-mark'), () => {
          window.Evts.publish('editMark', this._opts);
        }, this));

        this._evtIds.push(window.Evts.addEvent('click', this._popup.querySelector('#delete-mark'), () => {
          window.Evts.publish('deleteMark', this._opts);
        }, this));
      }
      this._evtIds.push(window.Evts.addEvent('click', this._popup.querySelector('#center-on'), e => {
        e.preventDefault();
        e.stopPropagation();
        window.Evts.publish('centerOn', {
          lat: this._opts.lat,
          lng: this._opts.lng,
          zoom: 17
        });
      }, this));

      resolve();
    });
  }


  _ready() {
    this._cb(this._popupElement);
  }


  get dom() {
    return this._popup;
  }


  get options() {
    return this._opts;
  }


}


export default MarkPopup;
