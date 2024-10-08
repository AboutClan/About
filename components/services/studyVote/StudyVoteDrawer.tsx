import dayjs from "dayjs";
import { useState } from "react";

import { useToast } from "../../../hooks/custom/CustomToast";
import { IModal } from "../../../types/components/modalTypes";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";

dayjs.locale("ko");

interface IStudyVoteDrawer extends IModal {
  handleSubmit: (voteTime: IStudyVoteTime) => void;
  isLoading?: boolean;
  date?: string;
  hasPlace?: boolean;
}

export default function StudyVoteDrawer({
  setIsModal,
  date,
  hasPlace,
  handleSubmit,
  isLoading,
}: IStudyVoteDrawer) {
  // const { date, id } = useParams<{ date: string; id: string }>();
  // const router = useRouter();

  const toast = useToast();
  // const studyDateStatus = useRecoilValue(studyDateStatusState);

  const [isFirst, setIsFirst] = useState(true);
  // const [myVote, setMyVote] = useState<IStudyVote>({
  //   place: id,
  //   subPlace: [],
  //   start: null,
  //   end: null,
  // });

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  // const [votePlaces, setVotePlaces] = useState<IStudyVotePlaces>();
  console.log(voteTime);
  // useEffect(() => {
  //   if (place) setMyVote((old) => ({ ...old, place, subPlace }));
  // }, [place]);

  // useEffect(() => {
  //   setMyVote((old) => ({ ...old, ...voteTime, ...votePlaces }));
  // }, [voteTime, votePlaces]);

  // const isPrivateStudy = PLACE_TO_NAME[id] === "개인 스터디";

  // const handleSuccess = () => {

  //   // if (myPrevVotePoint) {
  //   //   await getPoint({
  //   //     message: "스터디 투표 취소",
  //   //     value: -myPrevVotePoint,
  //   //   });
  //   // }
  //   // if (studyDateStatus === "not passed" && votePlaces?.subPlace?.length) {
  //   //   await getPoint({
  //   //     value: 5 + votePlaces.subPlace.length,
  //   //     message: "스터디 투표",
  //   //     sub: date,
  //   //   });
  //   //   toast("success", `투표 완료! ${!myStudy && "포인트가 적립되었습니다."}`);
  //   // } else toast("success", "투표 완료!");
  //   // //place가 있는 경우는 지도에서 투표한 경우로 생각
  //   // if (place) {
  //   //   setIsModal(false);
  //   //   router.push(`/home?tab=study&location=${locationEn}&date=${dateParam}`);
  //   //   return;
  //   // }
  //   setIsModal(false);
  // };

  const onSubmit = () => {
    const diffHour = voteTime.end.diff(voteTime.start, "hour");
    if (diffHour < 2) {
      toast("warning", "최소 2시간은 선택되어야 합니다.");
      return;
    }
    const realVoteTime: IStudyVoteTime = {
      start: dayjs(date).hour(voteTime.start.hour()).minute(voteTime.start.minute()),
      end: dayjs(date).hour(voteTime.end.hour()).minute(voteTime.end.minute()),
    };
    handleSubmit({ ...realVoteTime });
  };

  const drawerOptions: IBottomDrawerLgOptions = {
    header: {
      title: dayjs(date).format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      buttonText: isFirst && !hasPlace ? "다음" : "신청 완료",
      onClick: isFirst && !hasPlace ? () => setIsFirst(false) : onSubmit,
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
          {/* {!isPrivateStudy ? (
            <StudyVotePlacesPicker setVotePlaces={setVotePlaces} />
          ) : (
            <StudyVoteSubModalPrivate setVoteInfo={setMyVote} />
          )} */}
        </BottomDrawerLg>
      )}
    </>
  );
}
