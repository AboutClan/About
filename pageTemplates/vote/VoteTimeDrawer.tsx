import dayjs, { Dayjs } from "dayjs";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IBottomDrawerLgOptions } from "../../components/organisms/drawer/BottomDrawerLg";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";

import { STUDY_VOTE, STUDY_VOTE_CNT } from "../../constants/keys/queryKeys";
import { PointSystemProp } from "../../constants/serviceConstants/pointSystemConstants";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../hooks/user/queries";
import { StudyVoteMapActionType } from "../../pages/vote";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { myStudyState, studyDateStatusState } from "../../recoils/studyRecoils";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface IVoteTimeDrawer {
  myVote: IStudyVote;
  voteScore: PointSystemProp;
  actionType: StudyVoteMapActionType;
  setActionType: DispatchType<StudyVoteMapActionType>;
}

function VoteTimeDrawer({ myVote, voteScore, actionType, setActionType }: IVoteTimeDrawer) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const date = searchParams.get("date");
  const location = searchParams.get("location") as LocationEn;
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);

  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const [voteTime, setVoteTime] = useState<{ start: Dayjs; end: Dayjs }>();

  const moveToLink = () => {
    setSlideDirection(null);
    router.push(`/home?${newSearchParams.toString()}`);
  };

  const queryClient = useQueryClient();

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });

  //오늘 날짜 투표 포인트 받은거 찾기
  const myPrevVotePoint = pointLog?.find(
    (item) => item.message === "스터디 투표" && item.meta.sub === dayjsToStr(dayjs(date)),
  )?.meta.value;

  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate: studyVote, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  const handleSuccess = () => {
    queryClient.refetchQueries([STUDY_VOTE, date, convertLocationLangTo(location, "kr")]);
    queryClient.refetchQueries([
      [STUDY_VOTE_CNT, location, dayjs(date).startOf("month"), dayjs(date).endOf("month")],
    ]);
    if (myPrevVotePoint) {
      getPoint({
        message: "스터디 투표 취소",
        value: -myPrevVotePoint,
      });
    }
    if (studyDateStatus === "not passed" && voteScore) {
      getPoint({
        ...voteScore,
        sub: date,
      });
      toast("success", `투표 완료! ${!myStudy ? "포인트가 적립되었습니다." : ""}`);
    } else toast("success", "투표 완료!");

    moveToLink();
  };

  const onSubmit = () => {
    studyVote({
      ...myVote,
      ...voteTime,
    });
    setTimeout(() => {
      moveToLink();
    }, 1000);
  };
  console.log(1233, actionType);
  const drawerOptions: IBottomDrawerLgOptions = {
    header: {
      title: dayjs().format("M월 DD일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      buttonText: "선택 완료",
      onClick: onSubmit,
      buttonLoading: isLoading,
    },
  };

  return (
    <AnimatePresence>
      {actionType === "timeSelect" && (
        <StudyVoteTimeRulletDrawer
          drawerOptions={drawerOptions}
          setIsModal={() => setActionType(null)}
          setVoteTime={setVoteTime}
        />
      )}
    </AnimatePresence>
  );
}

export default VoteTimeDrawer;
