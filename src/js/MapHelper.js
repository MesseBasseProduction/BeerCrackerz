import Markers from './MarkerEnum.js';
import Rating from './Rating.js';
import Utils from './Utils.js';


class MapHelper {


  constructor() { /* Not meant to be instantiated, all methods should be static */ }


  static placeMarker(options) {
		let icon = Markers.black;
    if (options.type === 'store') {
      icon = Markers.blue;
    } else if (options.type === 'spot') {
      icon = Markers.green;
    } else if (options.type === 'bar') {
      icon = Markers.red;
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
    if (!options.marker) { // Create user marker if not existing
      options.type = 'user';
      options.marker = MapHelper.placeMarker(options);
      // Append circle around marker
      options.radius = options.accuracy;
      options.circle = MapHelper.drawCircle(options);
      // Update circle opacity if pref is at true
      if (Utils.getPreference('poi-show-circle') === 'true') {
        options.circle.setStyle({
          opacity: 1,
          fillOpacity: 0.1,
        });
      }
      // Callback on marker clicked to add marker on user position
      options.marker.on('click', window.BeerCrackerz.mapClicked.bind(window.BeerCrackerz));
    } else { // Update user marker position
      options.marker.setLatLng(options);
      options.circle.setLatLng(options);
    }
  }


  static definePOI(options, callback) {
		const poiWrapper = document.createElement('DIV');
    const newSpot = document.createElement('BUTTON');
    const newStore = document.createElement('BUTTON');
    const newBar = document.createElement('BUTTON');
    newSpot.innerHTML = 'Ajouter un spot';
    newStore.innerHTML = 'Ajouter un magasin';
    newBar.innerHTML = 'Ajouter un bar';
    poiWrapper.className = 'new-poi';
    poiWrapper.appendChild(newSpot);
    poiWrapper.appendChild(newStore);
    poiWrapper.appendChild(newBar);
    options.name = poiWrapper; // Update popup content with DOM elements
    const marker = MapHelper.placeMarker(options).openPopup();
    options.marker = marker; // Attach marker to option so it can be manipulated in clicked callbacks
    options.addedCallback = callback; // Attach callback to be called when marker addition is done
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
    newBar.addEventListener('click', () => {
      marker.isBeingDefined = true;
      marker.closePopup();
      MapHelper.defineNewBar(options);
    });
    marker.on('popupclose', () => {
      if (!marker.isBeingDefined) {
        marker.popupClosed = true;
        marker.removeFrom(window.BeerCrackerz.map);
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
        options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
        document.getElementById('aside').style.opacity = 0;
        setTimeout(() => document.getElementById('aside').innerHTML = '', 200); // Match CSS transition duration
      };
      // Submit or cancel event subscriptions
      submit.addEventListener('click', () => {
        _cleanDefineUI();
        MapHelper.buildSpotUI(name.value, options).then(dom => {
          options.type = 'spot';
          options.name = dom;
          options.description = description.value;
          options.rate = starRating.currentRate;
          options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
          options.marker = MapHelper.placeMarker(options); // Create final marker
          options.addedCallback(options);
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
        options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
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
          options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
          options.marker = MapHelper.placeMarker(options); // Create final marker
          options.addedCallback(options);
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


  static defineNewBar(options) {
    Utils.fetchTemplate('assets/html/newbar.html').then(dom => {
      const name = dom.querySelector('#bar-name');
      const submit = dom.querySelector('#submit-bar');
      const cancel = dom.querySelector('#cancel-bar');
      const close = dom.querySelector('#close-aside');
      const dollarRating = new Rating(dom.querySelector('#price-rating'));
      // Method to clear aside and hide it, and remove temporary marker on the map
      const _cleanDefineUI = () => {
        options.marker.isBeingDefined = false;
        options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
        document.getElementById('aside').style.opacity = 0;
        setTimeout(() => document.getElementById('aside').innerHTML = '', 200); // Match CSS transition duration
      };
      // Submit or cancel event subscriptions
      submit.addEventListener('click', () => {
        _cleanDefineUI();
        MapHelper.buildBarUI(name.value, options).then((dom) => {
          options.type = 'bar';
          options.name = dom;
          options.price = dollarRating.currentRate;
          options.marker.removeFrom(window.BeerCrackerz.map); // Clear temporary black marker
          options.marker = MapHelper.placeMarker(options); // Create final marker
          options.addedCallback(options);
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
        options.color = Utils.SPOT_COLOR;
        options.circle = MapHelper.drawCircle(options);

        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(name)
          .setLatLng(options.circle.getLatLng());

        if (Utils.getPreference('poi-marker-label') === 'true') {
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
        options.color = Utils.STORE_COLOR;
        options.circle = MapHelper.drawCircle(options);

        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(name)
          .setLatLng(options.circle.getLatLng());

        if (Utils.getPreference('poi-marker-label') === 'true') {
          options.tooltip.addTo(window.BeerCrackerz.map);
        }
        resolve(element);
      });
    });
  }


  static buildBarUI(name, options) {
    return new Promise((resolve) => {
      Utils.fetchTemplate('assets/html/bar.html').then((dom) => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        element.innerHTML = element.innerHTML.replace('{{BAR_NAME}}', Utils.stripDom(name));
        element.innerHTML = element.innerHTML.replace('{{BAR_LAT}}', options.lat);
        element.innerHTML = element.innerHTML.replace('{{BAR_LNG}}', options.lng);
        // Append circle around marker
        options.color = Utils.BAR_COLOR;
        options.circle = MapHelper.drawCircle(options);

        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(name)
          .setLatLng(options.circle.getLatLng());

        if (Utils.getPreference('poi-marker-label') === 'true') {
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
      opacity: 0, // This needs to be updated according to user proximity
      fillOpacity: 0, // Same for this parameter
      radius: options.radius ? options.radius : Utils.CIRCLE_RADIUS
    }).addTo(window.BeerCrackerz.map);
  }


  static setMarkerCircles(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      if (visible) {
        marks[i].circle.addTo(window.BeerCrackerz.map);
      } else {
        marks[i].circle.removeFrom(window.BeerCrackerz.map);
      }
    }
  }


  static setMarkerLabels(marks, visible) {
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
