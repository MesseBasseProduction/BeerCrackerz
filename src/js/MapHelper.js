import Markers from './utils/MarkerEnum.js';
import Rating from './ui/Rating.js';
import Utils from './utils/Utils.js';


class MapHelper {


  constructor() { /* Mixin to be extended from the BeerCrackerz main class */ }


  // ======================================================================== //
  // --------------------------- Marker helpers ----------------------------- //
  // ======================================================================== //


  placeMarker(options) {
    let icon = Markers.black;
    if (options.type === 'store') {
      icon = Markers.blue;
    } else if (options.type === 'spot') {
      icon = Markers.green;
    } else if (options.type === 'bar') {
      icon = Markers.red;
    } else if (options.type === 'user') {
      icon = Markers.user;
    }

    const marker = window.L.marker([options.lat, options.lng], { icon: icon }).on('click', () => {
      // Disable center on lock if previously set to true
      if (Utils.getPreference('map-center-on-user') === 'true') {
        this.toggleFocusLock();
      }
      // Actual fly to the marker
      this.map.flyTo([options.lat, options.lng], 18);
    });

    if (options.dom) {
      marker.bindPopup(options.dom);
    }
    // All markers that are not spot/store/bar should be appended to the map
    if (['spot', 'store', 'bar'].indexOf(options.type) === -1) {
      marker.addTo(this.map);
    }

    return marker;
  }


  drawUserMarker() {
    if (!this.user.marker) { // Create user marker if not existing
      this.user.type = 'user';
      this.user.marker = this.placeMarker(this.user);
      // Append circle around marker for accuracy and range for new marker
      this.user.radius = this.user.accuracy;
      this.user.circle = this.drawCircle(this.user);
      this.user.range = this.drawCircle({
        lat: this.user.lat,
        lng: this.user.lng,
        radius: Utils.NEW_MARKER_RANGE,
        color: Utils.RANGE_COLOR
      });
      // Update circle opacity if pref is at true
      if (Utils.getPreference('poi-show-circle') === 'true') {
        this.user.circle.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
        this.user.range.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
      }
      // Callback on marker clicked to add marker on user position
      this.user.marker.on('click', this.mapClicked.bind(this));
    } else { // Update user marker position, range, and accuracy circle
      this.user.marker.setLatLng(this.user);
      this.user.range.setLatLng(this.user);
      this.user.circle.setLatLng(this.user);
      this.user.circle.setRadius(this.user.accuracy);
    }
  }


  definePOI(options, callback) {
    const dom = {
      wrapper: document.createElement('DIV'),
      title: document.createElement('P'),
      spot: document.createElement('BUTTON'),
      store: document.createElement('BUTTON'),
      bar: document.createElement('BUTTON'),
    };
    // Update class and inner HTMl content according to user's nls
    dom.wrapper.className = 'new-poi';
    dom.title.innerHTML = this.nls.map('newTitle');
    dom.spot.innerHTML = this.nls.map('newSpot');
    dom.store.innerHTML = this.nls.map('newStore');
    dom.bar.innerHTML = this.nls.map('newBar');
    // Atach data type to each button (to be used in clicked callback)
    dom.spot.dataset.type = 'spot';
    dom.store.dataset.type = 'store';
    dom.bar.dataset.type = 'bar';
    // DOM chaining
    dom.wrapper.appendChild(dom.title);
    dom.wrapper.appendChild(dom.spot);
    dom.wrapper.appendChild(dom.store);
    dom.wrapper.appendChild(dom.bar);
    // Update popup content with DOM elements
    options.dom = dom.wrapper;
    // Create temporary mark with wrapper content and open it to offer user the creation menu
    const marker = this.placeMarker(options).openPopup();
    options.marker = marker; // Attach marker to option so it can be manipulated in clicked callbacks
    options.addedCallback = callback; // Attach callback to be called when marker addition is done
    // Callback on button clicked (to open modal and define a new mark)
    const _prepareNewMark = e => {
      marker.isBeingDefined = true;
      marker.closePopup();
      this.defineMarkFactory(e.target.dataset.type, options);
    };
    // Buttons click events
    dom.spot.addEventListener('click', _prepareNewMark);
    dom.store.addEventListener('click', _prepareNewMark);
    dom.bar.addEventListener('click', _prepareNewMark);
    // Listen to clicks outside of popup to close new mark
    marker.on('popupclose', () => {
      if (!marker.isBeingDefined) {
        marker.popupClosed = true;
        marker.removeFrom(this.map);
      }
    });

    return marker;
  }


  // ======================================================================== //
  // ---------------------- New mark in modal helper ------------------------ //
  // ======================================================================== //


