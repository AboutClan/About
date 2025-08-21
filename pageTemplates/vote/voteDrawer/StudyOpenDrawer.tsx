import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import MonthCalendar from "../../../components/molecules/MonthCalendar";
import { BottomFlexDrawerOptions } from "../../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../../components/organisms/SearchLocation";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useRealtimeVoteMutation } from "../../../hooks/realtime/mutations";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { CalendarHeader } from "../../../modals/aboutHeader/DateCalendarModal";
import { StudyPlaceProps } from "../../../types/models/studyTypes/study-entity.types";

import { RealTimeVoteProps } from "../../../types/models/studyTypes/requestTypes";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyPageMap from "../../studyPage/studyPageMap/StudyPageMap";

interface StudyPlaceDrawerProps {
  onClose: () => void;
  // date: string;
  // handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyOpenDrawer({ onClose }: StudyPlaceDrawerProps) {
  const resetStudy = useResetStudyQuery();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState<string>();
  const [isMapOpen, setIsMapOpen] = useState(false);

  useStudyPlacesQuery("main");

  const { mutate: handleStudyVote } = useRealtimeVoteMutation(selectedDate, {
    onSuccess() {
      toast("success", "스터디가 개설되었습니다.");
      resetStudy();
      onClose();
    },
  });

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
    title: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const [date, setDate] = useState(dayjs());

  const handleBottomNav = () => {
    if (isFirstPage) setIsFirstPage(false);
    else {
      if (!placeInfo?.title) {
        toast("warning", "장소를 입력해 주세요");
        return;
      }
      setIsTimeDrawer(true);
    }
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: "개설 완료",
      func: () => {
        const voteData: RealTimeVoteProps = {
          place: {
            latitude: placeInfo.latitude,
            longitude: placeInfo.longitude,
            name: placeInfo.title,
            address: placeInfo.address,
          },
          time: {
            start: voteTime.start,
            end: voteTime.end,
          },
          status: "open",
        };

        handleStudyVote(voteData);
      },
    },
  };

  const handleClickDate = (date: string) => {
    setSelectedDate((old) => {
      if (old === date) {
        return null;
      } else {
        return date;
      }
    });
  };

  const handleVotePick = (place: StudyPlaceProps) => {
    setPlaceInfo({
      title: place.title,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      address: place.location.address,
    });
    setIsMapOpen(false);
  };

  return (
    <>
      <RightDrawer title="" onClose={isFirstPage ? onClose : () => setIsFirstPage(true)}>
        <PageIntro
          main={{
            first: isFirstPage ? "언제 스터디를 진행하나요?" : "어디서 스터디를 진행하나요?",
          }}
          sub={isFirstPage ? "날짜를 선택해 주세요" : "공부하기 좋은 카페를 선택해 주세요."}
        />
        {isFirstPage ? (
          <>
            <Box fontSize="20px" mb={4} pb={4} px={2} borderBottom="var(--border)">
              <CalendarHeader
                goNext={() => setDate((old) => old.add(1, "month"))}
                goPrev={() => setDate((old) => old.subtract(1, "month"))}
                leftDisabled={date.month() === dayjs().month()}
                rightDisabled={date.month() === dayjs().month() + 1}
                date={dayjsToStr(date)}
              />
            </Box>
            <MonthCalendar
              standardDate={dayjsToStr(date)}
              selectedDates={[selectedDate]}
              func={handleClickDate}
              passedDisabled
              mintDateArr={[]}
              isTodayInclude
            />{" "}
            <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
              최대 일주일 이내의 스터디만 개설할 수 있습니다.
            </Box>
          </>
        ) : (
          <>
            <Box>
              <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} hasDetail={false} />
            </Box>

            <Flex w="full" mt={4} align="center" as="button" onClick={() => setIsMapOpen(true)}>
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
          </>
        )}
        <BottomNav
          isSlide={false}
          text={isFirstPage ? "다 음" : "스터디 개설"}
          onClick={handleBottomNav}
        />
      </RightDrawer>
      {isMapOpen && (
        <StudyPageMap
          handleVotePick={handleVotePick}
          isDefaultOpen
          onClose={() => setIsMapOpen(false)}
        />
      )}

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

export default StudyOpenDrawer;
