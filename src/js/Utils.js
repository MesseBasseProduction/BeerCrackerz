class Utils {


  constructor() { /* Not meant to be instantiated, all methods should be static */ }


  static fetchTemplate(url) {
    return new Promise((resolve, reject) => {
			fetch(url).then(data => {
        data.text().then(html => {
          resolve(document.createRange().createContextualFragment(html));
        }).catch(reject);
			}).catch(reject);
		});
  }


  static stripDom(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }


  static getDistanceBetweenCoords(from, to) {
    // return distance in meters
    var lon1 = (from[1] * Math.PI) / 180,
      lat1 = (from[0] * Math.PI) / 180,
      lon2 = (to[1] * Math.PI) / 180,
      lat2 = (to[0] * Math.PI) / 180;

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }


  static getPreference(pref) {
    return localStorage.getItem(pref) || null;
  }


  static setPreference(pref, value) {
    localStorage.setItem(pref, value);
  }


  static get USER_COLOR() {
    return '#63fff5';
  }


  static get SPOT_COLOR() {
    return '#26ad23';
  }


  static get STORE_COLOR() {
    return '#247dc9';
  }


  static get BAR_COLOR() {
    return '#ca2a3d';
  }


  static get CIRCLE_RADIUS() {
    return 100;
  }


  static get NEW_MARKER_RANGE() {
    return 200;
  }


  static get MAP_BOUNDS() {
    return window.L.latLngBounds(
      window.L.latLng(-89.98155760646617, -180),
      window.L.latLng(89.99346179538875, 180)
    );
  }


  static get HIGH_ACCURACY() {
    return {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 900,
    };
  }


  static get OPTIMIZED_ACCURACY() {
    return {
      enableHighAccuracy: false,
      maximumAge: 30000,
      timeout: 29000
    };
  }

}


export default Utils;
