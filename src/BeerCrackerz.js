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
			stores: []
		};

    this._initGeolocation()
      .then(this._initMap.bind(this))
      .then(this._initCmdBar.bind(this));
  }


  // Use geolocation API to get user position if allowed
  _initGeolocation() {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
				navigator.geolocation.watchPosition((position) => {
					this._user.lat = position.coords.latitude;
					this._user.lng = position.coords.longitude;
					// Only draw marker if map is already created
					if (this._map) {
						MapHelper.drawUserMarker(this._user);
						this._updateMarkerCircles();
					}
					resolve();
				}, resolve);
      } else {
        resolve();
      }
    });
  }


  _initMap() {
		return new Promise(resolve => {
			// Use main div to inject OSM into
			this._map = window.L.map('beer-crakerz-map').setView([this._user.lat, this._user.lng], 18);
      // Add meter and feet scale on map
      window.L.control.scale().addTo(this._map);
			// Subscribe to click event on map to react
			this._map.on('click', this._mapClicked.bind(this));
			// Place user marker on the map
			MapHelper.drawUserMarker(this._user);
			// Add OSM credits to the map next to leaflet credits
			window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(this._map);
			resolve();
		});
  }


  _initCmdBar() {
		document.getElementById('focus-on').addEventListener('click', this.focusOnCmd.bind(this));
		document.getElementById('label-toggle').addEventListener('click', this.toggleLabel.bind(this));
		// Modal material
		document.getElementById('about').addEventListener('click', this.aboutCmd.bind(this));
		document.getElementById('overlay').addEventListener('click', this.closeModal.bind(this));

		if (Utils.getPreference('poi-circle-label') === 'true') {
      document.getElementById('label-toggle').classList.add('labels-on');
		}

    window.BeerCrackerz.map.on('zoomstart', () => {
			MapHelper.hideCircles(this._marks.spots);
			MapHelper.hideCircles(this._marks.stores);
    });
    window.BeerCrackerz.map.on('zoomend', () => {
      MapHelper.showCircles(this._marks.spots);
      MapHelper.showCircles(this._marks.stores);
    });
	}


	focusOnCmd() {
		this._map.flyTo([this._user.lat, this._user.lng], 18);
	}


	toggleLabel() {
		if (Utils.getPreference('poi-circle-label') === 'true') {
      document.getElementById('label-toggle').classList.remove('labels-on');
      MapHelper.setCircleLabels(this._marks.spots, false);
      MapHelper.setCircleLabels(this._marks.stores, false);
			Utils.setPreference('poi-circle-label', 'false');
    } else {
      document.getElementById('label-toggle').classList.add('labels-on');
      MapHelper.setCircleLabels(this._marks.spots, true);
      MapHelper.setCircleLabels(this._marks.stores, true);
			Utils.setPreference('poi-circle-label', 'true');
		}
	}


	aboutCmd() {
		Utils.fetchTemplate('assets/html/about.html').then(dom => {
			document.getElementById('overlay').appendChild(dom);
			document.getElementById('overlay').style.display = 'flex';
			setTimeout(() => document.getElementById('overlay').style.opacity = 1, 50);
		});
	}


	closeModal() {
		document.getElementById('overlay').style.opacity = 0;
		setTimeout(() => {
			document.getElementById('overlay').style.display = 'none';
			document.getElementById('overlay').innerHTML = '';
		}, 300);
	}


  _mapClicked(event) {
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
		}
		// Clear new marker to let user add other stuff
    this._newMarker = null;
	}


	_updateMarkerCircles() {
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

		_updateByType(this._marks.spots);
		_updateByType(this._marks.stores);
	}


  get map() {
    return this._map;
  }


	get user() {
		return this._user;
	}


}


export default BeerCrackerz;
