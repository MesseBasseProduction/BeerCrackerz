!function(){"use strict";var e={d:function(t,n){for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}},t={};function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}e.d(t,{default:function(){return g}});var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._csrfToken=this._getCsrfCookie(),this._headers=this._createRequestHeaders(),this.isValid=this._checkValidity()}var t,r;return t=e,r=[{key:"_getCsrfCookie",value:function(){if(document.cookie&&""!==document.cookie)for(var e=document.cookie.split(";"),t=0;t<e.length;++t){var n=e[t].split("=");if(void 0!==n&&n[0].toLowerCase().includes("srf"))return decodeURIComponent(n[1])}return null}},{key:"_createRequestHeaders",value:function(){return[["Content-Type","application/json; charset=UTF-8"],["Accept","application/json"],["X-XSRF-TOKEN",this._csrfToken]]}},{key:"_checkValidity",value:function(){return null!==this._csrfToken&&3===this._headers.length}},{key:"_resolveAs",value:function(e,t){return new Promise((function(n,r){t?"raw"===e?200===t.status?n(t.responseText):r(t.status):"json"===e||"text"===e?t[e]?n(t[e]()):r(t.status):"dom"===e?t.text().then((function(e){n(document.createRange().createContextualFragment(e))})).catch(r):n():r("F_KOM_MISSING_ARGUMENT")}))}},{key:"_resolveAsJSON",value:function(e){return this._resolveAs("json",e)}},{key:"_resolveAsText",value:function(e){return this._resolveAs("text",e)}},{key:"_resolveAsDom",value:function(e){return this._resolveAs("dom",e)}},{key:"get",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this._resolveAsJSON.bind(this);return new Promise((function(r,o){var i={method:"GET",headers:new Headers([t._headers[0]])};fetch(e,i).then((function(e){return 200!==e.status&&o(e),n(e)})).then(r).catch(o)}))}},{key:"getText",value:function(e){return this.get(e,this._resolveAsText.bind(this))}},{key:"getTemplate",value:function(e){return this.get(e,this._resolveAsDom.bind(this))}},{key:"post",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this._resolveAsJSON.bind(this);return new Promise((function(o,i){var a={method:"POST",headers:new Headers(n._headers),body:JSON.stringify(t)};fetch(e,a).then((function(e){return 200!==e.status&&i(e),r(e)})).then(o).catch(i)}))}},{key:"postText",value:function(e,t){return this.post(e,t,this._resolveAsText.bind(this))}},{key:"_getPoints",value:function(e){var t=this;return new Promise((function(n,r){t.get("http://localhost:8080/api/".concat(e)).then(n).catch(r)}))}},{key:"getSpots",value:function(){return this._getPoints("spot")}},{key:"getShops",value:function(){return this._getPoints("shop")}},{key:"getBars",value:function(){return this._getPoints("bar")}},{key:"_savePoint",value:function(e,t){var n=this;return new Promise((function(r,o){n.post("http://localhost:8080/api/".concat(e,"/"),t,null).then(r).catch(o)}))}},{key:"spotCreated",value:function(e){return this._savePoint("spot",e)}},{key:"shopCreated",value:function(e){return this._savePoint("shop",e)}},{key:"barCreated",value:function(e){return this._savePoint("bar",e)}},{key:"csrf",get:function(){return null}}],r&&n(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}(),o=r;function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n;return t=e,n=[{key:"stripDom",value:function(e){return(new DOMParser).parseFromString(e,"text/html").body.textContent||""}},{key:"replaceString",value:function(e,t,n){e.innerHTML=e.innerHTML.replace(t,n)}},{key:"getDistanceBetweenCoords",value:function(e,t){var n=e[1]*Math.PI/180,r=e[0]*Math.PI/180,o=t[1]*Math.PI/180,i=t[0]*Math.PI/180,a=i-r,s=o-n,c=Math.pow(Math.sin(a/2),2)+Math.cos(r)*Math.cos(i)*Math.pow(Math.sin(s/2),2);return 2*Math.asin(Math.sqrt(c))*6371*1e3}},{key:"precisionRound",value:function(e,t){var n=Math.pow(10,t||0);return Math.round(e*n)/n}},{key:"initDebugInterface",value:function(){var e=window.BeerCrackerz.nls.debug.bind(window.BeerCrackerz.nls),t=document.createElement("DIV"),n=document.createElement("P"),r=document.createElement("P"),o=document.createElement("P"),i=document.createElement("P"),a=document.createElement("P"),s=document.createElement("P"),c=document.createElement("P"),l=document.createElement("P"),u=document.createElement("P"),d=document.createElement("BUTTON");return t.classList.add("debug-container"),n.classList.add("debug-user-lat"),r.classList.add("debug-user-lng"),o.classList.add("debug-updates-amount"),i.classList.add("debug-user-accuracy"),a.classList.add("debug-high-accuracy"),s.classList.add("debug-pos-max-age"),c.classList.add("debug-pos-timeout"),l.classList.add("debug-zoom-level"),u.classList.add("debug-marks-amount"),d.classList.add("debug-export-data"),n.innerHTML="<b>".concat(e("lat"),"</b> : -"),r.innerHTML="<b>".concat(e("lng"),"</b> : -"),o.innerHTML="<b>".concat(e("updates"),"</b> : 0"),i.innerHTML="<b>".concat(e("accuracy"),"</b> : -"),a.innerHTML="<b>".concat(e("highAccuracy"),"</b> : -"),s.innerHTML="<b>".concat(e("posAge"),"</b> : -"),c.innerHTML="<b>".concat(e("posTimeout"),"</b> : -"),l.innerHTML="<b>".concat(e("zoom"),"</b> : -"),u.innerHTML="<b>".concat(e("marks"),"</b> : -"),d.innerHTML=e("export"),t.appendChild(n),t.appendChild(r),t.appendChild(o),t.appendChild(i),t.appendChild(a),t.appendChild(s),t.appendChild(c),t.appendChild(l),t.appendChild(u),t.appendChild(d),d.addEventListener("click",window.BeerCrackerz.downloadData.bind(window.BeerCrackerz)),t}},{key:"updateDebugInterface",value:function(t,n,r){if(!0===window.DEBUG){var o=window.BeerCrackerz,i=o.nls.debug.bind(o.nls),a=parseInt(t.querySelector(".debug-updates-amount").innerHTML.split(" : ")[1])+1,s=o.marks.spot.length+o.marks.shop.length+o.marks.bar.length;t.querySelector(".debug-user-lat").innerHTML="\n        <b>".concat(i("lat"),"</b> : ").concat(n.lat,"\n      "),t.querySelector(".debug-user-lng").innerHTML="\n        <b>".concat(i("lng"),"</b> : ").concat(n.lng,"\n      "),t.querySelector(".debug-updates-amount").innerHTML="\n        <b>".concat(i("updates"),"</b> : ").concat(a,"\n      "),t.querySelector(".debug-user-accuracy").innerHTML="\n        <b>".concat(i("accuracy"),"</b> : ").concat(e.precisionRound(n.accuracy,2),"m\n      "),t.querySelector(".debug-high-accuracy").innerHTML="\n        <b>".concat(i("highAccuracy"),"</b> : ").concat(!0===r.enableHighAccuracy?i("enabled"):i("disabled"),"\n      "),t.querySelector(".debug-pos-max-age").innerHTML="\n        <b>".concat(i("posAge"),"</b> : ").concat(r.maximumAge/1e3,"s\n      "),t.querySelector(".debug-pos-timeout").innerHTML="\n        <b>".concat(i("posTimeout"),"</b> : ").concat(r.timeout/1e3,"s\n      "),t.querySelector(".debug-zoom-level").innerHTML="\n        <b>".concat(i("zoom"),"</b> : ").concat(o.map.getZoom(),"\n      "),t.querySelector(".debug-marks-amount").innerHTML="\n        <b>".concat(i("marks"),"</b> : ").concat(s,"\n      ")}}},{key:"getPreference",value:function(e){return localStorage.getItem(e)||null}},{key:"setPreference",value:function(e,t){localStorage.setItem(e,t)}},{key:"RANGE_COLOR",get:function(){return"#ffd87d"}},{key:"USER_COLOR",get:function(){return"#63fff5"}},{key:"SPOT_COLOR",get:function(){return"#26ad23"}},{key:"SHOP_COLOR",get:function(){return"#247dc9"}},{key:"BAR_COLOR",get:function(){return"#ca2a3d"}},{key:"CIRCLE_RADIUS",get:function(){return 100}},{key:"NEW_MARKER_RANGE",get:function(){return 200}},{key:"MAP_BOUNDS",get:function(){return window.L.latLngBounds(window.L.latLng(-89.98155760646617,-180),window.L.latLng(89.99346179538875,180))}},{key:"HIGH_ACCURACY",get:function(){return{enableHighAccuracy:!0,maximumAge:1e3,timeout:900}}},{key:"OPTIMIZED_ACCURACY",get:function(){return{enableHighAccuracy:!1,maximumAge:3e4,timeout:29e3}}},{key:"SUPPORTED_LANGUAGE",get:function(){return["en","fr","es","de","pt"]}}],null&&i(t.prototype,null),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),e}();function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._lang=-1!==a.SUPPORTED_LANGUAGE.indexOf(t)?t:"en",this._values={},this._init().then(n).catch(r)}var t,n;return t=e,(n=[{key:"_init",value:function(){var e=this;return new Promise((function(t,n){fetch("/static/nls/".concat(e._lang,".json")).then((function(r){200!==r.status&&(r.msg="Fetching the i18n file failed",n(r)),r.text().then((function(o){try{e._values=JSON.parse(o)}catch(e){r.msg="Parsing the i18n file failed",n(r)}t()})).catch(n)})).catch(n)}))}},{key:"debug",value:function(e){return this._values.debug[e]||""}},{key:"notif",value:function(e){return this._values.notif[e]||""}},{key:"nav",value:function(e){return this._values.nav[e]||""}},{key:"map",value:function(e){return this._values.map[e]||""}},{key:"spot",value:function(e){return this._values.spot[e]||""}},{key:"shop",value:function(e){return this._values.shop[e]||""}},{key:"bar",value:function(e){return this._values.bar[e]||""}},{key:"popup",value:function(e){return this._values.popup[e]||""}},{key:"modal",value:function(e){return this._values.modal[e]||""}},{key:"login",value:function(e){return this._values.auth.login[e]||""}},{key:"register",value:function(e){return this._values.auth.register[e]||""}},{key:"forgotPassword",value:function(e){return this._values.auth.forgotPassword[e]||""}}])&&s(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}();function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var u=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._map=t,this._container=document.querySelector("#zoom-slider"),this._slider=document.querySelector("#slider-position"),this._zoomRange=this._map.getMaxZoom()-this._map.getMinZoom(),this._timeoutId=-1,this._events()}var t,n;return t=e,(n=[{key:"_events",value:function(){var e=this;this._map.on("zoomstart",(function(){clearTimeout(e._timeoutId),e._timeoutId=-1,e._container.classList.add("opened")})),this._map.on("zoomend",(function(){var t=e._map.getZoom()-e._map.getMinZoom();e._slider.style.height="".concat(100*t/e._zoomRange,"%"),e._timeoutId=setTimeout((function(){return e._container.classList.remove("opened")}),1500)})),this._map.on("zoom",(function(){clearTimeout(e._timeoutId),e._timeoutId=-1;var t=e._map.getZoom()-e._map.getMinZoom();e._slider.style.height="".concat(100*t/e._zoomRange,"%")})),this._container.addEventListener("mouseover",(function(){clearTimeout(e._timeoutId),e._timeoutId=-1})),this._container.addEventListener("mouseleave",(function(){e._timeoutId=setTimeout((function(){return e._container.classList.remove("opened")}),1500)})),this._container.querySelector("#zoom-more").addEventListener("click",(function(){e._map.setZoom(e._map.getZoom()+1)})),this._container.querySelector("#zoom-less").addEventListener("click",(function(){e._map.setZoom(e._map.getZoom()-1)}))}}])&&l(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}(),d=Object.freeze({planOsm:window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:21,maxNativeZoom:19,minZoom:2}),satEsri:window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri Imagery</a>',minZoom:2,maxNativeZoom:19,maxZoom:21})}),m=Object.freeze({blue:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-blue.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),gold:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-gold.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),red:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-red.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),green:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-green.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),orange:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-orange.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),yellow:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-yellow.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),violet:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-violet.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),grey:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-grey.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),black:new window.L.Icon({iconUrl:"/static/img/marker/marker-icon-black.png",shadowUrl:"/static/img/marker/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),user:new window.L.Icon({iconUrl:"/static/img/marker/user-position.png",shadowUrl:"/static/img/marker/user-position-shadow.png",iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[1,-34],shadowSize:[32,32]})}),p=Object.freeze({spot:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/cluster-icon-green.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}}),shop:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/cluster-icon-blue.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}}),bar:new window.L.MarkerClusterGroup({animateAddingMarkers:!0,disableClusteringAtZoom:18,spiderfyOnMaxZoom:!1,iconCreateFunction:function(e){return window.L.divIcon({className:"cluster-icon-wrapper",html:'\n          <img src="/static/img/marker/cluster-icon-red.png" class="cluster-icon">\n          <span class="cluster-label">'.concat(e.getChildCount(),"</span>\n        ")})}})});function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var g=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._user={lat:48.853121540141096,lng:2.3498955769881156,accuracy:0},this._marks={spot:[],shop:[],bar:[]},this._clusters={spot:{},shop:{},bar:{}},this._aside=null,this._isAsideExpanded=!0,this._kom=null,this._lang=new c(window.navigator.language.substring(0,2),this._init.bind(this),this._fatalError.bind(this))}var t,n;return t=e,(n=[{key:"_init",value:function(){this._handleLoginAside(),this._kom=new o,!0===this._kom.isValid?this._initMap().then(this._initGeolocation.bind(this)).then(this._initEvents.bind(this)).then(this._initMarkers.bind(this)).catch(this._fatalError.bind(this)):this._fatalError({file:"Kom.js",msg:null===this._kom.csrf?"The CSRF token doesn't exists in cookies":"The headers amount is invalid"})}},{key:"_initMap",value:function(){var e=this;return new Promise((function(t){e._map=window.L.map("beer-crakerz-map",{zoomControl:!1}).setView([48.853121540141096,2.3498955769881156],12),window.L.control.scale().addTo(e._map),e._drawUserMarker(),e._map.setMaxBounds(a.MAP_BOUNDS);var n={};n["<p>".concat(e.nls.map("planLayerOSM"),"</p>")]=d.planOsm,n["<p>".concat(e.nls.map("satLayerEsri"),"</p>")]=d.satEsri,d.planOsm.addTo(e._map),window.L.control.layers(n,{},{position:"bottomright"}).addTo(e._map),e._zoomSlider=new u(e._map),t()}))}},{key:"_initGeolocation",value:function(){var e=this;return new Promise((function(t){"geolocation"in navigator?(e._watchId=navigator.geolocation.watchPosition((function(t){e._user.lat=t.coords.latitude,e._user.lng=t.coords.longitude,e._user.accuracy=t.coords.accuracy,e._map&&e._drawUserMarker()}),null,a.HIGH_ACCURACY),t()):t()}))}},{key:"_initEvents",value:function(){var e=this;return new Promise((function(t){e._map.on("drag",(function(){e._map.panInsideBounds(a.MAP_BOUNDS,{animate:!0})})),e._map.on("zoomend",(function(){e._map.getZoom()<15?(e._setMarkerLabels(e._marks.spot,!1),e._setMarkerLabels(e._marks.shop,!1),e._setMarkerLabels(e._marks.bar,!1)):(e._setMarkerLabels(e._marks.spot,!0),e._setMarkerLabels(e._marks.shop,!0),e._setMarkerLabels(e._marks.bar,!0))})),document.getElementById("center-on").addEventListener("click",(function(){e._map.flyTo([e._user.lat,e._user.lng],18)})),t()}))}},{key:"_initMarkers",value:function(){var e=this;return new Promise((function(t){e._clusters.spot=p.spot,e._clusters.shop=p.shop,e._clusters.bar=p.bar,e._map.addLayer(e._clusters.spot),e._map.addLayer(e._clusters.shop),e._map.addLayer(e._clusters.bar);var n=function(t){e._markPopupFactory(t).then((function(n){t.dom=n,t.marker=e._createMarker(t),e._marks[t.type].push(t),e._clusters[t.type].addLayer(t.marker)}))};e._kom.getSpots().then((function(e){for(var t=0;t<e.length;++t)n(e[t])})),e._kom.getShops().then((function(e){for(var t=0;t<e.length;++t)n(e[t])})),e._kom.getBars().then((function(e){for(var t=0;t<e.length;++t)n(e[t])})),t()}))}},{key:"_fatalError",value:function(e){!1===window.DEBUG?(e&&e.status?window.history.pushState("","","/welcome?&page=welcome&code=".concat(e.status,"&url=").concat(e.url,"&msg=").concat(e.msg)):e&&e.file&&e.msg?window.history.pushState("","","/welcome?&page=welcome&file=".concat(e.file,"&msg=").concat(e.msg)):window.history.pushState("","","/welcome?&page=welcome&file=BeerCrackerzAuth.js&msg=An unknown error occured"),window.location.href="/error"):console.error(e)}},{key:"_toggleAside",value:function(){!0===this._isAsideExpanded?(this._isAsideExpanded=!1,document.documentElement.style.setProperty("--aside-offset","-40rem"),document.getElementById("aside-expander-icon").src="/static/img/logo/left.svg",document.getElementById("page-header").classList.add("visible"),setTimeout((function(){return document.getElementById("aside-expander").style.left="-5rem"}),300)):(this._isAsideExpanded=!0,document.documentElement.style.setProperty("--aside-offset","0rem"),document.getElementById("aside-expander-icon").src="/static/img/logo/right.svg",document.getElementById("aside-expander").style.left="0",document.getElementById("page-header").classList.remove("visible"))}},{key:"_loadAside",value:function(e){var t=this;return new Promise((function(n,r){t._kom.getTemplate("/aside/".concat(e)).then((function(r){document.body.className="",document.body.classList.add(e),t._aside=document.getElementById("aside"),t._aside.innerHTML="",t._aside.appendChild(r),n()})).catch(r)}))}},{key:"_loadLoginAside",value:function(){var e=this;this._loadAside("login").then(this._handleLoginAside.bind(this)).catch((function(t){t.msg="Couldn't fetch or build the login aside",e._fatalError(t)}))}},{key:"_loadRegisterAside",value:function(){var e=this;this._loadAside("register").then(this._handleRegisterAside.bind(this)).catch((function(t){t.msg="Couldn't fetch or build the register aside",e._fatalError(t)}))}},{key:"_loadForgotPasswordAside",value:function(){var e=this;this._loadAside("forgotpassword").then(this._handleResetPasswordAside.bind(this)).catch((function(t){t.msg="Couldn't fetch or build the forgot password aside",e._fatalError(t)}))}},{key:"_handleLoginAside",value:function(){var e=this,t=document.getElementById("aside");document.title=this.nls.login("headTitle"),a.replaceString(t,"{LOGIN_SUBTITLE}",this.nls.login("subtitle")),a.replaceString(t,"{LOGIN_HIDDEN_ERROR}",this.nls.login("hiddenError")),a.replaceString(t,"{LOGIN_USERNAME_LABEL}",this.nls.login("username")),a.replaceString(t,"{LOGIN_USERNAME_PASSWORD}",this.nls.login("password")),a.replaceString(t,"{LOGIN_BUTTON}",this.nls.login("login")),a.replaceString(t,"{LOGIN_NOT_REGISTERED}",this.nls.login("notRegistered")),a.replaceString(t,"{LOGIN_REGISTER}",this.nls.login("register")),a.replaceString(t,"{LOGIN_FORGOT_PASSWORD}",this.nls.login("forgot")),a.replaceString(t,"{LOGIN_PASSWORD_RESET}",this.nls.login("reset"));var n=document.getElementById("login-error"),r=document.getElementById("username"),o=document.getElementById("password"),i=function(e){console.log(e),window.location="/"};document.getElementById("login-submit").addEventListener("click",(function(){n.classList.remove("visible"),r.classList.remove("error"),o.classList.remove("error"),(""===r.value&&""===o.value?(n.classList.add("visible"),n.innerHTML=e.nls.login("bothEmpty"),r.classList.add("error"),o.classList.add("error"),0):""===r.value?(n.classList.add("visible"),n.innerHTML=e.nls.login("usernameEmpty"),r.classList.add("error"),0):""!==o.value||(n.classList.add("visible"),n.innerHTML=e.nls.login("passwordEmpty"),o.classList.add("error"),0))&&e._kom.post("/api/login/",{username:r.value,password:o.value}).then(i).catch((function(){n.classList.add("visible"),n.innerHTML=e.nls.login("serverError")}))}),!1),document.getElementById("register-aside").addEventListener("click",this._loadRegisterAside.bind(this),!1),document.getElementById("forgot-password").addEventListener("click",this._loadForgotPasswordAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_handleRegisterAside",value:function(){var e=this,t=document.getElementById("aside");document.title=this.nls.register("headTitle"),a.replaceString(t,"{REGISTER_SUBTITLE}",this.nls.register("subtitle")),a.replaceString(t,"{REGISTER_HIDDEN_ERROR}",this.nls.register("hiddenError")),a.replaceString(t,"{REGISTER_USERNAME_LABEL}",this.nls.register("username")),a.replaceString(t,"{REGISTER_MAIL_LABEL}",this.nls.register("mail")),a.replaceString(t,"{REGISTER_USERNAME_PASSWORD_1}",this.nls.register("password1")),a.replaceString(t,"{REGISTER_USERNAME_PASSWORD_2}",this.nls.register("password2")),a.replaceString(t,"{REGISTER_BUTTON}",this.nls.register("register")),a.replaceString(t,"{REGISTER_ALREADY_DONE}",this.nls.register("notRegistered")),a.replaceString(t,"{REGISTER_LOGIN}",this.nls.register("login"));var n=document.getElementById("register-error"),r=document.getElementById("username"),o=document.getElementById("mail"),i=document.getElementById("password1"),s=document.getElementById("password2"),c=function(e){console.log(e),window.location="authindex.html"};document.getElementById("register-submit").addEventListener("click",(function(){n.classList.remove("visible"),r.classList.remove("error"),o.classList.remove("error"),i.classList.remove("error"),s.classList.remove("error"),(""===r.value||""===o.value||""===i.value||""===s.value?(n.classList.add("visible"),n.innerHTML=e.nls.register("fieldEmpty"),""===r.value&&r.classList.add("error"),""===o.value&&o.classList.add("error"),""===i.value&&i.classList.add("error"),""===s.value&&s.classList.add("error"),0):i.value===s.value||(n.classList.add("visible"),n.innerHTML=e.nls.register("notMatchingPassword"),i.classList.add("error"),s.classList.add("error"),0))&&e._kom.post("/api/register/submit",{username:r.value,email:o.value,password1:i.value,password2:s.value}).then(c).catch((function(){n.classList.add("visible"),n.innerHTML=e.nls.register("serverError")}))}),!1),document.getElementById("login-aside").addEventListener("click",this._loadLoginAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_handleResetPasswordAside",value:function(){var e=this,t=document.getElementById("aside");document.title=this.nls.forgotPassword("headTitle"),a.replaceString(t,"{FORGOT_PASSWORD_SUBTITLE}",this.nls.forgotPassword("subtitle")),a.replaceString(t,"{FORGOT_PASSWORD_ERROR}",this.nls.register("hiddenError")),a.replaceString(t,"{FORGOT_PASSWORD_MAIL_LABEL}",this.nls.forgotPassword("mail")),a.replaceString(t,"{FORGOT_PASSWORD_BUTTON}",this.nls.forgotPassword("submit")),a.replaceString(t,"{FORGOT_PASSWORD_LOGIN_LABEL}",this.nls.forgotPassword("loginLabel")),a.replaceString(t,"{FORGOT_PASSWORD_LOGIN}",this.nls.forgotPassword("login"));var n=document.getElementById("forgot-password-error"),r=document.getElementById("mail"),o=function(e){console.log(e),window.location="authindex.html"};document.getElementById("forgot-password-submit").addEventListener("click",(function(){n.classList.remove("visible"),r.classList.remove("error"),(""!==r.value||(n.classList.add("visible"),n.innerHTML=e.nls.forgotPassword("fieldEmpty"),""===r.value&&r.classList.add("error"),0))&&e._kom.post("/api/password/reset",{email:r.value}).then(o).catch((function(){n.classList.add("visible"),n.innerHTML=e.nls.forgotPassword("serverError")}))}),!1),document.getElementById("login-aside").addEventListener("click",this._loadLoginAside.bind(this),!1),document.getElementById("aside-expander").addEventListener("click",this._toggleAside.bind(this),!1)}},{key:"_drawUserMarker",value:function(){this.user.marker?this.user.marker.setLatLng(this.user):(this.user.type="user",this.user.marker=this._createMarker(this.user))}},{key:"_createMarker",value:function(e){var t=this,n=m.black;"spot"===e.type?n=m.green:"shop"===e.type?n=m.blue:"bar"===e.type?n=m.red:"user"===e.type&&(n=m.user);var r=window.L.marker([e.lat,e.lng],{icon:n}).on("click",(function(){t.map.flyTo([e.lat,e.lng],18)}));return e.dom&&r.bindPopup(e.dom),-1===["spot","shop","bar"].indexOf(e.type)&&r.addTo(this.map),r}},{key:"_markPopupFactory",value:function(e){var t=this;return new Promise((function(n){t._kom.getTemplate("/popup/".concat(e.type)).then((function(r){var o=document.createElement("DIV");o.appendChild(r);var i=e.user||t.user.username,s=a.stripDom(e.description)||t.nls.popup("".concat(e.type,"NoDesc"));a.replaceString(o,"{".concat(e.type.toUpperCase(),"_NAME}"),a.stripDom(e.name)),a.replaceString(o,"{".concat(e.type.toUpperCase(),"_FINDER}"),i),a.replaceString(o,"{".concat(e.type.toUpperCase(),"_RATE}"),e.rate+1),a.replaceString(o,"{".concat(e.type.toUpperCase(),"_DESC}"),s),a.replaceString(o,"{".concat(e.type.toUpperCase(),"_FOUND_BY}"),t.nls.popup("".concat(e.type,"FoundBy")));for(var c=o.querySelector("#".concat(e.type,"-rating")),l=0;l<e.rate+1;++l)c.children[l].classList.add("active");o.querySelector("#popup-social").parentNode.removeChild(o.querySelector("#popup-social")),o.querySelector("#popup-edit").parentNode.removeChild(o.querySelector("#popup-edit")),e.tooltip=window.L.tooltip({permanent:!0,direction:"center",className:"marker-tooltip",interactive:!0}).setContent(e.name).setLatLng(e),e.tooltip.addTo(t.map),n(o)}))}))}},{key:"_setMarkerLabels",value:function(e,t){for(var n=0;n<e.length;++n)t?e[n].tooltip.addTo(this.map):e[n].tooltip.removeFrom(this.map)}},{key:"map",get:function(){return this._map}},{key:"marks",get:function(){return this._marks}},{key:"user",get:function(){return this._user}},{key:"nls",get:function(){return this._lang}}])&&h(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}();window.BeerCrackerz=t.default}();