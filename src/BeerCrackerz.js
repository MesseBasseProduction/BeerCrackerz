import './BeerCrackerz.scss';
import Markers from './js/MarkerEnum.js';


class BeerCrackerz {
  constructor() {
		this._map = null;
		this._coords = {
      lat: 48.853121540141096, // Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Paris Notre-Dame longitude
      zoom: 12, // Default zoom is wide enough
    };
		this._popupOpened = false;

		this._initPosition()
			.then(this._initMap.bind(this));		
  }


	// Use geolocation API to get user position if allowed
	_initPosition() {
		return new Promise(resolve => {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(position => {
					this._coords.lat = position.coords.latitude;
					this._coords.lng = position.coords.longitude;
					this._coords.zoom = 18; // Set zoom to max val so user can properly see its position in map
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
    this._map = L.map('beer-crakerz-map').setView([this._coords.lat, this._coords.lng], this._coords.zoom);
		// Subscribe to click event on map to react
    this._map.on('click', this._mapClicked.bind(this));
    // Add OSM credits to the map next to leaflet credits
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(this._map);
  }


	_placeMarker(options) {
		let icon = Markers.black;
		if (options.type === 'store') {
			icon = Markers.red;
		}

    const marker = L.marker([options.lat, options.lng], { icon: icon })
      .addTo(this._map)
      .bindPopup(options.name);

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
	    this._newPOI(event.latlng);
		}
  }


	_newPOI(options) {
		const addSpot = () => {
			this._fetchTemplate('assets/html/newspot.html').then(dom => {
				const name = dom.querySelector('#spot-name');
				const submit = dom.querySelector('#submit-spot');
				submit.addEventListener('click', () => {
					options.name = name.value;
					options.type = 'spot';
					this._popupOpened = false;
					this._map.closePopup();
					this._placeMarker(options);
				});
				pop.setContent(dom);
			});
		};

		const addStore = () => {
			this._fetchTemplate('assets/html/newstore.html').then((dom) => {
        const name = dom.querySelector('#store-name');
        const submit = dom.querySelector('#submit-store');
        submit.addEventListener('click', () => {
          options.name = name.value;
					options.type = 'store';
					this._popupOpened = false;
          this._map.closePopup();
          this._placeMarker(options);
        });
        pop.setContent(dom);
      });
		};

		const poiWrapper = document.createElement('DIV');
		const newSpot = document.createElement('BUTTON');
		const newStore = document.createElement('BUTTON');
		newSpot.innerHTML = 'Ajouter un spot';
		newStore.innerHTML = 'Ajouter un point de vente';
		newSpot.addEventListener('click', addSpot);
		newStore.addEventListener('click', addStore);
		poiWrapper.appendChild(newSpot);
		poiWrapper.appendChild(newStore);

		const pop = L.popup({
      className: 'new-poi'
    }).setLatLng(options)
      .setContent(poiWrapper)
      .openOn(this._map);	
	}


	_buildNewStorePopupUI() {
		return ``;
	}


	_fetchTemplate(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(data => {
					data.text().then(htmlString => {
						resolve(document.createRange().createContextualFragment(htmlString));
					}).catch(reject);
			}).catch(reject);
		});
	}


}


export default BeerCrackerz;
