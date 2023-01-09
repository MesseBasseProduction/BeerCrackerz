class ImageResizer {


  constructor(options) {
    this._width = options.width;
    this._height = options.height;

    this._dom = {
      wrapper: options.wrapper,
      container: null,
      resizer: null,
      tl: null,
      tr: null,
      br: null,
      bl: null,
      l: null,
      t: null,
      r: null,
      b: null
    };

    this._grab = {
      tl: false,
      tr: false,
      br: false,
      bl: false,
      l: false,
      t: false,
      r: false,
      b: false,
      resizer: false
    };

    this._min = { x: 0, y: 0 };
    this._max = { x: 500, y: 500 };
    this._pointer = { x: 0, y: 0 };

    this.containerRect = {};
    this.resizerRect = {};

    this._buildUI();
    this._events();
  }


  _buildUI() {
    this._dom.wrapper.classList.add('image-resizer');
    this._dom.container = document.createElement('DIV');
    this._dom.resizer = document.createElement('DIV');
    this._dom.tl = document.createElement('DIV');
    this._dom.tr = document.createElement('DIV');
    this._dom.br = document.createElement('DIV');
    this._dom.bl = document.createElement('DIV');
    this._dom.l = document.createElement('DIV');
    this._dom.t = document.createElement('DIV');
    this._dom.r = document.createElement('DIV');
    this._dom.b = document.createElement('DIV');

    this._dom.container.classList.add('container');
    this._dom.resizer.classList.add('resizer');
    this._dom.tl.classList.add('tl-grab');
    this._dom.tl.dataset.loc = 'tl';
    this._dom.tr.classList.add('tr-grab');
    this._dom.tr.dataset.loc = 'tr';
    this._dom.br.classList.add('br-grab');
    this._dom.br.dataset.loc = 'br';
    this._dom.bl.classList.add('bl-grab');
    this._dom.bl.dataset.loc = 'bl';
    this._dom.l.classList.add('l-grab');
    this._dom.l.dataset.loc = 'l';
    this._dom.t.classList.add('t-grab');
    this._dom.t.dataset.loc = 't';
    this._dom.r.classList.add('r-grab');
    this._dom.r.dataset.loc = 'r';
    this._dom.b.classList.add('b-grab');
    this._dom.b.dataset.loc = 'b';
    this._dom.resizer.dataset.loc = 'resizer';

    this._dom.resizer.appendChild(this._dom.tl);
    this._dom.resizer.appendChild(this._dom.tr);
    this._dom.resizer.appendChild(this._dom.br);
    this._dom.resizer.appendChild(this._dom.bl);
    this._dom.resizer.appendChild(this._dom.l);
    this._dom.resizer.appendChild(this._dom.t);
    this._dom.resizer.appendChild(this._dom.r);
    this._dom.resizer.appendChild(this._dom.b);

    this._dom.wrapper.appendChild(this._dom.container);
    this._dom.wrapper.appendChild(this._dom.resizer);

    requestAnimationFrame(() => {
      this.containerRect = this._dom.container.getBoundingClientRect();
      this._initResizer();
      this.resizerRect = this._dom.resizer.getBoundingClientRect();
    });
  }


  _events() {
    this._dom.resizer.addEventListener('mousedown', this._mouseDown.bind(this));
    document.body.addEventListener('mousemove', this._mouseMove.bind(this));
    document.body.addEventListener('mouseup', this._mouseUp.bind(this));
    this._dom.resizer.addEventListener('touchstart', this._mouseDown.bind(this));
    document.body.addEventListener('touchmove', this._mouseMove.bind(this));
    document.body.addEventListener('touchend', this._mouseUp.bind(this));
  }


  _initResizer() {
    if (this._width > this._height) { // Landscape
      const bRect = this._dom.resizer.getBoundingClientRect();
      this._dom.resizer.style.left = (bRect.width - bRect.height) / 2;
      this._dom.resizer.style.right = (bRect.width - bRect.height) / 2;
    } else if (this._width < this._height) { // Portrait
      const bRect = this._dom.resizer.getBoundingClientRect();
      this._dom.resizer.style.top = (bRect.height - bRect.width) / 2;
      this._dom.resizer.style.bottom = (bRect.height - bRect.width) / 2;
    }
  }


  _mouseDown(event) {
    if (Object.keys(this._grab).indexOf(event.target.dataset.loc) !== -1) {
      this._grab[event.target.dataset.loc] = true;
      // Need to compute bounding rect before being in mousemove loop
      this.containerRect = this._dom.container.getBoundingClientRect();
      this.resizerRect = this._dom.resizer.getBoundingClientRect();
      this._pointer.x = event.pageX - this.containerRect.x;
      this._pointer.y = event.pageY - this.containerRect.y;
      if (event.touches && event.touches.length) {
        this._pointer.x = event.touches[0].clientX - this.containerRect.x;
        this._pointer.y = event.touches[0].clientY - this.containerRect.y;
      }      
    }
  }


  _mouseMove(event) {
    if (this._isGrabbed())  {      
      if (event.touches && event.touches.length) {
        event.pageX = event.touches[0].clientX;
        event.pageY = event.touches[0].clientY;        
      }

      let offsetX = event.pageX - this.containerRect.x;
      let offsetY = event.pageY - this.containerRect.y;

      if (offsetX < 0) {
        offsetX = 0;
      }
      if (offsetX > this.containerRect.width) {
        offsetX = this.containerRect.width;
      }
      if (offsetY < 0) {
        offsetY = 0;
      }
      if (offsetY > this.containerRect.height) {
        offsetY = this.containerRect.height;
      }

      const offsetL = this.resizerRect.x - this.containerRect.x;
      const offsetT = this.resizerRect.y - this.containerRect.y;
      const offsetR = this.resizerRect.x + this.resizerRect.width - this.containerRect.x;
      const offsetB = this.resizerRect.y + this.resizerRect.height - this.containerRect.y;
      const minWidth = this.containerRect.width - (512 * this.containerRect.width / this._width);
      const minHeight = this.containerRect.height - (512 * this.containerRect.height / this._height);

      if (this._grab.tl) { // Top/Left
        if (offsetT + (offsetX - offsetL) < 0) { // Top blocking
          const offset = this._dom.resizer.style.top.slice(0, -2);
          this._dom.resizer.style.top = 0;
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - offset;
          return;
        } else if (offsetT + (offsetX - offsetL) > minHeight) {
          return;
        }
        this._dom.resizer.style.left =  offsetL + (offsetX - offsetL);
        this._dom.resizer.style.top = offsetT + (offsetX - offsetL);
      } else if (this._grab.tr) { // Top/Right
        if (offsetT + (offsetR - offsetX) < 0) { // Top blocking
          const offset = this._dom.resizer.style.top.slice(0, -2);
          this._dom.resizer.style.top = 0;
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - offset;
          return;
        } else if (offsetT + (offsetR - offsetX) > minHeight) {
          return;
        }
        this._dom.resizer.style.right = (this.containerRect.width - offsetR) + offsetR - offsetX;
        this._dom.resizer.style.top = offsetT + (offsetR - offsetX);
      } else if (this._grab.br) { // Bottom/Right
        if ((this.containerRect.height - offsetB) + offsetR - offsetX < 0) { // Bottom blocking
          const offset = this._dom.resizer.style.bottom.slice(0, -2);
          this._dom.resizer.style.bottom = 0;
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - offset;
          return;
        } else if ((this.containerRect.height - offsetB) + offsetR - offsetX > minHeight) {
          return;
        }
        this._dom.resizer.style.right = (this.containerRect.width - offsetR) + offsetR - offsetX;
        this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + offsetR - offsetX;
      } else if (this._grab.bl) { // Bottom/Left
        if ((this.containerRect.height - offsetB) + (offsetX - offsetL) < 0) { // Bottom blocking
          const offset = this._dom.resizer.style.bottom.slice(0, -2);
          this._dom.resizer.style.bottom = 0;
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - offset;
          return;
        } else if ((this.containerRect.height - offsetB) + (offsetX - offsetL) > minHeight) {
          return;
        }
        this._dom.resizer.style.left = offsetL + (offsetX - offsetL);
        this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + (offsetX - offsetL);
      } else if (this._grab.l) { // Left
        if (offsetT + ((offsetX - offsetL) / 2) < 0) { // Top
          const offset = this._dom.resizer.style.top.slice(0, -2);
          this._dom.resizer.style.top = 0;
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - offset;
          this._dom.resizer.style.bottom = this._dom.resizer.style.bottom.slice(0, -2) - offset;
          return;
        } else if ((this.containerRect.height - offsetB) + ((offsetX - offsetL) / 2) < 0) { // Bottom
          const offset = this._dom.resizer.style.bottom.slice(0, -2);
          this._dom.resizer.style.bottom = 0;
          this._dom.resizer.style.top = this._dom.resizer.style.top.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - (offset / 2);
          return;
        } else if (offsetL + (offsetX - offsetL) > minWidth) {
          return;
        }
        this._dom.resizer.style.left = offsetL + (offsetX - offsetL);
        this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + ((offsetX - offsetL) / 2);
        this._dom.resizer.style.top = offsetT + ((offsetX - offsetL) / 2);
      } else if (this._grab.t) { // Top
        if (offsetL + ((offsetY - offsetT) / 2) < 0) { // Left
          const offset = this._dom.resizer.style.left.slice(0, -2);
          this._dom.resizer.style.left = 0;
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.top = this._dom.resizer.style.top.slice(0, -2) - (offset / 2);
          return;
        } else if ((this.containerRect.width - offsetR) + ((offsetY - offsetT) / 2) < 0) { // Right
          const offset = this._dom.resizer.style.right.slice(0, -2);
          this._dom.resizer.style.right = 0;
          this._dom.resizer.style.top = this._dom.resizer.style.top.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - (offset / 2);
          return;
        } else if (offsetT + (offsetY - offsetT) > minHeight) {
          return;
        }
        this._dom.resizer.style.top = offsetT + (offsetY - offsetT);
        this._dom.resizer.style.left = offsetL + ((offsetY - offsetT) / 2);
        this._dom.resizer.style.right = (this.containerRect.width - offsetR) + ((offsetY - offsetT) / 2);
      } else if (this._grab.r) { // Right
        if (offsetT + (offsetR - offsetX) / 2 < 0) { // Top
          const offset = this._dom.resizer.style.top.slice(0, -2);
          this._dom.resizer.style.top = 0;
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.bottom = this._dom.resizer.style.bottom.slice(0, -2) - (offset / 2);
          return;
        } else if ((this.containerRect.height - offsetB) + (offsetR - offsetX) / 2 < 0) { // Bottom
          const offset = this._dom.resizer.style.bottom.slice(0, -2);
          this._dom.resizer.style.bottom = 0;
          this._dom.resizer.style.top = this._dom.resizer.style.top.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - (offset / 2);
          return;
        } else if ((this.containerRect.width - offsetR) + offsetR - offsetX > minWidth) {
          return;
        }
        this._dom.resizer.style.right = (this.containerRect.width - offsetR) + offsetR - offsetX;
        this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + (offsetR - offsetX) / 2;
        this._dom.resizer.style.top = offsetT + (offsetR - offsetX) / 2;
      } else if (this._grab.b) { // Bottom
        if (offsetL + (offsetB - offsetY) / 2 < 0) { // Left
          const offset = this._dom.resizer.style.left.slice(0, -2);
          this._dom.resizer.style.left = 0;
          this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.bottom = this._dom.resizer.style.bottom.slice(0, -2) - (offset / 2);
          return;
        } else if ((this.containerRect.width - offsetR) + (offsetB - offsetY) / 2 < 0) { // Right
          const offset = this._dom.resizer.style.right.slice(0, -2);
          this._dom.resizer.style.right = 0;
          this._dom.resizer.style.bottom = this._dom.resizer.style.bottom.slice(0, -2) - (offset / 2);
          this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - (offset / 2);
          return;
        } else if ((this.containerRect.height - offsetB) + offsetB - offsetY > minHeight) {
          return;
        }
        this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + offsetB - offsetY;
        this._dom.resizer.style.left = offsetL + (offsetB - offsetY) / 2;
        this._dom.resizer.style.right = (this.containerRect.width - offsetR) + (offsetB - offsetY) / 2;
      } else if (this._grab.resizer) {
        if (this._pointer.x - offsetX > 0) { // Left
          if (offsetL - (this._pointer.x - offsetX) < 0) {
            const offset = this._dom.resizer.style.left.slice(0, -2);
            this._dom.resizer.style.left = 0;
            this._dom.resizer.style.right = this._dom.resizer.style.right.slice(0, -2) - offset;
          } else {
            this._dom.resizer.style.left = offsetL - (this._pointer.x - offsetX);
            this._dom.resizer.style.right = (this.containerRect.width - offsetR) + (this._pointer.x - offsetX);            
          }
        } else { // Right
          if ((this.containerRect.width - offsetR) + (this._pointer.x - offsetX) < 0) {
            const offset = this._dom.resizer.style.right.slice(0, -2);
            this._dom.resizer.style.right = 0;
            this._dom.resizer.style.left = this._dom.resizer.style.left.slice(0, -2) - offset;
          } else {
            this._dom.resizer.style.left = offsetL - (this._pointer.x - offsetX);
            this._dom.resizer.style.right = (this.containerRect.width - offsetR) + (this._pointer.x - offsetX);            
          }
        } 

        if (this._pointer.y - offsetY > 0) { // Top
          if (offsetT - (this._pointer.y - offsetY) < 0) {
            const offset = this._dom.resizer.style.top.slice(0, -2);
            this._dom.resizer.style.top = 0;
            this._dom.resizer.style.bottom = this._dom.resizer.style.bottom.slice(0, -2) - offset;
          } else {
            this._dom.resizer.style.top = offsetT - (this._pointer.y - offsetY);
            this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + (this._pointer.y - offsetY);            
          }
        } else { // Bottom
          if ((this.containerRect.height - offsetB) + (this._pointer.y - offsetY) < 0) {
            const offset = this._dom.resizer.style.bottom.slice(0, -2);
            this._dom.resizer.style.bottom = 0;
            this._dom.resizer.style.top = this._dom.resizer.style.top.slice(0, -2) - offset;
          } else {
            this._dom.resizer.style.top = offsetT - (this._pointer.y - offsetY);
            this._dom.resizer.style.bottom = (this.containerRect.height - offsetB) + (this._pointer.y - offsetY);            
          }
        }
      }
    }
  }


  _mouseUp(event) {
    event.preventDefault();
    this._grab.tl = false;
    this._grab.tr = false;
    this._grab.br = false;
    this._grab.bl = false;
    this._grab.l = false;
    this._grab.t = false;
    this._grab.r = false;
    this._grab.b = false;
    this._grab.resizer = false;
    this._computMinMax();
  }


  _computMinMax() {
    this.containerRect = this._dom.container.getBoundingClientRect();
    this.resizerRect = this._dom.resizer.getBoundingClientRect();

    this._min = {
      x: this.resizerRect.x - this.containerRect.x || 0,
      y: this.resizerRect.y - this.containerRect.y || 0
    };

    this._max = {
      x: this.resizerRect.x + this.resizerRect.width - this.containerRect.x || this.containerRect.x,
      y: this.resizerRect.y + this.resizerRect.height - this.containerRect.y || this.containerRect.y
    };
  }


  _isGrabbed() {
    if (this._grab.tl || this._grab.tr || this._grab.bl || this._grab.br) {
      return true;
    } else if (this._grab.l || this._grab.t || this._grab.r || this._grab.b) {
      return true;
    } else if (this._grab.resizer) {
      return true;
    }

    return false;
  }


  getMinPoint() {
    this._computMinMax();
    return {
      x: (this._min.x / this.containerRect.width) * this._width,
      y: (this._min.y / this.containerRect.height) * this._height
    };
  }


  getMaxPoint() {
    this._computMinMax();
    return {
      x: (this._max.x / this.containerRect.width) * this._width,
      y: (this._max.y / this.containerRect.height) * this._height      
    };
  }


}


export default ImageResizer;