import Utils from '../utils/Utils.js';
import AccuracyEnum from '../utils/enums/AccuracyEnum.js';
import ColorEnum from '../utils/enums/ColorEnum.js';
import MapEnum from '../utils/enums/MapEnum.js';
import MarkersEnum from '../utils/enums/MarkerEnum.js';


/**
 * @class
 * @static
 * @public
**/
class VisuHelper {


  // ======================================================================== //
  // ----------------------- Debug interface methods ------------------------ //
  // ======================================================================== //


  /**
   * @method
   * @name initDebugUI
   * @public
   * @static
   * @memberof VisuHelper
   * @author Arthur Beaulieu
   * @since November 2022
   * @description
   * <blockquote>
   * Will build the debug UI element and chain them as expected.
   * </blockquote>
   * @return {Element} The debug DOM element for BeerCrackerz
   **/
  static initDebugUI() {
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
    return debugContainer;
  }


  /**
   * @method
   * @name addDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The addDebugUI() method appends the debug DOM element to the document body
   * </blockquote>
   **/
  static addDebugUI() {
    document.body.appendChild(window.BeerCrackerz.debugElement);
  }


  /**
   * @method
   * @name removeDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The removeDebugUI() method remove the debug DOM element from the document body
   * </blockquote>
   **/
  static removeDebugUI() {
    document.body.removeChild(window.BeerCrackerz.debugElement);
  }


