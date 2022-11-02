import AddMarkModal from './modal/AddMarkModal.js';
import DeleteMarkModal from './modal/DeleteMarkModal.js';
import EditMarkModal from './modal/EditMarkModal.js';
import UserModal from './modal/UserModal.js';
import UpdateProfilePictureModal from './modal/UpdateProfilePictureModal.js';
import HideShowModal from './modal/HideShowModal.js';


const Classes = {
  AddMarkModal,
  DeleteMarkModal,
  EditMarkModal,
  UserModal,
  UpdateProfilePictureModal,
  HideShowModal
};


class ModalFactory {


  constructor(name, options = {}) {
    return new Classes[`${name}Modal`](options);
  }


}


export default ModalFactory;
