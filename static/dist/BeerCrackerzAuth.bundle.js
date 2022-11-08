!function(){"use strict";var e={d:function(t,r){for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}},t={};function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.d(t,{default:function(){return v}});var n=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._csrfToken=this._getCsrfCookie(),this._headers=this._createRequestHeaders(),this.isValid=this._checkValidity()}var t,n;return t=e,n=[{key:"_getCsrfCookie",value:function(){if(document.cookie&&""!==document.cookie)for(var e=document.cookie.split(";"),t=0;t<e.length;++t){var r=e[t].split("=");if(void 0!==r&&r[0].toLowerCase().includes("srf"))return decodeURIComponent(r[1])}return null}},{key:"_createRequestHeaders",value:function(){return[["Content-Type","application/json; charset=UTF-8"],["Accept","application/json"],["X-CSRFToken",this._csrfToken]]}},{key:"_checkValidity",value:function(){return null!==this._csrfToken&&3===this._headers.length}},{key:"_resolveAs",value:function(e,t){return new Promise((function(r,n){t?"raw"===e?200===t.status?r(t.responseText):n(t.status):"json"===e||"text"===e?t[e]?r(t[e]()):n(t.status):"dom"===e?t.text().then((function(e){r(document.createRange().createContextualFragment(e))})).catch(n):r():n("F_KOM_MISSING_ARGUMENT")}))}},{key:"_resolveAsJSON",value:function(e){return this._resolveAs("json",e)}},{key:"_resolveAsText",value:function(e){return this._resolveAs("text",e)}},{key:"_resolveAsDom",value:function(e){return this._resolveAs("dom",e)}},{key:"get",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this._resolveAsJSON.bind(this);return new Promise((function(n,i){var o={method:"GET",headers:new Headers([t._headers[0]])};fetch(e,o).then((function(e){return 200!==e.status&&i(e),r(e)})).then(n).catch(i)}))}},{key:"getText",value:function(e){return this.get(e,this._resolveAsText.bind(this))}},{key:"getTemplate",value:function(e){return this.get(e,this._resolveAsDom.bind(this))}},{key:"post",value:function(e,t){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this._resolveAsJSON.bind(this);return new Promise((function(i,o){var s={method:"POST",headers:new Headers(r._headers),body:JSON.stringify(t)};fetch(e,s).then((function(e){return e.status>=400&&o(e),null!=n?n(e):e})).then(i).catch(o)}))}},{key:"postText",value:function(e,t){return this.post(e,t,this._resolveAsText.bind(this))}},{key:"postImage",value:function(e,t){return this.post(e,t,null)}},{key:"patch",value:function(e,t){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this._resolveAsJSON.bind(this);return new Promise((function(i,o){var s={method:"PATCH",headers:new Headers(r._headers),body:JSON.stringify(t)};fetch(e,s).then((function(e){return e.status>=400&&o(e),null!=n?n(e):e})).then(i).catch(o)}))}},{key:"patchImage",value:function(e,t){return this.patch(e,t,null)}},{key:"delete",value:function(e,t){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this._resolveAsJSON.bind(this);return new Promise((function(i,o){var s={method:"DELETE",headers:new Headers(r._headers),body:JSON.stringify(t)};fetch(e,s).then((function(e){return e.status>=400&&o(e),null!=n?n(e):e})).then(i).catch(o)}))}},{key:"_getMarks",value:function(e){var t=this;return new Promise((function(r,n){t.get("http://localhost:8080/api/".concat(e)).then(r).catch(n)}))}},{key:"getSpots",value:function(){return this._getMarks("spot")}},{key:"getShops",value:function(){return this._getMarks("shop")}},{key:"getBars",value:function(){return this._getMarks("bar")}},{key:"_saveMark",value:function(e,t){return this.post("http://localhost:8080/api/".concat(e,"/"),t,this._resolveAsJSON.bind(this))}},{key:"spotCreated",value:function(e){return this._saveMark("spot",e)}},{key:"shopCreated",value:function(e){return this._saveMark("shop",e)}},{key:"barCreated",value:function(e){return this._saveMark("bar",e)}},{key:"_editMark",value:function(e,t,r){return e&&t&&r||Promise.reject(),this.patch("http://localhost:8080/api/".concat(e,"/").concat(t,"/"),r,this._resolveAsJSON.bind(this))}},{key:"spotEdited",value:function(e,t){return this._editMark("spot",e,t)}},{key:"shopEdited",value:function(e,t){return this._editMark("shop",e,t)}},{key:"barEdited",value:function(e,t){return this._editMark("bar",e,t)}},{key:"_deleteMark",value:function(e,t,r){return e&&t&&r||Promise.reject(),this.delete("http://localhost:8080/api/".concat(e,"/").concat(t,"/"),r,null)}},{key:"spotDeleted",value:function(e,t){return this._deleteMark("spot",e,t)}},{key:"shopDeleted",value:function(e,t){return this._deleteMark("shop",e,t)}},{key:"barDeleted",value:function(e,t){return this._deleteMark("bar",e,t)}},{key:"csrf",get:function(){return null}}],n&&r(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}(),i=n;function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function s(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,r;return t=e,r=[{key:"stripDom",value:function(e){return!e||"string"!=typeof e&&"number"!=typeof e?"":(new DOMParser).parseFromString(e,"text/html").body.textContent||""}},{key:"replaceString",value:function(e,t,r){return!!(e&&e.innerHTML&&t&&"string"==typeof t&&r&&"string"==typeof r)&&(e.innerHTML=e.innerHTML.replace(t,r),!0)}},{key:"getDistanceBetweenCoords",value:function(e,t){if(!(e&&t&&Array.isArray(e)&&Array.isArray(t)))return-1;if(2!==e.length||"number"!=typeof e[0]||"number"!=typeof e[1])return-1;if(2!==t.length||"number"!=typeof t[0]||"number"!=typeof t[1])return-1;var r=e[0]*Math.PI/180,n=e[1]*Math.PI/180,i=t[0]*Math.PI/180,o=i-r,s=t[1]*Math.PI/180-n,a=Math.pow(Math.sin(o/2),2)+Math.cos(r)*Math.cos(i)*Math.pow(Math.sin(s/2),2);return 2*Math.asin(Math.sqrt(a))*6371e3}},{key:"precisionRound",value:function(e,t){if("number"!=typeof e||"number"!=typeof t)return-1;var r=Math.pow(10,t||0);return Math.round(e*r)/r}},{key:"setDefaultPreferences",value:function(){null===e.getPreference("poi-show-spot")&&e.setPreference("poi-show-spot",!0),null===e.getPreference("poi-show-shop")&&e.setPreference("poi-show-shop",!0),null===e.getPreference("poi-show-bar")&&e.setPreference("poi-show-bar",!0),null===e.getPreference("poi-show-circle")&&e.setPreference("poi-show-circle",!0),null===e.getPreference("poi-show-label")&&e.setPreference("poi-show-label",!0),null===e.getPreference("map-plan-layer")&&e.setPreference("map-plan-layer","Plan OSM"),null===e.getPreference("selected-lang")&&e.setPreference("selected-lang","en"),null===e.getPreference("app-debug")&&e.setPreference("app-debug",!1),null===e.getPreference("map-high-accuracy")&&e.setPreference("map-high-accuracy",!1),null===e.getPreference("map-center-on-user")&&e.setPreference("map-center-on-user",!1),null===e.getPreference("dark-theme")&&e.setPreference("dark-theme",!0)}},{key:"formatMarker",value:function(e){if(!(e&&e.name&&e.types&&e.lat&&e.lng))return null;if("string"!=typeof e.name||!Array.isArray(e.types)||"number"!=typeof e.lat||"number"!=typeof e.lng)return null;for(var t=0;t<e.types.length;++t)if("string"!=typeof e.types[t])return null;if(e.description&&"string"!=typeof e.description)return null;if(e.modifiers){if(!Array.isArray(e.modifiers))return null;for(var r=0;r<e.modifiers.length;++r)if("string"!=typeof e.modifiers[r])return null}return e.rate&&"number"!=typeof e.rate||e.rate<0||e.rate>4||e.price&&"number"!=typeof e.price||e.price<0||e.price>2?null:{name:e.name,types:e.types,lat:e.lat,lng:e.lng,description:e.description,modifiers:e.modifiers,rate:e.rate,price:e.price}}},{key:"removeAllObjectKeys",value:function(e){return!(!e||"object"!==o(e)||Array.isArray(e)||(Object.keys(e).forEach((function(t){delete e[t]})),0))}},{key:"getPreference",value:function(e){return localStorage.getItem(e)||null}},{key:"setPreference",value:function(e,t){localStorage.setItem(e,t)}}],null&&s(t.prototype,null),r&&s(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}(),l=Object.freeze(["en","fr","es","de","pt"]);function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._lang="",this._fullLang="",this._values={}}var t,r;return t=e,(r=[{key:"_init",value:function(){var e=this;return new Promise((function(t,r){fetch("/static/nls/".concat(e._lang,".json")).then((function(n){200!==n.status&&(n.msg="Fetching the i18n file failed",r(n)),n.text().then((function(i){try{e._values=JSON.parse(i)}catch(e){n.msg="Parsing the i18n file failed",r(n)}t()})).catch(r)})).catch(r)}))}},{key:"updateLang",value:function(e){var t=this;return new Promise((function(r,n){t._lang!==e?(t._lang=-1!==l.indexOf(e)?e:"en",t._fullLang=e,t._init().then(r).catch(n)):r()}))}},{key:"debug",value:function(e){return this._values.debug[e]||""}},{key:"notif",value:function(e){return this._values.notif[e]||""}},{key:"nav",value:function(e){return this._values.nav[e]||""}},{key:"map",value:function(e){return this._values.map[e]||""}},{key:"spot",value:function(e){return this._values.spot[e]||""}},{key:"shop",value:function(e){return this._values.shop[e]||""}},{key:"bar",value:function(e){return this._values.bar[e]||""}},{key:"popup",value:function(e){return this._values.popup[e]||""}},{key:"modal",value:function(e){return this._values.modal[e]||""}},{key:"login",value:function(e){return this._values.auth.login[e]||""}},{key:"register",value:function(e){return this._values.auth.register[e]||""}},{key:"forgotPassword",value:function(e){return this._values.auth.forgotPassword[e]||""}},{key:"resetPassword",value:function(e){return this._values.auth.resetPassword[e]||""}},{key:"handleLoginAside",value:function(e){a.replaceString(e,"{LOGIN_SUBTITLE}",this.login("subtitle")),a.replaceString(e,"{LOGIN_HIDDEN_ERROR}",this.login("hiddenError")),a.replaceString(e,"{LOGIN_USERNAME_LABEL}",this.login("username")),a.replaceString(e,"{LOGIN_USERNAME_PASSWORD}",this.login("password")),a.replaceString(e,"{LOGIN_BUTTON}",this.login("login")),a.replaceString(e,"{LOGIN_NOT_REGISTERED}",this.login("notRegistered")),a.replaceString(e,"{LOGIN_REGISTER}",this.login("register")),a.replaceString(e,"{LOGIN_FORGOT_PASSWORD}",this.login("forgot")),a.replaceString(e,"{LOGIN_PASSWORD_RESET}",this.login("reset"))}},{key:"handleRegisterAside",value:function(e){a.replaceString(e,"{REGISTER_SUBTITLE}",this.register("subtitle")),a.replaceString(e,"{REGISTER_HIDDEN_ERROR}",this.register("hiddenError")),a.replaceString(e,"{REGISTER_USERNAME_LABEL}",this.register("username")),a.replaceString(e,"{REGISTER_MAIL_LABEL}",this.register("mail")),a.replaceString(e,"{REGISTER_USERNAME_PASSWORD_1}",this.register("password1")),a.replaceString(e,"{REGISTER_USERNAME_PASSWORD_2}",this.register("password2")),a.replaceString(e,"{REGISTER_BUTTON}",this.register("register")),a.replaceString(e,"{REGISTER_ALREADY_DONE}",this.register("notRegistered")),a.replaceString(e,"{REGISTER_LOGIN}",this.register("login"))}},{key:"handleForgotPasswordAside",value:function(e){a.replaceString(e,"{FORGOT_PASSWORD_SUBTITLE}",this.forgotPassword("subtitle")),a.replaceString(e,"{FORGOT_PASSWORD_ERROR}",this.register("hiddenError")),a.replaceString(e,"{FORGOT_PASSWORD_MAIL_LABEL}",this.forgotPassword("mail")),a.replaceString(e,"{FORGOT_PASSWORD_BUTTON}",this.forgotPassword("submit")),a.replaceString(e,"{FORGOT_PASSWORD_LOGIN_LABEL}",this.forgotPassword("loginLabel")),a.replaceString(e,"{FORGOT_PASSWORD_LOGIN}",this.forgotPassword("login"))}},{key:"handleResetPasswordAside",value:function(e){a.replaceString(e,"{RESET_PASSWORD_SUBTITLE}",this.resetPassword("subtitle")),a.replaceString(e,"{RESET_PASSWORD_HIDDEN_ERROR}",this.resetPassword("hiddenError")),a.replaceString(e,"{RESET_PASSWORD_1}",this.resetPassword("password1")),a.replaceString(e,"{RESET_PASSWORD_2}",this.resetPassword("password2")),a.replaceString(e,"{RESET_PASSWORD_BUTTON}",this.resetPassword("reset")),a.replaceString(e,"{RESET_PASSWORD_LOGIN_LABEL}",this.resetPassword("loginLabel")),a.replaceString(e,"{RESET_PASSWORD_LOGIN}",this.resetPassword("login"))}},{key:"addMarkModal",value:function(e,t,r){a.replaceString(e.querySelector("#nls-".concat(t,"-title")),"{".concat(t.toUpperCase(),"_TITLE}"),this[t]("".concat(r,"Title"))),a.replaceString(e.querySelector("#nls-".concat(t,"-subtitle")),"{".concat(t.toUpperCase(),"_SUBTITLE}"),this[t]("subtitle")),a.replaceString(e.querySelector("#nls-".concat(t,"-name")),"{".concat(t.toUpperCase(),"_NAME}"),this[t]("nameLabel")),a.replaceString(e.querySelector("#nls-".concat(t,"-desc")),"{".concat(t.toUpperCase(),"_DESC}"),this[t]("descLabel")),a.replaceString(e.querySelector("#nls-".concat(t,"-rate")),"{".concat(t.toUpperCase(),"_RATE}"),this[t]("rateLabel")),a.replaceString(e.querySelector("#nls-".concat(t,"-type")),"{".concat(t.toUpperCase(),"_TYPE}"),this[t]("typeLabel")),a.replaceString(e.querySelector("#nls-".concat(t,"-modifiers")),"{".concat(t.toUpperCase(),"_MODIFIERS}"),this[t]("modifiersLabel")),a.replaceString(e.querySelector("#".concat(t,"-submit")),"{".concat(t.toUpperCase(),"_SUBMIT}"),this.nav("add")),a.replaceString(e.querySelector("#".concat(t,"-close")),"{".concat(t.toUpperCase(),"_CANCEL}"),this.nav("cancel")),e.querySelector("#nls-".concat(t,"-price"))&&a.replaceString(e.querySelector("#nls-".concat(t,"-price")),"{".concat(t.toUpperCase(),"_PRICE}"),this[t]("priceLabel"))}},{key:"deleteMarkModal",value:function(e){a.replaceString(e.querySelector("#nls-modal-title"),"{MODAL_TITLE}",this.modal("deleteMarkTitle")),a.replaceString(e.querySelector("#nls-modal-desc"),"{MODAL_DESC}",this.modal("deleteMarkDesc")),a.replaceString(e.querySelector("#cancel-close"),"{MODAL_CANCEL}",this.nav("cancel")),a.replaceString(e.querySelector("#delete-close"),"{MODAL_DELETE}",this.nav("delete"))}},{key:"userProfileModal",value:function(e){a.replaceString(e.querySelector("#nls-modal-title"),"{MODAL_TITLE}",this.modal("userTitle")),a.replaceString(e.querySelector("#nls-user-high-accuracy"),"{ACCURACY_USER_CHECK}",this.modal("userAccuracyPref")),a.replaceString(e.querySelector("#nls-user-dark-theme"),"{DARK_THEME_CHECK}",this.modal("darkThemePref")),a.replaceString(e.querySelector("#nls-user-debug"),"{DEBUG_USER_CHECK}",this.modal("userDebugPref")),a.replaceString(e.querySelector("#nls-lang-select"),"{LANG_SELECT}",this.modal("langPref")),a.replaceString(e.querySelector("#nls-lang-fr"),"{LANG_FR}",this.modal("langFr")),a.replaceString(e.querySelector("#nls-lang-en"),"{LANG_EN}",this.modal("langEn")),a.replaceString(e.querySelector("#nls-lang-es"),"{LANG_ES}",this.modal("langEs")),a.replaceString(e.querySelector("#nls-lang-de"),"{LANG_DE}",this.modal("langDe")),a.replaceString(e.querySelector("#nls-lang-pt"),"{LANG_PT}",this.modal("langPt")),a.replaceString(e.querySelector("#nls-about-desc"),"{BEERCRACKERZ_DESC}",this.modal("aboutDesc")),a.replaceString(e.querySelector("#nls-update-pp"),"{UPDATE_PROFILE_PIC_LABEL}",this.modal("updatePP"))}},{key:"updateProfilePictureModal",value:function(e){a.replaceString(e.querySelector("#nls-modal-title"),"{MODAL_TITLE}",this.modal("updatePPTitle")),a.replaceString(e.querySelector("#nls-modal-desc"),"{UPDATE_PP_DESC}",this.modal("updatePPDesc")),a.replaceString(e.querySelector("#update-pp-close"),"{UPDATE_PP_CANCEL}",this.nav("cancel")),a.replaceString(e.querySelector("#update-pp-submit"),"{UPDATE_PP_SUBMIT}",this.nav("upload"))}},{key:"hideShowModal",value:function(e){a.replaceString(e.querySelector("#nls-hideshow-modal-title"),"{MODAL_TITLE}",this.modal("hideShowTitle")),a.replaceString(e.querySelector("#nls-hideshow-modal-labels"),"{LABELS_HIDESHOW_MODAL}",this.modal("hideShowLabels")),a.replaceString(e.querySelector("#nls-hideshow-modal-circles"),"{CIRCLES_HIDESHOW_MODAL}",this.modal("hideShowCircles")),a.replaceString(e.querySelector("#nls-hideshow-modal-spots"),"{SPOTS_HIDESHOW_MODAL}",this.modal("hideShowSpots")),a.replaceString(e.querySelector("#nls-hideshow-modal-shops"),"{SHOPS_HIDESHOW_MODAL}",this.modal("hideShowShops")),a.replaceString(e.querySelector("#nls-hideshow-modal-bars"),"{BARS_HIDESHOW_MODAL}",this.modal("hideShowBars")),a.replaceString(e.querySelector("#nls-view-helper-label"),"{HELPER_LABEL}",this.modal("hideShowHelperLabel")),a.replaceString(e.querySelector("#modal-close-button"),"{MODAL_CLOSE}",this.nav("close"))}},{key:"markPopup",value:function(e,t){a.replaceString(e,"{".concat(t.type.toUpperCase(),"_NAME}"),a.stripDom(t.name)),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_FINDER}"),t.user),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_FOUND_BY}"),this.popup("".concat(t.type,"FoundBy"))),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_FOUND_WHEN}"),this.popup("".concat(t.type,"FoundWhen"))),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_FOUND_DATE}"),t.date),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_RATE}"),t.rate+1),a.replaceString(e,"{".concat(t.type.toUpperCase(),"_DESC}"),t.desc)}},{key:"fullLang",get:function(){return this._fullLang}}])&&c(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function d(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var h=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._map=t,this._container=document.querySelector("#zoom-slider"),this._slider=document.querySelector("#slider-position"),this._zoomRange=this._map.getMaxZoom()-this._map.getMinZoom(),this._timeoutId=-1,this._events()}var t,r;return t=e,(r=[{key:"_events",value:function(){var e=this;this._map.on("zoomstart",this._zoomStart.bind(this)),this._map.on("zoomend",this._zoomEnd.bind(this)),this._map.on("zoom",(function(){return e._zoom.bind(e)})),this._container.addEventListener("mouseover",this._clearTimeout.bind(this)),this._container.querySelector("#slider-wrapper").addEventListener("click",this._relativeZoom.bind(this)),this._container.addEventListener("mouseleave",this._startTimeout.bind(this)),this._container.querySelector("#zoom-more").addEventListener("click",this._zoomIn.bind(this)),this._container.querySelector("#zoom-less").addEventListener("click",this._zoomOut.bind(this))}},{key:"_zoomStart",value:function(){this._clearTimeout(),this._container.classList.add("opened")}},{key:"_zoomEnd",value:function(){var e=this._map.getZoom()-this._map.getMinZoom();this._slider.style.height="".concat(100*e/this._zoomRange,"%"),this._startTimeout()}},{key:"_zoom",value:function(){this._clearTimeout();var e=this._map.getZoom()-this._map.getMinZoom();this._slider.style.height="".concat(100*e/this._zoomRange,"%")}},{key:"_zoomIn",value:function(){this._map.setZoom(this._map.getZoom()+1)}},{key:"_zoomOut",value:function(){this._map.setZoom(this._map.getZoom()-1)}},{key:"_relativeZoom",value:function(e){this._clearTimeout();var t=this._container.querySelector("#slider-wrapper").getBoundingClientRect(),r=(t.height-(e.pageY-t.top))/t.height;this._slider.style.height="".concat(100*r,"%"),this._map.setZoom(this._map.getMinZoom()+100*r*this._zoomRange/100)}},{key:"_startTimeout",value:function(){var e=this;this._timeoutId=setTimeout((function(){e._container.classList.remove("opened")}),1500)}},{key:"_clearTimeout",value:function(){clearTimeout(this._timeoutId),this._timeoutId=-1}}])&&d(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}(),p=Object.freeze({optimized:{enableHighAccuracy:!1,maximumAge:3e4,timeout:29e3},high:{enableHighAccuracy:!0,maximumAge:1e3,timeout:900}}),m=Object.freeze({spot:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,maxClusterRadius:360,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/marker-icon-green.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}}),shop:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,maxClusterRadius:360,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/marker-icon-blue.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}}),bar:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,maxClusterRadius:360,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/marker-icon-red.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}})}),g=Object.freeze({planOsm:window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',minZoom:5,maxNativeZoom:19,maxZoom:21}),satEsri:window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri Imagery</a>',minZoom:5,maxNativeZoom:19,maxZoom:21})}),f=Object.freeze({newMarkRange:55,socialMarkRange:100,mapBounds:window.L.latLngBounds(window.L.latLng(-89.98155760646617,-180),window.L.latLng(89.99346179538875,180))}),_=Object.freeze({blue:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-blue.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),gold:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-gold.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),red:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-red.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),green:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-green.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),orange:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-orange.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),yellow:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-yellow.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),violet:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-violet.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),grey:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-grey.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),black:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-black.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),user:new window.L.Icon({iconUrl:"/static/img/marker/user-position.png",shadowUrl:"/static/img/marker/user-position-shadow.png",iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[1,-34],shadowSize:[32,32]})});function y(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var v=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._user={lat:48.853121540141096,lng:2.3498955769881156,accuracy:0},this._marks={spot:[],shop:[],bar:[]},this._clusters={spot:{},shop:{},bar:{}},this._aside=null,this._isAsideExpanded=!0,this._kom=null,this._lang=new u(window.navigator.language.substring(0,2),this._init.bind(this),this._fatalError.bind(this))}var t,r;return t=e,(r=[{key:"_init",value:function(){if(this._handleLoginAside(),this._kom=new i,!0===this._kom.isValid){var e=new URLSearchParams(window.location.search),t=Object.fromEntries(e.entries());if(t.activate){var r=document.getElementById("login-error");r.classList.add("visible"),"True"===t.activate?(r.classList.add("success"),r.innerHTML=this.nls.register("activationSuccess")):r.innerHTML=this.nls.register("activationError")}else t.uidb64&&t.token&&this._loadForgotPasswordAside(t);this._initMap().then(this._initGeolocation.bind(this)).then(this._initEvents.bind(this)).then(this._initMarkers.bind(this)).catch(this._fatalError.bind(this))}else this._fatalError({file:"Kom.js",msg:null===this._kom.csrf?"The CSRF token doesn't exists in cookies":"The headers amount is invalid"})}},{key:"_initMap",value:function(){var e=this;return new Promise((function(t){e._map=window.L.map("beer-crakerz-map",{zoomControl:!1}).setView([48.853121540141096,2.3498955769881156],12),window.L.control.scale().addTo(e._map),e._drawUserMarker(),e._map.setMaxBounds(f.mapBounds);var r={};r["<p>".concat(e.nls.map("planLayerOSM"),"</p>")]=g.planOsm,r["<p>".concat(e.nls.map("satLayerEsri"),"</p>")]=g.satEsri,g.planOsm.addTo(e._map),window.L.control.layers(r,{},{position:"bottomright"}).addTo(e._map),e._zoomSlider=new h(e._map),t()}))}},{key:"_initGeolocation",value:function(){var e=this;return new Promise((function(t){"geolocation"in navigator?(e._watchId=navigator.geolocation.watchPosition((function(t){e._user.lat=t.coords.latitude,e._user.lng=t.coords.longitude,e._user.accuracy=t.coords.accuracy,e._map&&e._drawUserMarker()}),null,p.high),t()):t()}))}},{key:"_initEvents",value:function(){var e=this;return new Promise((function(t){e._map.on("drag",(function(){e._map.panInsideBounds(f.mapBounds,{animate:!0})})),e._map.on("zoomend",(function(){e._map.getZoom()<15?(e._setMarkerLabels(e._marks.spot,!1),e._setMarkerLabels(e._marks.shop,!1),e._setMarkerLabels(e._marks.bar,!1)):(e._setMarkerLabels(e._marks.spot,!0),e._setMarkerLabels(e._marks.shop,!0),e._setMarkerLabels(e._marks.bar,!0))})),document.getElementById("center-on").addEventListener("click",(function(){e._map.flyTo([e._user.lat,e._user.lng],18)})),t()}))}},{key:"_initMarkers",value:function(){var e=this;return new Promise((function(t){e._clusters.spot=m.spot,e._clusters.shop=m.shop,e._clusters.bar=m.bar,e._map.addLayer(e._clusters.spot),e._map.addLayer(e._clusters.shop),e._map.addLayer(e._clusters.bar);var r=function(t){e._markPopupFactory(t).then((function(r){t.dom=r,t.marker=e._createMarker(t),e._marks[t.type].push(t),e._clusters[t.type].addLayer(t.marker)}))};e._kom.getSpots().then((function(e){for(var t=0;t<e.length;++t)r(e[t])})),e._kom.getShops().then((function(e){for(var t=0;t<e.length;++t)r(e[t])})),e._kom.getBars().then((function(e){for(var t=0;t<e.length;++t)r(e[t])})),t()}))}},{key:"_fatalError",value:function(e){!1===window.DEBUG?(e&&e.status?window.history.pushState("","","/welcome?&page=welcome&code=".concat(e.status,"&url=").concat(e.url,"&msg=").concat(e.msg)):e&&e.file&&e.msg?window.history.pushState("","","/welcome?&page=welcome&file=".concat(e.file,"&msg=").concat(e.msg)):window.history.pushState("","","/welcome?&page=welcome&file=BeerCrackerzAuth.js&msg=An unknown error occured"),window.location.href="/error"):console.error(e)}},{key:"_toggleAside",value:function(){!0===this._isAsideExpanded?(this._isAsideExpanded=!1,document.documentElement.style.setProperty("--aside-offset","-40rem"),document.getElementById("aside-expander-icon").src="/static/img/logo/left.svg",document.getElementById("page-header").classList.add("visible"),setTimeout((function(){return document.getElementById("aside-expander").style.left="-5rem"}),300)):(this._isAsideExpanded=!0,document.documentElement.style.setProperty("--aside-offset","0rem"),document.getElementById("aside-expander-icon").src="/static/img/logo/right.svg",document.getElementById("aside-expander").style.left="0",document.getElementById("page-header").classList.remove("visible"))}},{key:"_loadAside",value:function(e){var t=this;return new Promise((function(r,n){t._kom.getTemplate("/aside/".concat(e)).then((function(n){document.body.className="",document.body.classList.add(e),t._aside=document.getElementById("aside"),t._aside.innerHTML="",t._aside.appendChild(n),r()})).catch(n)}))}},{key:"_loadLoginAside",value:function(){var e=this;this._loadAside("login").then(this._handleLoginAside.bind(this)).catch((function(t){t.msg="Couldn't fetch or build the login aside",e._fatalError(t)}))}},{key:"_loadRegisterAside",value:function(){var e=this;this._loadAside("register").then(this._handleRegisterAside.bind(this)).catch((function(t){t.msg="Couldn't fetch or build the register aside",e._fatalError(t)}))}},{key:"_loadForgotPasswordAside",value:function(e){var t=this;e.uidb64&&e.token?this._loadAside("resetpassword").then(this._handleResetPasswordAside.bind(this,e)).catch((function(e){e.msg="Couldn't fetch or build the forgot password aside",t._fatalError(e)})):this._loadAside("forgotpassword").then(this._handleForgotPasswordAside.bind(this)).catch((function(e){e.msg="Couldn't fetch or build the forgot password aside",t._fatalError(e)}))}},{key:"_handleLoginAside",value:function(){var e=this;document.title=this.nls.login("headTitle"),this.nls.handleLoginAside(document.getElementById("aside"));var t=document.getElementById("login-error"),r=document.getElementById("username"),n=document.getElementById("password"),i=function(e){console.log(e),window.location="/"},o=function(){t.classList.remove("visible"),r.classList.remove("error"),n.classList.remove("error"),t.className="error",(""===r.value&&""===n.value?(t.classList.add("visible"),t.innerHTML=e.nls.login("bothEmpty"),r.classList.add("error"),n.classList.add("error"),0):""===r.value?(t.classList.add("visible"),t.innerHTML=e.nls.login("usernameEmpty"),r.classList.add("error"),0):""!==n.value||(t.classList.add("visible"),t.innerHTML=e.nls.login("passwordEmpty"),n.classList.add("error"),0))&&e._kom.post("/api/auth/login/",{username:r.value,password:n.value}).then(i).catch((function(){t.classList.add("visible"),t.innerHTML=e.nls.login("serverError")}))};document.getElementById("login-submit").addEventListener("click",o.bind(this),!1),n.addEventListener("keydown",(function(e){"Enter"===e.key&&o()})),document.getElementById("register-aside").addEventListener("click",this._loadRegisterAside.bind(this),!1),document.getElementById("forgot-password").addEventListener("click",this._loadForgotPasswordAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_handleRegisterAside",value:function(){var e=this,t=document.getElementById("aside");document.title=this.nls.register("headTitle"),this.nls.handleRegisterAside(t);var r=document.getElementById("register-error"),n=document.getElementById("username"),i=document.getElementById("mail"),o=document.getElementById("password1"),s=document.getElementById("password2"),a=function(e){console.log(e)},l=function(){r.classList.remove("visible"),n.classList.remove("error"),i.classList.remove("error"),o.classList.remove("error"),s.classList.remove("error"),(""===n.value||""===i.value||""===o.value||""===s.value?(r.classList.add("visible"),r.innerHTML=e.nls.register("fieldEmpty"),""===n.value&&n.classList.add("error"),""===i.value&&i.classList.add("error"),""===o.value&&o.classList.add("error"),""===s.value&&s.classList.add("error"),0):o.value===s.value||(r.classList.add("visible"),r.innerHTML=e.nls.register("notMatchingPassword"),o.classList.add("error"),s.classList.add("error"),0))&&e._kom.post("/api/auth/register/",{username:n.value,email:i.value,password1:o.value,password2:s.value}).then(a).catch((function(){r.classList.add("visible"),r.innerHTML=e.nls.register("serverError")}))};document.getElementById("register-submit").addEventListener("click",l.bind(this),!1),s.addEventListener("keydown",(function(e){"Enter"===e.key&&l()})),document.getElementById("login-aside").addEventListener("click",this._loadLoginAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_handleForgotPasswordAside",value:function(){var e=this,t=document.getElementById("aside");document.title=this.nls.forgotPassword("headTitle"),this.nls.handleForgotPasswordAside(t);var r=document.getElementById("forgot-password-error"),n=document.getElementById("mail"),i=function(e){console.log(e)},o=function(){r.classList.remove("visible"),n.classList.remove("error"),(""!==n.value||(r.classList.add("visible"),r.innerHTML=e.nls.forgotPassword("fieldEmpty"),""===n.value&&n.classList.add("error"),0))&&e._kom.post("/api/auth/password-reset-request/",{email:n.value}).then(i).catch((function(){r.classList.add("visible"),r.innerHTML=e.nls.forgotPassword("serverError")}))};document.getElementById("forgot-password-submit").addEventListener("click",o.bind(this),!1),n.addEventListener("keydown",(function(e){"Enter"===e.key&&o()})),document.getElementById("login-aside").addEventListener("click",this._loadLoginAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_handleResetPasswordAside",value:function(e){var t=this,r=document.getElementById("aside");document.title=this.nls.resetPassword("headTitle"),this.nls.handleResetPasswordAside(r);var n=document.getElementById("reset-password-error"),i=document.getElementById("password1"),o=document.getElementById("password2"),s=function(e){console.log(e)},a=function(){n.classList.remove("visible"),i.classList.remove("error"),o.classList.remove("error"),(""===i.value||""===o.value?(n.classList.add("visible"),n.innerHTML=t.nls.resetPassword("fieldEmpty"),""===i.value&&i.classList.add("error"),""===o.value&&o.classList.add("error"),0):i.value===o.value||(n.classList.add("visible"),n.innerHTML=t.nls.resetPassword("notMatchingPassword"),i.classList.add("error"),o.classList.add("error"),0))&&(console.log(e),t._kom.post("/api/auth/password-reset/?uidb64=".concat(e.uidb64,"&token=").concat(e.token),{password1:i.value,password2:o.value}).then(s).catch((function(){n.classList.add("visible"),n.innerHTML=t.nls.resetPassword("serverError")})))};document.getElementById("reset-password-submit").addEventListener("click",a.bind(this),!1),o.addEventListener("keydown",(function(e){"Enter"===e.key&&a()})),document.getElementById("login-aside").addEventListener("click",this._loadLoginAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_drawUserMarker",value:function(){this.user.marker?this.user.marker.setLatLng(this.user):(this.user.type="user",this.user.marker=this._createMarker(this.user))}},{key:"_createMarker",value:function(e){var t=this,r=_.black;"spot"===e.type?r=_.green:"shop"===e.type?r=_.blue:"bar"===e.type?r=_.red:"user"===e.type&&(r=_.user);var n=window.L.marker([e.lat,e.lng],{icon:r}).on("click",(function(){t.map.flyTo([e.lat,e.lng],18)}));return e.dom&&n.bindPopup(e.dom),-1===["spot","shop","bar"].indexOf(e.type)&&n.addTo(this.map),n}},{key:"_markPopupFactory",value:function(e){var t=this;return new Promise((function(r){t._kom.getTemplate("/popup/".concat(e.type)).then((function(n){var i=document.createElement("DIV");i.appendChild(n);var o=e.user,s=a.stripDom(e.description)||t.nls.popup("".concat(e.type,"NoDesc")),l=new Intl.DateTimeFormat(t.nls.fullLang,{dateStyle:"long"}).format(new Date(e.creationDate));t.nls.markPopup(i,{type:e.type,name:e.name,user:o,rate:e.rate,desc:s,date:l});for(var c=i.querySelector("#".concat(e.type,"-rating")),u=0;u<e.rate+1;++u)c.children[u].classList.add("active");i.querySelector("#popup-social").parentNode.removeChild(i.querySelector("#popup-social")),i.querySelector("#popup-edit").parentNode.removeChild(i.querySelector("#popup-edit")),e.tooltip=window.L.tooltip({permanent:!0,direction:"center",className:"marker-tooltip",interactive:!0}).setContent(e.name).setLatLng(e),e.tooltip.addTo(t.map),r(i)}))}))}},{key:"_setMarkerLabels",value:function(e,t){for(var r=0;r<e.length;++r)t?e[r].tooltip.addTo(this.map):e[r].tooltip.removeFrom(this.map)}},{key:"map",get:function(){return this._map}},{key:"marks",get:function(){return this._marks}},{key:"user",get:function(){return this._user}},{key:"nls",get:function(){return this._lang}}])&&y(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();window.BeerCrackerz=t.default}();