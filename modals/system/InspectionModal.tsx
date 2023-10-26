import {
  ModalBody,
  ModalFooterOne,
  ModalHeader,
  ModalLayout,
} from "../../components/modals/Modals";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/reactTypes";

function ServerInspectModal({ setIsModal }: IModal) {
  return (
    <ModalLayout onClose={() => setIsModal(false)} size="md">
      <ModalHeader text="점검중" />
      <ModalBody>
        <ModalSubtitle>임시적으로 비활성화 된 컨텐츠 입니다.</ModalSubtitle>
        <div>
          해당 컨텐츠는 현재 점검중에 있습니다. 빠른 시간내로 다시 이용할 수
          있게 조치할게요!
        </div>
      </ModalBody>
      <ModalFooterOne text="확인" onClick={() => setIsModal(false)} />
    </ModalLayout>
  );
}

export default ServerInspectModal;
