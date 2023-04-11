class ZoomSlider {


  constructor(map) {
    this._map = map;
    this._container = document.querySelector('#zoom-slider');
    this._slider = document.querySelector('#slider-position');
    this._zoomRange = this._map.getMaxZoom() - this._map.getMinZoom();
    this._timeoutId = -1;
    this._events();
  }


  _events() {
    // Map callback events
    this._map.on('zoomstart', this._zoomStart.bind(this));
    this._map.on('zoomend', this._zoomEnd.bind(this));
    this._map.on('zoom', this._zoom.bind(this));
    // DOM mouse events
    this._container.addEventListener('mouseover', this._clearTimeout.bind(this));
    this._container.querySelector('#slider-wrapper').addEventListener('click', this._relativeZoom.bind(this));
    this._container.addEventListener('mouseleave', this._startTimeout.bind(this));
    this._container.querySelector('#zoom-more').addEventListener('click', this._zoomIn.bind(this));
    this._container.querySelector('#zoom-less').addEventListener('click', this._zoomOut.bind(this));
  }


  _zoomStart() {
    this._clearTimeout();
    this._container.classList.add('opened');
  }


  _zoomEnd() {
    const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
    this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;
    this._startTimeout();
  }


  _zoom() {
    this._clearTimeout();
    const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
    this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;    
  }


  _zoomIn() {
    this._map.setZoom(this._map.getZoom() + 1);
  }


  _zoomOut() {
    this._map.setZoom(this._map.getZoom() - 1);
  }


  _relativeZoom(e) {
    this._clearTimeout();
    // y represents the % in slider wrapper (bottom to top)
    const bRect = this._container.querySelector('#slider-wrapper').getBoundingClientRect();
    const y = (bRect.height - (e.pageY - bRect.top)) / bRect.height;
    // Update height and map zoom level accordingly
    this._slider.style.height = `${y * 100}%`;
    this._map.setZoom(this._map.getMinZoom() + ((y * 100) * this._zoomRange) / 100); // minZoom + % on zoomRange
  }


  _startTimeout() {
    this._timeoutId = setTimeout(() => {
      this._container.classList.remove('opened');
    }, 1500);
  }


  _clearTimeout() {
    clearTimeout(this._timeoutId);
    this._timeoutId = -1;
  }


  hide() {
    this._container.classList.remove('opened');
    this._clearTimeout();
  }


}


export default ZoomSlider;
