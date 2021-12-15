/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BeerCrackerz.js":
/*!*****************************!*\
  !*** ./src/BeerCrackerz.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _BeerCrackerz_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BeerCrackerz.scss */ \"./src/BeerCrackerz.scss\");\n/* harmony import */ var _js_MapHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/MapHelper.js */ \"./src/js/MapHelper.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n\n\n\nvar BeerCrackerz = /*#__PURE__*/function () {\n  function BeerCrackerz() {\n    _classCallCheck(this, BeerCrackerz);\n\n    this._map = null;\n    this._user = {\n      lat: 48.853121540141096,\n      // Paris Notre-Dame latitude\n      lng: 2.3498955769881156,\n      // Paris Notre-Dame longitude\n      marker: null\n    };\n    this._newMarker = null;\n\n    this._initMap().then(this._initGeolocation.bind(this)).then(this._initCmdBar.bind(this));\n  } // Use geolocation API to get user position if allowed\n\n\n  _createClass(BeerCrackerz, [{\n    key: \"_initGeolocation\",\n    value: function _initGeolocation() {\n      var _this = this;\n\n      return new Promise(function (resolve) {\n        if ('geolocation' in navigator) {\n          navigator.geolocation.getCurrentPosition(function (position) {\n            _this._user.lat = position.coords.latitude;\n            _this._user.lng = position.coords.longitude;\n            _js_MapHelper_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].drawUserMarker(_this._user);\n\n            _this._map.setView([_this._user.lat, _this._user.lng], 18);\n\n            navigator.geolocation.watchPosition(function (position) {\n              _this._user.lat = position.coords.latitude;\n              _this._user.lng = position.coords.longitude;\n              _js_MapHelper_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].drawUserMarker(_this._user);\n            });\n            resolve();\n          }, resolve);\n        } else {\n          resolve();\n        }\n      });\n    }\n  }, {\n    key: \"_initMap\",\n    value: function _initMap() {\n      var _this2 = this;\n\n      return new Promise(function (resolve) {\n        // Use main div to inject OSM into\n        _this2._map = window.L.map('beer-crakerz-map').setView([_this2._user.lat, _this2._user.lng], 18); // Subscribe to click event on map to react\n\n        _this2._map.on('click', _this2._mapClicked.bind(_this2)); // Add OSM credits to the map next to leaflet credits\n\n\n        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n          attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>'\n        }).addTo(_this2._map);\n        resolve();\n      });\n    }\n  }, {\n    key: \"_initCmdBar\",\n    value: function _initCmdBar() {\n      document.getElementById('focus-on').addEventListener('click', this._focusOn.bind(this));\n    }\n  }, {\n    key: \"_focusOn\",\n    value: function _focusOn() {\n      this._map.setView([this._user.lat, this._user.lng], this._map.getZoom());\n    }\n  }, {\n    key: \"_mapClicked\",\n    value: function _mapClicked(event) {\n      if (this._newMarker && this._newMarker.popupClosed) {\n        // Avoid to open new marker right after popup closing\n        this._newMarker = null;\n      } else if (this._newMarker === null || !this._newMarker.isBeingDefined) {\n        // Only create new marker if none is in progress\n        this._newMarker = _js_MapHelper_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].definePOI(event.latlng);\n        this._newMarker.addedCallback = this._markerSaved.bind(this);\n      }\n    }\n  }, {\n    key: \"_markerSaved\",\n    value: function _markerSaved(options) {\n      // TODO Save dat server side with user info and stuff\n      console.log(options);\n      this._newMarker = null;\n    }\n  }, {\n    key: \"map\",\n    get: function get() {\n      return this._map;\n    }\n  }]);\n\n  return BeerCrackerz;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BeerCrackerz);\n\n//# sourceURL=webpack://BeerCrackerz/./src/BeerCrackerz.js?");

/***/ }),