  defineMarkFactory(type, options) {
    Utils.fetchTemplate(`assets/html/modal/new${type}.html`).then(dom => {
      const name = dom.querySelector(`#${type}-name`);
      const description = dom.querySelector(`#${type}-desc`);
      const rating = new Rating(dom.querySelector(`#${type}-rating`));
      const submit = dom.querySelector(`#${type}-submit`);
      const cancel = dom.querySelector(`#${type}-cancel`);
      const close = dom.querySelector('#modal-close');
      // Update nls for template
      Utils.replaceString(dom.querySelector(`#nls-${type}-title`), `{{${type.toUpperCase()}_TITLE}}`, this.nls[type]('title'));
      Utils.replaceString(dom.querySelector(`#nls-${type}-subtitle`), `{{${type.toUpperCase()}_SUBTITLE}}`, this.nls[type]('subtitle'));
      Utils.replaceString(dom.querySelector(`#nls-${type}-name`), `{{${type.toUpperCase()}_NAME}}`, this.nls[type]('nameLabel'));
      Utils.replaceString(dom.querySelector(`#nls-${type}-desc`), `{{${type.toUpperCase()}_DESC}}`, this.nls[type]('descLabel'));
      Utils.replaceString(dom.querySelector(`#nls-${type}-rate`), `{{${type.toUpperCase()}_RATE}}`, this.nls[type]('rateLabel'));
      Utils.replaceString(submit, `{{${type.toUpperCase()}_SUBMIT}}`, this.nls.nav('add'));
      Utils.replaceString(cancel, `{{${type.toUpperCase()}_CANCEL}}`, this.nls.nav('cancel'));
      // Method to clear modal and hide it, and remove temporary marker on the map
      const _cleanDefineUI = () => {
        options.marker.isBeingDefined = false;
        options.marker.removeFrom(this.map); // Clear temporary black marker
        this.closeModal(null, true);
      };
      // Submit or cancel event subscriptions
      submit.addEventListener('click', () => {
        if (name.value === '') {
          this._notification.raise(this.nls.notif('markNameEmpty'));
        } else {
          _cleanDefineUI();
          options.type = type;
          options.name = name.value,
          options.description = description.value;
          options.rate = rating.currentRate;
          this.markPopupFactory(options).then(dom => {
            options.dom = dom;
            options.marker = this.placeMarker(options); // Create final marker
            options.addedCallback(options);
          });
        }
      });
      cancel.addEventListener('click', _cleanDefineUI);
      close.addEventListener('click', _cleanDefineUI);
      this.newMarkModal(dom);
    });
  }


  defineNewSpot(options) {
    this.defineMarkFactory('spot', options);
  }


  defineNewStore(options) {
    this.defineMarkFactory('store', options);
  }


  defineNewBar(options) {
    this.defineMarkFactory('bar', options);
  }


  // ======================================================================== //
  // ------------------------- Mark popup helper ---------------------------- //
  // ======================================================================== //


  markPopupFactory(options) {
    return new Promise(resolve => {
      Utils.fetchTemplate(`assets/html/popup/${options.type}.html`).then(dom => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        const user = options.user || this.user.username;
        const desc = Utils.stripDom(options.description) || this.nls.popup(`${options.type}NoDesc`);
        Utils.replaceString(element, `{{${options.type.toUpperCase()}_NAME}}`, Utils.stripDom(options.name));
        Utils.replaceString(element, `{{${options.type.toUpperCase()}_FINDER}}`, user);
        Utils.replaceString(element, `{{${options.type.toUpperCase()}_RATE}}`, options.rate + 1);
        Utils.replaceString(element, `{{${options.type.toUpperCase()}_DESC}}`, desc);
        Utils.replaceString(element, `{{${options.type.toUpperCase()}_FOUND_BY}}`, this.nls.popup(`${options.type}FoundBy`));
        // Fill mark rate (rating is in [0, 4] explaining the +1 in loop bound)
        const rate = element.querySelector(`#${options.type}-rating`);
        for (let i = 0; i < options.rate + 1; ++i) {
          rate.children[i].classList.add('active');
        }
        // Remove picture icon if user is not in range
        const distance = Utils.getDistanceBetweenCoords([this.user.lat, this.user.lng], [options.lat, options.lng]);
        if (distance > Utils.CIRCLE_RADIUS) {
          console.log('Too far');
          //element.removeChild(element.querySelector(''));
        }
        // Remove edition buttons if marker is not user's one, this does not replace a server test for edition...
        if (user !== this.user.username) {
          element.removeChild(element.querySelector('#popup-edit'));
        } else {
          element.querySelector('#edit-mark').addEventListener('click', this.editMarker.bind(this, options), false);
          element.querySelector('#delete-mark').addEventListener('click', this.deleteMarker.bind(this, options), false);
        }

        // Append circle around marker
        options.color = Utils[`${options.type.toUpperCase()}_COLOR`];
        options.circle = this.drawCircle(options);
        // Create label for new marker
        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(options.name)
          .setLatLng(options.circle.getLatLng());
        // Only make it visible if preference is to true
        if (Utils.getPreference('poi-marker-label') === 'true') {
          options.tooltip.addTo(this.map);
        }
        // Send back the popup
        resolve(element);
      });
    });
  }


  drawCircle(options) {
    return window.L.circle(options, {
      color: options.color,
      fillColor: options.color,
      opacity: 0, // This needs to be updated according to user proximity
      fillOpacity: 0, // Same for this parameter
      radius: options.radius ? options.radius : Utils.CIRCLE_RADIUS,
    }).addTo(this.map);
  }


  setMarkerCircles(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      // Here we update both opacity and add/remove circle from map
      if (visible) {
        marks[i].circle.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
        marks[i].circle.addTo(this.map);
      } else {
        marks[i].circle.setStyle({
          opacity: 0,
          fillOpacity: 0
        });
        marks[i].circle.removeFrom(this.map);
      }
    }
  }


  setMarkerLabels(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      if (visible) {
        marks[i].tooltip.addTo(this.map);
      } else {
        marks[i].tooltip.removeFrom(this.map);
      }
    }
  }


}


export default MapHelper;
