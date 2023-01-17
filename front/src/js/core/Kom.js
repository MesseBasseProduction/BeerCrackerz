class Kom {


  /** 
   * @summary Server communication abstraction
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * This class is the main object to deal with when requesting something from the server.
   * It handle all urls calls (<code>GET</code>, <code>POST</code>), treat responses or handle errors using
   * <code>Promise</code>.<br>Because it uses <code>Promise</code>, success and errors are to be handled in the caller
   * function, using <code>.then()</code> and <code>.catch()</code>. To properly deal with <code>POST</code> request,
   * the session must contain a csrf token in cookies. Otherwise, those <code>POST</code> call may fail.
   * </blockquote> 
   **/
  constructor() {
    /** 
     * User session CSRF token to use in POST request
     * @type {string}
     * @private
     **/
    this._csrfToken = this._getCsrfCookie();
    /** 
     * Array of HTTP headers to be used in HTTP calls
     * @type {Array[]}
     * @private
     **/
    this._headers = this._createRequestHeaders();
    /** 
     * Wether the Kom class headers are properly built
     * @type {Boolean}
     * @public
     **/
    this.isValid = this._checkValidity(); // Check that CSRF token exists and that headers are properly created
  }


  // ======================================================================== //
  // ------------------------- Class initialization ------------------------- //
  // ======================================================================== //


  /**
   * @method
   * @name _getCsrfCookie
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Extract CSRF token value from client cookies and returns it as a string. Returns an empty
   * string by default. This method is required to be called on construction.
   * </blockquote>
   * @return {String} - The CSRF token string 
   **/
  _getCsrfCookie() {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; ++i) {
        // Parse current cookie to extract its properties
        const cookie = cookies[i].split('=');
        if (cookie !== undefined && cookie[0].toLowerCase().includes('srf')) {
          // Found a matching cookie for csrftoken value, return as decoded string
          return decodeURIComponent(cookie[1]);
        }
      }
    }
    // Return empty string by default, POST calls may fail
    return null;
  }


  /** 
   * @method
   * @name _createRequestHeaders
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Fills Kom <code>_headers</code> private member array, to use in HTTP requests later on.
   * This method is required to be called on construction.
   * </blockquote>
   * @return {Array[]} - The headers array, length 3, to be used in HTTP requests 
   **/
  _createRequestHeaders() {
    return [
      ['Content-Type', 'application/json; charset=UTF-8'],
      ['Accept', 'application/json'],
      ['X-CSRFToken', this._csrfToken]
    ];
  }


  /** 
   * @method
   * @name _checkValidity
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Check the Kom instance validity (eough headers) to ensure its properties validity.
   * </blockquote> 
   **/
  _checkValidity() {
    if (this._csrfToken !== null) {
      if (this._headers.length !== 3) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }


  // ======================================================================== //
  // ------------------------- Response formatting -------------------------- //
  // ======================================================================== //


  /** 
   * @method
   * @async
   * @name _resolveAs
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Generic tool method used by private methods on fetch responses to format output in the provided
   * format. It must be either `json`, `text`, `raw` or `dom`.
   * </blockquote>
   * @param {String} type - The type of resolution, can be `json`, `text`, `raw` or `dom`
   * @param {Object} response - The <code>fetch</code> response object
   * @returns {Promise} The request <code>Promise</code>, format response as an object on resolve, as error code string on reject 
   **/
  _resolveAs(type, response) {
    return new Promise((resolve, reject) => {
      if (response) {
        if (type === 'raw') { // Raw are made in XMLHttpRequest and need special handling
          if (response.status === 200) {
            resolve(response.responseText);
          } else {
            reject(response.status);
          }
        } else if (type === 'json' || type === 'text') { // Call are made using fetch API
          if (response[type]) {
            resolve(response[type]());
          } else { // Fallback on standard error handling
            reject(response.status);
          }
        } else if (type === 'dom') {
          response.text().then(html => {
            resolve(document.createRange().createContextualFragment(html));
          }).catch(reject);
        } else { // Resolution type doesn't exists, resolving empty
          resolve();
        }
      } else {
        reject('F_KOM_MISSING_ARGUMENT');
      }
    });
  }


  /** 
   * @method
   * @async
   * @name _resolveAsJSON
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Tool method used by public methods on fetch responses to format output data as JSON to be
   * read in JavaScript code as objects.
   * </blockquote>
   * @param {Object} response - The <code>fetch</code> response object
   * @returns {Promise} The request <code>Promise</code>, format response as an object on resolve, as error code string on reject 
   **/
  _resolveAsJSON(response) {
    return this._resolveAs('json', response);
  }


  /** 
   * @method
   * @async
   * @name _resolveAsText
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Tool method used by public methods on fetch responses to format output data as text to be
   * read in JavaScript code as string (mostly to parse HTML templates).
   * </blockquote>
   * @param {Object} response - The <code>fetch</code> response object
   * @returns {Promise} The request <code>Promise</code>, format response as a string on resolve, as error code string on reject
   **/
  _resolveAsText(response) {
    return this._resolveAs('text', response);
  }


  /** 
   * @method
   * @async
   * @name _resolveAsDom
   * @private
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * Tool method used by public methods on fetch responses to format output data as DOM fragment to be
   * read in JavaScript code as HTML template.
   * </blockquote>
   * @param {Object} response - The <code>fetch</code> response object
   * @returns {Promise} The request <code>Promise</code>, format response as a string on resolve, as error code string on reject
   **/
  _resolveAsDom(response) {
    return this._resolveAs('dom', response);
  }



  // ======================================================================== //
  // --------------------------- GET server calls --------------------------- //
  // ======================================================================== //


  /** 
   * @method
   * @async
   * @name get
   * @public
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * <code>GET</code> HTTP request using the fetch API.<br><code>resolve</code> returns the
   * response as an <code>Object</code>.<br><code>reject</code> returns an error key as a <code>String</code>.
   * It is meant to perform API call to access database through the user interface.
   * </blockquote>
   * @param {String} url - The <code>GET</code> url to fetch data from, in supported back URLs
   * @returns {Promise} The request <code>Promise</code> 
   **/
  get(url, resolution = this._resolveAsJSON.bind(this)) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: new Headers([this._headers[0]]) // Content type to JSON
      };

      fetch(url, options)
        .then(data => {
          // In case the request wen well but didn't gave the expected 200 status
          if (data.status !== 200) {
            reject(data);
          } 
          return resolution(data);         
        })
        .then(resolve)
        .catch(reject);
    });
  }


  /** 
   * @method
   * @async
   * @name getText
   * @public
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * <code>GET</code> HTTP request using the fetch API.<br><code>resolve</code> returns the
   * response as a <code>String</code>.<br><code>reject</code> returns an error key as a <code>String</code>. It is
   * meant to perform API call to get HTML templates as string to be parsed as documents/documents fragments.
   * </blockquote>
   * @param {String} url - The <code>GET</code> url to fetch data from, in supported back URLs
   * @returns {Promise} The request <code>Promise</code>
   **/
  getText(url) {
    return this.get(url, this._resolveAsText.bind(this));
  }


  /** 
   * @method
   * @async
   * @name getText
   * @public
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * <code>GET</code> HTTP request using the fetch API.<br><code>resolve</code> returns the
   * response as a <code>String</code>.<br><code>reject</code> returns an error key as a <code>String</code>. It is
   * meant to perform API call to get HTML templates as string to be parsed as documents/documents fragments.
   * </blockquote>
   * @param {String} url - The <code>GET</code> url to fetch data from, in supported back URLs
   * @returns {Promise} The request <code>Promise</code> 
   **/
  getTemplate(url) {
    return this.get(url, this._resolveAsDom.bind(this));
  }


  // ======================================================================== //
  // -------------------------- POST server calls --------------------------- //
  // ======================================================================== //


  /** 
   * @method
   * @async
   * @name post
   * @public
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * <code>POST</code> HTTP request using the fetch API.<br>Beware that the given options
   * object match the url expectations.<br><code>resolve</code>
   * returns the response as an <code>Object</code>.<br><code>reject</code> returns an error key as a <code>String</code>.
   * </blockquote>
   * @param {String} url - The <code>POST</code> url to fetch data from
   * @param {Object} data - The <code>JSON</code> object that contains <code>POST</code> parameters
   * @returns {Promise} The request <code>Promise</code> 
   **/
  post(url, data, resolution = this._resolveAsJSON.bind(this)) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: new Headers(this._headers), // POST needs all previously defined headers
        body: JSON.stringify(data)
      };

      fetch(url, options)
        .then(data => {
          // In case the request wen well but didn't gave the expected 200 status
          if (data.status >= 400) {
            reject(data);
          }

          if (resolution !== undefined && resolution !== null) {
            return resolution(data);
          }

          return data;
        })
        .then(resolve)
        .catch(reject);
    });
  }


  /** 
   * @method
   * @async
   * @name postText
   * @public
   * @memberof Kom
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * <code>POST</code> HTTP request using the fetch API.<br>Beware that the given options
   * object match the url expectations.<br><code>resolve</code>
   * returns the response as a <code>String</code>.<br><code>reject</code> returns an error key as a <code>String</code>.
   * </blockquote>
   * @param {String} url - The <code>POST</code> url to fetch data from
   * @param {Object} data - The <code>JSON</code> object that contains <code>POST</code> parameters
   * @returns {Promise} The request <code>Promise</code>
   **/
  postText(url, data) {
    return this.post(url, data, this._resolveAsText.bind(this));
  }


  postImage(url, data) {
    return this.post(url, data, null);
  }


  // ======================================================================== //
  // ------------------------- PATCH server calls --------------------------- //
  // ======================================================================== //


  patch(url, data, resolution = this._resolveAsJSON.bind(this)) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'PATCH',
        headers: new Headers(this._headers), // PATCH needs all previously defined headers
        body: JSON.stringify(data)
      };

      fetch(url, options)
        .then(data => {
          // In case the request wen well but didn't gave the expected 200 status
          if (data.status >= 400) {
            reject(data);
          }

          if (resolution !== undefined && resolution !== null) {
            return resolution(data);
          }

          return data;
        })
        .then(resolve)
        .catch(reject);
    });
  }


  patchImage(url, data) {
    return this.patch(url, data, null);
  }


  // ======================================================================== //
  // ------------------------- DELETE server calls -------------------------- //
  // ======================================================================== //


  delete(url, data, resolution = this._resolveAsJSON.bind(this)) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'DELETE',
        headers: new Headers(this._headers), // DELETE needs all previously defined headers
        body: JSON.stringify(data)
      };

      fetch(url, options)
        .then(data => {
          // In case the request wen well but didn't gave the expected 200 status
          if (data.status >= 400) {
            reject(data);
          }

          if (resolution !== undefined && resolution !== null) {
            return resolution(data);
          }

          return data;
        })
        .then(resolve)
        .catch(reject);
    });
  }


  // ======================================================================== //
  // ------------------ BeerCrackerz server call shortcuts ------------------ //
  // ======================================================================== //


  _getMarks(type) {
    return new Promise((resolve, reject) => {
      this.get(`/api/${type}`).then(resolve).catch(reject);
    });
  }


  getSpots() {
    return this._getMarks('spot');
  }


  getShops() {
    return this._getMarks('shop');
  }


  getBars() {
    return this._getMarks('bar');
  }


  _saveMark(type, data) {
    return this.post(`/api/${type}/`, data, this._resolveAsJSON.bind(this));
  }


  spotCreated(data) {
    return this._saveMark('spot', data);    
  }


  shopCreated(data) {
    return this._saveMark('shop', data);    
  }


  barCreated(data) {
    return this._saveMark('bar', data);    
  }


  _editMark(type, id, data) {
    if (!type || !id || !data) { Promise.reject(); }
    return this.patch(`/api/${type}/${id}/`, data, this._resolveAsJSON.bind(this));
  }


  spotEdited(id, data) {
    return this._editMark('spot', id, data);    
  }


  shopEdited(id, data) {
    return this._editMark('shop', id, data);    
  }


  barEdited(id, data) {
    return this._editMark('bar', id, data);    
  }


  _deleteMark(type, id, data) {
    if (!type || !id || !data) { Promise.reject(); }
    return this.delete(`/api/${type}/${id}/`, data, null);
  }


  spotDeleted(id, data) {
    return this._deleteMark('spot', id, data);    
  }


  shopDeleted(id, data) {
    return this._deleteMark('shop', id, data);    
  }


  barDeleted(id, data) {
    return this._deleteMark('bar', id, data);    
  }


  get csrf() {
    return null;
  }


}


export default Kom;
