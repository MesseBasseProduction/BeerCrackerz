import './BeerCrackerzAuth.scss';
import Providers from './js/utils/ProviderEnum.js';
import ZoomSlider from './js/ui/ZoomSlider.js';
import LangManager from './js/utils/LangManager.js';
import Notification from './js/ui/Notification.js';
import Markers from './js/utils/MarkerEnum.js';
import Utils from './js/utils/Utils.js';
import Kom from './js/utils/Kom.js';


class BeerCrackerzAuth {


  constructor() {
    /**
     * The user object holds everything useful to ensure a proper session
     * @type {Object}
     * @private
     **/
    this._user = {
      lat: 48.853121540141096, // Default lat to Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Default lng to Paris Notre-Dame longitude
      accuracy: 0, // Accuracy in meter given by geolocation API
      marker: null, // The user marker on map
      circle: null, // The accuracy circle around the user marker
      range: null, // The range in which user can add a new marker
      color: Utils.USER_COLOR, // The color to use for circle (match the user marker color)
      id: -1,
      username: ''
    };
    /**
     * The stored marks for spots, shops and bars
     * @type {Object}
     * @private
     **/
     this._marks = {
      spot: [],
      shop: [],
      bar: []
    };
    /**
     * The stored clusters for markers, see Leaflet.markercluster plugin
     * @type {Object}
     * @private
     **/
     this._clusters = {
      spot: {},
      shop: {},
      bar: {}
    };

    this._aside = null;
    this._isAsideExpanded = true;

    this._kom = new Kom();
    // The BeerCrackerz app is only initialized once nls are set up
    // By default, the template contains the login aside, no need to fetch it
    this._lang = new LangManager(
      window.navigator.language.substring(0, 2),
      this._init.bind(this)
    );
  }


  _init() {
    this._handleLoginAside();
    this._notification = new Notification();

    this._initMap()
      .then(this._initGeolocation.bind(this))
      .then(this._initEvents.bind(this))
      .then(this._initMarkers.bind(this));
  }


  // ======================================================================== //
  // -------------------------- Aside interactivity ------------------------- //
  // ======================================================================== //


