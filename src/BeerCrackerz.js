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
		document.getElementById('focus-on').addEventListener('click', this._focusOn.bind(this));
	}


	_focusOn() {
		this._map.setView([this._user.lat, this._user.lng], this._map.getZoom());
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
		// Check spots in user's proximity
		for (let i = 0; i < this._marks.spots.length; ++i) {
			// Only update circles that are in user view
			if (this._map.getBounds().contains(this._marks.spots[i].marker.getLatLng())) {
				const marker = this._marks.spots[i].marker;
				const distance = Utils.getDistanceBetweenCoords([this._user.lat, this._user.lng], [marker.getLatLng().lat, marker.getLatLng().lng]);
				// Only show if user distance to marker is under circle radius
				if (distance < 40) {
					this._marks.spots[i].circle.setStyle({
            opacity: 1,
            fillOpacity: 0.3
          });
				} else {
					this._marks.spots[i].circle.setStyle({
            opacity: 0,
            fillOpacity: 0
          });					
				}
			}
		}
		// Do aswell for stores
		for (let i = 0; i < this._marks.stores.length; ++i) {
			// Only update circles that are in user view
			if (this._map.getBounds().contains(this._marks.stores[i].marker.getLatLng())) {
				const marker = this._marks.stores[i].marker;
				const distance = Utils.getDistanceBetweenCoords([this._user.lat, this._user.lng], [marker.getLatLng().lat, marker.getLatLng().lng]);
				// Only show if user distance to marker is under circle radius
				if (distance < 40) {
					this._marks.stores[i].circle.setStyle({
            opacity: 1,
            fillOpacity: 0.3,
          });
				} else {
					this._marks.stores[i].circle.setStyle({
            opacity: 0,
            fillOpacity: 0,
          });					
				}
			}
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
