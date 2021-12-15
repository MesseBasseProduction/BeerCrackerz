import './BeerCrackerz.scss';
import MapHelper from './js/MapHelper.js';


class BeerCrackerz {


  constructor() {
    this._map = null;
    this._user = {
      lat: 48.853121540141096, // Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Paris Notre-Dame longitude
			marker: null
    };
    this._newMarker = null;

    this._initMap()
      .then(this._initGeolocation.bind(this))
      .then(this._initCmdBar.bind(this));
  }


  // Use geolocation API to get user position if allowed
  _initGeolocation() {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this._user.lat = position.coords.latitude;
          this._user.lng = position.coords.longitude;
					MapHelper.drawUserMarker(this._user);
					this._map.setView([this._user.lat, this._user.lng], 18);

					navigator.geolocation.watchPosition(position => {
						this._user.lat = position.coords.latitude;
						this._user.lng = position.coords.longitude;
						MapHelper.drawUserMarker(this._user);
          });

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
    // TODO Save dat server side with user info and stuff
    console.log(options);
    this._newMarker = null;
  }


  get map() {
    return this._map;
  }


}


export default BeerCrackerz;
