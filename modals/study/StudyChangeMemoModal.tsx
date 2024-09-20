import { useParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";

import Textarea from "../../components/atoms/Textarea";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyChangeMemoModal extends IModal {
  hasModalMemo;
}
export default function StudyChangeMemoModal({ hasModalMemo, setIsModal }: IStudyChangeMemoModal) {
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const location = PLACE_TO_LOCATION[id];
  const resetStudy = useResetStudyQuery();
  const [value, setValue] = useState(hasModalMemo);

  const queryClient = useQueryClient();

  const { mutate: changeStudyMemo, isLoading } = useStudyAttendCheckMutation(date, {
    onSuccess() {
      resetStudy();
      setIsModal(true);
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: () => changeStudyMemo(value),
      isLoading,
    },
  };

  const [isFocus, setIsFocus] = useState();

  return (
    <ModalLayout
      title="출석 메모 변경"
      footerOptions={footerOptions}
      setIsModal={setIsModal}
      isInputFocus={isFocus}
    >
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} setIsFocus={setIsFocus} />
    </ModalLayout>
  );
}
