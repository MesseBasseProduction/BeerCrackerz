import './BeerCrackerz.scss';
import Kom from './js/core/Kom.js';
import LangManager from './js/core/LangManager.js';

import ZoomSlider from './js/ui/component/ZoomSlider.js';
import Notification from './js/ui/component/Notification.js';
import ImageResizer from './js/ui/component/ImageResizer.js';
import VisuHelper from './js/ui/VisuHelper.js';

import Markers from './js/utils/MarkerEnum.js';
import CustomEvents from './js/utils/CustomEvents.js';
import DropElement from './js/utils/DropElement.js';
import Clusters from './js/utils/ClusterEnum.js';
import Providers from './js/utils/ProviderEnum.js';
import Utils from './js/utils/Utils.js';
import MarkPopup from './js/ui/MarkPopup';
import ModalFactory from './js/ui/ModalFactory';


window.Evts = new CustomEvents();


/**
 * @class
 * @constructor
 * @public
**/
class BeerCrackerz {


  /**
   * @summary The BeerCrackerz main component
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * This component handles the whole BeerCrackerz app. It includes the map manipulation,
   * the geolocation API to update the user position and process any map events that are
   * relevant to an UX stand point. For more information, please consult the application
   * description page at <a href="https://about.beercrackerz.org">https://about.beercrackerz.org/</a>
   * </blockquote>
   **/
  constructor() {
    /**
     * The core Leaflet.js map
     * @type {Object}
     * @private
     **/
    this._map = null;
    /**
     * The zoom slider handler
     * @type {Object}
     * @private
     **/
    this._zoomSlider = null;
    /**
     * The notification handler
     * @type {Object}
     * @private
     **/
    this._notification = null;
    /**
     * The user object holds everything useful to ensure a proper session
     * @type {Object}
     * @private
     **/
    this._user = {
      lat: 48.853121540141096, // Default lat to Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Default lng to Paris Notre-Dame longitude
      accuracy: 0, // Accuracy in meter given by geolocation API
      marker: null, // The user marker on map
      circle: null, // The accuracy circle around the user marker
      range: null, // The range in which user can add a new marker
      color: Utils.USER_COLOR, // The color to use for circle (match the user marker color)
      id: -1,
      username: ''
    };
    /**
     * The stored marks for spots, shops and bars
     * @type {Object}
     * @private
     **/
    this._marks = {
      spot: [],
      shop: [],
      bar: []
    };
    /**
     * The stored clusters for markers, see Leaflet.markercluster plugin
     * @type {Object}
     * @private
     **/
    this._clusters = {
      spot: {},
      shop: {},
      bar: {}
    };
    /**
     * The temporary marker for new marks only
     * @type {Object}
     * @private
     **/
    this._newMarker = null;
    /**
     * The debug DOM object
     * @type {Object}
     * @private
     **/
    this.debugElement = null;
    /**
     * ID for geolocation watch callback
     * @type {Number}
     * @private
     **/
    this._watchId = null;
    /**
     * Flag to know if a zoom action is occuring on map
     * @type {Boolean}
     * @private
     **/
    this._isZooming = false;
    /**
     * The communication manager to process all server call
     * @type {Object}
     * @private
     **/
    this._kom = new Kom();
    /**
     * The LangManager must be instantiated to handle nls accross the app
     * @type {Object}
     * @private
     **/
    // The BeerCrackerz app is only initialized once nls are set up
    this._lang = new LangManager(
      window.navigator.language.substring(0, 2),
      this._init.bind(this)
    );
  }


  // ======================================================================== //
  // ----------------- Application initialization sequence ------------------ //
  // ======================================================================== //


  /**
   * @method
   * @name _init
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _init() method is designed to properly configure the user session, according
   * to its saved preferences and its position. It first build the debug interface,
   * then loads the user preferences, then create the map and finally, events are listened.
   * </blockquote>
   **/
  _init() {
    this._notification = new Notification();
    this._initUser()
      .then(this._initPreferences.bind(this))
      .then(this._initGeolocation.bind(this))
      .then(this._initMap.bind(this))
      .then(this._initEvents.bind(this))
      .then(this._initMarkers.bind(this));
  }


