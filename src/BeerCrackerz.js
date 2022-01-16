import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';
import LangManager from './js/LangManager.js';
import Utils from './js/Utils.js';


/**
 * @class
 * @constructor
 * @public
 * @extends MapHelper
 * @licence GPL-v3.0
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
		 * @type {boolean}
     * @private
     **/
    this._map = null;
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
      color: Utils.USER_COLOR, // The color to use for circle (match the user marker color)
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
    this._lang = new LangManager('en', this._init.bind(this)); // The BeerCrackerz app is only initialized once nls are set up
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
    this._initPreferences()
      .then(this._initGeolocation.bind(this))
      .then(this._initMap.bind(this))
      .then(this._initEvents.bind(this));
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
				console.error("Your browser doesn't implement the geolocation API. BeerCrackerz is unusable.");
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

			window.L.control.layers(baseMaps, {}, { position: 'bottomright' }).addTo(this._map);
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
				this.setMarkerCircles(this._marks.spot, false);
				this.setMarkerCircles(this._marks.store, false);
				this.setMarkerCircles(this._marks.bar, false);
				this.setMarkerCircles([this._user], false);
			});
			this._map.on('zoomend', () => {
        this._isZooming = false;
        this.setMarkerCircles(this._marks.spot, true);
        this.setMarkerCircles(this._marks.store, true);
        this.setMarkerCircles(this._marks.bar, true);
        this.setMarkerCircles([this._user], true);
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
		Utils.setPreference('poi-show-circle', visible);
		this.updateMarkerCirclesVisibility();
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
		for (let i = 0; i < this._marks[type].length; ++i) {
			if (visible === true) {
        this._marks[type][i].marker.addTo(this._map);
			} else {
        this._marks[type][i].marker.removeFrom(this._map);
			}
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
      Utils.replaceString(dom.querySelector(`#nls-user-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('userTitle'));
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
			Utils.replaceString(dom.querySelector(`#nls-about-modal-title`), `{{MODAL_TITLE}}`, this.nls.modal('aboutTitle'));
      Utils.replaceString(dom.querySelector(`#nls-about-modal-desc`), `{{DESC_ABOUT_MODAL}}`, this.nls.modal('aboutDesc'));
			
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
	closeModal(event) {
		if (event.target.id === 'overlay' || event.target.id.indexOf('close') !== -1) {
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
				console.log('New marker out of range');
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
		if (options.type === 'spot') {
      this._marks.spot.push(options);
    } else if (options.type === 'store') {
      this._marks.store.push(options);
    } else if (options.type === 'bar') {
      this._marks.bar.push(options);
    }
		// Update marker visibility according to preferences
		if (Utils.getPreference(`poi-show-${options.type}`) === 'false') {
			options.marker.removeFrom(this._map);
		}
		// Update marker circles visibility according to user position
		this.updateMarkerCirclesVisibility();
		// Clear new marker to let user add other stuff
		this._newMarker = null;
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
