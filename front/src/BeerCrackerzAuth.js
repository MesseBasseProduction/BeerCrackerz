import './BeerCrackerzAuth.scss';
import MapHelper from './js/MapHelper.js';
import Providers from './js/utils/ProviderEnum.js';
import ZoomSlider from './js/ui/ZoomSlider.js';
import LangManager from './js/utils/LangManager.js';
import Notification from './js/ui/Notification.js';
import Utils from './js/utils/Utils.js';


class BeerCrackerzAuth extends MapHelper {


  constructor() {
    super();

    console.log('CACACACACACACACA')
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
     * The stored marks for spots, stores and bars
     * @type {Object}
     * @private
     **/
     this._marks = {
      spot: [],
      store: [],
      bar: [],
    };
    /**
     * The stored clusters for markers, see Leaflet.markercluster plugin
     * @type {Object}
     * @private
     **/
     this._clusters = {
      spot: {},
      store: {},
      bar: {},
    };

    this._aside = null;
    this._isAsideExpanded = true;
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
    document.title = this.nls.login('headTitle');
    Utils.replaceString(document.body, '{{LOGIN_SUBTITLE}}', this.nls.login('subtitle'));
    Utils.replaceString(document.body, '{{LOGIN_HIDDEN_ERROR}}', this.nls.login('hiddenError'));
    Utils.replaceString(document.body, '{{LOGIN_USERNAME_LABEL}}', this.nls.login('username'));
    Utils.replaceString(document.body, '{{LOGIN_USERNAME_PASSWORD}}', this.nls.login('password'));
    Utils.replaceString(document.body, '{{LOGIN_FORGOT_PASSWORD}}', this.nls.login('forgot'));
    Utils.replaceString(document.body, '{{LOGIN_BUTTON}}', this.nls.login('login'));
    Utils.replaceString(document.body, '{{LOGIN_NOT_REGISTERED}}', this.nls.login('notRegistered'));
    Utils.replaceString(document.body, '{{LOGIN_REGISTER}}', this.nls.login('register'));

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
      // If the user ma nually force redirection to authindex,
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
        Utils.postReq('/api/login/submit').then(_backValidation).catch(() => {
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
    document.title = this.nls.register('headTitle');
    Utils.replaceString(document.body, '{{REGISTER_SUBTITLE}}', this.nls.register('subtitle'));
    Utils.replaceString(document.body, '{{REGISTER_HIDDEN_ERROR}}', this.nls.register('hiddenError'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_LABEL}}', this.nls.register('username'));
    Utils.replaceString(document.body, '{{REGISTER_MAIL_LABEL}}', this.nls.register('mail'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_PASSWORD_1}}', this.nls.register('password1'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_PASSWORD_2}}', this.nls.register('password2'));
    Utils.replaceString(document.body, '{{REGISTER_BUTTON}}', this.nls.register('register'));
    Utils.replaceString(document.body, '{{REGISTER_ALREADY_DONE}}', this.nls.register('notRegistered'));
    Utils.replaceString(document.body, '{{REGISTER_LOGIN}}', this.nls.register('login'));
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
        Utils.postReq('/api/register/submit').then(_backValidation).catch(() => {
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
    document.title = this.nls.forgotPassword('headTitle');
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_SUBTITLE}}', this.nls.forgotPassword('subtitle'));
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_ERROR}}', this.nls.register('hiddenError'));
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_MAIL_LABEL}}', this.nls.forgotPassword('mail'));
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_BUTTON}}', this.nls.forgotPassword('submit'));
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_LOGIN_LABEL}}', this.nls.forgotPassword('loginLabel'));
    Utils.replaceString(document.body, '{{FORGOT_PASSWORD_LOGIN}}', this.nls.forgotPassword('login'));
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
        Utils.postReq('/api/password/reset').then(_backValidation).catch(() => {
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
      Utils.fetchTemplate(`/assets/html/aside/${type}.html`).then(dom => {
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
    this._loadAside('login').then(() => {
      this._handleLoginAside();
    }).catch(() => {
      console.error('Couldn\'t fetch or build the login aside');
    });
  }


  _loadRegisterAside() {
    this._loadAside('register').then(() => {
      this._handleRegisterAside();
    }).catch(() => {
      console.error('Couldn\'t fetch or build the register aside');
    });
  }


  _loadForgotPasswordAside() {
    this._loadAside('forgot-password').then(() => {
      this._handleResetPasswordAdise();
    }).catch(() => {
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
        document.getElementById('aside-expander-icon').src = '/assets/img/logo/left.svg';
      }, 100);
    } else {
      this._isAsideExpanded = true;
      document.getElementById('aside').style.maxWidth = '40rem';
      document.getElementById('aside').style.right = '0';
      document.getElementById('aside-expander').style.transition = 'none';
      document.getElementById('aside-expander').style.left = '0';
      document.getElementById('aside-expander-icon').src = '/assets/img/logo/right.svg';
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
        const options = (Utils.getPreference('map-high-accuracy') === 'true') ? Utils.HIGH_ACCURACY : Utils.OPTIMIZED_ACCURACY;
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
        }, null, options);
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
        // Disable lock focus if user drags the map
        if (Utils.getPreference('map-center-on-user') === 'true') {
          this.toggleFocusLock();
        }
      });
      // Map events
      this._map.on('zoomstart', () => {
        this._isZooming = true;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          this.setMarkerCircles(this._marks.spot, false);
          this.setMarkerCircles(this._marks.store, false);
          this.setMarkerCircles(this._marks.bar, false);
          this.setMarkerCircles([this._user], false);
          this.setMarkerCircles([{ circle: this._user.range }], false);
        }
      });
      this._map.on('zoomend', () => {
        this._isZooming = false;
        if (Utils.getPreference('poi-show-circle') === 'true') {
          if (this._map.getZoom() >= 15) {
            this.setMarkerCircles(this._marks.spot, true);
            this.setMarkerCircles(this._marks.store, true);
            this.setMarkerCircles(this._marks.bar, true);
            this.setMarkerCircles([this._user], true);
            this.setMarkerCircles([{ circle: this._user.range }], true);
          }
        }
        // Auto hide labels if zoom level is too high (and restore it when needed)
        if (Utils.getPreference('poi-marker-label') === 'true') {
          if (this._map.getZoom() < 15) {
            this.setMarkerLabels(this._marks.spot, false);
            this.setMarkerLabels(this._marks.store, false);
            this.setMarkerLabels(this._marks.bar, false);
          } else {
            this.setMarkerLabels(this._marks.spot, true);
            this.setMarkerLabels(this._marks.store, true);
            this.setMarkerLabels(this._marks.bar, true);
          }
        }
      });
      this._map.on('baselayerchange', event => {
        Utils.setPreference('map-plan-layer', Utils.stripDom(event.name));
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
              <img src="/assets/img/marker/cluster-icon-green.png" class="cluster-icon">
              <span class="cluster-label">${cluster.getChildCount()}</span>
            `
          });
        }
      }));
      this._clusters.store = new window.L.MarkerClusterGroup(Object.assign(clusterOptions, {
        iconCreateFunction: cluster => {
          return window.L.divIcon({
            className: 'cluster-icon-wrapper',
            html: `
              <img src="/assets/img/marker/cluster-icon-blue.png" class="cluster-icon">
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
              <img src="/assets/img/marker/cluster-icon-red.png" class="cluster-icon">
              <span class="cluster-label">${cluster.getChildCount()}</span>
            `
          });
        }
      }));
      // Append clusters to the map depending on user preferences
      if (Utils.getPreference(`poi-show-spot`) === 'true') {
        this._map.addLayer(this._clusters.spot);
      }
      if (Utils.getPreference(`poi-show-store`) === 'true') {
        this._map.addLayer(this._clusters.store);
      }
      if (Utils.getPreference(`poi-show-bar`) === 'true') {
        this._map.addLayer(this._clusters.bar);
      }
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
          spots[i].userId = 42;
          spots[i].lat = spots[i].latitude;
          spots[i].lng = spots[i].longitude;
          iterateMarkers(spots[i]);
        }
      });

      Utils.getStores().then(stores => {
        for (let i = 0; i < stores.length; ++i) {
          // TODO @raph
          stores[i].type = 'store';
          stores[i].user = 'messmaker';
          stores[i].userId = 42;
          stores[i].lat = stores[i].latitude;
          stores[i].lng = stores[i].longitude;
          iterateMarkers(stores[i]);
        }
      });

      Utils.getBars().then(bars => {
        for (let i = 0; i < bars.length; ++i) {
          // TODO @raph
          bars[i].type = 'bar';
          bars[i].user = 'messmaker';
          bars[i].userId = 42;
          bars[i].lat = bars[i].latitude;
          bars[i].lng = bars[i].longitude;
          iterateMarkers(bars[i]);
        }
      });

      resolve();
    });
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
    console.log('lkjdslm')
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
   * Leaflet.js marks that holds spot/store/bar marks as subkeys
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
