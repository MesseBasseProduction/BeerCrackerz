import AddMarkModal from './modal/AddMarkModal.js';
import DeleteAccountModal from './modal/DeleteAccountModal.js';
import DeleteMarkModal from './modal/DeleteMarkModal.js';
import EditMarkModal from './modal/EditMarkModal.js';
import UserModal from './modal/UserModal.js';
import UpdateProfilePictureModal from './modal/UpdateProfilePictureModal.js';
import HideShowModal from './modal/HideShowModal.js';
import StartupHelpModal from './modal/StartupHelpModal.js';


const Classes = {
  AddMarkModal,
  DeleteAccountModal,
  DeleteMarkModal,
  EditMarkModal,
  UserModal,
  UpdateProfilePictureModal,
  HideShowModal,
  StartupHelpModal
};


class ModalFactory {


  static build(name, options = {}) {
    if (!Classes[`${name}Modal`]) {
      return null;
    }

    return new Classes[`${name}Modal`](options);
  }


}


export default ModalFactory;
