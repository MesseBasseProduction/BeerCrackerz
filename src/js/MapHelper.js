import Markers from './MarkerEnum.js';
import Utils from './Utils.js';


class MapHelper {
  
  
  constructor() {}


  static placeMarker(options) {
		let icon = Markers.black;
    if (options.type === 'store') {
      icon = Markers.red;
    } else if (options.type === 'spot') {
      icon = Markers.blue;
    }

    const marker = window.L.marker([options.lat, options.lng], { icon: icon })
      .addTo(window.BeerCrackerz.map);

    if (options.name) {
      marker.bindPopup(options.name);
    }

    return marker;
  }


  static definePOI(options) {
		const poiWrapper = document.createElement('DIV');
    const newSpot = document.createElement('BUTTON');
    const newStore = document.createElement('BUTTON');
    newSpot.innerHTML = 'Ajouter un spot';
    newStore.innerHTML = 'Ajouter un point de vente';
    poiWrapper.className = 'new-poi';
    poiWrapper.appendChild(newSpot);
    poiWrapper.appendChild(newStore);

    options.name = poiWrapper; // Update popup content with DOM elements
    const marker = MapHelper.placeMarker(options).openPopup();
    options.marker = marker; // Attach marker to option so it can be manipulated in clicked callbacks
    newSpot.addEventListener('click', () => { 
      marker.closePopup();
      MapHelper.defineNewSpot(options);
    });
    newStore.addEventListener('click', () => {
      marker.closePopup();
      MapHelper.defineNewStore(options);
    });
  }

  
  static defineNewSpot(options) {
    Utils.fetchTemplate('assets/html/newspot.html').then((dom) => {
      const name = dom.querySelector('#spot-name');
      const submit = dom.querySelector('#submit-spot');
      const cancel = dom.querySelector('#cancel-spot');
      submit.addEventListener('click', () => {
        options.name = name.value;
        options.type = 'spot';
        this._popupOpened = false;
        this._map.closePopup();
        this._placeMarker(options);
      });
      cancel.addEventListener('click', () => { 
        window.BeerCrackerz.map.removeLayer(options.marker);
        document.getElementById('aside').style.opacity = 0;
        setTimeout(() => document.getElementById('aside').innerHTML = '', 200); // Match CSS transition duration
      });
      // Append new DOM element at the end to keep its scope while building events and co.
      document.getElementById('aside').appendChild(dom);
      document.getElementById('aside').style.opacity = 1;
    });
  }


  static defineNewStore(options) {
    Utils.fetchTemplate('assets/html/newstore.html').then((dom) => {
      const name = dom.querySelector('#store-name');
      const submit = dom.querySelector('#submit-store');
      submit.addEventListener('click', () => {
        options.name = name.value;
        options.type = 'store';
        this._popupOpened = false;
        this._map.closePopup();
        this._placeMarker(options);
      });
      document.getElementById('aside').appendChild(dom);
    });
  }


}


export default MapHelper;