  /**
   * @method
   * @name _initUser
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _init() method initialize the user object according to its information
   * and statistic so the UI can be properly built.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initUser() {
    return new Promise((resolve, reject) => {
      this._kom.get('/api/user/me/').then(user => {
        this._user.id = user.id;
        this._user.username = user.username;
        this._user.email = user.email;
        this._user.pp = user.profilePicture;
        this._user.isActive = user.isActive;
        resolve();
      }).catch(reject);
    });
  }


  /**
   * @method
   * @name _initPreferences
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initPreferences() will initialize user preference if they are not set yet,
   * it will also update the UI according to user preferences ; debug DOM visible,
   * update the command classList for selected ones.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initPreferences() {
    return new Promise((resolve, reject) => {
      if (Utils.getPreference('poi-show-spot') === null) {
        Utils.setPreference('poi-show-spot', true);
      }

      if (Utils.getPreference('poi-show-shop') === null) {
        Utils.setPreference('poi-show-shop', true);
      }

      if (Utils.getPreference('poi-show-bar') === null) {
        Utils.setPreference('poi-show-bar', true);
      }

      if (Utils.getPreference('map-plan-layer') === null) {
        Utils.setPreference('map-plan-layer', true);
      }
      // Update icon class if center on preference is set to true
      if (Utils.getPreference('map-center-on-user') === 'true') {
        document.getElementById('center-on').classList.add('lock-center-on');
      }

      if (Utils.getPreference('selected-lang') === null) {
        Utils.setPreference('selected-lang', 'en'); // Default lang to EN
      }
      // Update LangManager if pref is !english
      this.nls.updateLang(Utils.getPreference('selected-lang')).then(() => {
        // Create and append debug UI with proper nls settings
        if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
          window.DEBUG = true; // Ensure to set global flag if preference comes from local storage
          Utils.setPreference('app-debug', true); // Ensure to set local storage preference if debug flag was added to the url
          this.debugElement = Utils.initDebugInterface();        
          VisuHelper.addDebugUI();
        }
        resolve();        
      }).catch(reject);
    });
  }


  /**
   * @method
   * @name _initGeolocation
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initGeolocation() method will request from browser the location authorization.
   * Once granted, an event listener is set on any position update, so it can update the
   * map state and the markers position. This method can be called again, only if the
   * geolocation watch has been cleared ; for example when updating the accuracy options.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initGeolocation() {
    return new Promise(resolve => {
      if ('geolocation' in navigator) {
        const options = (Utils.getPreference('map-high-accuracy') === 'true') ? Utils.HIGH_ACCURACY : Utils.OPTIMIZED_ACCURACY;
        this._watchId = navigator.geolocation.watchPosition(position => {
          // Update saved user position
          this._user.lat = position.coords.latitude;
          this._user.lng = position.coords.longitude;
          this._user.accuracy = position.coords.accuracy;
          // Only draw marker if map is already created
          if (this._map) {
            this.drawUserMarker();
            VisuHelper.updateMarkerCirclesVisibility();
            // Update map position if focus lock is active
            if (Utils.getPreference('map-center-on-user') === 'true' && !this._isZooming) {
              this._map.setView(this._user);
            }
            // Updating debug info
            VisuHelper.updateDebugUI();
          }
          resolve();
        }, resolve, options);
      } else {
        this.notification.raise(this.nls.notif('geolocationError'));
        resolve();
      }
    });
  }


  /**
   * @method
   * @name _initMap
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initMap() method will create the Leaflet.js map with two base layers (plan/satellite),
   * add scale control, remove zoom control and set map bounds.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initMap() {
    return new Promise(resolve => {
      // Use main div to inject OSM into
      this._map = window.L.map('beer-crakerz-map', {
        zoomControl: false,
      }).setView([this._user.lat, this._user.lng], 18);
      // Add meter and feet scale on map
      window.L.control.scale().addTo(this._map);
      // Place user marker on the map
      this.drawUserMarker();
      // Add OSM credits to the map next to leaflet credits
      const osm = Providers.planOsm;
      const esri = Providers.satEsri;
      // Prevent panning outside of the world's edge
      this._map.setMaxBounds(Utils.MAP_BOUNDS);
      // Add layer group to interface
      const baseMaps = {};
      baseMaps[`<p>${this.nls.map('planLayerOSM')}</p>`] = osm;
      baseMaps[`<p>${this.nls.map('satLayerEsri')}</p>`] = esri;
      // Append layer depending on user preference
      if (Utils.getPreference('map-plan-layer')) {
        switch (Utils.getPreference('map-plan-layer')) {
          case this.nls.map('planLayerOSM'):
            osm.addTo(this._map);
            break;
          case this.nls.map('satLayerEsri'):
            esri.addTo(this._map);
            break;
          default:
            osm.addTo(this._map);
            break;
        }
      } else { // No saved pref, fallback on OSM base map
        osm.addTo(this._map);
      }
      // Add layer switch radio on bottom right of the map
      window.L.control.layers(baseMaps, {}, { position: 'bottomright' }).addTo(this._map);
      // Init zoom slider when map has been created
      this._zoomSlider = new ZoomSlider(this._map);
      resolve();
    });
  }


  /**
   * @method
   * @name _initEvents
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initEvents() method will listen to all required events to manipulate the map. Those events
   * are both for commands and for map events (click, drag, zoom and layer change).
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initEvents() {
    return new Promise(resolve => {
      // Command events
      window.Evts.addEvent('click', document.getElementById('user-profile'), this.userProfileModal, this);
      window.Evts.addEvent('click', document.getElementById('hide-show'), this.hidShowMenu, this);
      window.Evts.addEvent('click', document.getElementById('center-on'), VisuHelper.toggleFocusLock, this);
      // Subscribe to click event on map to react
      this._map.on('click', this.mapClicked.bind(this));
      // Map is dragged by user mouse/finger
      this._map.on('drag', () => {
        // Constrain pan to the map bounds
        this._map.panInsideBounds(Utils.MAP_BOUNDS, { animate: true });
        // Disable lock focus if user drags the map
        if (Utils.getPreference('map-center-on-user') === 'true') {
          VisuHelper.toggleFocusLock();
        }
      });
      // Map events
      this._map.on('zoomstart', () => {
        this._isZooming = true;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          VisuHelper.setMarkerCircles(false);
        }
      });
      this._map.on('zoomend', () => {
        this._isZooming = false;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          if (this._map.getZoom() >= 15) {
            VisuHelper.setMarkerCircles(true);
          }
        }
        // Auto hide labels if zoom level is too high (and restore it when needed)
        if (Utils.getPreference('poi-marker-label') === 'true') {
          if (this._map.getZoom() < 15) {
            VisuHelper.setMarkerLabels(false);
          } else {
            VisuHelper.setMarkerLabels(true);
          }
        }
        // Updating debug info
        VisuHelper.updateDebugUI();
      });
      this._map.on('baselayerchange', event => {
        Utils.setPreference('map-plan-layer', Utils.stripDom(event.name));
      });

      window.Evts.subscribe('addMark', this.addMark.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('onMarkAdded', this._onMarkAdded.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('deleteMark', this.deleteMark.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('onMarkDeleted', this._onMarkDeleted.bind(this)); // User confirmed the mark deletion
      window.Evts.subscribe('editMark', this.editMark.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('onMarkEdited', this._onMarkEdited.bind(this)); // User confirmed the mark edition

      window.Evts.subscribe('centerOn', VisuHelper.centerOn.bind(VisuHelper));

      resolve();
    });
  }


  /**
   * @method
   * @name _initMarkers
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initEvents() method will initialize all saved marker into the map.
   * Markers must be retrieved from server with a specific format to ensure it works
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initMarkers() {
    return new Promise(resolve => {
      // Init map clusters for marks to be displayed (disable clustering at opened popup zoom level)
      this._clusters.spot = Clusters.spot;
      this._clusters.shop = Clusters.shop;
      this._clusters.bar = Clusters.bar;
      // Append clusters to the map depending on user preferences
      if (Utils.getPreference(`poi-show-spot`) === 'true') {
        this._map.addLayer(this._clusters.spot);
      }
      if (Utils.getPreference(`poi-show-shop`) === 'true') {
        this._map.addLayer(this._clusters.shop);
      }
      if (Utils.getPreference(`poi-show-bar`) === 'true') {
        this._map.addLayer(this._clusters.bar);
      }
      // Load data from local storage, later to be fetched from server
      const iterateMarkers = mark => {
        const popup = new MarkPopup(mark, dom => {
          mark.dom = dom;
          mark.marker = this.placeMarker(mark);
          mark.popup = popup;          
          this._marks[mark.type].push(mark);
          this._clusters[mark.type].addLayer(mark.marker);
        });
      };

      this._kom.getSpots().then(spots => {
        for (let i = 0; i < spots.length; ++i) {
          iterateMarkers(spots[i]);
        }
      });

      this._kom.getShops().then(shops => {
        for (let i = 0; i < shops.length; ++i) {
          iterateMarkers(shops[i]);
        }
      }); 
    
      this._kom.getBars().then(bars => {
        for (let i = 0; i < bars.length; ++i) {
          iterateMarkers(bars[i]);
        }
      }); 

      VisuHelper.updateMarkerCirclesVisibility();

      resolve();
    });
  }


  // ======================================================================== //
  // ------------------------- Toggle for map items ------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name toggleHighAccuracy
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleHighAccuracy() method will, depending on user preference, update the
   * geolocation accuracy between optimized and high. The high settings might cause
   * more memory and processing consumption, but gives better results. It will clear
   * any previous position watch on the geolocation API so it can subscribe a new one
   * with the new accuracy parameters (see Utils for values)
   * </blockquote>
   **/
  toggleHighAccuracy() {
    const high = !(Utils.getPreference('map-high-accuracy') === 'true');
    Utils.setPreference('map-high-accuracy', high);
    navigator.geolocation.clearWatch(this._watchId);
    this._initGeolocation().then(VisuHelper.updateDebugUI.bind(VisuHelper));
  }


