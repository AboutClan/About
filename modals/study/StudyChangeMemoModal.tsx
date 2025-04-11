import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import Textarea from "../../components/atoms/Textarea";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { findMyStudyInfo } from "../../libs/study/studySelectors";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyChangeMemoModal extends IModal {
  hasModalMemo;
}
export default function StudyChangeMemoModal({ hasModalMemo, setIsModal }: IStudyChangeMemoModal) {
  const { data: session } = useSession();
  const resetStudy = useResetStudyQuery();
  const [value, setValue] = useState<string>(hasModalMemo || "");

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const myStudyInfo = findMyStudyInfo(myStudyParticipation, session?.user.uid);

  const { mutate: changeStudyMemo, isLoading } = useStudyAttendCheckMutation({
    onSuccess() {
      resetStudy();
      setIsModal(true);
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: () => changeStudyMemo({ memo: value, endHour: dayjs(myStudyInfo.time.end) }),
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
