import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import { BottomFlexDrawerOptions } from "../../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../../components/organisms/SearchLocation";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../../hooks/realtime/mutations";
import { getLocationByCoordinates } from "../../../libs/study/getLocationByCoordinates";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";

interface PlaceDrawerProps {
  setIsRightDrawer: DispatchBoolean;
  setIsVoteDrawer: DispatchBoolean;
  date: string;
}

export function VoteDrawerPlace({
  setIsRightDrawer,
  setIsVoteDrawer,
  date,
}: PlaceDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  const toast = useToast();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);

  const { mutate, isLoading } = useRealtimeVoteMutation({
    onSuccess() {
      typeToast("vote");

      resetStudy();
      newSearchParams.set("center", "votePlace");
      router.push(`/studyPage?${newSearchParams.toString()}`);
      setIsVoteDrawer(false);
    },
  });

  const handleBottomNav = () => {
    if (!placeInfo?.place_name) {
      toast("warning", "장소를 입력해 주세요");
      return;
    }
    const changeLocation = getLocationByCoordinates(+placeInfo?.y, +placeInfo?.x);

    if (!changeLocation) {
      toast("warning", "서비스중인 지역이 아닙니다.");
      return;
    }
    setIsTimeDrawer(true);
  };
  const handleSubmit = () => {
    mutate({
      place: {
        name: placeInfo.place_name,
        address: placeInfo.road_address_name,
        latitude: +placeInfo.y,
        longitude: +placeInfo.x,
      },
      time: { ...voteTime },
    });
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      text: "신청 완료",
      func: handleSubmit,
      loading: isLoading,
    },
  };

  return (
    <>
      <RightDrawer title="" onClose={() => setIsRightDrawer(false)}>
        <PageIntro
          main={{ first: "리스트에 없으신가요?", second: "스터디 장소를 알려주세요" }}
          sub="스터디를 진행할 장소를 입력해 보세요"
        />
        <Box>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Box>{" "}
        <BottomNav isSlide={false} text="스터디 신청" onClick={handleBottomNav} />
      </RightDrawer>{" "}
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

export default VoteDrawerPlace;
