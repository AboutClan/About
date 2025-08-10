import { Badge, Box, Flex } from "@chakra-ui/react";
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
  onClose: () => void;
  date: string;
  handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyPlaceDrawer({ onClose, date, handleStudyVote }: StudyPlaceDrawerProps) {
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
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: "스터디 개설",
      func: () => {
        const voteData: RealTimeVoteProps = {
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
            first: "스터디 장소를 지정해 주세요.",
          }}
          sub={"공부하기 좋은 공간으로 선택해 주세요"}
        />
        <Box>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} hasDetail={false} />
        </Box>

        <Flex w="full" mt={4} align="center">
          <Badge colorScheme="mint" size="lg" mr={2}>
            TIP
          </Badge>

          <Box
            textDecoration="underline"
            textDecorationColor="gray.400"
            fontSize="14px"
            lineHeight="20px"
            color="gray.500"
          >
            카공하기 좋은 카페를 찾고있다면?
          </Box>
        </Flex>
        <BottomNav isSlide={false} text={"스터디 개설"} onClick={handleBottomNav} />
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
          // defaultVoteTime={{ start: dayjs(), end: dayjs().add(3, "hour") }}
        />
      )}
    </>
  );
}

export default StudyPlaceDrawer;
