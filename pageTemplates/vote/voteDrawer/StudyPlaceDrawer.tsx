import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import { BottomFlexDrawerOptions } from "../../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../../components/organisms/SearchLocation";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useToast } from "../../../hooks/custom/CustomToast";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { RealTimeVoteProps } from "../../../types/models/studyTypes/requestTypes";
import { IStudyVoteTime, StudyVoteProps } from "../../../types/models/studyTypes/studyInterActions";

interface StudyPlaceDrawerProps {
  type: "vote" | "realTime";
  onClose: () => void;
  date: string;
  handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyPlaceDrawer({ type, onClose, date, handleStudyVote }: StudyPlaceDrawerProps) {
  const toast = useToast();

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);

  const handleBottomNav = () => {
    if (!placeInfo?.place_name) {
      toast("warning", "장소를 입력해 주세요");
      return;
    }
    setIsTimeDrawer(true);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle:
        type === "vote"
          ? "예상 시작 시간과 종료 시간을 선택해 주세요"
          : "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      text: type === "vote" ? "신청 완료" : "참여 확정",
      func: () => {
        const voteData: StudyVoteProps | RealTimeVoteProps =
          type === "vote"
            ? {
                latitude: +placeInfo.y,
                longitude: +placeInfo.x,
                start: voteTime.start,
                end: voteTime.end,
              }
            : {
                place: {
                  latitude: +placeInfo.y,
                  longitude: +placeInfo.x,
                  name: placeInfo.place_name,
                  address: placeInfo.road_address_name,
                },
                time: {
                  start: voteTime.start,
                  end: voteTime.end,
                },
              };

        handleStudyVote(voteData);
        // mutate({
        //   place: {
        //     name: placeInfo.place_name,
        //     address: placeInfo.road_address_name,
        //     latitude: +placeInfo.y,
        //     longitude: +placeInfo.x,
        //   },
        //   time: { ...voteTime },
        // });
      },
    },
  };

  return (
    <>
      <RightDrawer title="" onClose={onClose}>
        <PageIntro
          main={{
            first:
              type === "vote"
                ? "원하는 스터디 위치를 입력해주세요."
                : "어디에서 공부하실 예정인가요?",
          }}
          sub={
            type === "vote"
              ? "입력한 위치와 가까운 스터디 장소로 매칭됩니다."
              : "스터디 할 장소를 입력해 주세요"
          }
        />
        <Box>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Box>
        <BottomNav
          isSlide={false}
          text={type === "vote" ? "시간 선택" : "참여 확정"}
          onClick={handleBottomNav}
        />
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
        />
      )}
    </>
  );
}

export default StudyPlaceDrawer;
