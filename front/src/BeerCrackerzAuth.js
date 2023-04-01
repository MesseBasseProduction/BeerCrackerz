import './BeerCrackerzAuth.scss';
import Kom from './js/core/Kom.js';
import LangManager from './js/core/LangManager.js';

import VisuHelper from './js/ui/VisuHelper.js';
import MarkPopup from './js/ui/MarkPopup';
import ZoomSlider from './js/ui/component/ZoomSlider.js';

import CustomEvents from './js/utils/CustomEvents.js';
import Utils from './js/utils/Utils.js';
import AccuracyEnum from './js/utils/enums/AccuracyEnum.js';
import ClustersEnum from './js/utils/enums/ClusterEnum.js';
import ProvidersEnum from './js/utils/enums/ProviderEnum.js';
import MapEnum from './js/utils/enums/MapEnum.js';
import MarkersEnum from './js/utils/enums/MarkerEnum.js';


window.VERSION = '0.1.0';
window.Evts = new CustomEvents();


class BeerCrackerzAuth {


  /**
   * @summary The BeerCrackerzAuth main component
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * This component handles all the authentication pages for BeerCrackerz. It provides the login, the
   * register and the forgot password process. It also provides a public map so unauthenticated user
   * can still browse the best BeerCrackerz spots. For more information, please consult the application
   * description page at <a href="https://about.beercrackerz.org">https://about.beercrackerz.org/</a>
   * </blockquote>
   **/
  constructor() {
    /**
     * The minimal user object holds position and accuracy
     * @type {Object}
     * @private
     **/
    this._user = {
      lat: 48.853121540141096, // Default lat to Paris Notre-Dame latitude
      lng: 2.3498955769881156, // Default lng to Paris Notre-Dame longitude
      accuracy: 0 // Accuracy in meter given by geolocation API
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
    /**
     * The Aside DOM container
     * @type {Object}
     * @private
     **/
    this._aside = null;
    /**
     * The Aside expand status
     * @type {Boolean}
     * @private
     **/
    this._isAsideExpanded = true;
    /**
     * The server communication class
     * @type {Object}
     * @private
     **/
    this._kom = null;
    /**
     * The frontend i18n manager
     * @type {Object}
     * @private
     **/
    this._lang = new LangManager();

    this._init();
  }


  // ======================================================================== //
  // -------------------------- App initialization -------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name _init
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _init() method handle the whole app initialization sequence. It first
   * set the aside content to login (as it comes with the base welcome.html template),
   * then initialize the communication and notification handler, and will finally
   * initialize the whole map, markers and interactivity.
   * </blockquote>
   **/
  _init() {
    // Force default language to english for first page loading
    if (Utils.getPreference('selected-lang') === null) {
      Utils.setPreference('selected-lang', 'en');
    }
    this.nls.updateLang(Utils.getPreference('selected-lang')).then(() => {
      // By default, the template contains the login aside, no need to fetch it
      this._handleLoginAside();
      this._kom = new Kom();
      // We ensure the Kom layer is valid and ready to go any further
      if (this._kom.isValid === true) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (params.activate) {
          const error = document.getElementById('login-error');
          error.classList.add('visible');
          if (params.activate === 'True') {
            error.classList.add('success');
            error.innerHTML = this.nls.register('activationSuccess');
          } else {
            error.innerHTML = this.nls.register('activationError');
          }
        } else if (params.uidb64 && params.token) {
          this._loadForgotPasswordAside(params);
        }

        this._initMap()
          .then(this._initGeolocation.bind(this))
          .then(this._initMarkers.bind(this))
          .then(this._initEvents.bind(this))
          .catch(this._fatalError.bind(this));
      } else {
        this._fatalError({
          file: 'Kom.js',
          msg: (this._kom.csrf === null) ? `The CSRF token doesn't exists in cookies` : `The headers amount is invalid`
        });
      }
    });
  }


