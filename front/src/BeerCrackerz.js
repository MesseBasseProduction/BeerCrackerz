import './BeerCrackerz.scss';
import Kom from './js/core/Kom.js';
import LangManager from './js/core/LangManager.js';

import ZoomSlider from './js/ui/component/ZoomSlider.js';
import Notification from './js/ui/component/Notification.js';
import VisuHelper from './js/ui/VisuHelper.js';
import MarkPopup from './js/ui/MarkPopup';
import ModalFactory from './js/ui/ModalFactory';

import CustomEvents from './js/utils/CustomEvents.js';
import Utils from './js/utils/Utils.js';
import AccuracyEnum from './js/utils/enums/AccuracyEnum.js';
import ClustersEnum from './js/utils/enums/ClusterEnum.js';
import ColorEnum from './js/utils/enums/ColorEnum.js';
import ProvidersEnum from './js/utils/enums/ProviderEnum.js';
import MapEnum from './js/utils/enums/MapEnum.js';


window.VERSION = '0.0.2';
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
      color: ColorEnum.user, // The color to use for circle (match the user marker color)
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
    this._lang = new LangManager();
    // Start app initialization
    this._init();
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
      .then(this._initMarkers.bind(this))
      .then(this._initEvents.bind(this));
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
      // If no pref, set fallbacks
      Utils.setDefaultPreferences();
      // Update icon class if center on preference is set to true
      if (Utils.getPreference('map-center-on-user') === 'true') {
        document.getElementById('center-on').classList.add('lock-center-on');
      }
      // Replace dark-theme class with light-theme class on body
      if (Utils.getPreference('dark-theme') === 'false') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
      // Update LangManager with pref language
      this.nls.updateLang(Utils.getPreference('selected-lang')).then(() => {
        this.debugElement = VisuHelper.initDebugUI();
        // Create and append debug UI with proper nls settings
        if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
          window.DEBUG = true; // Ensure to set global flag if preference comes from local storage
          Utils.setPreference('app-debug', true); // Ensure to set local storage preference if debug flag was added to the url
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
        const options = (Utils.getPreference('map-high-accuracy') === 'true') ? AccuracyEnum.high : AccuracyEnum.optimized;
        this._watchId = navigator.geolocation.watchPosition(position => {
          // Update saved user position
          this._user.lat = position.coords.latitude;
          this._user.lng = position.coords.longitude;
          this._user.accuracy = position.coords.accuracy;
          // Only draw marker if map is already created
          if (this._map) {
            VisuHelper.drawUserMarker();
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
      VisuHelper.drawUserMarker();
      // Add OSM credits to the map next to leaflet credits
      const osm = ProvidersEnum.planOsm;
      const esri = ProvidersEnum.satEsri;
      // Prevent panning outside of the world's edge
      this._map.setMaxBounds(MapEnum.mapBounds);
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
      this._clusters.spot = ClustersEnum.spot;
      this._clusters.shop = ClustersEnum.shop;
      this._clusters.bar = ClustersEnum.bar;
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
          mark.marker = VisuHelper.addMark(mark);
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
      // Subscribe to click event on map to react
      this._map.on('click', this.mapClicked.bind(this));
      // Map is dragged by user mouse/finger
      this._map.on('drag', () => {
        // Constrain pan to the map bounds
        this._map.panInsideBounds(MapEnum.mapBounds, { animate: true });
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
          if (this._map.getZoom() >= 10) {
            VisuHelper.setMarkerCircles(true);
          }
        }
        // Auto hide labels if zoom level is too high (and restore it when needed)
        if (Utils.getPreference('poi-show-label') === 'true') {
          if (this._map.getZoom() < 16) {
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
      // Clustering events
      this._clusters.spot.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'spot'));
      this._clusters.shop.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'shop'));
      this._clusters.bar.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'bar'));
      // Command events
      window.Evts.addEvent('click', document.getElementById('user-profile'), this.userProfile, this);
      window.Evts.addEvent('click', document.getElementById('hide-show'), this.hidShowMenu, this);
      window.Evts.addEvent('click', document.getElementById('center-on'), VisuHelper.toggleFocusLock, this);
      // Bus events
      window.Evts.subscribe('addMark', this.addMark.bind(this)); // Event from addMarkPopup
      window.Evts.subscribe('onMarkAdded', this._onMarkAdded.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('deleteMark', this.deleteMark.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('onMarkDeleted', this._onMarkDeleted.bind(this)); // User confirmed the mark deletion
      window.Evts.subscribe('editMark', this.editMark.bind(this)); // Event from MarkPopup
      window.Evts.subscribe('onMarkEdited', this._onMarkEdited.bind(this)); // User confirmed the mark edition
      window.Evts.subscribe('updateProfile', this.updateProfilePicture.bind(this)); // Event from user modal
      window.Evts.subscribe('onProfilePictureUpdated', this._onProfilePictureUpdated.bind(this)); // Event from update pp modal

      window.Evts.subscribe('centerOn', VisuHelper.centerOn.bind(VisuHelper));

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


  updateLang(event) {
    Utils.setPreference('selected-lang', event.target.value);
    this.nls.updateLang(Utils.getPreference('selected-lang')).then(() => {
      if (this._modal) {
        this._modal.close(null, true);
        VisuHelper.updateDebugUI();
        setTimeout(this.userProfile.bind(this), 200);
      } else { // Lang update from elsewhere than user modal
        window.location.reload();
      }
    });
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
      if (distance < MapEnum.newMarkRange) {
        this.addMarkPopup(event.latlng);
      } else if (this._map.getZoom() >= 10) {
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
    this._newMarker = VisuHelper.addMark(options).openPopup();
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
    this._modal = ModalFactory.build('AddMark', options);
  }


  _onMarkAdded(options) {
    const popup = new MarkPopup(options, dom => {
      options.dom = dom;
      options.marker = VisuHelper.addMark(options); // Create final marker
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
    this._modal = ModalFactory.build('DeleteMark', options);
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
    this._modal = ModalFactory.build('EditMark', options);
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


  // ======================================================================== //
  // --------------------------- User profile ------------------------------- //
  // ======================================================================== //



  /**
   * @method
   * @name userProfile
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The userProfile() method will request the user modal, which contains
   * the user preferences, and the user profile information
   * </blockquote>
   **/
  userProfile() {
    this._modal = ModalFactory.build('User');
  }


  updateProfilePicture(options) {
    this._modal = ModalFactory.build('UpdateProfilePicture', options);
  }


  _onProfilePictureUpdated(options) {
    this._kom.patchImage(`api/user/${this._user.id}/profile-picture/`, {
      profile_picture: document.getElementById('wip-pp').src,
      minX: Math.round(options.imageResizer.getMinPoint().x),
      minY: Math.round(options.imageResizer.getMinPoint().y),
      maxX: Math.round(options.imageResizer.getMaxPoint().x),
      maxY: Math.round(options.imageResizer.getMaxPoint().y)
    }).then(() => {
      this.notification.raise(this.nls.notif('uploadPPSuccess'));
    }).catch(err => {
      this.notification.raise(this.nls.notif('uploadPPFailed'));
      console.error(err)
    }).finally(() => {
      // Reload user from server with new path and close modal
      this._initUser().then(() => {
        this._modal.close(null, true);
      });
    });
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
    this._modal = ModalFactory.build('HideShow');
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
