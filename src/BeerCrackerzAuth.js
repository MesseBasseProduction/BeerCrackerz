import './BeerCrackerzAuth.scss';
import LangManager from './js/utils/LangManager.js';
import Utils from './js/utils/Utils.js';


class BeerCrackerzAuth {


  constructor() {
    let _init = () => {};
    if (document.body.className.includes('login')) {
      _init = this._handleLogin.bind(this);
    } else if (document.body.className.includes('register')) {
      _init = this._handleRegister.bind(this);
    }
    // The BeerCrackerz app is only initialized once nls are set up
    this._lang = new LangManager(
      window.navigator.language.substring(0, 2),
      _init.bind(this)
    );
  }


  _handleLogin() {
    // Update page nls according to browser language
    document.title = this.nls.login('headTitle');
    Utils.replaceString(document.body, '{{LOGIN_SUBTITLE}}', this.nls.login('subtitle'));
    Utils.replaceString(document.body, '{{LOGIN_HIDDEN_ERROR}}', this.nls.login('hiddenError'));
    Utils.replaceString(document.body, '{{LOGIN_USERNAME_LABEL}}', this.nls.login('username'));
    Utils.replaceString(document.body, '{{LOGIN_USERNAME_PASSWORD}}', this.nls.login('password'));
    Utils.replaceString(document.body, '{{LOGIN_BUTTON}}', this.nls.login('login'));
    Utils.replaceString(document.body, '{{LOGIN_NOT_REGISTERED}}', this.nls.login('notRegistered'));
    Utils.replaceString(document.body, '{{LOGIN_REGISTER}}', this.nls.login('register'));
    
    const error = document.getElementById('login-error');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
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
    const _backValidation = response => {
      // Check response and handle status codes
      console.log(response);
      // If all front and back tests are ok, redirect to auth
      // If the user ma nually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = 'authindex.html';
    };
    // Submit click event
    document.getElementById('login-submit').addEventListener('click', () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      password.classList.remove('error');
      if (_frontFieldValidation()) {
        Utils.postReq('/api/login/submit').then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.login('serverError');
        });
      }
    }, false);
  }


  _handleRegister() {
    // Update page nls according to browser language
    document.title = this.nls.register('headTitle');
    Utils.replaceString(document.body, '{{REGISTER_SUBTITLE}}', this.nls.register('subtitle'));
    Utils.replaceString(document.body, '{{REGISTER_HIDDEN_ERROR}}', this.nls.register('hiddenError'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_LABEL}}', this.nls.register('username'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_PASSWORD_1}}', this.nls.register('password1'));
    Utils.replaceString(document.body, '{{REGISTER_USERNAME_PASSWORD_2}}', this.nls.register('password2'));
    Utils.replaceString(document.body, '{{REGISTER_BUTTON}}', this.nls.register('register'));
    Utils.replaceString(document.body, '{{REGISTER_ALREADY_DONE}}', this.nls.register('notRegistered'));
    Utils.replaceString(document.body, '{{REGISTER_LOGIN}}', this.nls.register('login'));    
    const error = document.getElementById('register-error');
    const username = document.getElementById('username');
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    // useful login method for field check and server response check
    const _frontFieldValidation = () => {
      // Handling empty error cases
      if (username.value === '' || password1.value === '' || password2.value === '') {
        error.classList.add('visible');
        error.innerHTML = this.nls.register('fieldEmpty');
        if (username.value === '') {
          username.classList.add('error');
        }
        if (password1.value === '') {
          password1.classList.add('error');
        }
        if (password2.value === '') {
          password2.classList.add('error');
        }
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
    const _backValidation = (response) => {
      // Check response and handle status codes
      console.log(response);
      // If all front and back tests are ok, redirect to auth
      // If the user ma nually force redirection to authindex,
      // the server should reject the request as the user is not authenticated
      window.location = 'authindex.html';
    };
    // Submit click event
    document.getElementById('register-submit').addEventListener('click', () => {
      // Reset error css classes
      error.classList.remove('visible');
      username.classList.remove('error');
      password1.classList.remove('error');
      password2.classList.remove('error');
      if (_frontFieldValidation()) {
        Utils.postReq('/api/register/submit').then(_backValidation).catch(() => {
          error.classList.add('visible');
          error.innerHTML = this.nls.register('serverError');
        });
      }
    }, false);
  }


	get nls() {
		return this._lang;
	}  


}


export default BeerCrackerzAuth;
