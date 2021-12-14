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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _BeerCrackerz_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BeerCrackerz.scss */ \"./src/BeerCrackerz.scss\");\n/* harmony import */ var _js_MarkerEnum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/MarkerEnum.js */ \"./src/js/MarkerEnum.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n\n\n\nvar BeerCrackerz = /*#__PURE__*/function () {\n  function BeerCrackerz() {\n    _classCallCheck(this, BeerCrackerz);\n\n    this._map = null;\n    this._coords = {\n      lat: 48.853121540141096,\n      // Paris Notre-Dame latitude\n      lng: 2.3498955769881156,\n      // Paris Notre-Dame longitude\n      zoom: 12 // Default zoom is wide enough\n\n    };\n    this._popupOpened = false;\n\n    this._initPosition().then(this._initMap.bind(this));\n  } // Use geolocation API to get user position if allowed\n\n\n  _createClass(BeerCrackerz, [{\n    key: \"_initPosition\",\n    value: function _initPosition() {\n      var _this = this;\n\n      return new Promise(function (resolve) {\n        if ('geolocation' in navigator) {\n          navigator.geolocation.getCurrentPosition(function (position) {\n            _this._coords.lat = position.coords.latitude;\n            _this._coords.lng = position.coords.longitude;\n            _this._coords.zoom = 18; // Set zoom to max val so user can properly see its position in map\n            // TODO listen do position update, notify on map where user is\n\n            resolve();\n          }, resolve);\n        } else {\n          resolve();\n        }\n      });\n    }\n  }, {\n    key: \"_initMap\",\n    value: function _initMap() {\n      // Use main div to inject OSM into\n      this._map = L.map('beer-crakerz-map').setView([this._coords.lat, this._coords.lng], this._coords.zoom); // Subscribe to click event on map to react\n\n      this._map.on('click', this._mapClicked.bind(this)); // Add OSM credits to the map next to leaflet credits\n\n\n      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap contributors</a>'\n      }).addTo(this._map);\n    }\n  }, {\n    key: \"_placeMarker\",\n    value: function _placeMarker(options) {\n      var _this2 = this;\n\n      var icon = _js_MarkerEnum_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].black;\n\n      if (options.type === 'store') {\n        icon = _js_MarkerEnum_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].red;\n      }\n\n      var marker = L.marker([options.lat, options.lng], {\n        icon: icon\n      }).addTo(this._map).bindPopup(options.name);\n      marker.on('click', function () {\n        _this2._popupOpened = true;\n\n        _this2._map.setView(options, _this2._map.getZoom(), {\n          animate: true,\n          duration: 0.8\n        });\n      });\n    }\n  }, {\n    key: \"_mapClicked\",\n    value: function _mapClicked(event) {\n      if (this._popupOpened === true) {\n        this._popupOpened = false;\n\n        this._map.closePopup();\n      } else {\n        this._popupOpened = true;\n\n        this._newPOI(event.latlng);\n      }\n    }\n  }, {\n    key: \"_newPOI\",\n    value: function _newPOI(options) {\n      var _this3 = this;\n\n      var addSpot = function addSpot() {\n        _this3._fetchTemplate('assets/html/newspot.html').then(function (dom) {\n          var name = dom.querySelector('#spot-name');\n          var submit = dom.querySelector('#submit-spot');\n          submit.addEventListener('click', function () {\n            options.name = name.value;\n            options.type = 'spot';\n            _this3._popupOpened = false;\n\n            _this3._map.closePopup();\n\n            _this3._placeMarker(options);\n          });\n          pop.setContent(dom);\n        });\n      };\n\n      var addStore = function addStore() {\n        _this3._fetchTemplate('assets/html/newstore.html').then(function (dom) {\n          var name = dom.querySelector('#store-name');\n          var submit = dom.querySelector('#submit-store');\n          submit.addEventListener('click', function () {\n            options.name = name.value;\n            options.type = 'store';\n            _this3._popupOpened = false;\n\n            _this3._map.closePopup();\n\n            _this3._placeMarker(options);\n          });\n          pop.setContent(dom);\n        });\n      };\n\n      var poiWrapper = document.createElement('DIV');\n      var newSpot = document.createElement('BUTTON');\n      var newStore = document.createElement('BUTTON');\n      newSpot.innerHTML = 'Ajouter un spot';\n      newStore.innerHTML = 'Ajouter un point de vente';\n      newSpot.addEventListener('click', addSpot);\n      newStore.addEventListener('click', addStore);\n      poiWrapper.appendChild(newSpot);\n      poiWrapper.appendChild(newStore);\n      var pop = L.popup({\n        className: 'new-poi'\n      }).setLatLng(options).setContent(poiWrapper).openOn(this._map);\n    }\n  }, {\n    key: \"_buildNewStorePopupUI\",\n    value: function _buildNewStorePopupUI() {\n      return \"\";\n    }\n  }, {\n    key: \"_fetchTemplate\",\n    value: function _fetchTemplate(url) {\n      return new Promise(function (resolve, reject) {\n        fetch(url).then(function (data) {\n          data.text().then(function (htmlString) {\n            resolve(document.createRange().createContextualFragment(htmlString));\n          })[\"catch\"](reject);\n        })[\"catch\"](reject);\n      });\n    }\n  }]);\n\n  return BeerCrackerz;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BeerCrackerz);\n\n//# sourceURL=webpack://BeerCrackerz/./src/BeerCrackerz.js?");

/***/ }),

/***/ "./src/js/MarkerEnum.js":
/*!******************************!*\
  !*** ./src/js/MarkerEnum.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.freeze({\n  blue: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-blue.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  gold: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-gold.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  red: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-red.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  green: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-green.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  orange: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-orange.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  yellow: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-yellow.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  violet: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-violet.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  grey: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-grey.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  }),\n  black: new L.Icon({\n    iconUrl: 'assets/img/marker/marker-icon-2x-black.png',\n    shadowUrl: 'assets/img/marker/marker-shadow.png',\n    iconSize: [25, 41],\n    iconAnchor: [12, 41],\n    popupAnchor: [1, -34],\n    shadowSize: [41, 41]\n  })\n}));\n\n//# sourceURL=webpack://BeerCrackerz/./src/js/MarkerEnum.js?");

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