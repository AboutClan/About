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

import { IModal } from "../../types/components/modalTypes";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { createTimeArr, parseTimeToDayjs } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyChangeTimeModal extends IModal {}

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

  const myStudy = useRecoilValue(myStudyInfoState);
  const isFree = myStudy.status === "free";
  const { start, end, startTime } = getMyStudyVoteInfo(myStudy, session?.user.uid);

  const [time, setTime] = useState<IStudyVoteTime>({
    start,
    end,
  });

  const [rulletIndex, setRulletIndex] = useState<{
    left: number;
    right: number;
  }>({
    left: 8,
    right: 12,
  });

  useEffect(() => {
    if (rulletIndex.left + 4 > rulletIndex.right && rulletIndex.left + 4 < endTimeArr.length - 1) {
      setRulletIndex((old) => ({ ...old, right: old.left + 4 }));
    }
  }, [rulletIndex.left]);

  useEffect(() => {
    setTime({
      start: parseTimeToDayjs(startItemArr[rulletIndex.left]),
      end: parseTimeToDayjs(endTimeArr[rulletIndex.right]),
    });
  }, [rulletIndex]);

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
        leftRulletArr={startItemArr}
        rightRulletArr={endTimeArr}
        rulletIndex={rulletIndex}
        setRulletIndex={setRulletIndex}
      />
    </ModalLayout>
  );
}

export default StudyChangeTimeModal;
