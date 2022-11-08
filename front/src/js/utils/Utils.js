/**
 * @class
 * @static
 * @public
**/
class Utils {


  /**
   * @method
   * @name stripDom
   * @public
   * @static
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since November 2022
   * @description
   * <blockquote>
   * From a given string/number input, this method will strip all unnecessary
   * characters and will only retrun the text content as a string.
   * </blockquote>
   * @param {String|Number} html - The html string to strip
   * @return {String} The stripped text content, empty string on error
   **/
  static stripDom(html) {
    // Not accepting empty or not string/number
    if (!html || (typeof html !== 'string' && typeof html !== 'number')) {
      return '';      
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }


  /**
   * @method
   * @name replaceString
   * @public
   * @static
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since November 2022
   * @description
   * <blockquote>
   * Replace a given string in an HTML element with another. 
   * </blockquote>
   * @param {Element} element - The DOM element to replace string in
   * @param {String} string - The string to be replaced
   * @param {String} value - The value to apply to the replaced string
   * @return {Boolean} The success status of the replace action
   **/
  static replaceString(element, string, value) {
    if (!element || !element.innerHTML || !string || typeof string !== 'string' || !value || typeof value !== 'string') {
      return false;
    }

    element.innerHTML = element.innerHTML.replace(string, value);
    return true;
  }


  /**
   * @method
   * @name getDistanceBetweenCoords
   * @public
   * @static
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since November 2022
   * @description
   * <blockquote>
   * Compute the distance in meters between two points given in [Lat, Lng] arrays. 
   * </blockquote>
   * @param {Array} from - The first point lat and lng array
   * @param {Array} to - The second point lat and lng array
   * @return {Number} A floating number, the distance between two points given in meters
   **/
  static getDistanceBetweenCoords(from, to) {
    // Generic argument testing
    if (!from || !to || !Array.isArray(from) || !Array.isArray(to)) {
      return -1;
    }
    // From input array testing
    if (from.length !== 2 || typeof from[0] !== 'number' || typeof from[1] !== 'number') {
      return -1;
    }
    // To input array testing
    if (to.length !== 2 || typeof to[0] !== 'number' || typeof to[1] !== 'number') {
      return -1;
    }
    // Return distance in meters
    const lat1 = (from[0] * Math.PI) / 180;
    const lon1 = (from[1] * Math.PI) / 180;
    const lat2 = (to[0] * Math.PI) / 180;
    const lon2 = (to[1] * Math.PI) / 180;
    // Delta between coords to compute output distance
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
    const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return (c * 6371000); // Earth radius in meters
  }


  /**
   * @method
   * @name precisionRound
   * @public
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since September 2018
   * @description
   * <blockquote>
   * Do a Math.round with a given precision (ie amount of integers after the coma). 
   * </blockquote>
   * @param {Nunmber} value - The value to precisely round (> 0)
   * @param {Number} precision - The number of integers after the coma (> 0)
   * @return {Number} - The rounded value 
   **/
  static precisionRound(value, precision) {
    if (typeof value !== 'number' || typeof precision !== 'number') {
      return -1;
    }
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }


  /**
   * @method
   * @name setDefaultPreferences
   * @public
   * @static
   * @memberof Utils
   * @author Arthur Beaulieu
   * @since November 2022
   * @description
   * <blockquote>
   * Analyze preferences and fallback to default values if preferences doesn't exists.
   * </blockquote>
   **/
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
      Utils.setPreference('map-plan-layer', 'Plan OSM');
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


  /**
   * @method
   * @name formatMarker
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since February 2022
   * @description
   * <blockquote>
   * This method formats a mark so it can be parsed using JSON.parse 
   * in order to be later stored in database.
   * </blockquote>
   * @param {Object} mark - The mark options to format for server communication
   * @return {Object} The formatted mark
   **/
  static formatMarker(mark) {
    // Mandatory arguments
    if (!mark || !mark.name || !mark.types || !mark.lat || !mark.lng) {
      return null;
    }
    // Mandatory arguments proper types
    if (typeof mark.name !== 'string' || !Array.isArray(mark.types) || typeof mark.lat !== 'number' || typeof mark.lng !== 'number') {
      return null;
    }
    // Only return if types aren't all strings
    for (let i = 0; i < mark.types.length; ++i) {
      if (typeof mark.types[i] !== 'string') {
        return null;
      }
    }
    // Only return if description is not properly formated
    if (mark.description && typeof mark.description !== 'string') {
      return null;
    }
    // Only return if modifiers are not properly formated
    if (mark.modifiers) {
      if (!Array.isArray(mark.modifiers)) {
        return null;
      }

      for (let i = 0; i < mark.modifiers.length; ++i) {
        if (typeof mark.modifiers[i] !== 'string') {
          return null;
        }
      }
    }
    // Only return if rate is not a number or not between 0 and 4
    if (mark.rate && typeof mark.rate !== 'number' || mark.rate < 0 || mark.rate > 4) {
      return null;
    }
    // Only return if price is not a number or not between 0 and 2
    if (mark.price && typeof mark.price !== 'number' || mark.price < 0 || mark.price > 2) {
      return null;
    }
    // Finally return formatted mark
    return {
      name: mark.name,
      types: mark.types,
      lat: mark.lat,
      lng: mark.lng,
      description: mark.description,
      modifiers: mark.modifiers,
      rate: mark.rate,
      price: mark.price
    };
  }


  static removeAllObjectKeys(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return false;
    }

    Object.keys(obj).forEach(key => {
      delete obj[key];
    });

    return true;
  }


  /* Preference get set (DEPRECATED, will be mgrated with user pref when ready) */


  static getPreference(pref) {
    return localStorage.getItem(pref) || null;
  }


  static setPreference(pref, value) {
    localStorage.setItem(pref, value);
  }


}


export default Utils;
