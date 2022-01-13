import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';
import LangManager from './js/LangManager.js';
import Utils from './js/Utils.js';


class BeerCrackerz extends MapHelper {


	constructor() {
		super();
		this._map = null;
		this._user = {
			lat: 48.853121540141096, // Paris Notre-Dame latitude
			lng: 2.3498955769881156, // Paris Notre-Dame longitude
			accuracy: 0,
			marker: null,
			circle: null,
			color: Utils.USER_COLOR
		};
		this._newMarker = null; // This marker is temporary for New Spot/New Store mark only
		this._marks = {
			spot: [],
			store: [],
			bar: []
		};

		this._watchId = null;
		this._isZooming = false;
		this._debugElement = null;

		this._lang = new LangManager('en', this._init.bind(this));		
	}


  // ======================================================================== //
  // ----------------- Application initialization sequence ------------------ //
  // ======================================================================== //


	_init() {
		this._debugElement = Utils.initDebugInterface();
    this._initPreferences()
      .then(this._initGeolocation.bind(this))
      .then(this._initMap.bind(this))
      .then(this._initEvents.bind(this));
	}


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


	_initMap() {
		return new Promise(resolve => {
			// Use main div to inject OSM into
			this._map = window.L.map('beer-crakerz-map', {
				zoomControl: false,
			}).setView([this._user.lat, this._user.lng], 18);
			// Add meter and feet scale on map
			window.L.control.scale().addTo(this._map);
			// Subscribe to click event on map to react
			this._map.on('click', this.mapClicked.bind(this));
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


	_initEvents() {
		return new Promise(resolve => {
			// Command events
			document.getElementById('user-profile').addEventListener('click', this.userProfileModal.bind(this));
			document.getElementById('about').addEventListener('click', this.aboutModal.bind(this));
			document.getElementById('hide-show').addEventListener('click', this.hidShowModal.bind(this));
			document.getElementById('center-on').addEventListener('click', this.toggleFocusLock.bind(this));
			document.getElementById('overlay').addEventListener('click', this.closeModal.bind(this));
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


	toggleLabel() {
		const visible = !(Utils.getPreference('poi-marker-label') === 'true');
		this.setMarkerLabels(this._marks.spot, visible);
		this.setMarkerLabels(this._marks.store, visible);
		this.setMarkerLabels(this._marks.bar, visible);
		Utils.setPreference('poi-marker-label', visible);
	}


	toggleCircle() {
		const visible = !(Utils.getPreference('poi-show-circle') === 'true');
		this.setMarkerCircles(this._marks.spot, visible);
		this.setMarkerCircles(this._marks.store, visible);
		this.setMarkerCircles(this._marks.bar, visible);
		this.setMarkerCircles([this._user], visible);
		Utils.setPreference('poi-show-circle', visible);
		this.updateMarkerCirclesVisibility();
	}


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


	toggleHighAccuracy() {
		const high = !(Utils.getPreference('map-high-accuracy') === 'true');
		Utils.setPreference('map-high-accuracy', high);
		navigator.geolocation.clearWatch(this._watchId);
		this._initGeolocation().then(this.updateDebugUI.bind(this));
	}


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


	closeModal(e) {
		if (e.target.id === 'overlay' || e.target.id.indexOf('close') !== -1) {
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


	addDebugUI() {
		document.body.appendChild(this._debugElement);
	}


	removeDebugUI() {
		document.body.removeChild(this._debugElement);
	}


	updateDebugUI() {
		const options = (Utils.getPreference('map-high-accuracy') === 'true') ? Utils.HIGH_ACCURACY : Utils.OPTIMIZED_ACCURACY;
		Utils.updateDebugInterface(this._debugElement, this._user, options);
	}


  // ======================================================================== //
  // ---------------------------- Class accessors --------------------------- //
  // ======================================================================== //	


	get map() {
		return this._map;
	}


	get user() {
		return this._user;
	}


	get nls() {
		return this._lang;
	}	


}


export default BeerCrackerz;