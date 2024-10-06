import { Box } from "@chakra-ui/react";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import SearchLocation from "../../../components/organisms/SearchLocation";
import StudyVoteDrawer from "../../../components/services/studyVote/StudyVoteDrawer";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";

function Place() {
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);

  const handleBottomNav = () => {
    setIsVoteDrawer(true);
  };

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
      {isVoteDrawer && <StudyVoteDrawer setIsModal={() => setIsVoteDrawer(false)} />}
    </>
  );
}

export default Place;
