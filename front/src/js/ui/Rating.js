class Rating {


  constructor(domList, rate) {
    this._container = null;
    this._items = [];
    this._currentRate = rate || 0; // Mostly for hover operations
    this._clicked = rate || - 1; // To know when user clicked on a given star

    this._init(domList);
    this._events();
  }


  _init(domList) {
    this._container = domList;
    for (let i = 0; i < domList.children.length; ++i) {
      this._items.push(domList.children[i]);
    }
    // Init Rating with given rate
    for (let i = 0; i < this._currentRate + 1; ++i) {
      this._items[i].classList.add('active');
      this._items[i].classList.add('selected');
    }
  }


  _events() {
    this._container.addEventListener('mouseover', this._containerHovered.bind(this), false);
    this._container.addEventListener('mouseout', this._pointerExit.bind(this), false);
    for (let i = 0; i < this._items.length; ++i) {
      this._items[i].addEventListener('click', this._starClicked.bind(this), false);
    }
  }


  _containerHovered(event) {
    if (event.target.tagName === 'IMG') {
      this._currentRate = parseInt(event.target.dataset.id);
      this._container.dataset.rate = this._currentRate;
      this.updateStars();
    }
  }


  _pointerExit() {
    this._currentRate = (this._clicked === -1) ? 0 : this._clicked;
    this._container.dataset.rate = this._currentRate;
    this.updateStars();
  }


  _starClicked(event) {
    this._currentRate = parseInt(event.target.dataset.id);
    this._container.dataset.rate = this._currentRate;
    this._clicked = this._currentRate;
    this.updateStars();
  }


  updateStars() {
    for (let i = 0; i < this._items.length; ++i) {
      if (i <= this._currentRate) {
        this._items[i].classList.add('active');
        if (i <= this._clicked) {
          this._items[i].classList.add('selected');
        }
      } else {
        this._items[i].classList.remove('active');
        this._items[i].classList.remove('selected');
      }
    }
  }


  get currentRate() {
    return this._currentRate;
  }


}


export default Rating;
