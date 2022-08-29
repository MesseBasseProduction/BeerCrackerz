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
    this._map.on('zoomstart', () => {
      clearTimeout(this._timeoutId);
      this._timeoutId = -1;
      this._container.classList.add('opened');
    });

    this._map.on('zoomend', () => {
      const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
      this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;
      this._timeoutId = setTimeout(() => this._container.classList.remove('opened'), 1500);
    });

    this._map.on('zoom', () => {
      clearTimeout(this._timeoutId);
      this._timeoutId = -1;
      const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
      this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;
    });

    this._container.addEventListener('mouseover', () => {
      clearTimeout(this._timeoutId);
      this._timeoutId = -1;
    });

    this._container.addEventListener('mouseleave', () => {
      this._timeoutId = setTimeout(() => this._container.classList.remove('opened'), 1500);
    });

    this._container.querySelector('#zoom-more').addEventListener('click', () => {
      this._map.setZoom(this._map.getZoom() + 1);
    });

    this._container.querySelector('#zoom-less').addEventListener('click', () => {
      this._map.setZoom(this._map.getZoom() - 1);
    });
  }


}


export default ZoomSlider;
