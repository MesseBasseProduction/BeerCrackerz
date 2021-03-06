import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';
import ZoomSlider from './js/ui/ZoomSlider.js';
import LangManager from './js/utils/LangManager.js';
import Notification from './js/ui/Notification.js';
import Rating from './js/ui/Rating.js';
import Utils from './js/utils/Utils.js';


/**
 * @class
 * @constructor
 * @public
 * @extends MapHelper
**/
class BeerCrackerz extends MapHelper {


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
    super();
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
     * The stored marks for spots, stores and bars
     * @type {Object}
     * @private
     **/
    this._marks = {
      spot: [],
      store: [],
      bar: [],
    };
    /**
     * The stored clusters for markers, see Leaflet.markercluster plugin
     * @type {Object}
     * @private
     **/
    this._clusters = {
      spot: {},
      store: {},
      bar: {},
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
    this._debugElement = null;
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
     * The LangManager must be instantiated to handle nls accross the app
     * @type {Boolean}
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
    this._debugElement = Utils.initDebugInterface();
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
    return new Promise(resolve => {
      // TODO fill user information from server
      this._user.id = 42;
      this._user.username = 'messmaker';
      resolve();
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
    return new Promise(resolve => {
      if (Utils.getPreference('poi-show-spot') === null) {
        Utils.setPreference('poi-show-spot', true);
      }

      if (Utils.getPreference('poi-show-store') === null) {
        Utils.setPreference('poi-show-store', true);
      }

      if (Utils.getPreference('poi-show-bar') === null) {
        Utils.setPreference('poi-show-bar', true);
      }

      if (Utils.getPreference('map-plan-layer') === null) {
        Utils.setPreference('map-plan-layer', true);
      }

      if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
        window.DEBUG = true; // Ensure to set global flag if preference comes from local storage
        Utils.setPreference('app-debug', true); // Ensure to set local storage preference if debug flag was added to the url
        this.addDebugUI();
      }
      // Update icon class if center on preference is set to true
      if (Utils.getPreference('map-center-on-user') === 'true') {
        document.getElementById('center-on').classList.add('lock-center-on');
      }

      resolve();
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
            this.updateMarkerCirclesVisibility();
            // Update map position if focus lock is active
            if (Utils.getPreference('map-center-on-user') === 'true' && !this._isZooming) {
              this._map.setView(this._user);
            }
            // Updating debug info
            this.updateDebugUI();
          }
          resolve();
        }, resolve, options);
      } else {
        this._notification.raise(this.nls.notif('geolocationError'));
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
      const osm = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 21,
        maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
        minZoom: 2 // Don't allow dezooming too far from map so it always stay fully visible
      });
      const esri = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri Imagery</a>',
        maxZoom: 21,
        maxNativeZoom: 19, // To ensure tiles are not unloaded when zooming after 19
        minZoom: 2 // Don't allow dezooming too far from map so it always stay fully visible
      });
      // Prevent panning outside of the world's edge
      this._map.setMaxBounds(Utils.MAP_BOUNDS);
      // Add layer group to interface
      const baseMaps = {};
      baseMaps[`<p>${this.nls.map('planLayer')}</p>`] = osm;
      baseMaps[`<p>${this.nls.map('satLayer')}</p>`] = esri;
      // Append layer depending on user preference
      if (Utils.getPreference('map-plan-layer') === 'true') {
        osm.addTo(this._map);
      } else {
        esri.addTo(this._map);
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
      document.getElementById('user-profile').addEventListener('click', this.userProfileModal.bind(this));
      document.getElementById('about').addEventListener('click', this.aboutModal.bind(this));
      document.getElementById('hide-show').addEventListener('click', this.hidShowModal.bind(this));
      document.getElementById('center-on').addEventListener('click', this.toggleFocusLock.bind(this));
      document.getElementById('overlay').addEventListener('click', this.closeModal.bind(this));
      // Subscribe to click event on map to react
      this._map.on('click', this.mapClicked.bind(this));
      // Map is dragged by user mouse/finger
      this._map.on('drag', () => {
        // Constrain pan to the map bounds
        this._map.panInsideBounds(Utils.MAP_BOUNDS, { animate: true });
        // Disable lock focus if user drags the map
        if (Utils.getPreference('map-center-on-user') === 'true') {
          this.toggleFocusLock();
        }
      });
      // Map events
      this._map.on('zoomstart', () => {
        this._isZooming = true;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          this.setMarkerCircles(this._marks.spot, false);
          this.setMarkerCircles(this._marks.store, false);
          this.setMarkerCircles(this._marks.bar, false);
          this.setMarkerCircles([this._user], false);
          this.setMarkerCircles([{ circle: this._user.range }], false);
        }
      });
      this._map.on('zoomend', () => {
        this._isZooming = false;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          if (this._map.getZoom() >= 15) {
            this.setMarkerCircles(this._marks.spot, true);
            this.setMarkerCircles(this._marks.store, true);
            this.setMarkerCircles(this._marks.bar, true);
            this.setMarkerCircles([this._user], true);
            this.setMarkerCircles([{ circle: this._user.range }], true);
          }
        }
        // Auto hide labels if zoom level is too high (and restore it when needed)
        if (Utils.getPreference('poi-marker-label') === 'true') {
          if (this._map.getZoom() < 15) {
            this.setMarkerLabels(this._marks.spot, false);
            this.setMarkerLabels(this._marks.store, false);
            this.setMarkerLabels(this._marks.bar, false);
          } else {
            this.setMarkerLabels(this._marks.spot, true);
            this.setMarkerLabels(this._marks.store, true);
            this.setMarkerLabels(this._marks.bar, true);
          }
        }
        // Updating debug info
        this.updateDebugUI();
      });
      this._map.on('baselayerchange', event => {
        const planActive = (Utils.stripDom(event.name) === this.nls.map('planLayer'));
        Utils.setPreference('map-plan-layer', planActive);
      });
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
      const clusterOptions = {
        animateAddingMarkers: true,
        disableClusteringAtZoom: 18,
        spiderfyOnMaxZoom: false
      };
      this._clusters.spot = new window.L.MarkerClusterGroup(clusterOptions);
      this._clusters.store = new window.L.MarkerClusterGroup(clusterOptions);
      this._clusters.bar = new window.L.MarkerClusterGroup(clusterOptions);
      // Append clusters to the map depending on user preferences
      if (Utils.getPreference(`poi-show-spot`) === 'true') {
        this._map.addLayer(this._clusters.spot);
      }
      if (Utils.getPreference(`poi-show-store`) === 'true') {
        this._map.addLayer(this._clusters.store);
      }
      if (Utils.getPreference(`poi-show-bar`) === 'true') {
        this._map.addLayer(this._clusters.bar);
      }
      // Load data from local storage, later to be fetched from server
      const iterateMarkers = mark => {
        this.markPopupFactory(mark).then(dom => {
          mark.dom = dom;
          mark.marker = this.placeMarker(mark);
          this._marks[mark.type].push(mark);
          this._clusters[mark.type].addLayer(mark.marker);
        });
      };
      let marks = JSON.parse(Utils.getPreference('saved-spot')) || [];
      for (let i = 0; i < marks.length; ++i) {
        iterateMarkers(marks[i]);
      }
      marks = JSON.parse(Utils.getPreference('saved-store')) || [];
      for (let i = 0; i < marks.length; ++i) {
        iterateMarkers(marks[i]);
      }
      marks = JSON.parse(Utils.getPreference('saved-bar')) || [];
      for (let i = 0; i < marks.length; ++i) {
        iterateMarkers(marks[i]);
      }

      resolve();
    });
  }


  // ======================================================================== //
  // ------------------------- Toggle for map items ------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name toggleFocusLock
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleFocusLock() method will, depending on user preference, lock or unlock
   * the map centering around the user marker at each position refresh. This way the user
   * can roam while the map is following its position.
   * </blockquote>
   **/
  toggleFocusLock() {
    if (Utils.getPreference('map-center-on-user') === 'true') {
      document.getElementById('center-on').classList.remove('lock-center-on');
      Utils.setPreference('map-center-on-user', 'false');
    } else {
      document.getElementById('center-on').classList.add('lock-center-on');
      this._map.flyTo([this._user.lat, this._user.lng], 18);
      Utils.setPreference('map-center-on-user', 'true');
    }
  }


  /**
   * @method
   * @name toggleLabel
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleLabel() method will, depending on user preference, display or not
   * the labels attached to spots/stores/bars marks. This label is basically the
   * mark name given by its creator.
   * </blockquote>
   **/
  toggleLabel() {
    const visible = !(Utils.getPreference('poi-marker-label') === 'true');
    this.setMarkerLabels(this._marks.spot, visible);
    this.setMarkerLabels(this._marks.store, visible);
    this.setMarkerLabels(this._marks.bar, visible);
    Utils.setPreference('poi-marker-label', visible);
  }


  /**
   * @method
   * @name toggleCircle
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleCircle() method will, depending on user preference, display or not
   * the circles around the spots/stores/bars marks. This circle indicates the minimal
   * distance which allow the user to make updates on the mark information
   * </blockquote>
   **/
  toggleCircle() {
    const visible = !(Utils.getPreference('poi-show-circle') === 'true');
    this.setMarkerCircles(this._marks.spot, visible);
    this.setMarkerCircles(this._marks.store, visible);
    this.setMarkerCircles(this._marks.bar, visible);
    this.setMarkerCircles([this._user], visible);
    this.setMarkerCircles([{ circle: this._user.range }], visible);
    Utils.setPreference('poi-show-circle', visible);
  }


  /**
   * @method
   * @name toggleMarkers
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleMarkers() method will, depending on user preference, display or not
   * a given mark type. This way, the user can fine tune what is displayed on the map.
   * A mark type in spots/stores/bars must be given as an argument
   * </blockquote>
   * @param {String} type The mark type in spots/tores/bars
   **/
  toggleMarkers(type) {
    const visible = !(Utils.getPreference(`poi-show-${type}`) === 'true');
    if (visible === true) {
      this._map.addLayer(this._clusters[type]);
    } else {
      this._map.removeLayer(this._clusters[type]);
    }
    Utils.setPreference(`poi-show-${type}`, visible);
  }


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
    this._initGeolocation().then(this.updateDebugUI.bind(this));
  }


  /**
   * @method
   * @name toggleDebug
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleDebug() method will, depending on user preference, add or remove
   * the debug DOM element to the user interface. The debug DOM display several
   * useful information to identify an issue with the geolocation API
   * </blockquote>
   **/
  toggleDebug() {
    const visible = !window.DEBUG;
    window.DEBUG = visible;
    Utils.setPreference('app-debug', visible);
    if (visible) {
      this.addDebugUI();
    } else {
      this.removeDebugUI();
    }
  }


  // ======================================================================== //
  // ----------------- App modals display and interaction ------------------- //
  // ======================================================================== //


  newMarkModal(dom) {
    document.getElementById('overlay').appendChild(dom);
    document.getElementById('overlay').style.display = 'flex';
    setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
  }


  editMarkModal(options) {
    Utils.fetchTemplate(`assets/html/modal/edit${options.type}.html`).then(dom => {
      const name = dom.querySelector(`#${options.type}-name`);
      const description = dom.querySelector(`#${options.type}-desc`);
      const submit = dom.querySelector(`#${options.type}-submit`);
      const cancel = dom.querySelector(`#${options.type}-cancel`);
      const rate = dom.querySelector(`#${options.type}-rating`);
      const rating = new Rating(rate, options.rate);
      // Update nls for template
      Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal(`${options.type}EditTitle`));
      Utils.replaceString(dom.querySelector(`#nls-${options.type}-name`), `{{${options.type.toUpperCase()}_NAME}}`, this.nls[options.type]('nameLabel'));
      Utils.replaceString(dom.querySelector(`#nls-${options.type}-desc`), `{{${options.type.toUpperCase()}_DESC}}`, this.nls[options.type]('descLabel'));
      Utils.replaceString(dom.querySelector(`#nls-${options.type}-rate`), `{{${options.type.toUpperCase()}_RATE}}`, this.nls[options.type]('rateLabel'));
      Utils.replaceString(submit, `{{${options.type.toUpperCase()}_SUBMIT}}`, this.nls.nav('add'));
      Utils.replaceString(cancel, `{{${options.type.toUpperCase()}_CANCEL}}`, this.nls.nav('cancel'));
      name.value = options.name;
      description.value = options.description;
      submit.addEventListener('click', () => {
        // Iterate through marks to find matching one (by coord as marks coordinates are unique)
        for (let i = 0; i < this._marks[options.type].length; ++i) {
          // We found, remove circle, label and marker from map/clusters
          if (options.lat === this._marks[options.type][i].lat && options.lng === this._marks[options.type][i].lng) {
            this._marks[options.type][i].name = name.value;
            this._marks[options.type][i].description = description.value;
            this._marks[options.type][i].rate = rating.currentRate;
            options.tooltip.removeFrom(this.map);
            this.markPopupFactory(options).then(dom => {
              options.dom = dom;
              options.marker.setPopupContent(options.dom);
            });
            break;
          }
        }
        // Format marks to be saved and then update user preference with
        const formattedMarks = [];
        for (let i = 0; i < this._marks[options.type].length; ++i) {
          formattedMarks.push(this.formatSavedMarker(this._marks[options.type][i]));
        }
        Utils.setPreference(`saved-${options.type}`, JSON.stringify(formattedMarks));
        // Notify user through UI that marker has been successfully deleted
        this._notification.raise(this.nls.notif(`${options.type}Deleted`));
        this.closeModal(null, true);
      });

      cancel.addEventListener('click', this.closeModal.bind(this, null, true));
      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
    });
  }


  /**
   * @method
   * @name deleteMarkModal
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * The deleteMarkModal() method will request the mark delete modal, which prompts
   * the user a confirmation to actually delete the mark
   * </blockquote>
   * @param {Function} cb The function to callback with true or false depending on user's choice
   **/
  deleteMarkModal(cb) {
    Utils.fetchTemplate('assets/html/modal/deletemark.html').then(dom => {
      // Update nls for template
      Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('deleteMarkTitle'));
      Utils.replaceString(dom.querySelector(`#nls-modal-desc`), `{{MODAL_DESC}}`, this.nls.modal('deleteMarkDesc'));
      Utils.replaceString(dom.querySelector(`#cancel-close`), `{{MODAL_CANCEL}}`, this.nls.nav('cancel'));
      Utils.replaceString(dom.querySelector(`#delete-close`), `{{MODAL_DELETE}}`, this.nls.nav('delete'));
      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      // Setup callback for confirm/cancel buttons
      document.getElementById('cancel-close').addEventListener('click', e => {
        this.closeModal(e);
        cb(false);
      }, false);
      document.getElementById('delete-close').addEventListener('click', e => {
        this.closeModal(e);
        cb(true);
      }, false);
      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
    });
  }


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
    Utils.fetchTemplate('assets/html/modal/user.html').then(dom => {
      // Update nls for template
      Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('userTitle'));
      Utils.replaceString(dom.querySelector(`#nls-user-modal-accuracy`), `{{ACCURACY_USER_MODAL}}`, this.nls.modal('userAccuracyPref'));
      Utils.replaceString(dom.querySelector(`#nls-user-modal-debug`), `{{DEBUG_USER_MODAL}}`, this.nls.modal('userDebugPref'));

      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      // Init modal checkbox state according to local storage preferences
      if (Utils.getPreference('map-high-accuracy') === 'true') {
        document.getElementById('high-accuracy-toggle').checked = true;
      }

      if (window.DEBUG === true || (Utils.getPreference('app-debug') === 'true')) {
        document.getElementById('debug-toggle').checked = true;
      }

      document.getElementById('high-accuracy-toggle').addEventListener('change', this.toggleHighAccuracy.bind(this));
      document.getElementById('debug-toggle').addEventListener('change', this.toggleDebug.bind(this));

      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
    });
  }


  /**
   * @method
   * @name aboutModal
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The aboutModal() method will request the about modal, which contains
   * information about BeerCrackerz, cookies/tracking policies and links
   * </blockquote>
   **/
  aboutModal() {
    Utils.fetchTemplate('assets/html/modal/about.html').then(dom => {
      // Update nls for template
      Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('aboutTitle'));
      Utils.replaceString(dom.querySelector(`#nls-modal-desc`), `{{MODAL_DESC}}`, this.nls.modal('aboutDesc'));

      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
    });
  }


  /**
   * @method
   * @name hidShowModal
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The hidShowModal() method will request the hide show modal, which all
   * toggles for map elements ; labels/circles/spots/stores/bars
   * </blockquote>
   **/
  hidShowModal() {
    Utils.fetchTemplate('assets/html/modal/hideshow.html').then(dom => {
      // Update template nls
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('hideShowTitle'));
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-labels`), `{{LABELS_HIDESHOW_MODAL}}`, this.nls.modal('hideShowLabels'));
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-circles`), `{{CIRCLES_HIDESHOW_MODAL}}`, this.nls.modal('hideShowCircles'));
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-spots`), `{{SPOTS_HIDESHOW_MODAL}}`, this.nls.modal('hideShowSpots'));
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-stores`), `{{STORES_HIDESHOW_MODAL}}`, this.nls.modal('hideShowStores'));
      Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-bars`), `{{BARS_HIDESHOW_MODAL}}`, this.nls.modal('hideShowBars'));
      Utils.replaceString(dom.querySelector(`#modal-close-button`), `{{MODAL_CLOSE}}`, this.nls.nav('close'));
      document.getElementById('overlay').appendChild(dom);
      document.getElementById('overlay').style.display = 'flex';
      // Init modal checkbox state according to local storage preferences
      if (Utils.getPreference('poi-marker-label') === 'true') {
        document.getElementById('label-toggle').checked = true;
      }

      if (Utils.getPreference('poi-show-circle') === 'true') {
        document.getElementById('circle-toggle').checked = true;
      }

      if (Utils.getPreference('poi-show-spot') === 'true') {
        document.getElementById('show-spots').checked = true;
      }

      if (Utils.getPreference('poi-show-store') === 'true') {
        document.getElementById('show-stores').checked = true;
      }

      if (Utils.getPreference('poi-show-bar') === 'true') {
        document.getElementById('show-bars').checked = true;
      }

      document.getElementById('label-toggle').addEventListener('change', this.toggleLabel.bind(this));
      document.getElementById('circle-toggle').addEventListener('change', this.toggleCircle.bind(this));
      document.getElementById('show-spots').addEventListener('change', this.toggleMarkers.bind(this, 'spot'));
      document.getElementById('show-stores').addEventListener('change', this.toggleMarkers.bind(this, 'store'));
      document.getElementById('show-bars').addEventListener('change', this.toggleMarkers.bind(this, 'bar'));

      setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
    });
  }


  /**
   * @method
   * @name closeModal
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The closeModal() method will close any opened modal if the click event is
   * targeted on the modal overlay or on close buttons
   * </blockquote>
   * @param {Event} event The click event
   **/
  closeModal(event, force) {
    if (force === true || event.target.id === 'overlay' || event.target.id.indexOf('close') !== -1) {
      document.getElementById('overlay').style.opacity = 0;
      setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('overlay').innerHTML = '';
      }, 300);
    }
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
        this._newMarker = this.definePOI(event.latlng, this._markerSaved.bind(this));
      } else {
        this._notification.raise(this.nls.notif('newMarkerOutside'));
      }
    }
  }


  /**
   * @method
   * @name _markerSaved
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _markerSaved() method is the callback used when a marker is created and added
   * to the map. It is the last method of a new marker proccess.
   * </blockquote>
   * @param {Object} options The new marker options
   **/
  _markerSaved(options) {
    // Save marke in marks and clusters for the map
    this._marks[options.type].push(options);
    this._clusters[options.type].addLayer(options.marker);
    // Notify user that new marker has been saved
    this._notification.raise(this.nls.notif(`${options.type}Added`));
    // Update marker circles visibility according to user position
    this.updateMarkerCirclesVisibility();
    // Clear new marker to let user add other stuff
    this._newMarker = null;
    // Save new marker in local storage, later to be sent to the server
    const marks = JSON.parse(Utils.getPreference(`saved-${options.type}`)) || [];
    marks.push(this.formatSavedMarker(options));
    Utils.setPreference(`saved-${options.type}`, JSON.stringify(marks));
  }


  /**
   * @method
   * @name updateMarkerCirclesVisibility
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The updateMarkerCirclesVisibility() method will update the circle visibility for
   * all mark types (spots/stores/bars) and for the user marker
   * </blockquote>
   **/
  updateMarkerCirclesVisibility() {
    const _updateByType = data => {
      // Check spots in user's proximity
      for (let i = 0; i < data.length; ++i) {
        // Only update circles that are in user view
        if (this._map.getBounds().contains(data[i].marker.getLatLng())) {
          const marker = data[i].marker;
          const distance = Utils.getDistanceBetweenCoords([this._user.lat, this._user.lng], [marker.getLatLng().lat, marker.getLatLng().lng]);
          // Only show if user distance to marker is under circle radius
          if (distance < Utils.CIRCLE_RADIUS && !data[i].circle.visible) {
            data[i].circle.visible = true;
            data[i].circle.setStyle({
              opacity: 1,
              fillOpacity: 0.1
            });
          } else if (distance >= Utils.CIRCLE_RADIUS && data[i].circle.visible) {
            data[i].circle.visible = false;
            data[i].circle.setStyle({
              opacity: 0,
              fillOpacity: 0
            });
          }
        }
      }
    };

    if (Utils.getPreference('poi-show-circle') === 'true') {
      _updateByType(this._marks.spot);
      _updateByType(this._marks.store);
      _updateByType(this._marks.bar);
      _updateByType([this._user]);
    }
  }


  // ======================================================================== //
  // -------------------------- Marker edition ------------------------------ //
  // ======================================================================== //


  /**
   * @method
   * @name formatSavedMarker
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * This method formats a mark returned from MapHelper so it can be parsed
   * using JSON.parse (in order to store it in local storage/database)
   * </blockquote>
   * @param {Object} mark The mark options from internal this._marks[type]
   **/
  formatSavedMarker(mark) {
    return {
      type: mark.type,
      lat: mark.lat,
      lng: mark.lng,
      name: mark.name,
      description: mark.description,
      user: mark.username || this.user.username,
      userId: mark.userId || this.user.id,
      dom: null,
      rate: mark.rate,
      marker: null,
      circle: null,
    };
  }


  /**
   * @method
   * @name editMarker
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
  editMarker(options) {
    this._map.closePopup();
    this.editMarkModal(options);
  }


  /**
   * @method
   * @name deleteMarker
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
  deleteMarker(options) {
    this.deleteMarkModal(confirm => {
      if (confirm === true) {
        // Iterate through marks to find matching one (by coord as marks coordinates are unique)
        const marks = this._marks[options.type];
        for (let i = 0; i < marks.length; ++i) {
          // We found, remove circle, label and marker from map/clusters
          if (options.lat === marks[i].lat && options.lng === marks[i].lng) {
            this.setMarkerCircles([ marks[i] ], false);
            this.setMarkerLabels([marks[i]], false);
            this._clusters[options.type].removeLayer(marks[i].marker);
            marks.splice(i, 1);
            break;
          }
        }
        // Update internal marks array
        this._marks[options.type] = marks;
        // Format marks to be saved and then update user preference with
        const formattedMarks = [];
        for (let i = 0; i < this._marks[options.type].length; ++i) {
          formattedMarks.push(this.formatSavedMarker(this._marks[options.type][i]));
        }
        Utils.setPreference(`saved-${options.type}`, JSON.stringify(formattedMarks));
        // Notify user through UI that marker has been successfully deleted
        this._notification.raise(this.nls.notif(`${options.type}Deleted`));
      }
    });
  }


  // ======================================================================== //
  // ---------------------------- Debug methods ----------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name addDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The addDebugUI() method appends the debug DOM element to the document body
   * </blockquote>
   **/
  addDebugUI() {
    document.body.appendChild(this._debugElement);
  }


  /**
   * @method
   * @name removeDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The removeDebugUI() method remove the debug DOM element from the document body
   * </blockquote>
   **/
  removeDebugUI() {
    document.body.removeChild(this._debugElement);
  }


  /**
   * @method
   * @name updateDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The updateDebugUI() method will update informations held in the debug DOM
   * </blockquote>
   **/
  updateDebugUI() {
    const options = (Utils.getPreference('map-high-accuracy') === 'true') ? Utils.HIGH_ACCURACY : Utils.OPTIMIZED_ACCURACY;
    Utils.updateDebugInterface(this._debugElement, this._user, options);
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
   * Leaflet.js marks that holds spot/store/bar marks as subkeys
   **/
  get marks() {
    return this._marks;
  }


  /**
   * @public
   * @property {Object} user
   * The session user object
   **/
  get user() {
    return this._user;
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
