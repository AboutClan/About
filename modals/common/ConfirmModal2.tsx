import { IFooterOptions, ModalLayout } from "../../components/modals/Modals";
import { IModal } from "../../types/reactTypes";
import { IConfirmContent } from "./ConfirmModal";

interface IConfirmModal extends IModal {
  content: IConfirmContent;
}

function ConfirmModal2({ content, setIsModal }: IConfirmModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
      func: content.onClickRight,
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <ModalLayout
      footerOptions={footerOptions}
      title={content.title}
      setIsModal={setIsModal}
    >
      {content.text}
    </ModalLayout>
  );
}

export default ConfirmModal2;
