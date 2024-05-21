import { Box } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dispatch } from "react";
import { useRecoilValue } from "recoil";

import Calendar from "../../components/molecules/Calendar";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import {
  handleChangeDate,
  VoteType,
} from "../../pageTemplates/home/studyController/StudyController";
import {
  ACTION_TO_VOTE_TYPE,
  getStudyVoteButtonProps,
} from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { myStudyState, studyDateStatusState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { ModalLayout } from "../Modals";
interface DateCalendarModalProps extends IModal {
  selectedDate: Dayjs;
  setModalType: Dispatch<VoteType>;
}

function DateCalendarModal({ selectedDate, setIsModal, setModalType }: DateCalendarModalProps) {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isGuest = session?.user.name === "guest";

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);
  const buttonProps = getStudyVoteButtonProps(studyDateStatus, myStudy, session?.user.uid);

  const onClick = (month: number) => {
    const newDate = handleChangeDate(selectedDate, "month", month);
    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleModalOpen = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    const type = buttonProps.text;
    if (type === "참여 신청" || type === "투표 변경" || type === "당일 참여") {
      router.push(`/vote?${newSearchParams.toString()}`);
      return;
    }
    setModalType(ACTION_TO_VOTE_TYPE[type]);
  };

  return (
    <ModalLayout title={dayjsToFormat(selectedDate, "YYYY년 M월")} setIsModal={setIsModal}>
      <Calendar selectedDate={selectedDate} type="month" func={onClick} />
      <Box mt="12px" borderTop="var(--border)">
        {/* <DateVoteBlock buttonProps={buttonProps} func={handleModalOpen} /> */}
      </Box>
    </ModalLayout>
  );
}

export default DateCalendarModal;