  // ======================================================================== //
  // -------------------------- Map interaction ----------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name mapClicked
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The mapClicked() method is the callback used when the user clicked on the Leaflet.js map
   * </blockquote>
   * @param {Event} event The click event
   **/
  mapClicked(event) {
    if (this._newMarker && this._newMarker.popupClosed) {
      // Avoid to open new marker right after popup closing
      this._newMarker = null;
    } else if (this._newMarker === null || !this._newMarker.isBeingDefined) {
      // Only create new marker if none is in progress, and that click is max range to add a marker
      const distance = Utils.getDistanceBetweenCoords([this._user.lat, this._user.lng], [event.latlng.lat, event.latlng.lng]);
      if (distance < Utils.NEW_MARKER_RANGE) {
        this.addMarkPopup(event.latlng);
      } else {
        this.notification.raise(this.nls.notif('newMarkerOutside'));
      }
    }
  }


  // ======================================================================== //
  // ----------------------- Marker manipulation ---------------------------- //
  // ======================================================================== //


  addMarkPopup(options) {
    const dom = {
      wrapper: document.createElement('DIV'),
      title: document.createElement('P'),
      spot: document.createElement('BUTTON'),
      shop: document.createElement('BUTTON'),
      bar: document.createElement('BUTTON'),
    };
    // Update class and inner HTMl content according to user's nls
    dom.wrapper.className = 'new-poi';
    dom.title.innerHTML = this.nls.map('newTitle');
    dom.spot.innerHTML = this.nls.map('newSpot');
    dom.shop.innerHTML = this.nls.map('newShop');
    dom.bar.innerHTML = this.nls.map('newBar');
    // Atach data type to each button (to be used in clicked callback)
    dom.spot.dataset.type = 'spot';
    dom.shop.dataset.type = 'shop';
    dom.bar.dataset.type = 'bar';
    // DOM chaining
    dom.wrapper.appendChild(dom.title);
    dom.wrapper.appendChild(dom.spot);
    dom.wrapper.appendChild(dom.shop);
    dom.wrapper.appendChild(dom.bar);
    // Update popup content with DOM elements
    options.dom = dom.wrapper;
    // Create temporary mark with wrapper content and open it to offer user the creation menu
    this._newMarker = this.placeMarker(options).openPopup();
    options.marker = this._newMarker; // Attach marker to option so it can be manipulated in clicked callbacks
    // Callback on button clicked (to open modal and define a new mark)
    const _prepareNewMark = e => {
      this._newMarker.isBeingDefined = true;
      this._newMarker.closePopup();
      options.type = e.target.dataset.type;
      window.Evts.publish('addMark', options);
    };
    // Buttons click events
    dom.spot.addEventListener('click', _prepareNewMark);
    dom.shop.addEventListener('click', _prepareNewMark);
    dom.bar.addEventListener('click', _prepareNewMark);
    // Listen to clicks outside of popup to close new mark
    this._newMarker.on('popupclose', () => {
      if (!this._newMarker.isBeingDefined) {
        this._newMarker.popupClosed = true;
        this._newMarker.removeFrom(this.map);
      }
    });
  }