  _handleLoginAside() {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.login('headTitle');
    Utils.replaceString(aside, '{LOGIN_SUBTITLE}', this.nls.login('subtitle'));
    Utils.replaceString(aside, '{LOGIN_HIDDEN_ERROR}', this.nls.login('hiddenError'));
    Utils.replaceString(aside, '{LOGIN_USERNAME_LABEL}', this.nls.login('username'));
    Utils.replaceString(aside, '{LOGIN_USERNAME_PASSWORD}', this.nls.login('password'));
    Utils.replaceString(aside, '{LOGIN_FORGOT_PASSWORD}', this.nls.login('forgot'));
    Utils.replaceString(aside, '{LOGIN_BUTTON}', this.nls.login('login'));
    Utils.replaceString(aside, '{LOGIN_NOT_REGISTERED}', this.nls.login('notRegistered'));
    Utils.replaceString(aside, '{LOGIN_REGISTER}', this.nls.login('register'));

    const error = document.getElementById('login-error');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      // Handling empty error cases
      if (username.value === '' && password.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.login('bothEmpty');
        username.classList.add('error');
        password.classList.add('error');
        return false;
      } else if (username.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.login('usernameEmpty');
        username.classList.add('error');
        return false;
      } else if (password.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.login('passwordEmpty');
        password.classList.add('error');
        return false;
      }
      return true;
    };
    const _backValidation = response => {
      // Check response and handle status codes
      console.log(response);
      // If all front and back tests are ok, redirect to auth
      // If the user manually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = 'authindex.html';
    };
    // Submit click event
    document.getElementById('login-submit').addEventListener('click', () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      password.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/login/', {
          username: username.value,
          password: password.value
        }).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.login('serverError');
        });
      }
    }, false);
    // Register event
    document.getElementById('register-aside').addEventListener('click', this._loadRegisterAside.bind(this), false);
    document.getElementById('forgot-password').addEventListener('click', this._loadForgotPasswordAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  _handleRegisterAside() {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.register('headTitle');
    Utils.replaceString(aside, '{REGISTER_SUBTITLE}', this.nls.register('subtitle'));
    Utils.replaceString(aside, '{REGISTER_HIDDEN_ERROR}', this.nls.register('hiddenError'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_LABEL}', this.nls.register('username'));
    Utils.replaceString(aside, '{REGISTER_MAIL_LABEL}', this.nls.register('mail'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_PASSWORD_1}', this.nls.register('password1'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_PASSWORD_2}', this.nls.register('password2'));
    Utils.replaceString(aside, '{REGISTER_BUTTON}', this.nls.register('register'));
    Utils.replaceString(aside, '{REGISTER_ALREADY_DONE}', this.nls.register('notRegistered'));
    Utils.replaceString(aside, '{REGISTER_LOGIN}', this.nls.register('login'));
    const error = document.getElementById('register-error');
    const username = document.getElementById('username');
    const mail = document.getElementById('mail');
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      // Handling empty error cases
      if (username.value === '' || mail.value === '' || password1.value === '' || password2.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.register('fieldEmpty');
        if (username.value === '') {
          username.classList.add('error');
        }
        if (mail.value === '') {
          mail.classList.add('error');
        }
        if (password1.value === '') {
          password1.classList.add('error');
        }
        if (password2.value === '') {
          password2.classList.add('error');
        }
        return false;
      } else if (password1.value !== password2.value) {
        error.classList.add('visible');
        error.innerHTML = this.nls.register('notMatchingPassword');
        password1.classList.add('error');
        password2.classList.add('error');
        return false;
      }
      return true;
    };
    const _backValidation = (response) => {
      // Check response and handle status codes
      console.log(response);
      // If all front and back tests are ok, redirect to auth
      // If the user ma nually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = 'authindex.html';
    };
    // Submit click event
    document.getElementById('register-submit').addEventListener('click', () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      mail.classList.remove('error');
      password1.classList.remove('error');
      password2.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/register/submit', {
          username: username.value,
          email: mail.value,
          password1: password1.value,
          password2: password2.value
        }).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.register('serverError');
        });
      }
    }, false);
    // Register event
    document.getElementById('login-aside').addEventListener('click', this._loadLoginAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);    
  }


  _handleResetPasswordAdise() {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.forgotPassword('headTitle');
    Utils.replaceString(aside, '{FORGOT_PASSWORD_SUBTITLE}', this.nls.forgotPassword('subtitle'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_ERROR}', this.nls.register('hiddenError'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_MAIL_LABEL}', this.nls.forgotPassword('mail'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_BUTTON}', this.nls.forgotPassword('submit'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_LOGIN_LABEL}', this.nls.forgotPassword('loginLabel'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_LOGIN}', this.nls.forgotPassword('login'));
    const error = document.getElementById('forgot-password-error');
    const mail = document.getElementById('mail');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      // Handling empty error cases
      if (mail.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.forgotPassword('fieldEmpty');
        if (mail.value === '') {
          mail.classList.add('error');
        }
        return false;
      }
      return true;
    };
    const _backValidation = (response) => {
      // Check response and handle status codes
      console.log(response);
      // If all front and back tests are ok, redirect to auth
      // If the user ma nually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = 'authindex.html';
    };
    // Submit click event
    document.getElementById('forgot-password-submit').addEventListener('click', () => {
      // Reset error css classes
      error.classList.remove('visible');
      mail.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/password/reset', {
          email: mail.value
        }).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.forgotPassword('serverError');
        });
      }
    }, false);

    document.getElementById('login-aside').addEventListener('click', this._loadLoginAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  _loadAside(type) {
    return new Promise((resolve, reject) => {
      this._kom.getTemplate(`/static/html/aside/${type}.html`).then(dom => {
        document.body.className = ''; // Clear previous css class
        document.body.classList.add(type); // Update body class with current aside view
        // We need to get aside at the last moment because of nls that changed HTML content
        this._aside = document.getElementById('aside');
        this._aside.innerHTML = ''; // Clear HTML content
        this._aside.appendChild(dom); // Replace with current aside dom
        resolve();
      }).catch(reject);
    });
  }


  _loadLoginAside() {
    this._loadAside('login').then(this._handleLoginAside.bind(this)).catch(() => {
      console.error('Couldn\'t fetch or build the login aside');
    });
  }


  _loadRegisterAside() {
    this._loadAside('register').then(this._handleRegisterAside.bind(this)).catch(() => {
      console.error('Couldn\'t fetch or build the register aside');
    });
  }


  _loadForgotPasswordAside() {
    this._loadAside('forgot-password').then(this._handleResetPasswordAdise.bind(this)).catch(() => {
      console.error('Couldn\'t fetch or build the forgot password aside');
    });    
  }


  _toggleAside() {
    if (this._isAsideExpanded === true) {
      this._isAsideExpanded = false;
      document.getElementById('aside').style.right = '-40rem';
      document.documentElement.style.setProperty('--aside-width', '0');
      // Refreshing map to load new tiles
      requestAnimationFrame(() => { this._map.invalidateSize(); });
      setTimeout(() => {
        document.getElementById('aside-expander').style.left = '-44.8rem'; 
        document.getElementById('aside-expander-icon').src = '/static/img/logo/left.svg';
      }, 100);
    } else {
      this._isAsideExpanded = true;
      document.getElementById('aside').style.maxWidth = '40rem';
      document.getElementById('aside').style.right = '0';
      document.getElementById('aside-expander').style.transition = 'none';
      document.getElementById('aside-expander').style.left = '0';
      document.getElementById('aside-expander-icon').src = '/static/img/logo/right.svg';
      setTimeout(() => {
        document.documentElement.style.setProperty('--aside-width', '40rem');
        document.getElementById('aside').style.maxWidth = 'var(--aside-width)';
        document.getElementById('aside-expander').style.transition = 'all .5s';
      }, 500);
    }
  }

  
  // ======================================================================== //
  // -------------------------- Public map methods -------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name _initMap
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initMap() method will create the Leaflet.js map with two base layers (plan/satellite),
   * add scale control, remove zoom control and set map bounds.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initMap() {
    return new Promise(resolve => {
      // Use main div to inject OSM into
      this._map = window.L.map('beer-crakerz-map', {
        zoomControl: false,
      }).setView([this._user.lat, this._user.lng], 18);
      // Add meter and feet scale on map
      window.L.control.scale().addTo(this._map);
      // Place user marker on the map
      this.drawUserMarker();
      // Add OSM credits to the map next to leaflet credits
      const osm = Providers.planOsm;
      //const plan = Providers.planGeo;
      const esri = Providers.satEsri;
      //const geo = Providers.satGeo;
      // Prevent panning outside of the world's edge
      this._map.setMaxBounds(Utils.MAP_BOUNDS);
      // Add layer group to interface
      const baseMaps = {};
      baseMaps[`<p>${this.nls.map('planLayerOSM')}</p>`] = osm;
      baseMaps[`<p>${this.nls.map('satLayerEsri')}</p>`] = esri;
      // Append layer depending on user preference
      osm.addTo(this._map);
      // Add layer switch radio on bottom right of the map
      window.L.control.layers(baseMaps, {}, { position: 'bottomright' }).addTo(this._map);
      // Init zoom slider when map has been created
      this._zoomSlider = new ZoomSlider(this._map);
      resolve();
    });
  }


  /**
   * @method
   * @name _initGeolocation
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initGeolocation() method will request from browser the location authorization.
   * Once granted, an event listener is set on any position update, so it can update the
   * map state and the markers position. This method can be called again, only if the
   * geolocation watch has been cleared ; for example when updating the accuracy options.
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
   _initGeolocation() {
    return new Promise(resolve => {
      if ('geolocation' in navigator) {
        this._watchId = navigator.geolocation.watchPosition(position => {
          // Update saved user position
          this._user.lat = position.coords.latitude;
          this._user.lng = position.coords.longitude;
          this._user.accuracy = position.coords.accuracy;
          // Only draw marker if map is already created
          if (this._map) {
            this.drawUserMarker();
            this._map.setView(this._user);
          }
        }, null, Utils.HIGH_ACCURACY);
        resolve();
      } else {
        this._notification.raise(this.nls.notif('geolocationError'));
        resolve();
      }
    });
  }


  /**
   * @method
   * @name _initEvents
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initEvents() method will listen to all required events to manipulate the map. Those events
   * are both for commands and for map events (click, drag, zoom and layer change).
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initEvents() {
    return new Promise(resolve => {
      // Subscribe to click event on map to react
      this._map.on('click', this.mapClicked.bind(this));
      // Map is dragged by user mouse/finger
      this._map.on('drag', () => {
        // Constrain pan to the map bounds
        this._map.panInsideBounds(Utils.MAP_BOUNDS, { animate: true });
      });
      // Map events
      this._map.on('zoomstart', () => {
        this._isZooming = true;
      });
      this._map.on('zoomend', () => {
        this._isZooming = false;
        // Auto hide labels if zoom level is too high (and restore it when needed)
        if (this._map.getZoom() < 15) {
          this.setMarkerLabels(this._marks.spot, false);
          this.setMarkerLabels(this._marks.shop, false);
          this.setMarkerLabels(this._marks.bar, false);
        } else {
          this.setMarkerLabels(this._marks.spot, true);
          this.setMarkerLabels(this._marks.shop, true);
          this.setMarkerLabels(this._marks.bar, true);
        }
      });
      resolve();
    });
  }


  /**
   * @method
   * @name _initMarkers
   * @private
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The _initEvents() method will initialize all saved marker into the map.
   * Markers must be retrieved from server with a specific format to ensure it works
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initMarkers() {
    return new Promise(resolve => {
      // Init map clusters for marks to be displayed (disable clustering at opened popup zoom level)
      const clusterOptions = {
        animateAddingMarkers: true,
        disableClusteringAtZoom: 18,
        spiderfyOnMaxZoom: false
      };
      this._clusters.spot = new window.L.MarkerClusterGroup(Object.assign(clusterOptions, {
        iconCreateFunction: cluster => {
          return window.L.divIcon({
            className: 'cluster-icon-wrapper',
            html: `
              <img src="/static/img/marker/cluster-icon-green.png" class="cluster-icon">
              <span class="cluster-label">${cluster.getChildCount()}</span>
            `
          });
        }
      }));
      this._clusters.shop = new window.L.MarkerClusterGroup(Object.assign(clusterOptions, {
        iconCreateFunction: cluster => {
          return window.L.divIcon({
            className: 'cluster-icon-wrapper',
            html: `
              <img src="/static/img/marker/cluster-icon-blue.png" class="cluster-icon">
              <span class="cluster-label">${cluster.getChildCount()}</span>
            `
          });
        }
      }));
      this._clusters.bar = new window.L.MarkerClusterGroup(Object.assign(clusterOptions, {
        iconCreateFunction: cluster => {
          return window.L.divIcon({
            className: 'cluster-icon-wrapper',
            html: `
              <img src="/static/img/marker/cluster-icon-red.png" class="cluster-icon">
              <span class="cluster-label">${cluster.getChildCount()}</span>
            `
          });
        }
      }));

      this._map.addLayer(this._clusters.spot);
      this._map.addLayer(this._clusters.shop);
      this._map.addLayer(this._clusters.bar);

      // Load data from local storage, later to be fetched from server
      const iterateMarkers = mark => {
        this.markPopupFactory(mark).then(dom => {
          mark.dom = dom;
          mark.marker = this.placeMarker(mark);
          this._marks[mark.type].push(mark);
          this._clusters[mark.type].addLayer(mark.marker);
        });
      };

      Utils.getSpots().then(spots => {
        for (let i = 0; i < spots.length; ++i) {
          // TODO @raph
          spots[i].type = 'spot';
          spots[i].user = 'messmaker';
          spots[i].userId = 1;
          iterateMarkers(spots[i]);
        }
      });

      Utils.getShops().then(shops => {
        for (let i = 0; i < shops.length; ++i) {
          // TODO @raph
          shops[i].type = 'shop';
          shops[i].user = 'messmaker';
          shops[i].userId = 1;
          iterateMarkers(shops[i]);
        }
      });

      Utils.getBars().then(bars => {
        for (let i = 0; i < bars.length; ++i) {
          // TODO @raph
          bars[i].type = 'bar';
          bars[i].user = 'messmaker';
          bars[i].userId = 1;
          iterateMarkers(bars[i]);
        }
      });

      resolve();
    });
  }


  drawUserMarker() {
    if (!this.user.marker) { // Create user marker if not existing
      this.user.type = 'user';
      this.user.marker = this.placeMarker(this.user);
      // Append circle around marker for accuracy and range for new marker
      this.user.radius = this.user.accuracy;
      // Callback on marker clicked to add marker on user position
      this.user.marker.on('click', this.mapClicked.bind(this));
    } else { // Update user marker position, range, and accuracy circle
      this.user.marker.setLatLng(this.user);
    }
  }


  placeMarker(options) {
    let icon = Markers.black;
    if (options.type === 'shop') {
      icon = Markers.blue;
    } else if (options.type === 'spot') {
      icon = Markers.green;
    } else if (options.type === 'bar') {
      icon = Markers.red;
    } else if (options.type === 'user') {
      icon = Markers.user;
    }

    const marker = window.L.marker([options.lat, options.lng], { icon: icon }).on('click', () => {
      // Actual fly to the marker
      this.map.flyTo([options.lat, options.lng], 18);
    });

    if (options.dom) {
      marker.bindPopup(options.dom);
    }
    // All markers that are not spot/shop/bar should be appended to the map
    if (['spot', 'shop', 'bar'].indexOf(options.type) === -1) {
      marker.addTo(this.map);
    }

    return marker;
  }


  markPopupFactory(options) {
    return new Promise(resolve => {
      this._kom.getTemplate(`/static/html/popup/${options.type}.html`).then(dom => {
        const element = document.createElement('DIV');
        element.appendChild(dom);
        const user = options.user || this.user.username;
        const desc = Utils.stripDom(options.description) || this.nls.popup(`${options.type}NoDesc`);
        Utils.replaceString(element, `{${options.type.toUpperCase()}_NAME}`, Utils.stripDom(options.name));
        Utils.replaceString(element, `{${options.type.toUpperCase()}_FINDER}`, user);
        Utils.replaceString(element, `{${options.type.toUpperCase()}_RATE}`, options.rate + 1);
        Utils.replaceString(element, `{${options.type.toUpperCase()}_DESC}`, desc);
        Utils.replaceString(element, `{${options.type.toUpperCase()}_FOUND_BY}`, this.nls.popup(`${options.type}FoundBy`));
        // Fill mark rate (rating is in [0, 4] explaining the +1 in loop bound)
        const rate = element.querySelector(`#${options.type}-rating`);
        for (let i = 0; i < options.rate + 1; ++i) {
          rate.children[i].classList.add('active');
        }
        // Remove edition buttons if marker is not user's one, this does not replace a server test for edition...
        //element.removeChild(element.querySelector('#popup-edit'));
        // Append circle around marker
        options.color = Utils[`${options.type.toUpperCase()}_COLOR`];
        // Create label for new marker
        options.tooltip = window.L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'marker-tooltip',
          interactive: true
        }).setContent(options.name)
          .setLatLng(options);
        // Make tooltip visible if preference is to true
        options.tooltip.addTo(this.map);
        // Send back the popup
        resolve(element);
      });
    });
  }


  setMarkerLabels(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      if (visible) {
        marks[i].tooltip.addTo(this.map);
      } else {
        marks[i].tooltip.removeFrom(this.map);
      }
    }
  }


  /**
   * @method
   * @name mapClicked
   * @public
   * @memberof BeerCrackerz
   * @author Arthur Beaulieu
   * @since January 2022
   * @description
   * <blockquote>
   * The mapClicked() method is the callback used when the user clicked on the Leaflet.js map
   * </blockquote>
   **/
   mapClicked() {
    // Let this empty
  }


  // ======================================================================== //
  // ---------------------------- Class accessors --------------------------- //
  // ======================================================================== //


  /**
   * @public
   * @property {Object} map
   * Leaflet.js map getter
   **/
   get map() {
    return this._map;
  }


  /**
   * @public
   * @property {Object} marks
   * Leaflet.js marks that holds spot/shop/bar marks as subkeys
   **/
  get marks() {
    return this._marks;
  }


  /**
   * @public
   * @property {Object} user
   * The session user object
   **/
  get user() {
    return this._user;
  }


  /**
   * @public
   * @property {Object} nls
   * The LangManager getter
   **/
  get nls() {
    return this._lang;
  }


}


export default BeerCrackerzAuth;
