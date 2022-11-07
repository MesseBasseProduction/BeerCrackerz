class Utils {


  constructor() { /* Not meant to be instantiated, all methods should be static */ }


  static stripDom(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }


  static replaceString(element, string, value) {
    element.innerHTML = element.innerHTML.replace(string, value);
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


  /** @method
   * @name precisionRound
   * @public
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since September 2018
   * @description Do a Math.round with a given precision (ie amount of integers after the coma)
   * @param {nunmber} value - The value to precisely round
   * @param {number} precision - The number of integers after the coma
   * @return {number} - The rounded value */
  static precisionRound(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }


  static setDefaultPreferences() {
    if (Utils.getPreference('poi-show-spot') === null) {
      Utils.setPreference('poi-show-spot', true);
    }

    if (Utils.getPreference('poi-show-shop') === null) {
      Utils.setPreference('poi-show-shop', true);
    }

    if (Utils.getPreference('poi-show-bar') === null) {
      Utils.setPreference('poi-show-bar', true);
    }

    if (Utils.getPreference('poi-show-circle') === null) {
      Utils.setPreference('poi-show-circle', true);
    }

    if (Utils.getPreference('poi-show-label') === null) {
      Utils.setPreference('poi-show-label', true);
    }

    if (Utils.getPreference('map-plan-layer') === null) {
      Utils.setPreference('map-plan-layer', true);
    }

    if (Utils.getPreference('selected-lang') === null) {
      Utils.setPreference('selected-lang', 'en');
    }

    if (Utils.getPreference('app-debug') === null) {
      Utils.setPreference('app-debug', false);
    }

    if (Utils.getPreference('map-high-accuracy') === null) {
      Utils.setPreference('map-high-accuracy', false);
    }

    if (Utils.getPreference('map-center-on-user') === null) {
      Utils.setPreference('map-center-on-user', false);
    }
    
    if (Utils.getPreference('dark-theme') === null) {
      Utils.setPreference('dark-theme', true);
    }
  }


  static initDebugInterface() {
    const lang = window.BeerCrackerz.nls.debug.bind(window.BeerCrackerz.nls);
    const debugContainer = document.createElement('DIV');
    const title = document.createElement('H1');
    const userLat = document.createElement('P');
    const userLng = document.createElement('P');
    const updatesAmount = document.createElement('P');
    const userAccuracy = document.createElement('P');
    const highAccuracy = document.createElement('P');
    const maxAge = document.createElement('P');
    const posTimeout = document.createElement('P');
    const zoomLevel = document.createElement('P');
    const marks = document.createElement('P');
    const exportData = document.createElement('BUTTON');
    debugContainer.classList.add('debug-container');
    userLat.classList.add('debug-user-lat');
    userLng.classList.add('debug-user-lng');
    updatesAmount.classList.add('debug-updates-amount');
    userAccuracy.classList.add('debug-user-accuracy');
    highAccuracy.classList.add('debug-high-accuracy');
    maxAge.classList.add('debug-pos-max-age');
    posTimeout.classList.add('debug-pos-timeout');
    zoomLevel.classList.add('debug-zoom-level');
    marks.classList.add('debug-marks-amount');
    exportData.classList.add('debug-export-data');
    title.innerHTML = `BeerCrackerz v${window.VERSION}`;
    userLat.innerHTML = `<b>${lang('lat')}</b> -`;
    userLng.innerHTML = `<b>${lang('lng')}</b> -`;
    updatesAmount.innerHTML = `<b>${lang('updates')}</b> 0`;
    userAccuracy.innerHTML = `<b>${lang('accuracy')}</b> -`;
    highAccuracy.innerHTML = `<b>${lang('highAccuracy')}</b> -`;
    maxAge.innerHTML = `<b>${lang('posAge')}</b> -`;
    posTimeout.innerHTML = `<b>${lang('posTimeout')}</b> -`;
    zoomLevel.innerHTML = `<b>${lang('zoom')}</b> -`;
    marks.innerHTML = `<b>${lang('marks')}</b> -`;
    exportData.innerHTML = lang('export');
    debugContainer.appendChild(title);
    debugContainer.appendChild(userLat);
    debugContainer.appendChild(userLng);
    debugContainer.appendChild(updatesAmount);
    debugContainer.appendChild(userAccuracy);
    debugContainer.appendChild(highAccuracy);
    debugContainer.appendChild(maxAge);
    debugContainer.appendChild(posTimeout);
    debugContainer.appendChild(zoomLevel);
    debugContainer.appendChild(marks);
    debugContainer.appendChild(exportData);
    exportData.addEventListener('click', Utils.downloadData.bind(Utils));
    return debugContainer;
  }


  static updateDebugInterface(element, user, options) {
    if (window.DEBUG === true) {
      const bc = window.BeerCrackerz;
      const lang = bc.nls.debug.bind(bc.nls);
      const updates = parseInt(element.querySelector('.debug-updates-amount').innerHTML.split(' ')[1]) + 1;
      const marks = bc.marks.spot.length + bc.marks.shop.length + bc.marks.bar.length;
      element.querySelector('.debug-user-lat').innerHTML = `<b>${lang('lat')}</b> ${user.lat}`;
      element.querySelector('.debug-user-lng').innerHTML = `<b>${lang('lng')}</b> ${user.lng}`;
      element.querySelector('.debug-updates-amount').innerHTML = `<b>${lang('updates')}</b> ${updates}`;
      element.querySelector('.debug-user-accuracy').innerHTML = `<b>${lang('accuracy')}</b> ${Utils.precisionRound(user.accuracy, 2)}m`;
      element.querySelector('.debug-high-accuracy').innerHTML = `<b>${lang('highAccuracy')}</b> ${options.enableHighAccuracy === true ? lang('enabled') : lang('disabled')}`;
      element.querySelector('.debug-pos-max-age').innerHTML = `<b>${lang('posAge')}</b> ${options.maximumAge / 1000}s`;
      element.querySelector('.debug-pos-timeout').innerHTML = `<b>${lang('posTimeout')}</b> ${options.timeout / 1000}s`;
      element.querySelector('.debug-zoom-level').innerHTML = `<b>${lang('zoom')}</b> ${bc.map.getZoom()}`;
      element.querySelector('.debug-marks-amount').innerHTML = `<b>${lang('marks')}</b> ${marks}`;
    }
  }


  /**
   * @method
   * @name downloadData
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since August 2022
   * @description
   * <blockquote>
   * The downloadData() method will save to user disk the saved spots as a JSON file
   * </blockquote>
   **/
  static downloadData() {
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(Utils.getPreference('saved-spot'))}`;
    const link = document.createElement('A');
    link.setAttribute('href', dataString);
    link.setAttribute('download', 'BeerCrackerzData.json');
    link.click();
  }


  /**
   * @method
   * @name formatMarker
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * This method formats a mark returned from MapHelper so it can be parsed
   * using JSON.parse (in order to store it in database)
   * </blockquote>
   * @param {Object} mark The mark options from internal this._marks[type]
   **/
   static formatMarker(mark) {
    return {
      name: mark.name,
      description: mark.description,
      lat: mark.lat,
      lng: mark.lng,
      rate: mark.rate,
      types: mark.types,
      modifiers: mark.modifiers,
      price: (mark.price) ? mark.price : undefined
    };
  }


  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  /* Preference get set (DEPRECATED) */


  static getPreference(pref) {
    return localStorage.getItem(pref) || null;
  }


  static setPreference(pref, value) {
    localStorage.setItem(pref, value);
  }


  static get RANGE_COLOR() {
    return '#ffd87d';
  }


  static get USER_COLOR() {
    return '#63fff5';
  }


  static get SPOT_COLOR() {
    return '#26ad23';
  }


  static get SHOP_COLOR() {
    return '#247dc9';
  }


  static get BAR_COLOR() {
    return '#ca2a3d';
  }


  static get CIRCLE_RADIUS() {
    return 100;
  }


  static get NEW_MARKER_RANGE() {
    return 2^53; // TODO fallback to 200 when roles are implement server side
  }


  static get MAP_BOUNDS() {
    return window.L.latLngBounds(
      window.L.latLng(-89.98155760646617, -180),
      window.L.latLng(89.99346179538875, 180)
    );
  }


  static get HIGH_ACCURACY() {
    return {
      enableHighAccuracy: true, // More consuption, better position
      maximumAge: 1000, // A position will last 1s maximum
      timeout: 900, // A position is updated in 0.9s maximum
    };
  }


  static get OPTIMIZED_ACCURACY() {
    return {
      enableHighAccuracy: false, // Less consuption
      maximumAge: 30000, // A position will last 30s maximum
      timeout: 29000 // A position is updated in 29s maximum
    };
  }


  static get SUPPORTED_LANGUAGE() {
    return ['en', 'fr', 'es', 'de', 'pt'];
  }


}


export default Utils;
