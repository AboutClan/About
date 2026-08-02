import { Badge, Box, Collapse, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

import PageIntro from "../../components/atoms/PageIntro";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import BottomNav from "../../components/layouts/BottomNav";
import DatePointButton from "../../components/molecules/DatePointButton";
import { BottomFlexDrawerOptions } from "../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../hooks/realtime/mutations";
import { transferStudyRewardState } from "../../recoils/transferRecoils";
import { LocationProps } from "../../types/common";
import { RealTimeVoteProps } from "../../types/models/studyTypes/requestTypes";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import StudyPageMap from "../studyPage/studyPageMap/StudyPageMap";

const WEEK_DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

interface StudyPlaceDrawerProps {
  onClose: () => void;
}

function StudyOpenDrawer({ onClose }: StudyPlaceDrawerProps) {
  const resetStudy = useResetStudyQuery();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState<string>();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isPlaceOpen, setIsPlaceOpen] = useState(true);
  const setTransferStudyReward = useSetRecoilState(transferStudyRewardState);

  const { mutate: handleStudyVote, isLoading } = useRealtimeVoteMutation(selectedDate, {
    onSuccess(data) {
      setTimeout(() => {
        setTransferStudyReward(data);
      }, 500);
      resetStudy();
      onClose();
    },
  });

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);

  const today = dayjs();
  const startOfThisWeek = today.startOf("week");
  const weekDates = Array.from({ length: 14 }, (_, i) => startOfThisWeek.add(i, "day"));
  const activeUntil = today.add(6, "day");

  const handleBottomNav = () => {
    if (!selectedDate) {
      toast("warning", "날짜를 선택해 주세요");
      return;
    }
    if (!placeInfo?.name) {
      toast("warning", "장소를 입력해 주세요");
      setIsPlaceOpen(true);
      return;
    }
    setIsTimeDrawer(true);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(selectedDate).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: "개설 완료",
      func: () => {
        const voteData: RealTimeVoteProps = {
          place: placeInfo,
          time: {
            start: voteTime.start,
            end: voteTime.end,
          },
          status: "open",
        };

        handleStudyVote(voteData);
      },
      loading: isLoading,
    },
  };

  const handleClickDate = (date: string) => {
    setSelectedDate((old) => (old === date ? null : date));
  };

  const handleVotePick = (place: StudyPlaceProps) => {
    const { name, latitude, longitude, address } = place.location;
    setPlaceInfo({ name, latitude, longitude, address });
    setIsMapOpen(false);
  };

  return (
    <>
      <RightDrawer title="" onClose={onClose}>
        <Flex direction="column" h="calc(100dvh - var(--header-h))" overflow="hidden">
          <Flex flex={1} overflowY="auto" direction="column" pb={5} gap={5}>
            <Box>
              <PageIntro
                main={{
                  first: "개설 날짜 선택",
                }}
                sub="스터디를 열고 싶은 날짜를 선택해 주세요"
              />

              <Box position="relative" mt="14px">
                <Flex
                  position="absolute"
                  top="-14px"
                  left="0"
                  zIndex={1}
                  justify="center"
                  align="center"
                  py={1.5}
                  px={2.5}
                  borderRadius="full"
                  bg="gray.800"
                  color="white"
                  fontSize="10px"
                  fontWeight={600}
                >
                  {dayjsToFormat(today, "M월")}
                </Flex>
                <Box p={3} pt={5} bg="gray.50" borderRadius="16px" border="var(--border)">
                  <Grid templateColumns="repeat(7, 1fr)" mb={2}>
                    {WEEK_DAYS_KR.map((day, idx) => (
                      <Box
                        h="20px"
                        key={day}
                        textAlign="center"
                        fontSize="12px"
                        fontWeight={500}
                        color={
                          idx === 0
                            ? "var(--color-red)"
                            : idx === 6
                            ? "var(--color-blue)"
                            : "gray.600"
                        }
                      >
                        {day}
                      </Box>
                    ))}
                  </Grid>
                  <Box h="1px" bg="gray.200" mb={3} />
                  <Grid templateColumns="repeat(7, 1fr)" rowGap="10px">
                    {weekDates.map((d) => {
                      const dateStr = dayjsToStr(d);
                      const isOutOfRange = d.isAfter(activeUntil, "day");
                      return (
                        <Flex key={dateStr} justify="center">
                          <DatePointButton
                            date={dateStr}
                            func={() => handleClickDate(dateStr)}
                            isSelected={selectedDate === dateStr}
                            pointType="mint"
                            isDisabled={isOutOfRange}
                            isMint={false}
                            size="md"
                          />
                        </Flex>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            </Box>

            <Box border="1px solid" borderColor="gray.100" borderRadius="14px" overflow="hidden">
              <Flex
                as="button"
                type="button"
                w="100%"
                justify="space-between"
                align="center"
                p={4}
                onClick={() => setIsPlaceOpen((old) => !old)}
              >
                <Box textAlign="start">
                  <Box fontSize="15px" fontWeight={700} color="gray.800">
                    스터디 장소
                  </Box>
                  <Box fontSize="12px" color="gray.500" mt={0.5}>
                    {placeInfo?.name || "장소를 선택해 주세요"}
                  </Box>
                </Box>
                <Box flexShrink={0} ml={3}>
                  <ShortArrowIcon dir={isPlaceOpen ? "top" : "bottom"} color="gray" />
                </Box>
              </Flex>

              <Collapse in={isPlaceOpen} animateOpacity unmountOnExit>
                <Box px={4} pb={4} pt={1} borderTop="1px solid" borderColor="gray.100">
                  <Box mt={4}>
                    <SearchLocation
                      placeInfo={placeInfo}
                      setPlaceInfo={setPlaceInfo}
                      hasDetail={false}
                    />

                    <Flex
                      w="full"
                      mt={4}
                      align="center"
                      as="button"
                      onClick={() => setIsMapOpen(true)}
                    >
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
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Flex>

          <BottomNav isSlide={false} text="시간 선택하기" onClick={handleBottomNav} />
        </Flex>
      </RightDrawer>
      {isMapOpen && (
        <StudyPageMap
          handleVotePick={handleVotePick}
          isDefaultOpen
          onClose={() => setIsMapOpen(false)}
          isCafeMap={false}
          noModalUpdate
        />
      )}

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

export default StudyOpenDrawer;