  /**
   * @method
   * @async
   * @name _initMap
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
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
      }).setView([48.853121540141096, 2.3498955769881156], 12);
      // Add meter and feet scale on map
      window.L.control.scale().addTo(this._map);
      // Place user marker on the map
      this._drawUserMarker();
      // Prevent panning outside of the world's edge
      this._map.setMaxBounds(MapEnum.mapBounds);
      // Add layer group to interface
      const baseMaps = {};
      baseMaps[`<p>${this.nls.map('planLayerOSM')}</p>`] = ProvidersEnum.planOsm;
      baseMaps[`<p>${this.nls.map('satLayerEsri')}</p>`] = ProvidersEnum.satEsri;
      // Append layer depending on user preference
      ProvidersEnum.planOsm.addTo(this._map);
      // Add layer switch radio on bottom right of the map
      window.L.control.layers(baseMaps, {}, { position: 'bottomright' }).addTo(this._map);
      // Init zoom slider when map has been created
      this._zoomSlider = new ZoomSlider(this._map);
      resolve();
    });
  }


  /**
   * @method
   * @async
   * @name _initGeolocation
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
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
            this._drawUserMarker();
          }
        }, null, AccuracyEnum.high);
        resolve();
      } else {
        resolve();
      }
    });
  }


  /**
   * @method
   * @async
   * @name _initMarkers
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
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
      this._clusters.spot = ClustersEnum.spot;
      this._clusters.shop = ClustersEnum.shop;
      this._clusters.bar = ClustersEnum.bar;

      this._map.addLayer(this._clusters.spot);
      this._map.addLayer(this._clusters.shop);
      this._map.addLayer(this._clusters.bar);

      const iterateMarkers = mark => {
        const popup = new MarkPopup(mark, dom => {
          mark.dom = dom;
          mark.marker = VisuHelper.addMark(mark);
          mark.popup = popup;
          this._marks[mark.type].push(mark);
          this._clusters[mark.type].addLayer(mark.marker);
        });
      };

      this._kom.getSpots().then(spots => {
        for (let i = 0; i < spots.length; ++i) {
          iterateMarkers(spots[i]);
        }
      });

      this._kom.getShops().then(shops => {
        for (let i = 0; i < shops.length; ++i) {
          iterateMarkers(shops[i]);
        }
      });

      this._kom.getBars().then(bars => {
        for (let i = 0; i < bars.length; ++i) {
          iterateMarkers(bars[i]);
        }
      });

      resolve();
    });
  }


  /**
   * @method
   * @async
   * @name _initEvents
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _initEvents() method will listen to all required events to manipulate the map. Those events
   * are both for commands and for map events (click, drag, zoom and layer change).
   * </blockquote>
   * @returns {Promise} A Promise resolved when preferences are set
   **/
  _initEvents() {
    return new Promise(resolve => {
      // Map is dragged by user mouse/finger
      this._map.on('drag', () => {
        // Constrain pan to the map bounds
        this._map.panInsideBounds(MapEnum.mapBounds, { animate: true });
      });
      // Auto hide labels if zoom level is too high (and restore it when needed)
      this._map.on('zoomend', () => {
        if (this._map.getZoom() < 15) {
          this._setMarkerLabels(this._marks.spot, false);
          this._setMarkerLabels(this._marks.shop, false);
          this._setMarkerLabels(this._marks.bar, false);
        } else {
          this._setMarkerLabels(this._marks.spot, true);
          this._setMarkerLabels(this._marks.shop, true);
          this._setMarkerLabels(this._marks.bar, true);
        }
      });
      // Update map view for big popups
      this._map.on('popupopen', event => {
        const px = this._map.project(event.target._popup._latlng);
        px.y -= event.target._popup._container.clientHeight / 2;
        this._map.panTo(this._map.unproject(px), { animate: true });
      });
      // Clustering events
      this._clusters.spot.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'spot'));
      this._clusters.shop.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'shop'));
      this._clusters.bar.on('animationend', VisuHelper.checkClusteredMark.bind(this, 'bar'));
      // Center on command
      document.getElementById('center-on').addEventListener('click', () => {
        this._map.flyTo([this._user.lat, this._user.lng], 18);
      });
      resolve();
    });
  }


  /**
   * @method
   * @name _fatalError
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _fatalError() method will handle all fatal errors from which the app
   * can't recover. It redirects to the error page and send info through the referrer
   * so the error page can properly displays it to the user
   * </blockquote>
   * @param {Object} err - The error object with its info
   * @param {Number} [err.status] - The HTTP error code
   * @param {String} [err.url] - The URL that generated the HTTP error
   * @param {String} [err.file] - The file in which the fatal error happened
   * @param {String} [err.msg] - The custom error message
   **/
  _fatalError(err) {
    if (window.DEBUG === false) { // In production, do the actual redirection
      // We add params to referrer then redirect to error page so the information can be displayed
      if (err && err.status) { // HTTP or related error
        window.history.pushState('', '', `/welcome?&page=welcome&code=${err.status}&url=${err.url}&msg=${err.msg}`);
      } else if (err && err.file && err.msg) { // File or process error
        window.history.pushState('', '', `/welcome?&page=welcome&file=${err.file}&msg=${err.msg}`);
      } else { // Generic error fallback
        window.history.pushState('', '', `/welcome?&page=welcome&file=BeerCrackerzAuth.js&msg=An unknown error occured`);
      }
      // Now redirect the user to error page
      window.location.href = '/error';
    } else {
      console.error(err);
    }
  }


  // ======================================================================== //
  // -------------------------- Aside interactivity ------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name _toggleAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _toggleAside() method will expand or collapse the aside, depending on the
   * `this._isAsideExpanded` flag state. To be used as a callba, adding useful parameters to url before redirectck on aside expander.
   * </blockquote>
   **/
  _toggleAside() {
    if (this._isAsideExpanded === true) { // Collapsing aside
      this._isAsideExpanded = false;
      document.documentElement.style.setProperty('--aside-offset', '-40rem');
      document.getElementById('aside-expander-icon').src = '/static/img/logo/left.svg';
      document.getElementById('expander-back').classList.add('visible');
      setTimeout(() => document.getElementById('aside-expander').style.left = '-6rem', 300);
    } else { // Expanding aside
      this._isAsideExpanded = true;
      document.documentElement.style.setProperty('--aside-offset', '0rem');
      document.getElementById('aside-expander-icon').src = '/static/img/logo/right.svg';
      document.getElementById('aside-expander').style.left = '0';
      document.getElementById('expander-back').classList.remove('visible');
    }
  }


  /**
   * @method
   * @async
   * @name _loadAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _loadAside() method is a generic method to load an HTML template and replace
   * the aside DOM content with that template, aswell as updating the document's class.
   * </blockquote>
   * @param {String} type - The aside to load in login/register/forgot-password
   * @returns {Promise} A Promise resolved when template is loaded and in DOM
   **/
  _loadAside(type) {
    return new Promise((resolve, reject) => {
      this._kom.getTemplate(`/aside/${type}`).then(dom => {
        //document.body.className = 'login dark-theme'; // Clear previous css class
        document.body.classList.add(type); // Update body class with current aside view
        // We need to get aside at the last moment because of nls that changed HTML content
        this._aside = document.getElementById('aside');
        this._aside.innerHTML = ''; // Clear HTML content
        this._aside.appendChild(dom); // Replace with current aside dom
        resolve();
      }).catch(reject);
    });
  }


  /**
   * @method
   * @name _loadLoginAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _loadLoginAside() method will load the login content into the aside
   * </blockquote>
   **/
  _loadLoginAside(checkMail = false) {
    this._loadAside('login').then(this._handleLoginAside.bind(this, checkMail)).catch(err => {
      err.msg = `Couldn't fetch or build the login aside`;
      this._fatalError(err);
    });
  }


  /**
   * @method
   * @name _loadRegisterAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _loadRegisterAside() method will load the register content into the aside
   * </blockquote>
   **/
  _loadRegisterAside() {
    this._loadAside('register').then(this._handleRegisterAside.bind(this)).catch(err => {
      err.msg = `Couldn't fetch or build the register aside`;
      this._fatalError(err);
    });
  }


  /**
   * @method
   * @name _loadForgotPasswordAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _loadForgotPasswordAside() method will load the forgot password content into the aside
   * </blockquote>
   **/
  _loadForgotPasswordAside(params) {
    if (params.uidb64 && params.token) {
      this._loadAside('resetpassword').then(this._handleResetPasswordAside.bind(this, params)).catch(err => {
        err.msg = `Couldn't fetch or build the forgot password aside`;
        this._fatalError(err);
      });
    } else {
      this._loadAside('forgotpassword').then(this._handleForgotPasswordAside.bind(this)).catch(err => {
        err.msg = `Couldn't fetch or build the forgot password aside`;
        this._fatalError(err);
      });
    }
  }


  /**
   * @method
   * @name _handleLoginAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _handleLoginAside() method will replace the aside content with the login template,
   * then it will handle its i18n, and all of its interactivity to submit login form to the server.
   * </blockquote>
   **/
  _handleLoginAside(checkMail = false) {
    // Update page nls according to browser language
    document.title = this.nls.login('headTitle');
    this.nls.handleLoginAside(document.getElementById('aside'));

    const error = document.getElementById('login-error');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (checkMail === true) {
      error.classList.add('visible');
      error.innerHTML = this.nls.login('checkMail');
    }

    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      error.className = 'error';
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
    const _backValidation = (e) => {
      // Check response and handle status codes
      // If all front and back tests are ok, redirect to auth
      // If the user manually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = '/';
    };
    const _submit = () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      password.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/auth/login/', {
          username: username.value,
          password: password.value
        }).then(_backValidation).catch(e => {
          error.classList.add('visible');
          if (e.status === 401) {
            error.innerHTML = this.nls.login('credsInvalid');
          } else {
            error.innerHTML = this.nls.login('serverError');
          }
        });
      }
    };
    // Submit click event
    document.getElementById('login-submit').addEventListener('click', _submit.bind(this), false);
    password.addEventListener('keydown', e => { if (e.key === 'Enter') { _submit(); } });
    // Register event
    document.getElementById('register-aside').addEventListener('click', this._loadRegisterAside.bind(this), false);
    document.getElementById('forgot-password').addEventListener('click', this._loadForgotPasswordAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  /**
   * @method
   * @name _handleRegisterAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _handleRegisterAside() method will replace the aside content with the register template,
   * then it will handle its i18n, and all of its interactivity to submit register form to the server.
   * </blockquote>
   **/
  _handleRegisterAside() {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.register('headTitle');
    this.nls.handleRegisterAside(aside);
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
        if (username.value === '') { username.classList.add('error'); }
        if (mail.value === '') { mail.classList.add('error'); }
        if (password1.value === '') { password1.classList.add('error'); }
        if (password2.value === '') { password2.classList.add('error'); }
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
    const _backValidation = () => {
      // Redirect aside to login
      this._loadLoginAside(true);
    };
    const _submit = () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      mail.classList.remove('error');
      password1.classList.remove('error');
      password2.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/auth/register/', {
          username: username.value,
          email: mail.value,
          password1: password1.value,
          password2: password2.value
        }).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.register('serverError');
        });
      }
    };
    // Submit click event
    document.getElementById('register-submit').addEventListener('click', _submit.bind(this), false);
    password2.addEventListener('keydown', e => { if (e.key === 'Enter') { _submit(); } });
    // Register event
    document.getElementById('login-aside').addEventListener('click', this._loadLoginAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  /**
   * @method
   * @name _handleForgotPasswordAside
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _handleForgotPasswordAside() method will replace the aside content with the fogot password
   * template, then it will handle its i18n, and all of its interactivity to submit forgot password
   * form to the server.
   * </blockquote>
   **/
  _handleForgotPasswordAside() {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.forgotPassword('headTitle');
    this.nls.handleForgotPasswordAside(aside);
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
    const _backValidation = () => {
      // Check response and handle status codes
      error.classList.add('visible');
      error.innerHTML = this.nls.login('checkMail');
    };
    const _submit = () => {
      // Reset error css classes
      error.classList.remove('visible');
      mail.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post('/api/auth/password-reset-request/', {
          email: mail.value
        }, null).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.forgotPassword('serverError');
        });
      }
    };
    // Submit click event
    document.getElementById('forgot-password-submit').addEventListener('click', _submit.bind(this), false);
    mail.addEventListener('keydown', e => { if (e.key === 'Enter') { _submit(); } });

    document.getElementById('login-aside').addEventListener('click', this._loadLoginAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  _handleResetPasswordAside(params) {
    // Update page nls according to browser language
    const aside = document.getElementById('aside');
    document.title = this.nls.resetPassword('headTitle');
    this.nls.handleResetPasswordAside(aside);
    const error = document.getElementById('reset-password-error');
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      // Handling empty error cases
      if (password1.value === '' || password2.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.resetPassword('fieldEmpty');
        if (password1.value === '') { password1.classList.add('error'); }
        if (password2.value === '') { password2.classList.add('error'); }
        return false;
      } else if (password1.value !== password2.value) {
        error.classList.add('visible');
        error.innerHTML = this.nls.resetPassword('notMatchingPassword');
        password1.classList.add('error');
        password2.classList.add('error');
        return false;
      }
      return true;
    };
    const _backValidation = () => {
      // Redirect aside to login
      this._loadLoginAside();
    };
    const _submit = () => {
      // Reset error css classes
      error.classList.remove('visible');
      password1.classList.remove('error');
      password2.classList.remove('error');
      if (_frontFieldValidation()) {
        this._kom.post(`/api/auth/password-reset/?uidb64=${params.uidb64}&token=${params.token}`, {
          password1: password1.value,
          password2: password2.value
        }, null).then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.resetPassword('serverError');
        });
      }
    };
    // Submit click event
    document.getElementById('reset-password-submit').addEventListener('click', _submit.bind(this), false);
    password2.addEventListener('keydown', e => { if (e.key === 'Enter') { _submit(); } });

    document.getElementById('login-aside').addEventListener('click', this._loadLoginAside.bind(this), false);
    document.getElementById('aside-expander').addEventListener('click', this._toggleAside.bind(this), false);
  }


  // ======================================================================== //
  // -------------------------- Public map methods -------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name _drawUserMarker
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _drawUserMarker() method will draw the user marker to the position received
   * from the geolocation API. If the marker doesn't exist yet, it will create it and
   * place it to its default position (see constructor/this._user).
   * </blockquote>
   **/
  _drawUserMarker() {
    if (!this.user.marker) { // Create user marker if not existing
      this.user.type = 'user';
      this.user.marker = VisuHelper.addMark(this.user);
    } else { // Update user marker position, range, and accuracy circle
      this.user.marker.setLatLng(this.user);
    }
  }


  /**
   * @method
   * @name _setMarkerLabels
   * @private
   * @memberof BeerCrackerzAuth
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * The _setMarkerLabels() method will set the label visibility for an array of marks
   * depending on the `visible` argument value.
   * </blockquote>
   * @param {Object[]} marks - The array of marks to edit visibility from
   * @param {Boolean} visible - The labels visibility state to apply
  **/
  _setMarkerLabels(marks, visible) {
    for (let i = 0; i < marks.length; ++i) {
      if (visible) {
        marks[i].tooltip.addTo(this.map);
      } else {
        marks[i].tooltip.removeFrom(this.map);
      }
    }
  }


  // ======================================================================== //
  // ---------------------------- Class accessors --------------------------- //
  // ======================================================================== //


  get kom() {
    return this._kom;
  }


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
