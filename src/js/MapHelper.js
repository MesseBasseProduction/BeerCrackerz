import Markers from './MarkerEnum.js';
import Utils from './Utils.js';


class MapHelper {
  
  
  constructor() {}


  static placeMarker(options) {
		let icon = Markers.black;
    if (options.type === 'store') {
      icon = Markers.blue;
    } else if (options.type === 'spot') {
      icon = Markers.green;
    } else if (options.type === 'user') {
      icon = Markers.user;
    }

    const marker = window.L.marker([options.lat, options.lng], { icon: icon })
      .addTo(window.BeerCrackerz.map);

    if (options.name) {
      marker.bindPopup(options.name);
    }

    return marker;
  }


  static drawUserMarker(options) {
    if (!options.marker) {
      options.type = 'user';
      options.marker = MapHelper.placeMarker(options);
    } else {
      options.marker.setLatLng(options);
    }
  }


  static definePOI(options) {
		const poiWrapper = document.createElement('DIV');
    const newSpot = document.createElement('BUTTON');
    const newStore = document.createElement('BUTTON');
    newSpot.innerHTML = 'Ajouter un spot';
    newStore.innerHTML = 'Ajouter un vendeur';
    poiWrapper.className = 'new-poi';
    poiWrapper.appendChild(newSpot);
    poiWrapper.appendChild(newStore);
    options.name = poiWrapper; // Update popup content with DOM elements
    const marker = MapHelper.placeMarker(options).openPopup();
    options.marker = marker; // Attach marker to option so it can be manipulated in clicked callbacks
    newSpot.addEventListener('click', () => { 
      marker.isBeingDefined = true;
      marker.closePopup();
      MapHelper.defineNewSpot(options);
    });
    newStore.addEventListener('click', () => {
      marker.isBeingDefined = true;
      marker.closePopup();
      MapHelper.defineNewStore(options);
    });
    marker.on('popupclose', () => {
      if (!marker.isBeingDefined) {
        marker.popupClosed = true;
        window.BeerCrackerz.map.removeLayer(marker);
      }
    });
    return marker;
  }

  
  static defineNewSpot(options) {
    Utils.fetchTemplate('assets/html/newspot.html').then(dom => {
      const name = dom.querySelector('#spot-name');
      const submit = dom.querySelector('#submit-spot');
      const cancel = dom.querySelector('#cancel-spot');
      const close = dom.querySelector('#close-aside');
      // Method to clear aside and hide it, and remove temporary marker on the map
      const _cleanDefineUI = () => {
        options.marker.isBeingDefined = false;
        window.BeerCrackerz.map.removeLayer(options.marker);
        document.getElementById('aside').style.opacity = 0;
        setTimeout(() => document.getElementById('aside').innerHTML = '', 200); // Match CSS transition duration
      };
      // Submit or cancel event subscriptions
      submit.addEventListener('click', () => {
        _cleanDefineUI();
        MapHelper.buildSpotUI(name.value).then((dom) => {
          options.name = dom;
          options.type = 'spot';
          MapHelper.placeMarker(options);
          options.marker.addedCallback(options);
        });
      });
      cancel.addEventListener('click', _cleanDefineUI);
      close.addEventListener('click', _cleanDefineUI);
      // Append new DOM element at the end to keep its scope while building events and co.
      document.getElementById('aside').innerHTML = '';
      document.getElementById('aside').appendChild(dom);
      document.getElementById('aside').style.opacity = 1;
    });
  }


  static defineNewStore(options) {
    Utils.fetchTemplate('assets/html/newstore.html').then(dom => {
      const name = dom.querySelector('#store-name');
      const submit = dom.querySelector('#submit-store');
      const cancel = dom.querySelector('#cancel-store');
      const close = dom.querySelector('#close-aside');
      // Method to clear aside and hide it, and remove temporary marker on the map
      const _cleanDefineUI = () => {
        options.marker.isBeingDefined = false;
        window.BeerCrackerz.map.removeLayer(options.marker);
        document.getElementById('aside').style.opacity = 0;
        setTimeout(() => document.getElementById('aside').innerHTML = '', 200); // Match CSS transition duration
      };
      // Submit or cancel event subscriptions
      submit.addEventListener('click', () => {
        _cleanDefineUI();
        MapHelper.buildStoreUI(name.value).then(dom => {
          options.name = dom;
          options.type = 'store';
          MapHelper.placeMarker(options);
          options.marker.addedCallback(options);
        });
      });
      cancel.addEventListener('click', _cleanDefineUI);
      close.addEventListener('click', _cleanDefineUI);
      // Append new DOM element at the end to keep its scope while building events and co.
      document.getElementById('aside').innerHTML = '';
      document.getElementById('aside').appendChild(dom);
      document.getElementById('aside').style.opacity = 1;
    });
  }


  static buildSpotUI(name) {
    return new Promise(resolve => {
      Utils.fetchTemplate('assets/html/spot.html').then(dom => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        element.innerHTML = element.innerHTML.replace('{{SPOT_NAME}}', Utils.stripDom(name));
        resolve(element);
      });
    });
  }


  static buildStoreUI(name) {
    return new Promise((resolve) => {
      Utils.fetchTemplate('assets/html/store.html').then((dom) => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        element.innerHTML = element.innerHTML.replace('{{STORE_NAME}}', Utils.stripDom(name));
        resolve(element);
      });
    });
  }


}


export default MapHelper;