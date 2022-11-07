import Markers from '../utils/MarkerEnum.js';
import Utils from '../utils/Utils.js';


class VisuHelper {


  constructor() { /* Not meant to be instantiated, all methods should be static */ }


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
    const options = (Utils.getPreference('map-high-accuracy') === 'true') ? Utils.HIGH_ACCURACY : Utils.OPTIMIZED_ACCURACY;
    Utils.updateDebugInterface(window.BeerCrackerz.debugElement, window.BeerCrackerz.user, options);
  }


  static drawUserMarker() {
    if (!window.BeerCrackerz.user.marker) { // Create user marker if not existing
      window.BeerCrackerz.user.type = 'user';
      window.BeerCrackerz.user.marker = VisuHelper.addMark(window.BeerCrackerz.user);
      // Append circle around marker for accuracy and range for new marker
      window.BeerCrackerz.user.radius = window.BeerCrackerz.user.accuracy;
      window.BeerCrackerz.user.circle = VisuHelper.drawCircle(window.BeerCrackerz.user);
      window.BeerCrackerz.user.range = VisuHelper.drawCircle({
        lat: window.BeerCrackerz.user.lat,
        lng: window.BeerCrackerz.user.lng,
        radius: Utils.NEW_MARKER_RANGE,
        color: Utils.RANGE_COLOR
      });

      window.BeerCrackerz.user.circle.addTo(window.BeerCrackerz.map);
      window.BeerCrackerz.user.range.addTo(window.BeerCrackerz.map);
      // Update circle opacity if pref is at true
      if (Utils.getPreference('poi-show-circle') === 'true') {
        window.BeerCrackerz.user.circle.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
        window.BeerCrackerz.user.range.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
      }
      // Callback on marker clicked to add marker on user position
      window.BeerCrackerz.user.marker.on('click', window.BeerCrackerz.mapClicked.bind(window.BeerCrackerz));
    } else { // Update user marker position, range, and accuracy circle
      window.BeerCrackerz.user.marker.setLatLng(window.BeerCrackerz.user);
      window.BeerCrackerz.user.range.setLatLng(window.BeerCrackerz.user);
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
      radius: options.radius ? options.radius : Utils.CIRCLE_RADIUS,
    });
  }


  static setMarkerCircles(visible) {
    const _updateCircle = list => {
      for (let i = 0; i < list.length; ++i) {
        // Here we update both opacity and add/remove circle from map
        if (visible) {
          list[i].circle.setStyle({
            opacity: 1,
            fillOpacity: 0.1
          });
          list[i].circle.addTo(window.BeerCrackerz.map);
        } else {
          list[i].circle.setStyle({
            opacity: 0,
            fillOpacity: 0
          });
          list[i].circle.removeFrom(window.BeerCrackerz.map);
        }
      }
    };

    const keys = Object.keys(window.BeerCrackerz.marks);
    for (let i = 0; i < keys.length; ++i) {
      _updateCircle(window.BeerCrackerz.marks[keys[i]]);
    }

    _updateCircle([ window.BeerCrackerz.user ]);
    _updateCircle([{ circle: window.BeerCrackerz.user.range }]);
  }


  static updateMarkerCirclesVisibility() {   
    if (Utils.getPreference('poi-show-circle') === 'true') {
      const _updateCircles = list => {
        // Check spots in user's proximity
        for (let i = 0; i < list.length; ++i) {
          // Only update circles that are in user view
          if (window.BeerCrackerz.map.getBounds().contains(list[i].marker.getLatLng())) {
            const marker = list[i].marker;
            const distance = Utils.getDistanceBetweenCoords(
              [ window.BeerCrackerz.user.lat, window.BeerCrackerz.user.lng ],
              [ marker.getLatLng().lat, marker.getLatLng().lng ]
            );
            // Only show if user distance to marker is under circle radius
            if (distance < Utils.CIRCLE_RADIUS && !list[i].circle.visible) {
              list[i].circle.visible = true;
              list[i].circle.setStyle({
                opacity: 1,
                fillOpacity: 0.1
              });
            } else if (distance >= Utils.CIRCLE_RADIUS && list[i].circle.visible) {
              list[i].circle.visible = false;
              list[i].circle.setStyle({
                opacity: 0,
                fillOpacity: 0
              });
            }
          }
        }
      };

      // Update circle visibility according to user distance to them
      _updateCircles(window.BeerCrackerz.marks.spot);
      _updateCircles(window.BeerCrackerz.marks.shop);
      _updateCircles(window.BeerCrackerz.marks.bar);
      _updateCircles([ window.BeerCrackerz.user ]);
    }
  }


  static setMarkerLabels(visible) {
    const _updateTooltip = list => {
      for (let i = 0; i < list.length; ++i) {
        if (visible) {
          list[i].tooltip.addTo(window.BeerCrackerz.map);
        } else {
          list[i].tooltip.removeFrom(window.BeerCrackerz.map);
        }
      }
    };

    const keys = Object.keys(window.BeerCrackerz.marks);
    for (let i = 0; i < keys.length; ++i) {
      _updateTooltip(window.BeerCrackerz.marks[keys[i]]);
    }
  }


  static removeMarkDecoration(mark) {
    // Remove label
    mark.tooltip.removeFrom(window.BeerCrackerz.map);
    // Remove circle
    mark.circle.setStyle({
      opacity: 0,
      fillOpacity: 0
    });
    mark.circle.removeFrom(window.BeerCrackerz.map);
    // Call destroy on mark popup
    if (mark.popup) {
      mark.popup.destroy();
    } 
  }


  static addMark(mark) {
    let icon = Markers.black;
    if (mark.type === 'shop') {
      icon = Markers.blue;
    } else if (mark.type === 'spot') {
      icon = Markers.green;
    } else if (mark.type === 'bar') {
      icon = Markers.red;
    } else if (mark.type === 'user') {
      icon = Markers.user;
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
   * @name toggleLabel
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleLabel() method will, depending on user preference, display or not
   * the labels attached to spots/shops/bars marks. This label is basically the
   * mark name given by its creator.
   * </blockquote>
   **/
  static toggleLabel() {
    const visible = !(Utils.getPreference('poi-marker-label') === 'true');
    VisuHelper.setMarkerLabels(visible);
    Utils.setPreference('poi-marker-label', visible);
  }


  /**
   * @method
   * @name toggleCircle
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The toggleCircle() method will, depending on user preference, display or not
   * the circles around the spots/shops/bars marks. This circle indicates the minimal
   * distance which allow the user to make updates on the mark information
   * </blockquote>
   **/
  static toggleCircle() {
    const visible = !(Utils.getPreference('poi-show-circle') === 'true');
    VisuHelper.setMarkerCircles(visible);
    Utils.setPreference('poi-show-circle', visible);
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
        window.BeerCrackerz.marks[type][i].circle.setStyle({
          opacity: 1,
          fillOpacity: 0.1
        });
      }
      window.BeerCrackerz.map.addLayer(window.BeerCrackerz.clusters[type]);
    } else {
      for (let i = 0; i < window.BeerCrackerz.marks[type].length; ++i) {
        window.BeerCrackerz.marks[type][i].visible = false;
        window.BeerCrackerz.marks[type][i].circle.setStyle({
          opacity: 0,
          fillOpacity: 0
        });
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
    window.BeerCrackerz.map.flyTo([options.lat, options.lng], 18);    
  }


}


export default VisuHelper;
  