import { ModalLayout } from "@/components/modals/Modals";

interface StudyCancelModalProps {
  onClose: () => void;
  handleCancel: () => void;
  isLoading: boolean;
  /** 취소될 신청 날짜 수. 알면 문구에 적는다. */
  dateCount?: number;
}

/**
 * 신청 전체 취소 확인. 이 취소는 이번 주 신청을 통째로 지운다(dateArr를 빈 목록으로 보낸다).
 * 예전 문구("완전히 취소하시겠어요?")로는 날짜 하나만 빠지는지 전부 빠지는지 알 수 없었다.
 */
export function StudyCancelModal({
  onClose,
  handleCancel,
  isLoading,
  dateCount,
}: StudyCancelModalProps) {
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
      {dateCount
        ? `이번 주에 신청한 ${dateCount}개 날짜가 모두 취소돼요.`
        : "이번 주에 신청한 날짜가 모두 취소돼요."}
      <br />
      날짜를 하나만 빼려면 신청 변경에서 해제해 주세요.
    </ModalLayout>
  );
}
