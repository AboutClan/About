import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import RulletPickerTwo from "../../components/molecules/picker/RulletPickerTwo";
import { POINT_SYSTEM_DEPOSIT } from "../../constants/serviceConstants/pointSystemConstants";
import { STUDY_VOTE_HOUR_ARR } from "../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../hooks/user/queries";
import { getMyStudyVoteInfo } from "../../libs/study/getMyStudy";
import { myStudyState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { createTimeArr, parseTimeToDayjs } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyChangeTimeModal extends IModal {}

const leftDefaultIdx = 8;
const rightDefaultIdx = 10;

const startItemArr = createTimeArr(STUDY_VOTE_HOUR_ARR[0], STUDY_VOTE_HOUR_ARR[11]);

const endTimeArr = createTimeArr(
  STUDY_VOTE_HOUR_ARR[3],
  STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 1],
);

function StudyChangeTimeModal({ setIsModal }: IStudyChangeTimeModal) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const { date } = useParams<{ id: string; date: string }>();

  const myStudy = useRecoilValue(myStudyState);
  const isFree = myStudy.status === "free";
  const { start, end, startTime } = getMyStudyVoteInfo(myStudy, session?.user.uid);

  const [time, setTime] = useState<IStudyVoteTime>({
    start,
    end,
  });

  const [rulletValue, setRulletValue] = useState<{
    left: string;
    right: string;
  }>({
    left: startItemArr[leftDefaultIdx],
    right: endTimeArr[rightDefaultIdx],
  });

  useEffect(() => {
    setTime({
      start: parseTimeToDayjs(rulletValue.left),
      end: parseTimeToDayjs(rulletValue.right),
    });
  }, [rulletValue]);

  const { data } = usePointSystemLogQuery("deposit");

  const prevFee = data?.find(
    (item) =>
      item?.meta?.sub === date && item.message === POINT_SYSTEM_DEPOSIT.STUDY_TIME_CHANGE.message,
  );

  const { mutate: getDeposit } = usePointSystemMutation("deposit");
  const { mutate: patchAttend } = useStudyParticipationMutation(dayjs(date), "patch", {
    onSuccess() {
      resetStudy();
      if (isFree) return;
      if (startTime && dayjs() > startTime && !prevFee) {
        getDeposit({
          ...POINT_SYSTEM_DEPOSIT.STUDY_TIME_CHANGE,
          sub: date,
        });
      }
      toast("success", "변경되었습니다.");
    },
    onError: () => typeToast("error"),
  });

  const onSubmit = () => {
    patchAttend(time);
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: onSubmit,
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <ModalLayout title="시간 변경" footerOptions={footerOptions} setIsModal={setIsModal}>
      <RulletPickerTwo
        leftDefaultIdx={leftDefaultIdx}
        rightDefaultIdx={rightDefaultIdx}
        leftRulletArr={startItemArr}
        rightRulletArr={endTimeArr}
        setRulletValue={setRulletValue}
      />
    </ModalLayout>
  );
}

export default StudyChangeTimeModal;
