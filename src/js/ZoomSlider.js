class ZoomSlider {


  constructor(map) {
    this._map = map;
    this._container = document.querySelector('#zoom-slider');
    this._slider = document.querySelector('#slider-position');
    this._zoomRange = this._map.getMaxZoom() - this._map.getMinZoom();
    this._timeoutId = null;

    this._map.on('zoomstart', () => {
      clearTimeout(this._timeoutId);
      this._container.classList.add('opened');
    });

    this._map.on('zoomend', () => {
      const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
      this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;
      this._timeoutId = setTimeout(() => this._container.classList.remove('opened'), 1200);
    });

    this._map.on('zoom', () => {
      const correctedZoom = this._map.getZoom() - this._map.getMinZoom();
      this._slider.style.height = `${(correctedZoom * 100) / this._zoomRange}%`;
    });    
  }


}


export default ZoomSlider;
