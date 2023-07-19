import { ModalHeaderX } from "../../../components/common/modal/ModalComponents";
import { ModalLayout } from "../../../components/common/modal/Modals";
import { IModal, IRefetch } from "../../../types/reactTypes";
import { IRegisterForm } from "../../../types/user/user";
import CheckRegisterModalDetail from "./CheckRegisterModalDetail";
import CheckRegisterModalFooter from "./CheckRegisterModalFooter";

interface ICheckRegisterModal extends IModal, IRefetch {
  applicant: IRegisterForm;
}

function CheckRegisterModal({
  setIsModal,
  applicant,
  setIsRefetch,
}: ICheckRegisterModal) {
  if (!applicant) return null;
  return (
    <ModalLayout size="md">
      <ModalHeaderX title={applicant.name} setIsModal={setIsModal} />
      <CheckRegisterModalDetail applicant={applicant} />
      <CheckRegisterModalFooter
        setIsModal={setIsModal}
        setIsRefetch={setIsRefetch}
        uid={applicant.uid}
      />
    </ModalLayout>
  );
}

export default CheckRegisterModal;
