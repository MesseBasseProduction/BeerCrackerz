import Utils from './Utils.js';


class LangManager {


  constructor(lang, cb) {
    this._lang = lang || 'en';
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


  modal(key) {
    return this._values.modal[key] || '';
  }


}


export default LangManager;
