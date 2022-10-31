import DeleteMarkModal from './modal/DeleteMarkModal.js';
import HideShowModal from './modal/HideShowModal.js';

const Classes = {
  DeleteMarkModal,
  HideShowModal
};


class ModalFactory {


  constructor(name, options = {}) {
    return new Classes[`${name}Modal`](options);
  }


}


export default ModalFactory;
