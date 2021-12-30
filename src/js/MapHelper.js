import Markers from './MarkerEnum.js';
import Rating from './Rating.js';
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
      .addTo(window.BeerCrackerz.map)
      .on('click', () => {
        window.BeerCrackerz.map.flyTo([options.lat, options.lng], 18);
      });

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
      const description = dom.querySelector('#spot-desc');
      const submit = dom.querySelector('#submit-spot');
      const cancel = dom.querySelector('#cancel-spot');
      const close = dom.querySelector('#close-aside');
      const starRating = new Rating(dom.querySelector('#star-rating'));
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
        MapHelper.buildSpotUI(name.value, options).then((dom) => {
          options.type = 'spot';
          options.name = dom;
          options.description = description.value;
          options.rate = starRating.currentRate;
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
      const dollarRating = new Rating(dom.querySelector('#price-rating'));
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
        MapHelper.buildStoreUI(name.value, options).then(dom => {
          options.type = 'store';
          options.name = dom;
          options.price = dollarRating.currentRate;
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


  static buildSpotUI(name, options) {
    return new Promise(resolve => {
      Utils.fetchTemplate('assets/html/spot.html').then(dom => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        element.innerHTML = element.innerHTML.replace('{{SPOT_NAME}}', Utils.stripDom(name));
        element.innerHTML = element.innerHTML.replace('{{SPOT_LAT}}', options.lat);
        element.innerHTML = element.innerHTML.replace('{{SPOT_LNG}}', options.lng);
        // Append circle around marker
        options.color = '#26ad23';
        options.circle = MapHelper.drawCircle(options);

        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(name)
          .setLatLng(options.circle.getLatLng());

        if (Utils.getPreference('poi-circle-label') === 'true') {
          options.tooltip.addTo(window.BeerCrackerz.map);
        }
        resolve(element);
      });
    });
  }


  static buildStoreUI(name, options) {
    return new Promise((resolve) => {
      Utils.fetchTemplate('assets/html/store.html').then((dom) => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        element.innerHTML = element.innerHTML.replace('{{STORE_NAME}}', Utils.stripDom(name));
        element.innerHTML = element.innerHTML.replace('{{STORE_LAT}}', options.lat);
        element.innerHTML = element.innerHTML.replace('{{STORE_LNG}}', options.lng);
        // Append circle around marker
        options.color = '#247dc9';
        options.circle = MapHelper.drawCircle(options);

        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(name)
          .setLatLng(options.circle.getLatLng());

        if (Utils.getPreference('poi-circle-label') === 'true') {
          options.tooltip.addTo(window.BeerCrackerz.map);
        }
        resolve(element);
      });
    });
  }


  static drawCircle(options) {
    return window.L.circle(options, {
      color: options.color,
      fillColor: options.color,
      opacity: 0,
      fillOpacity: 0,
      radius: Utils.CIRCLE_RADIUS,
    }).addTo(window.BeerCrackerz.map);
  }


  static hideCircles(marks) {
    for (let i = 0; i < marks.length; ++i) {
      marks[i].circle.removeFrom(window.BeerCrackerz.map);
    }
  }


  static showCircles(marks) {
    for (let i = 0; i < marks.length; ++i) {
      marks[i].circle.addTo(window.BeerCrackerz.map);
    }
  }


  static setCircleLabels(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      if (visible) {
        marks[i].tooltip.addTo(window.BeerCrackerz.map);
      } else {
        marks[i].tooltip.removeFrom(window.BeerCrackerz.map);
      }
    }
  }


}


export default MapHelper;
