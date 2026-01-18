import { useRouter } from "next/router";

import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import TextCheckButton from "../molecules/TextCheckButton";
import ValueBoxCol from "../molecules/ValueBoxCol";

function NewbeBenefitModal({ onClose }: CloseProps) {
  const router = useRouter();
  return (
    <ModalLayout
      title="활동 지원금 지급 안내"
      isCloseButton={false}
      footerOptions={{
        main: {},
        sub: {
          text: "포인트 기록 보기",
          func: () => router.push("/user/log/point"),
        },
      }}
      setIsModal={onClose}
    >
      <ValueBoxCol
        items={[
          {
            left: "일일 출석체크",
            right: "+ 20%",
          },
          {
            left: "공부 인증 리워드",
            right: "+ 20%",
          },
          {
            left: "스터디 참여 리워드",
            right: "+ 20%",
          },
          {
            left: "번개 참여권",
            right: "월 1장 추가",
          },
          {
            left: "소모임 참여권",
            right: "월 2장 추가",
          },
        ]}
      />
      <TextCheckButton
        text="위 내용을 확인했고, 입금을 마쳤습니다."
        isChecked={true}
        toggleCheck={() => {}}
        // isChecked={isChecked}
        // toggleCheck={() => setIsChecked((old) => !old)}
      />
      <TextCheckButton
        text="위 내용을 확인했고, 입금을 마쳤습니다."
        isChecked={true}
        toggleCheck={() => {}}
        // isChecked={isChecked}
        // toggleCheck={() => setIsChecked((old) => !old)}
      />
    </ModalLayout>
  );
}

export default NewbeBenefitModal;
