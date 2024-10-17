import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SearchLocation from "../../../components/organisms/SearchLocation";
import StudyVoteDrawer from "../../../components/services/studyVote/StudyVoteDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../../hooks/realtime/mutations";
import { getLocationByCoordinates } from "../../../libs/study/getLocationByCoordinates";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";

dayjs.locale("ko");

function Place() {
  const typeToast = useTypeToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const router = useRouter();
  const resetStudy = useResetStudyQuery();
  const toast = useToast();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  const [isVoteDrawer, setIsVoteDrawer] = useState(false);

  const { mutate, isLoading } = useRealtimeVoteMutation({
    onSuccess() {
      typeToast("vote");
      resetStudy();
      newSearchParams.set("category", "votePlace");

      router.push(`/studyPage?${newSearchParams.toString()}`);
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

    setIsVoteDrawer(true);
  };

  const handleSubmit = (voteTime: IStudyVoteTime) => {
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

  // const drawerOptions: IBottomDrawerLgOptions = {
  //   header: {
  //     title: dayjsToFormat(dayjs(), "M월 D일 ddd요일"),
  //     subTitle: "스터디 참여시간을 선택해주세요!",
  //   },
  //   footer: {
  //     buttonText: "신청 완료",
  //     onClick: handleSubmit,
  //     buttonLoading: isLoading,
  //   },
  // };

  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro
            main={{ first: "리스트에 없으신가요?", second: "스터디 장소를 알려주세요" }}
            sub="스터디를 진행할 장소를 입력해 보세요"
          />
          <Box>
            <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
          </Box>
        </Slide>
      </Box>
      <BottomNav text="스터디 신청" onClick={handleBottomNav} />
      {/* {isVoteDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={() => setIsVoteDrawer(false)}
        />
      )} */}
      {isVoteDrawer && (
        <StudyVoteDrawer
          hasPlace
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          setIsModal={setIsVoteDrawer}
        />
      )}
    </>
  );
}

export default Place;