  addMark(options) {
    this._modal = new ModalFactory('AddMark', options);
  }


  _onMarkAdded(options) {
    const popup = new MarkPopup(options, dom => {
      options.dom = dom;
      options.marker = this.placeMarker(options); // Create final marker
      options.popup = popup;
      // Save new marker in local storage, later to be sent to the server
      this._kom[`${options.type}Created`](Utils.formatMarker(options)).then(data => {
        // Update marker data to session memory
        options.id = data.id;
        options.name = data.name;
        options.description = data.description;
        options.lat = data.lat;
        options.lng = data.lng;
        // Save marke in marks and clusters for the map
        this._marks[options.type].push(options);
        this._clusters[options.type].addLayer(options.marker);
        // Notify user that new marker has been saved
        this.notification.raise(this.nls.notif(`${options.type}Added`));
        // Update marker circles visibility according to user position
        VisuHelper.updateMarkerCirclesVisibility();
        // Clear new marker to let user add other stuff
        this._newMarker = null;
      }).catch(() => {
        this.notification.raise(this.nls.notif(`${options.type}NotAdded`));      
      });
    });
  }


  /**
   * @method
   * @name deleteMark
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * This method will delete a mark after prompting the user if he trully wants to
   * </blockquote>
   * @param {Object} options The mark options to delete
   **/
  deleteMark(options) {
    this._map.closePopup();
    this._modal = new ModalFactory('DeleteMark', options);
  }


