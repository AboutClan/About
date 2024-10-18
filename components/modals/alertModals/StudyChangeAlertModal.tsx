import { IModal } from "../../../types/components/modalTypes";
import AlertModal from "../../AlertModal";

interface StudyChangeAlertModalProps extends IModal {
  handleFunction: () => void;
}

function StudyChangeAlertModal({ handleFunction, setIsModal }: StudyChangeAlertModalProps) {
  return (
    <AlertModal
      options={{
        title: "스터디 장소 변경",
        subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
        text: "변경합니다",
        func: () => handleFunction(),
      }}
      setIsModal={setIsModal}
    />
  );
}

export default StudyChangeAlertModal;
