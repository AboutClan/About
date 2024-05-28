import CheckList from "../../components/atoms/CheckList";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyPointGuideModal({ setIsModal }: IModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
    },
  };

  const STUDY_CONTENTS = [
    "결과 발표 이전에 신청한 경우 5 POINT + 선택한 서브 장소 만큼 추가 포인트 획득!",
    "가장 먼저 신청한 인원은 +10 POINT, 두번째 인원은 +5 POINT, 세번째 인원은 +2 POINT를 추가 획득!",
    "당일 참여나 자유 스터디의 경우 +2 POINT",
  ];

  return (
    <ModalLayout setIsModal={setIsModal} title="스터디 포인트" footerOptions={footerOptions}>
      <CheckList contents={STUDY_CONTENTS} />
    </ModalLayout>
  );
}

export default StudyPointGuideModal;
