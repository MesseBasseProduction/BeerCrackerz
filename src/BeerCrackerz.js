import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';
import Utils from './js/Utils.js';


class BeerCrackerz {


	constructor() {
		this._map = null;
		this._user = {
			lat: 48.853121540141096, // Paris Notre-Dame latitude
			lng: 2.3498955769881156, // Paris Notre-Dame longitude
			marker: null
		};
		this._newMarker = null; // This marker is temporary for New Spot/New Store mark only
		this._marks = {
			spot: [],
			store: [],
			bar: []
		};

		this._isZooming = false;

		this._initDebug()
      .then(this._initPreferences.bind(this))
      .then(this._initGeolocation.bind(this))
      .then(this._initMap.bind(this))
      .then(this._initEvents.bind(this));
	}


  // ======================================================================== //
  // ----------------- Application initialization sequence ------------------ //
  // ======================================================================== //


	_initDebug() {
		return new Promise(resolve => {
			if (window.DEBUG === true) {
				const debugContainer = document.createElement('DIV');
				const updatesAmount = document.createElement('P');
				const userLat = document.createElement('P');
				const userLng = document.createElement('P');
				debugContainer.classList.add('debug-container');
				updatesAmount.classList.add('debug-updates-amount');
				userLat.classList.add('debug-user-lat');
				userLng.classList.add('debug-user-lng');
				updatesAmount.innerHTML = '<b>Updates</b> : 0';
				debugContainer.appendChild(updatesAmount);
				debugContainer.appendChild(userLat);
				debugContainer.appendChild(userLng);
				document.body.appendChild(debugContainer);
			}
			resolve();
		});
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
			
			resolve();
		});
	}


	_initGeolocation() {
		return new Promise(resolve => {
			if ('geolocation' in navigator) {
				navigator.geolocation.watchPosition(position => {
					// Update saved user position
					this._user.lat = position.coords.latitude;
					this._user.lng = position.coords.longitude;
					// Only draw marker if map is already created
					if (this._map) {
						MapHelper.drawUserMarker(this._user);
						this.updateMarkerCirclesVisibility();
						// Update map position if focus lock is active
						if (Utils.getPreference('lock-center-on') === 'true' && !this._isZooming) {
							this._map.setView(this._user);
            }
					}
					// Updating debug info if url contains ?debug
					if (window.DEBUG === true) {
						const updates = parseInt(document.querySelector('.debug-updates-amount').innerHTML.split(' : ')[1]) + 1;
						document.querySelector('.debug-updates-amount').innerHTML = `<b>Updates</b> : ${updates}`;
						document.querySelector('.debug-user-lat').innerHTML = `<b>Lat</b> : ${this._user.lat}`;
						document.querySelector('.debug-user-lng').innerHTML = `<b>Lng</b> : ${this._user.lng}`;
					}
					resolve();
				}, resolve, {
					enableHighAccuracy: true, // More consuption, better results
					maximumAge: 30000, // A position will last 30s maximum
					timeout: 29000 // A position is update in 29s maximum
				});
      } else {
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
			MapHelper.drawUserMarker(this._user);
			// Add OSM credits to the map next to leaflet credits
			window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				minZoom: 2 // Don't allow dezooming too far from map
			}).addTo(this._map);
			// Prevent panning outside of the world's edge
			this._map.setMaxBounds(Utils.MAP_BOUNDS);
			resolve();
		});
	}


	_initEvents() {
		return new Promise(resolve => {
			document.getElementById('center-on').addEventListener('click', this.toggleFocusLock.bind(this));
			document.getElementById('hide-show').addEventListener('click', this.hidShowModal.bind(this));
			// Modal material
			document.getElementById('about').addEventListener('click', this.aboutModal.bind(this));
			document.getElementById('overlay').addEventListener('click', this.closeModal.bind(this));
			// Map is dragged by user mouse/finger
			this._map.on('drag', () => {
				// Constrain pan to the map bounds
				this._map.panInsideBounds(Utils.MAP_BOUNDS, { animate: true });
				// Disable lock focus if user drags the map
				if (Utils.getPreference('lock-center-on') === 'true') {
					this.toggleFocusLock();
				}
			});

			if (Utils.getPreference('lock-center-on') === 'true') {
				document.getElementById('center-on').classList.add('lock-center-on');
			}

			window.BeerCrackerz.map.on('zoomstart', () => {
				this._isZooming = true;
				MapHelper.setMarkerCircles(this._marks.spot, false);
				MapHelper.setMarkerCircles(this._marks.store, false);
				MapHelper.setMarkerCircles(this._marks.bar, false);
			});
			window.BeerCrackerz.map.on('zoomend', () => {
				this._isZooming = false;
				MapHelper.setMarkerCircles(this._marks.spot, true);
				MapHelper.setMarkerCircles(this._marks.store, true);
				MapHelper.setMarkerCircles(this._marks.bar, true);
			});
			
			resolve();
		});
	}


  // ======================================================================== //
  // ------------------------- Toggle for map items ------------------------- //
  // ======================================================================== //	


	toggleFocusLock() {
		if (Utils.getPreference('lock-center-on') === 'true') {
			document.getElementById('center-on').classList.remove('lock-center-on');
			Utils.setPreference('lock-center-on', 'false');
		} else {
			document.getElementById('center-on').classList.add('lock-center-on');
			this._map.flyTo([this._user.lat, this._user.lng], 18);
			Utils.setPreference('lock-center-on', 'true');
		}
	}


	toggleLabel() {
		const visible = !(Utils.getPreference('poi-marker-label') === 'true');
		MapHelper.setMarkerLabels(this._marks.spot, visible);
		MapHelper.setMarkerLabels(this._marks.store, visible);
		MapHelper.setMarkerLabels(this._marks.bar, visible);
		Utils.setPreference('poi-marker-label', visible);
	}


	toggleCircle() {
		const visible = !(Utils.getPreference('poi-show-circle') === 'true');
		MapHelper.setMarkerCircles(this._marks.spot, visible);
		MapHelper.setMarkerCircles(this._marks.store, visible);
		MapHelper.setMarkerCircles(this._marks.bar, visible);
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


  // ======================================================================== //
  // ----------------- App modals display and interaction ------------------- //
  // ======================================================================== //	


	hidShowModal() {
		Utils.fetchTemplate('assets/html/hideshow.html').then(dom => {
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

			document.getElementById('modal-close').addEventListener('click', this.closeModal.bind(this));
			document.getElementById('modal-close-button').addEventListener('click', this.closeModal.bind(this));
			document.getElementById('label-toggle').addEventListener('change', this.toggleLabel.bind(this));
			document.getElementById('circle-toggle').addEventListener('change', this.toggleCircle.bind(this));
			document.getElementById('show-spots').addEventListener('change', this.toggleMarkers.bind(this, 'spot'));
			document.getElementById('show-stores').addEventListener('change', this.toggleMarkers.bind(this, 'store'));
			document.getElementById('show-bars').addEventListener('change', this.toggleMarkers.bind(this, 'bar'));

			setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
		});
	}


	aboutModal() {
		Utils.fetchTemplate('assets/html/about.html').then(dom => {
			document.getElementById('overlay').appendChild(dom);
			document.getElementById('overlay').style.display = 'flex';
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


	mapClicked(event) {
		if (this._newMarker && this._newMarker.popupClosed) {
			// Avoid to open new marker right after popup closing
			this._newMarker = null;
		} else if (this._newMarker === null || !this._newMarker.isBeingDefined) {
			// Only create new marker if none is in progress
			this._newMarker = MapHelper.definePOI(event.latlng, this._markerSaved.bind(this));
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
							fillOpacity: 0.1,
						});
					} else if (distance >= Utils.CIRCLE_RADIUS && data[i].circle.visible) {
						data[i].circle.visible = false;
						data[i].circle.setStyle({
							opacity: 0,
							fillOpacity: 0,
						});
					}
				}
			}
		};

		if (Utils.getPreference('poi-show-circle') === 'true') {
      _updateByType(this._marks.spot);
      _updateByType(this._marks.store);
      _updateByType(this._marks.bar);
    }
	}


	get map() {
		return this._map;
	}


	get user() {
		return this._user;
	}


}


export default BeerCrackerz;