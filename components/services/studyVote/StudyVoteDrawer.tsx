import "dayjs/locale/ko";

import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import { STUDY_VOTE } from "../../../constants/keys/queryKeys";
import { PLACE_TO_LOCATION } from "../../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../../hooks/study/mutations";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../../hooks/user/queries";
import StudyVoteSubModalPrivate from "../../../modals/study/studyVoteSubModal/StudyVoteSubModalPrivate";
import {
  myStudyState,
  studyDateStatusState,
} from "../../../recoils/studyRecoils";
import { PLACE_TO_NAME } from "../../../storage/study";
import { IModal } from "../../../types/components/modalTypes";
import {
  IStudyVote,
  IStudyVotePlaces,
  IStudyVoteTime,
} from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
import StudyVotePlacesPicker from "../StudyVotePlacesPicker";
import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";
dayjs.locale("ko");

interface IStudyVoteDrawer extends IModal {}

export default function StudyVoteDrawer({ setIsModal }: IStudyVoteDrawer) {
  const { date, id } = useParams<{ date: string; id: string }>();
  const location = PLACE_TO_LOCATION[id];

  const toast = useToast();
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);

  const [isFirst, setIsFirst] = useState(true);
  const [myVote, setMyVote] = useState<IStudyVote>({
    place: id,
    subPlace: [],
    start: null,
    end: null,
  });

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [votePlaces, setVotePlaces] = useState<IStudyVotePlaces>();

  useEffect(() => {
    setMyVote((old) => ({ ...old, ...voteTime, ...votePlaces }));
  }, [voteTime, votePlaces]);

  const queryClient = useQueryClient();

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });

  const isPrivateStudy = PLACE_TO_NAME[id] === "자유신청";

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
    queryClient.invalidateQueries([STUDY_VOTE, date, location]);

    if (myPrevVotePoint) {
      await getPoint({
        message: "스터디 투표 취소",
        value: -myPrevVotePoint,
      });
    }
    if (studyDateStatus === "not passed" && votePlaces.subPlace.length) {
      await getPoint({
        value: 5 + votePlaces.subPlace.length,
        message: "스터디 투표",
        sub: date,
      });
      toast("success", `투표 완료! ${!myStudy && "포인트가 적립되었습니다."}`);
    } else toast("success", "투표 완료!");
    setIsModal(false);
  };

  const onSubmit = () => {
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
      buttonText: isFirst ? "다음" : "신청 완료",
      onClick: isFirst ? () => setIsFirst(false) : onSubmit,
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
