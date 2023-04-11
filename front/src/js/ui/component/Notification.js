class Notification {


  constructor() {
    this._container = document.querySelector('#notification-wrapper');
    this._message = document.querySelector('#notification-message');
    this._timeoutId = null;
  }


  raise(message) {
    clearTimeout(this._timeoutId);
    this._message.innerHTML = message;
    this._container.classList.add('opened');
    this._timeoutId = setTimeout(() => {
      this._container.classList.remove('opened');
      this._message.innerHTML = '';
    }, 2000);
  }


}


export default Notification;
