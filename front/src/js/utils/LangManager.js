import Utils from './Utils.js';


class LangManager {


  constructor(lang, cb) {
    this._lang = (Utils.SUPPORTED_LANGUAGE.indexOf(lang) !== -1) ? lang : 'en';
    this._values = {};
    this._init().then(cb);
  }


  _init() {
    return new Promise((resolve, reject) => {
      Utils.fetchFile(`assets/nls/${this._lang}.json`).then(lang => {
        this._values = JSON.parse(lang);
        resolve();
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


  store(key) {
    return this._values.store[key] || '';
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