  _onMarkDeleted(options) {
    // Iterate through marks to find matching one (by coord as marks coordinates are unique)
    const marks = this._marks[options.type];
    for (let i = 0; i < marks.length; ++i) {
      // We found, remove circle, label and marker from map/clusters
      if (options.lat === marks[i].lat && options.lng === marks[i].lng) {
        // Send data to server
        this._kom[`${options.type}Deleted`](marks[i].id, Utils.formatMarker(marks[i])).then(() => {
          VisuHelper.removeMarkDecoration(marks[i]);
          this._clusters[options.type].removeLayer(marks[i].marker);
          marks.splice(i, 1);
          // Update internal marks array
          this._marks[options.type] = marks;
          // Notify user through UI that marker has been successfully deleted
          this.notification.raise(this.nls.notif(`${options.type}Deleted`));
        }).catch(() => {
          this.notification.raise(this.nls.notif(`${options.type}NotDeleted`));
        });
        break;
      }
    }

    this._modal.close(null, true);
  }


  /**
   * @method
   * @name editMark
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * This method will open a mark edition modal
   * </blockquote>
   * @param {Object} options The mark options to edit
   **/
   editMark(options) {
    this._map.closePopup();
    this._modal = new ModalFactory('EditMark', options);
  }


  _onMarkEdited(options) {
    // Iterate through marks to find matching one (by coord as marks coordinates are unique)
    for (let i = 0; i < this._marks[options.type].length; ++i) {
      // We found, remove circle, label and marker from map/clusters
      if (options.lat === this._marks[options.type][i].lat && options.lng === this._marks[options.type][i].lng) {
        this._marks[options.type][i].name = options.name.value;
        this._marks[options.type][i].description = options.description.value;
        this._marks[options.type][i].rate = options.rating.currentRate;
        options.tooltip.removeFrom(this.map);
        const popup = new MarkPopup(options, dom => {
          options.dom = dom;
          options.marker.setPopupContent(options.dom);
          options.popup = popup;
          // Send data to server
          this._kom[`${options.type}Edited`](options.id, Utils.formatMarker(options)).then(data => {
            // Update marker data to session memory
            options.id = data.id;
            options.name = data.name;
            options.description = data.description;
            options.lat = data.lat;
            options.lng = data.lng;
            // Notify user through UI that marker has been successfully deleted
            this.notification.raise(this.nls.notif(`${options.type}Edited`));
          }).catch(() => {
            this.notification.raise(this.nls.notif(`${options.type}NotEdited`));                
          }).finally(() => {
            this._modal.close(null, true);
          });
        });
        break;
      }
    }    
  }


