import { IFooterOptions, ModalLayout } from "@/components/modals/Modals";
import { IConfirmContent } from "@/modals/common/ConfirmModal";
import { IModal } from "@/types/components/modalTypes";

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
    <ModalLayout footerOptions={footerOptions} title={content.title} setIsModal={setIsModal}>
      {content.text}
    </ModalLayout>
  );
}

export default ConfirmModal2;
