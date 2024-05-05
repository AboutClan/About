import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function NotCompletedModal({ setIsModal }: IModal) {
  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <>
      <ModalLayout title="준비중인 컨텐츠" footerOptions={footerOptions} setIsModal={setIsModal}>
        <ModalSubtitle>개발 진행중인 컨텐츠입니다.</ModalSubtitle>
      </ModalLayout>
    </>
  );
}

export default NotCompletedModal;
