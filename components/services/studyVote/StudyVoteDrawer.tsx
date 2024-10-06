import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { PLACE_TO_NAME } from "../../../constants/serviceConstants/studyConstants/studyCafeNameConstants";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../../hooks/study/mutations";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../../hooks/user/queries";
import StudyVoteSubModalPrivate from "../../../modals/study/studyVoteSubModal/StudyVoteSubModalPrivate";
import { myStudyInfoState, studyDateStatusState } from "../../../recoils/studyRecoils";
import { IModal } from "../../../types/components/modalTypes";
import {
  IStudyVote,
  IStudyVotePlaces,
  IStudyVoteTime,
} from "../../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../../types/services/locationTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
import StudyVotePlacesPicker from "../StudyVotePlacesPicker";
import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";

dayjs.locale("ko");

interface IStudyVoteDrawer extends IModal {
  place?: string;
  subPlace?: string[];
  locationEn?: LocationEn;
  dateParam?: string;
}

export default function StudyVoteDrawer({
  place,
  subPlace = [],
  locationEn,
  dateParam,
  setIsModal,
}: IStudyVoteDrawer) {
  const { date, id } = useParams<{ date: string; id: string }>();
  const router = useRouter();
  const resetStudy = useResetStudyQuery();

  const toast = useToast();
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyInfoState);

  const [isFirst, setIsFirst] = useState(true);
  const [myVote, setMyVote] = useState<IStudyVote>({
    place: id,
    subPlace: [],
    start: null,
    end: null,
  });
  console.log(place);

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [votePlaces, setVotePlaces] = useState<IStudyVotePlaces>();

  useEffect(() => {
    if (place) setMyVote((old) => ({ ...old, place, subPlace }));
  }, [place]);

  useEffect(() => {
    setMyVote((old) => ({ ...old, ...voteTime, ...votePlaces }));
  }, [voteTime, votePlaces]);

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });

  const isPrivateStudy = PLACE_TO_NAME[id] === "개인 스터디";

  //오늘 날짜 투표 포인트 받은거 찾기
  const myPrevVotePoint = pointLog?.find(
    (item) => item.message === "스터디 투표" && item.meta.sub === dayjsToStr(dayjs(date)),
  )?.meta.value;

  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate: patchAttend, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  const handleSuccess = async () => {
    resetStudy();

    if (myPrevVotePoint) {
      await getPoint({
        message: "스터디 투표 취소",
        value: -myPrevVotePoint,
      });
    }
    if (studyDateStatus === "not passed" && votePlaces?.subPlace?.length) {
      await getPoint({
        value: 5 + votePlaces.subPlace.length,
        message: "스터디 투표",
        sub: date,
      });
      toast("success", `투표 완료! ${!myStudy && "포인트가 적립되었습니다."}`);
    } else toast("success", "투표 완료!");
    //place가 있는 경우는 지도에서 투표한 경우로 생각
    if (place) {
      setIsModal(false);
      router.push(`/home?tab=study&location=${locationEn}&date=${dateParam}`);
      return;
    }
    setIsModal(false);
  };

  const onSubmit = () => {
    const diffHour = voteTime.end.diff(voteTime.start, "hour");
    if (diffHour < 2) {
      toast("warning", "최소 2시간은 선택되어야 합니다.");
      return;
    }
    const temp = {
      ...myVote,
      place: myVote.place,
      subPlace: myVote.subPlace,
    };

    patchAttend(temp);
  };

  const drawerOptions: IBottomDrawerLgOptions = {
    header: {
      title: dayjs(date).format("M월 DD일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      buttonText: isFirst && studyDateStatus !== "today" && !place ? "다음" : "신청 완료",
      onClick:
        isFirst && studyDateStatus !== "today" && !place ? () => setIsFirst(false) : onSubmit,
      buttonLoading: isLoading,
    },
  };

  return (
    <>
      {isFirst ? (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsModal}
        />
      ) : (
        <BottomDrawerLg options={drawerOptions} setIsModal={setIsModal} isAnimation={false}>
          {!isPrivateStudy ? (
            <StudyVotePlacesPicker setVotePlaces={setVotePlaces} />
          ) : (
            <StudyVoteSubModalPrivate setVoteInfo={setMyVote} />
          )}
        </BottomDrawerLg>
      )}
    </>
  );
}
