import { ModalLayout } from "../../../../../../modals/Modals";

interface StudyCancelModalProps {
  onClose: () => void;
  handleCancel: () => void;
  isLoading: boolean;
}

export function StudyCancelModal({ onClose, handleCancel, isLoading }: StudyCancelModalProps) {
  return (
    <ModalLayout
      title="스터디 취소 확인"
      setIsModal={onClose}
      footerOptions={{
        main: {
          text: "취소할게요",
          func: handleCancel,
          isLoading,
        },
        sub: {
          text: "닫 기",
          func: onClose,
        },
      }}
    >
      스터디 신청을 완전히 취소하시겠어요?
    </ModalLayout>
  );
}