  /**
   * @method
   * @name hidShowMenu
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The hidShowMenu() method will request the hide show modal, which all
   * toggles for map elements ; labels/circles/spots/shops/bars
   * </blockquote>
   **/
  hidShowMenu() {
    this._modal = new ModalFactory('HideShow');
  }


  // ======================================================================== //
  // --------------------------- User profile ------------------------------- //
  // ======================================================================== //



  /**
   * @method
   * @name userProfileModal
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The userProfileModal() method will request the user modal, which contains
   * the user preferences, and the user profile information
   * </blockquote>
   **/
   userProfileModal() {
    this._kom.getTemplate('/modal/user').then(dom => {
      this.nls.userProfileModal(dom);
      dom.querySelector(`#user-pp`).src = this._user.pp;
      dom.querySelector(`#user-name`).innerHTML = this._user.username;
      dom.querySelector(`#user-email`).innerHTML = this._user.email;

      new DropElement({
        target: dom.querySelector('#update-pp-wrapper'),
        onDrop: this.updateProfilePictureModal.bind(this)
      });
      new DropElement({
        target: dom.querySelector('#drop-user-pp'),
        onDrop: this.updateProfilePictureModal.bind(this)
      });

      // Init modal checkbox state according to local storage preferences
      if (Utils.getPreference('map-high-accuracy') === 'true') {
        dom.querySelector('#high-accuracy-toggle').checked = true;
      }

      if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
        dom.querySelector('#debug-toggle').checked = true;
      }

      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);

      document.getElementById('high-accuracy-toggle').addEventListener('change', this.toggleHighAccuracy.bind(this));
      document.getElementById('debug-toggle').addEventListener('change', VisuHelper.toggleDebug.bind(VisuHelper));
      document.getElementById('update-pp').addEventListener('change', this.updateProfilePictureModal.bind(this));
      document.getElementById('user-pp').addEventListener('click', this.updateProfilePictureModal.bind(this));
      document.getElementById('logout').addEventListener('click', () => {
        this._kom.post('api/auth/logout/', null).then(() => {
          window.location = '/welcome'
        })
      });
    });
  }


  // TODo split into component and stuff
  updateProfilePictureModal(event) {
    if (event.type === 'click') { // Clicked on actual pp
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      document.getElementById('update-pp').dispatchEvent(evt);
      return;
    }

    const fileInput = document.getElementById('update-pp');
    let files = { files: fileInput.files }; // From input change
    if (event.files && event.files.length === 1) { // From drop
      files = { files: event.files };
    }

    if (files.files && files.files.length === 1) {
      // Check if file is conform to what's expected
      if (files.files[0].size > 2621440) { // 2.5Mo
        document.getElementById('update-pp').value = '';
        document.getElementById('update-pp').classList.add('error');
        document.getElementById('update-pp-error').innerHTML = this.nls.modal('updatePPSizeError');
        return;
      }

      if (FileReader) {
        const fr = new FileReader();
        fr.onload = () => {
          var image = new Image();
          image.src = fr.result;
          image.onload = () => {
            if (image.width < 512 || image.height < 512) {
              document.getElementById('update-pp').value = '';
              document.getElementById('update-pp').classList.add('error');
              document.getElementById('update-pp-error').innerHTML = this.nls.modal('updatePPDimensionError');
              return;
            } else {
              _onFileLoaded(image.width, image.height, fr.result);
            }
          };
        };
        fr.readAsDataURL(files.files[0]);
      } else {
        console.error('Couldnt read file');
      }

      // place resizer around en transparence
      const _onFileLoaded = (width, height, b64) => {
        this._kom.getTemplate('/modal/updatepp').then(dom => {
          this.nls.updateProfilePictureModal(dom);

          document.getElementById('overlay').appendChild(dom);
          document.getElementById('overlay').style.display = 'flex';
          document.getElementById('wip-pp').src = b64;

          const imageResizer = new ImageResizer({
            wrapper: document.getElementById('wip-pp-wrapper'),
            width: width,
            height: height
          });          
          // Send PP to the server
          document.getElementById(`update-pp-submit`).addEventListener('click', () => {
            this._kom.patchImage(`api/user/${this._user.id}/profile-picture/`, {
              profile_picture: document.getElementById('wip-pp').src,
              minX: Math.round(imageResizer.getMinPoint().x),
              minY: Math.round(imageResizer.getMinPoint().y),
              maxX: Math.round(imageResizer.getMaxPoint().x),
              maxY: Math.round(imageResizer.getMaxPoint().y)
            }).then(() => {
              this.notification.raise(this.nls.notif('uploadPPSuccess'));
            }).catch(err => {
              this.notification.raise(this.nls.notif('uploadPPFailed'));
              console.error(err)
            }).finally(() => {
              // Reload user from server with new path and close modal
              //this._initUser().then(this.closeModal.bind(this, null, true));              
            });
          });
          // Cancel
          //document.getElementById(`update-pp-cancel`).addEventListener('click', this.closeModal.bind(this, null, true));
        });
      };
    }
  }


  // ======================================================================== //
  // ---------------------------- Debug methods ----------------------------- //
  // ======================================================================== //


  placeMarker(options) {
    let icon = Markers.black;
    if (options.type === 'shop') {
      icon = Markers.blue;
    } else if (options.type === 'spot') {
      icon = Markers.green;
    } else if (options.type === 'bar') {
      icon = Markers.red;
    } else if (options.type === 'user') {
      icon = Markers.user;
    }

    const marker = window.L.marker([options.lat, options.lng], { icon: icon }).on('click', VisuHelper.centerOn.bind(VisuHelper, options));

    if (options.dom) {
      marker.bindPopup(options.dom);
    }
    // All markers that are not spot/shop/bar should be appended to the map
    if (['spot', 'shop', 'bar'].indexOf(options.type) === -1) {
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
      this.user.circle = VisuHelper.drawCircle(this.user);
      this.user.range = VisuHelper.drawCircle({
        lat: this.user.lat,
        lng: this.user.lng,
        radius: Utils.NEW_MARKER_RANGE,
        color: Utils.RANGE_COLOR
      });

      this.user.circle.addTo(this._map);
      this.user.range.addTo(this._map);
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


  // ======================================================================== //
  // ---------------------------- Class accessors --------------------------- //
  // ======================================================================== //


  /**
   * @public
   * @property {Object} map
   * Leaflet.js map getter
   **/
  get map() {
    return this._map;
  }


  /**
   * @public
   * @property {Object} marks
   * Leaflet.js marks that holds spot/shop/bar marks as subkeys
   **/
  get marks() {
    return this._marks;
  }


  get clusters() {
    return this._clusters;
  }


  /**
   * @public
   * @property {Object} user
   * The session user object
   **/
  get user() {
    return this._user;
  }


  get kom() {
    return this._kom;
  }


  get notification() {
    return this._notification;
  }


  /**
   * @public
   * @property {Object} nls
   * The LangManager getter
   **/
  get nls() {
    return this._lang;
  }


}


export default BeerCrackerz;