  /**
   * @method
   * @name updateDebugUI
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The updateDebugUI() method will update informations held in the debug DOM
   * </blockquote>
   **/
  static updateDebugUI() {
    if (window.DEBUG === true) {
      const options = (Utils.getPreference('map-high-accuracy') === 'true') ? AccuracyEnum.high : AccuracyEnum.optimized;
      const element = window.BeerCrackerz.debugElement;
      const user = window.BeerCrackerz.user;
      const bc = window.BeerCrackerz;
      const lang = bc.nls.debug.bind(bc.nls);
      const updateSplittedString = element.querySelector('.debug-updates-amount').innerHTML.split(' ');
      const updates = parseInt(updateSplittedString[updateSplittedString.length - 1]) + 1;
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


  static drawUserMarker() {
    if (!window.BeerCrackerz.user.marker) { // Create user marker if not existing
      window.BeerCrackerz.user.type = 'user';
      window.BeerCrackerz.user.marker = VisuHelper.addMark(window.BeerCrackerz.user);
      // Append circle around marker for accuracy and range for new marker
      window.BeerCrackerz.user.radius = window.BeerCrackerz.user.accuracy;
      window.BeerCrackerz.user.circle = VisuHelper.drawCircle(window.BeerCrackerz.user);

      window.BeerCrackerz.user.circle.addTo(window.BeerCrackerz.map);
      window.BeerCrackerz.user.circle.setStyle({
        opacity: 1,
        fillOpacity: 0.1
      });
      // Callback on marker clicked to add marker on user position
      window.BeerCrackerz.user.marker.on('click', window.BeerCrackerz.mapClicked.bind(window.BeerCrackerz));
    } else { // Update user marker position, range, and accuracy circle
      window.BeerCrackerz.user.marker.setLatLng(window.BeerCrackerz.user);
      window.BeerCrackerz.user.circle.setLatLng(window.BeerCrackerz.user);
      window.BeerCrackerz.user.circle.setRadius(window.BeerCrackerz.user.accuracy);
    }    
  }


  static drawCircle(options) {
    return window.L.circle(options, {
      color: options.color,
      fillColor: options.color,
      opacity: 0, // This needs to be updated according to user proximity
      fillOpacity: 0, // Same for this parameter
      radius: options.radius ? options.radius : MapEnum.socialMarkRange,
    });
  }


  static removeMarkDecoration(mark) {
    if (mark.popup) {
      mark.popup.destroy();
    } 
  }


  static addMark(mark) {
    let icon = MarkersEnum.black;
    if (mark.type === 'shop') {
      icon = MarkersEnum.blue;
    } else if (mark.type === 'spot') {
      icon = MarkersEnum.green;
    } else if (mark.type === 'bar') {
      icon = MarkersEnum.red;
    } else if (mark.type === 'user') {
      icon = MarkersEnum.user;
    }

    const marker = window.L.marker([mark.lat, mark.lng], { icon: icon }).on('click', VisuHelper.centerOn.bind(VisuHelper, mark));
    if (mark.dom) {
      marker.bindPopup(mark.dom);
    }
    // All markers that are not spot/shop/bar should be appended to the map
    if (['spot', 'shop', 'bar'].indexOf(mark.type) === -1) {
      marker.addTo(window.BeerCrackerz.map);
    }

    return marker;
  }


  /**
   * @method
   * @name toggleMarkers
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleMarkers() method will, depending on user preference, display or not
   * a given mark type. This way, the user can fine tune what is displayed on the map.
   * A mark type in spots/shops/bars must be given as an argument
   * </blockquote>
   * @param {String} type - The mark type in spots/tores/bars
   **/
  static toggleMarkers(event) {
    const type = event.target.dataset.type;
    const visible = !(Utils.getPreference(`poi-show-${type}`) === 'true');
    if (visible === true) {
      for (let i = 0; i < window.BeerCrackerz.marks[type].length; ++i) {
        window.BeerCrackerz.marks[type][i].visible = true;
      }
      window.BeerCrackerz.map.addLayer(window.BeerCrackerz.clusters[type]);
    } else {
      for (let i = 0; i < window.BeerCrackerz.marks[type].length; ++i) {
        window.BeerCrackerz.marks[type][i].visible = false;
      }
      window.BeerCrackerz.map.removeLayer(window.BeerCrackerz.clusters[type]);
    }
    Utils.setPreference(`poi-show-${type}`, visible);
  }


  /**
   * @method
   * @name toggleDebug
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleDebug() method will, depending on user preference, add or remove
   * the debug DOM element to the user interface. The debug DOM display several
   * useful information to identify an issue with the geolocation API
   * </blockquote>
   **/
  static toggleDebug() {
    const visible = !window.DEBUG;
    window.DEBUG = visible;
    Utils.setPreference('app-debug', visible);
    if (visible) {
      VisuHelper.addDebugUI();
    } else {
      VisuHelper.removeDebugUI();
    }
  }


  static toggleDarkTheme() {
    const isDark = (Utils.getPreference(`dark-theme`) === 'true');
    Utils.setPreference('dark-theme', !isDark);
    if (isDark === true) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }


  /**
   * @method
   * @name toggleFocusLock
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleFocusLock() method will, depending on user preference, lock or unlock
   * the map centering around the user marker at each position refresh. This way the user
   * can roam while the map is following its position.
   * </blockquote>
   **/
  static toggleFocusLock() {
    if (Utils.getPreference('map-center-on-user') === 'true') {
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif(`unlockFocusOn`));
      document.getElementById('center-on').classList.remove('lock-center-on');
      Utils.setPreference('map-center-on-user', 'false');
    } else {
      window.BeerCrackerz.notification.raise(window.BeerCrackerz.nls.notif(`lockFocusOn`));
      document.getElementById('center-on').classList.add('lock-center-on');
      window.BeerCrackerz.map.flyTo([window.BeerCrackerz.user.lat, window.BeerCrackerz.user.lng], 18);
      Utils.setPreference('map-center-on-user', 'true');
    }
  }


  static centerOn(options) {
    // Disable center on lock if previously set to true
    if (Utils.getPreference('map-center-on-user') === 'true') {
      VisuHelper.toggleFocusLock();
    }
    // Actual fly to the marker
    let zoom = options.zoom;
    if (!options.zoom) {
      zoom = window.BeerCrackerz.map.getZoom();
    }
    window.BeerCrackerz.map.flyTo([options.lat, options.lng], zoom);
  }


  static toggleStartupHelp() {
    if (Utils.getPreference('startup-help') === 'true') {
      Utils.setPreference('startup-help', 'false');
    } else {
      Utils.setPreference('startup-help', 'true');
      window.location = '/'; // Force reload so user can see the startup help guide
    }
  }


  static checkClusteredMark(type) {
    const clusters = window.BeerCrackerz.clusters[type]
    clusters._featureGroup.eachLayer(layer => {
      if (layer instanceof L.MarkerCluster && layer.getChildCount() > 2) {
        clusters._showCoverage({ layer: layer });
      } else {
        clusters._hideCoverage();        
      }
    });
  }


}


export default VisuHelper;
  