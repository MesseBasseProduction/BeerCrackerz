import Utils from '../utils/Utils.js';


class LangManager {


  /** 
   * @summary Handle i18n for BeerCrackerz
   * @author Arthur Beaulieu
   * @since September 2022
   * @description
   * <blockquote>
   * This class will fetch and store all i18n keys for a given language to be used in BeerCrackerz.
   * </blockquote> 
   * @param {String} lang - The selected language to fetch
   * @param {Function} cb - The callback to call once i18n keys are loaded
   * @param {Function} err - The callback to call if anything went wrong
   **/
  constructor(lang, cb, err) {
    this._lang = (Utils.SUPPORTED_LANGUAGE.indexOf(lang) !== -1) ? lang : 'en';
    this._values = {};
    this._init().then(cb).catch(err);
  }


  _init() {
    return new Promise((resolve, reject) => {
      fetch(`/static/nls/${this._lang}.json`).then(data => {
        // In case the request wen well but didn't gave the expected 200 status
        if (data.status !== 200) {
          data.msg = `Fetching the i18n file failed`;
          reject(data);
        }

        data.text().then(nls => {
          try {
            this._values = JSON.parse(nls);
          } catch (err) {
            data.msg = `Parsing the i18n file failed`;
            reject(data);
          }

          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }


  debug(key) {
    return this._values.debug[key] || '';
  }


  notif(key) {
    return this._values.notif[key] || '';
  }


  nav(key) {
    return this._values.nav[key] || '';
  }


  map(key) {
    return this._values.map[key] || '';
  }


  spot(key) {
    return this._values.spot[key] || '';
  }


  shop(key) {
    return this._values.shop[key] || '';
  }


  bar(key) {
    return this._values.bar[key] || '';
  }


  popup(key) {
    return this._values.popup[key] || '';
  }


  modal(key) {
    return this._values.modal[key] || '';
  }


  login(key) {
    return this._values.auth.login[key] || '';
  }


  register(key) {
    return this._values.auth.register[key] || '';
  }


  forgotPassword(key) {
    return this._values.auth.forgotPassword[key] || '';    
  }


}


export default LangManager;
