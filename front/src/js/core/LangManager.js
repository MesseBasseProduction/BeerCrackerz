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
  constructor() {
    this._lang = '';
    this._fullLang = '';
    this._values = {};
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


  updateLang(lang) {
    return new Promise((resolve, reject) => {
      if (this._lang !== lang) {
        this._lang = (Utils.SUPPORTED_LANGUAGE.indexOf(lang) !== -1) ? lang : 'en';
        this._fullLang = lang;
        this._init().then(resolve).catch(reject);
      } else {
        resolve();
      }
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


  resetPassword(key) {
    return this._values.auth.resetPassword[key] || '';    
  }


  // Auth page shortcut to update UI chunks of text in views 


  handleLoginAside(aside) {
    Utils.replaceString(aside, '{LOGIN_SUBTITLE}', this.login('subtitle'));
    Utils.replaceString(aside, '{LOGIN_HIDDEN_ERROR}', this.login('hiddenError'));
    Utils.replaceString(aside, '{LOGIN_USERNAME_LABEL}', this.login('username'));
    Utils.replaceString(aside, '{LOGIN_USERNAME_PASSWORD}', this.login('password'));
    Utils.replaceString(aside, '{LOGIN_BUTTON}', this.login('login'));
    Utils.replaceString(aside, '{LOGIN_NOT_REGISTERED}', this.login('notRegistered'));
    Utils.replaceString(aside, '{LOGIN_REGISTER}', this.login('register'));
    Utils.replaceString(aside, '{LOGIN_FORGOT_PASSWORD}', this.login('forgot'));
    Utils.replaceString(aside, '{LOGIN_PASSWORD_RESET}', this.login('reset'));    
  }


  handleRegisterAside(aside) {
    Utils.replaceString(aside, '{REGISTER_SUBTITLE}', this.register('subtitle'));
    Utils.replaceString(aside, '{REGISTER_HIDDEN_ERROR}', this.register('hiddenError'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_LABEL}', this.register('username'));
    Utils.replaceString(aside, '{REGISTER_MAIL_LABEL}', this.register('mail'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_PASSWORD_1}', this.register('password1'));
    Utils.replaceString(aside, '{REGISTER_USERNAME_PASSWORD_2}', this.register('password2'));
    Utils.replaceString(aside, '{REGISTER_BUTTON}', this.register('register'));
    Utils.replaceString(aside, '{REGISTER_ALREADY_DONE}', this.register('notRegistered'));
    Utils.replaceString(aside, '{REGISTER_LOGIN}', this.register('login'));    
  }


  handleForgotPasswordAside(aside) {
    Utils.replaceString(aside, '{FORGOT_PASSWORD_SUBTITLE}', this.forgotPassword('subtitle'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_ERROR}', this.register('hiddenError'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_MAIL_LABEL}', this.forgotPassword('mail'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_BUTTON}', this.forgotPassword('submit'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_LOGIN_LABEL}', this.forgotPassword('loginLabel'));
    Utils.replaceString(aside, '{FORGOT_PASSWORD_LOGIN}', this.forgotPassword('login'));
  }


  handleResetPasswordAside(aside) {
    Utils.replaceString(aside, '{RESET_PASSWORD_SUBTITLE}', this.resetPassword('subtitle'));
    Utils.replaceString(aside, '{RESET_PASSWORD_HIDDEN_ERROR}', this.resetPassword('hiddenError'));
    Utils.replaceString(aside, '{RESET_PASSWORD_1}', this.resetPassword('password1'));
    Utils.replaceString(aside, '{RESET_PASSWORD_2}', this.resetPassword('password2'));
    Utils.replaceString(aside, '{RESET_PASSWORD_BUTTON}', this.resetPassword('reset'));
    Utils.replaceString(aside, '{RESET_PASSWORD_LOGIN_LABEL}', this.resetPassword('loginLabel'));
    Utils.replaceString(aside, '{RESET_PASSWORD_LOGIN}', this.resetPassword('login'));    
  }


  // Main App shortcut to update UI chunks of text in views 


  addMarkModal(dom, type, action) {
    Utils.replaceString(dom.querySelector(`#nls-${type}-title`), `{${type.toUpperCase()}_TITLE}`, this[type](`${action}Title`));
    Utils.replaceString(dom.querySelector(`#nls-${type}-subtitle`), `{${type.toUpperCase()}_SUBTITLE}`, this[type]('subtitle'));
    Utils.replaceString(dom.querySelector(`#nls-${type}-name`), `{${type.toUpperCase()}_NAME}`, this[type]('nameLabel'));
    Utils.replaceString(dom.querySelector(`#nls-${type}-desc`), `{${type.toUpperCase()}_DESC}`, this[type]('descLabel'));
    Utils.replaceString(dom.querySelector(`#nls-${type}-rate`), `{${type.toUpperCase()}_RATE}`, this[type]('rateLabel'));
    Utils.replaceString(dom.querySelector(`#nls-${type}-type`), `{${type.toUpperCase()}_TYPE}`, this[type]('typeLabel'));
    Utils.replaceString(dom.querySelector(`#nls-${type}-modifiers`), `{${type.toUpperCase()}_MODIFIERS}`, this[type]('modifiersLabel'));
    Utils.replaceString(dom.querySelector(`#${type}-submit`), `{${type.toUpperCase()}_SUBMIT}`, this.nav('add'));
    Utils.replaceString(dom.querySelector(`#${type}-close`), `{${type.toUpperCase()}_CANCEL}`, this.nav('cancel'));    
    if (dom.querySelector(`#nls-${type}-price`)) {
      Utils.replaceString(dom.querySelector(`#nls-${type}-price`), `{${type.toUpperCase()}_PRICE}`, this[type]('priceLabel'));
    }
  }


  deleteMarkModal(dom) {
    Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{MODAL_TITLE}`, this.modal('deleteMarkTitle'));
    Utils.replaceString(dom.querySelector(`#nls-modal-desc`), `{MODAL_DESC}`, this.modal('deleteMarkDesc'));
    Utils.replaceString(dom.querySelector(`#cancel-close`), `{MODAL_CANCEL}`, this.nav('cancel'));
    Utils.replaceString(dom.querySelector(`#delete-close`), `{MODAL_DELETE}`, this.nav('delete'));    
  }


  userProfileModal(dom) {
    Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{MODAL_TITLE}`, this.modal('userTitle'));
    Utils.replaceString(dom.querySelector(`#nls-user-high-accuracy`), `{ACCURACY_USER_CHECK}`, this.modal('userAccuracyPref'));
    Utils.replaceString(dom.querySelector(`#nls-user-dark-theme`), `{DARK_THEME_CHECK}`, this.modal('darkThemePref'));
    Utils.replaceString(dom.querySelector(`#nls-user-debug`), `{DEBUG_USER_CHECK}`, this.modal('userDebugPref'));
    Utils.replaceString(dom.querySelector(`#nls-lang-select`), `{LANG_SELECT}`, this.modal('langPref'));
    Utils.replaceString(dom.querySelector(`#nls-lang-fr`), `{LANG_FR}`, this.modal('langFr'));
    Utils.replaceString(dom.querySelector(`#nls-lang-en`), `{LANG_EN}`, this.modal('langEn'));
    Utils.replaceString(dom.querySelector(`#nls-lang-es`), `{LANG_ES}`, this.modal('langEs'));
    Utils.replaceString(dom.querySelector(`#nls-lang-de`), `{LANG_DE}`, this.modal('langDe'));
    Utils.replaceString(dom.querySelector(`#nls-lang-pt`), `{LANG_PT}`, this.modal('langPt')); 
    Utils.replaceString(dom.querySelector(`#nls-about-desc`), `{BEERCRACKERZ_DESC}`, this.modal('aboutDesc'));
    Utils.replaceString(dom.querySelector(`#nls-update-pp`), `{UPDATE_PROFILE_PIC_LABEL}`, this.modal('updatePP'));    
  }


  updateProfilePictureModal(dom) {
    Utils.replaceString(dom.querySelector(`#nls-modal-title`), `{MODAL_TITLE}`, this.modal('updatePPTitle'));
    Utils.replaceString(dom.querySelector(`#nls-modal-desc`), `{UPDATE_PP_DESC}`, this.modal('updatePPDesc'));
    Utils.replaceString(dom.querySelector(`#update-pp-close`), `{UPDATE_PP_CANCEL}`, this.nav('cancel'));
    Utils.replaceString(dom.querySelector(`#update-pp-submit`), `{UPDATE_PP_SUBMIT}`, this.nav('upload'));
  }


  hideShowModal(dom) {
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-title`), `{MODAL_TITLE}`, this.modal('hideShowTitle'));
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-labels`), `{LABELS_HIDESHOW_MODAL}`, this.modal('hideShowLabels'));
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-circles`), `{CIRCLES_HIDESHOW_MODAL}`, this.modal('hideShowCircles'));
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-spots`), `{SPOTS_HIDESHOW_MODAL}`, this.modal('hideShowSpots'));
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-shops`), `{SHOPS_HIDESHOW_MODAL}`, this.modal('hideShowShops'));
    Utils.replaceString(dom.querySelector(`#nls-hideshow-modal-bars`), `{BARS_HIDESHOW_MODAL}`, this.modal('hideShowBars'));
    Utils.replaceString(dom.querySelector(`#nls-view-helper-label`), `{HELPER_LABEL}`, this.modal('hideShowHelperLabel'));
    Utils.replaceString(dom.querySelector(`#modal-close-button`), `{MODAL_CLOSE}`, this.nav('close'));    
  }


  markPopup(dom, options) {
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_NAME}`, Utils.stripDom(options.name));
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_FINDER}`, options.user);
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_FOUND_BY}`, this.popup(`${options.type}FoundBy`));
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_FOUND_WHEN}`, this.popup(`${options.type}FoundWhen`));
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_FOUND_DATE}`, options.date);
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_RATE}`, options.rate + 1);
    Utils.replaceString(dom, `{${options.type.toUpperCase()}_DESC}`, options.desc);    
  }


  get fullLang() {
    return this._fullLang;
  }


}


export default LangManager;