/***/ "./src/js/MapHelper.js":
/*!*****************************!*\
  !*** ./src/js/MapHelper.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _MarkerEnum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MarkerEnum.js */ \"./src/js/MarkerEnum.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"./src/js/Utils.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n\n\n\nvar MapHelper = /*#__PURE__*/function () {\n  function MapHelper() {\n    _classCallCheck(this, MapHelper);\n  }\n\n  _createClass(MapHelper, null, [{\n    key: \"placeMarker\",\n    value: function placeMarker(options) {\n      var icon = _MarkerEnum_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].black;\n\n      if (options.type === 'store') {\n        icon = _MarkerEnum_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].blue;\n      } else if (options.type === 'spot') {\n        icon = _MarkerEnum_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].green;\n      } else if (options.type === 'user') {\n        icon = _MarkerEnum_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].user;\n      }\n\n      var marker = window.L.marker([options.lat, options.lng], {\n        icon: icon\n      }).addTo(window.BeerCrackerz.map);\n\n      if (options.name) {\n        marker.bindPopup(options.name);\n      }\n\n      return marker;\n    }\n  }, {\n    key: \"drawUserMarker\",\n    value: function drawUserMarker(options) {\n      if (!options.marker) {\n        options.type = 'user';\n        options.marker = MapHelper.placeMarker(options);\n      } else {\n        options.marker.setLatLng(options);\n      }\n    }\n  }, {\n    key: \"definePOI\",\n    value: function definePOI(options) {\n      var poiWrapper = document.createElement('DIV');\n      var newSpot = document.createElement('BUTTON');\n      var newStore = document.createElement('BUTTON');\n      newSpot.innerHTML = 'Ajouter un spot';\n      newStore.innerHTML = 'Ajouter un vendeur';\n      poiWrapper.className = 'new-poi';\n      poiWrapper.appendChild(newSpot);\n      poiWrapper.appendChild(newStore);\n      options.name = poiWrapper; // Update popup content with DOM elements\n\n      var marker = MapHelper.placeMarker(options).openPopup();\n      options.marker = marker; // Attach marker to option so it can be manipulated in clicked callbacks\n\n      newSpot.addEventListener('click', function () {\n        marker.isBeingDefined = true;\n        marker.closePopup();\n        MapHelper.defineNewSpot(options);\n      });\n      newStore.addEventListener('click', function () {\n        marker.isBeingDefined = true;\n        marker.closePopup();\n        MapHelper.defineNewStore(options);\n      });\n      marker.on('popupclose', function () {\n        if (!marker.isBeingDefined) {\n          marker.popupClosed = true;\n          window.BeerCrackerz.map.removeLayer(marker);\n        }\n      });\n      return marker;\n    }\n  }, {\n    key: \"defineNewSpot\",\n    value: function defineNewSpot(options) {\n      _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].fetchTemplate('assets/html/newspot.html').then(function (dom) {\n        var name = dom.querySelector('#spot-name');\n        var submit = dom.querySelector('#submit-spot');\n        var cancel = dom.querySelector('#cancel-spot');\n        var close = dom.querySelector('#close-aside'); // Method to clear aside and hide it, and remove temporary marker on the map\n\n        var _cleanDefineUI = function _cleanDefineUI() {\n          options.marker.isBeingDefined = false;\n          window.BeerCrackerz.map.removeLayer(options.marker);\n          document.getElementById('aside').style.opacity = 0;\n          setTimeout(function () {\n            return document.getElementById('aside').innerHTML = '';\n          }, 200); // Match CSS transition duration\n        }; // Submit or cancel event subscriptions\n\n\n        submit.addEventListener('click', function () {\n          _cleanDefineUI();\n\n          MapHelper.buildSpotUI(name.value).then(function (dom) {\n            options.name = dom;\n            options.type = 'spot';\n            MapHelper.placeMarker(options);\n            options.marker.addedCallback(options);\n          });\n        });\n        cancel.addEventListener('click', _cleanDefineUI);\n        close.addEventListener('click', _cleanDefineUI); // Append new DOM element at the end to keep its scope while building events and co.\n\n        document.getElementById('aside').innerHTML = '';\n        document.getElementById('aside').appendChild(dom);\n        document.getElementById('aside').style.opacity = 1;\n      });\n    }\n  }, {\n    key: \"defineNewStore\",\n    value: function defineNewStore(options) {\n      _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].fetchTemplate('assets/html/newstore.html').then(function (dom) {\n        var name = dom.querySelector('#store-name');\n        var submit = dom.querySelector('#submit-store');\n        var cancel = dom.querySelector('#cancel-store');\n        var close = dom.querySelector('#close-aside'); // Method to clear aside and hide it, and remove temporary marker on the map\n\n        var _cleanDefineUI = function _cleanDefineUI() {\n          options.marker.isBeingDefined = false;\n          window.BeerCrackerz.map.removeLayer(options.marker);\n          document.getElementById('aside').style.opacity = 0;\n          setTimeout(function () {\n            return document.getElementById('aside').innerHTML = '';\n          }, 200); // Match CSS transition duration\n        }; // Submit or cancel event subscriptions\n\n\n        submit.addEventListener('click', function () {\n          _cleanDefineUI();\n\n          MapHelper.buildStoreUI(name.value).then(function (dom) {\n            options.name = dom;\n            options.type = 'store';\n            MapHelper.placeMarker(options);\n            options.marker.addedCallback(options);\n          });\n        });\n        cancel.addEventListener('click', _cleanDefineUI);\n        close.addEventListener('click', _cleanDefineUI); // Append new DOM element at the end to keep its scope while building events and co.\n\n        document.getElementById('aside').innerHTML = '';\n        document.getElementById('aside').appendChild(dom);\n        document.getElementById('aside').style.opacity = 1;\n      });\n    }\n  }, {\n    key: \"buildSpotUI\",\n    value: function buildSpotUI(name) {\n      return new Promise(function (resolve) {\n        _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].fetchTemplate('assets/html/spot.html').then(function (dom) {\n          var element = document.createElement('DIV');\n          element.appendChild(dom);\n          element.innerHTML = element.innerHTML.replace('{{SPOT_NAME}}', _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].stripDom(name));\n          resolve(element);\n        });\n      });\n    }\n  }, {\n    key: \"buildStoreUI\",\n    value: function buildStoreUI(name) {\n      return new Promise(function (resolve) {\n        _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].fetchTemplate('assets/html/store.html').then(function (dom) {\n          var element = document.createElement('DIV');\n          element.appendChild(dom);\n          element.innerHTML = element.innerHTML.replace('{{STORE_NAME}}', _Utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].stripDom(name));\n          resolve(element);\n        });\n      });\n    }\n  }]);\n\n  return MapHelper;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MapHelper);\n\n//# sourceURL=webpack://BeerCrackerz/./src/js/MapHelper.js?");

/***/ }),

/***/ "./src/js/MarkerEnum.js":
/*!******************************!*\
  !*** ./src/js/MarkerEnum.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze({\n  blue: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-blue.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  gold: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-gold.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  red: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-red.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  green: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-green.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  orange: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-orange.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  yellow: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-yellow.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  violet: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-violet.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  grey: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-grey.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  black: new window.L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-black.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  user: new window.L.Icon({\n    iconUrl: 'assets/img/marker/user-position.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [32, 32],\n    iconAnchor: [16, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [32, 32]\n  })\n}));\n\n//# sourceURL=webpack://BeerCrackerz/./src/js/MarkerEnum.js?");

/***/ }),

