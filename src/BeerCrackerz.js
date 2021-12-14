import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';


class BeerCrackerz {
  constructor() {
		this._map = null;
		this._user = {
      lat: 48.853121540141096, // Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Paris Notre-Dame longitude
    };
		this._popupOpened = false;

		this._initGeolocation()
			.then(this._initMap.bind(this));		
  }


	// Use geolocation API to get user position if allowed
	_initGeolocation() {
		return new Promise(resolve => {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(position => {
					this._user.lat = position.coords.latitude;
					this._user.lng = position.coords.longitude;
					// TODO listen do position update, notify on map where user is
					resolve();
				}, resolve);
			} else {
				resolve();
			}
		});
	}


	_initMap() {
    // Use main div to inject OSM into
    this._map = L.map('beer-crakerz-map').setView([this._user.lat, this._user.lng], 18);
		// Subscribe to click event on map to react
    this._map.on('click', this._mapClicked.bind(this));
    // Add OSM credits to the map next to leaflet credits
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this._map);
  }


	_placeMarker(options) {
    const marker = MapHelper.placeMarker(options);
		marker.on('click', () => {
			this._popupOpened = true;
			this._map.setView(options, this._map.getZoom(), { animate: true, duration: 0.8 });
		});
	}


  _mapClicked(event) {
		if (this._popupOpened === true) {
			this._popupOpened = false;
			this._map.closePopup();
		} else {
			this._popupOpened = true;
			MapHelper.definePOI(event.latlng);
		}
  }


	get map() {
		return this._map;
	}


}


export default BeerCrackerz;
