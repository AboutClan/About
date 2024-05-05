import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function ServerInspectModal({ setIsModal }: IModal) {
  const footerOptions: IFooterOptions = {
    main: { text: "확인" },
  };

  return (
    <ModalLayout setIsModal={setIsModal} footerOptions={footerOptions} title="점검중">
      <ModalSubtitle>임시적으로 비활성화 된 컨텐츠 입니다.</ModalSubtitle>
      <div>해당 컨텐츠는 현재 점검중에 있습니다. 빠른 시간내로 다시 이용할 수 있게 조치할게요!</div>
    </ModalLayout>
  );
}

export default ServerInspectModal;
