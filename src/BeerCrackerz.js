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
			spots: [],
			stores: [],
			bars: []
		};

		this._isZooming = false;

		this._initDebug()
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
				MapHelper.setMarkerCircles(this._marks.spots, false);
				MapHelper.setMarkerCircles(this._marks.stores, false);
				MapHelper.setMarkerCircles(this._marks.bars, false);
			});
			window.BeerCrackerz.map.on('zoomend', () => {
				this._isZooming = false;
				MapHelper.setMarkerCircles(this._marks.spots, true);
				MapHelper.setMarkerCircles(this._marks.stores, true);
				MapHelper.setMarkerCircles(this._marks.bars, true);
			});
			
			resolve();
		});
	}


  // ======================================================================== //
  // ----------------- Events callbacks and public methods ------------------ //
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
		let visible = !(Utils.getPreference('poi-marker-label') === 'true');
		MapHelper.setMarkerLabels(this._marks.spots, visible);
		MapHelper.setMarkerLabels(this._marks.stores, visible);
		MapHelper.setMarkerLabels(this._marks.bars, visible);
		Utils.setPreference('poi-marker-label', visible);
	}


	toggleCircle() {
		let visible = !(Utils.getPreference('poi-show-circle') === 'true');
		MapHelper.setMarkerCircles(this._marks.spots, visible);
		MapHelper.setMarkerCircles(this._marks.stores, visible);
		MapHelper.setMarkerCircles(this._marks.bars, visible);
		Utils.setPreference('poi-show-circle', visible);
	}


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

			document.getElementById('label-toggle').addEventListener('change', this.toggleLabel.bind(this));
			document.getElementById('circle-toggle').addEventListener('change', this.toggleCircle.bind(this));

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
		if (e.target.id === 'overlay') {
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
			this._newMarker = MapHelper.definePOI(event.latlng);
			this._newMarker.addedCallback = this._markerSaved.bind(this);
		}
	}


	_markerSaved(options) {
		if (options.type === 'spot') {
      this._marks.spots.push(options);
    } else if (options.type === 'store') {
      this._marks.stores.push(options);
    } else if (options.type === 'bar') {
      this._marks.bars.push(options);
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
      _updateByType(this._marks.spots);
      _updateByType(this._marks.stores);
      _updateByType(this._marks.bars);
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