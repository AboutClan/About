import { useParams } from "next/navigation";
import { useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyChangeMemoModal extends IModal {
  hasModalMemo;
}
export default function StudyChangeMemoModal({ hasModalMemo, setIsModal }: IStudyChangeMemoModal) {
  const { date } = useParams<{ id: string; date: string }>() || {};

  const resetStudy = useResetStudyQuery();
  const [value, setValue] = useState(hasModalMemo);

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
