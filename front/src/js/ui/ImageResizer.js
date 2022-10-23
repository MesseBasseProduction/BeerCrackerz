class ImageResizer {


  constructor(options) {
    this._dom = {
      wrapper: options.wrapper,
      container: null,
      resizer: null,
      tl: null
    };

    this._grab = {
      tl: false
    };

    this._buildUI();
    this._events();
  }


  _buildUI() {
    this._dom.wrapper.classList.add('image-resizer');
    this._dom.container = document.createElement('DIV');
    this._dom.resizer = document.createElement('DIV');
    this._dom.tl = document.createElement('DIV');

    this._dom.container.classList.add('container');
    this._dom.resizer.classList.add('resizer');
    this._dom.tl.classList.add('tl-grab');
    this._dom.tl.dataset.loc = 'tl';

    this._dom.resizer.appendChild(this._dom.tl);

    this._dom.wrapper.appendChild(this._dom.container);
    this._dom.wrapper.appendChild(this._dom.resizer);
  }


  _events() {
    this._dom.resizer.addEventListener('mousedown', this._mouseDown.bind(this));
    this._dom.resizer.addEventListener('mousemove', this._mouseOver.bind(this));
    this._dom.resizer.addEventListener('mouseup', this._mouseUp.bind(this));

    //this._dom.tl.addEventListener('click', this._tlGrabbed);
  }


  _mouseDown(event) {
    if (Object.keys(this._grab).indexOf(event.target.dataset.loc) !== -1) {
      this._grab[event.target.dataset.loc] = true;
    }
  }


  _mouseOver(event) {
    console.log(event)
    if (this._grab.tl) {
      event.preventDefault();
      console.log('dragging')
    }
  }


  _mouseUp(event) {
    this._grab.tl = false;
  }


  getMinPoint() {
    return { x: 0, y: 0 };
  }


  getMaxPoit() {
    return { x: 0, y: 0 };
  }

}


export default ImageResizer;