/***/ "./src/js/Utils.js":
/*!*************************!*\
  !*** ./src/js/Utils.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\nvar Utils = /*#__PURE__*/function () {\n  function Utils() {\n    _classCallCheck(this, Utils);\n  }\n\n  _createClass(Utils, null, [{\n    key: \"fetchTemplate\",\n    value: function fetchTemplate(url) {\n      return new Promise(function (resolve, reject) {\n        fetch(url).then(function (data) {\n          data.text().then(function (html) {\n            resolve(document.createRange().createContextualFragment(html));\n          })[\"catch\"](reject);\n        })[\"catch\"](reject);\n      });\n    }\n  }, {\n    key: \"stripDom\",\n    value: function stripDom(html) {\n      var doc = new DOMParser().parseFromString(html, 'text/html');\n      return doc.body.textContent || '';\n    }\n  }]);\n\n  return Utils;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);\n\n//# sourceURL=webpack://BeerCrackerz/./src/js/Utils.js?");

/***/ }),

/***/ "./src/BeerCrackerz.scss":
/*!*******************************!*\
  !*** ./src/BeerCrackerz.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://BeerCrackerz/./src/BeerCrackerz.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/BeerCrackerz.js");
/******/ 	window.BeerCrackerz = __webpack_exports__["default"];
/******/ 	
/******/ })()
;