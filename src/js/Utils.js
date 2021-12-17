class Utils {


  constructor() {}


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


  static get CIRCLE_RADIUS() {
    return 100;
  }

}


export default Utils;
