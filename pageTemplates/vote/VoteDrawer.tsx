import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { IModal } from "../../types/components/modalTypes";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps, StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { ActiveLocation } from "../../types/services/locationTypes";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";

export interface VoteDrawerItemProps {
  place: StudyPlaceProps;
  voteCnt: number;
  favoritesCnt: number;
  myFavorite: "first" | "second";
}

interface VoteDrawerProps extends IModal {
  studyVoteData: StudyDailyInfoProps;
  location: ActiveLocation;
  date: string;
  // myVote: IStudyVoteWithPlace;
  // setMyVote: DispatchType<IStudyVoteWithPlace>;
  // setActionType: DispatchType<"timeSelect">;
  setIsDrawerDown: DispatchBoolean;
}

const DEFAULT_SUB_PLACE_CNT = 4;

function VoteDrawer({ studyVoteData, location, date, setIsModal }: VoteDrawerProps) {
  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const [myVote, setMyVote] = useState<{ main: string; sub: string[] }>({ main: null, sub: [] });
  const [isFirstPage, setIsFirstPage] = useState(true);
  const isTodayVote = dayjs().isSame(date, "day") && dayjs().hour() >= 9;

  useEffect(() => {
    if (preference === undefined || !studyVoteData) return;

    const findMainPlace = studyVoteData.participations.find(
      (par) => par.place._id === (isFirstPage ? preference?.place : myVote?.main),
    );

    let votePlaceProps = {
      main: null,
      sub: [],
    };
    if (findMainPlace) {
      const subPlace = studyVoteData.participations
        .filter((par) => preference?.subPlace.includes(par.place._id))
        .map((par) => par.place._id);

      if (subPlace?.length >= DEFAULT_SUB_PLACE_CNT) {
        votePlaceProps = {
          main: preference?.place,
          sub: preference?.subPlace,
        };
      } else {
        const temp = [...subPlace];

        const sortedArr = [...studyVoteData.participations].sort((a, b) => {
          const aDistance = getDistanceFromLatLonInKm(
            a.place.latitude,
            a.place.longitude,
            findMainPlace.place.latitude,
            findMainPlace.place.longitude,
          );
          const bDistance = getDistanceFromLatLonInKm(
            b.place.latitude,
            b.place.longitude,
            findMainPlace.place.latitude,
            findMainPlace.place.longitude,
          );

          if (aDistance < bDistance) return -1;
          else if (aDistance > bDistance) return 1;
          return 0;
        });

        sortedArr.forEach((par, idx) => {
          if (idx > DEFAULT_SUB_PLACE_CNT - subPlace?.length - 1) {
            return;
          } else temp.push(par.place._id);
        });

        votePlaceProps = {
          main: findMainPlace.place._id,
          sub: temp,
        };
      }

      setMyVote({
        main: votePlaceProps.main,
        sub: votePlaceProps.sub.filter((place) => place !== votePlaceProps.main),
      });
    }

    const participations = convertStudyToParticipations(studyVoteData, location);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      currentLocation,
      null,
      location,
      votePlaceProps?.main ? votePlaceProps : null,
    );

    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [preference, studyVoteData, isFirstPage, currentLocation]);

  useEffect(() => {
    if (!myVote?.main) setIsFirstPage(true);
  }, [myVote]);

  const handleClickPlaceButton = (id: string) => {
    if (isFirstPage) {
      if (myVote?.main === id) return;
      else setMyVote({ main: id, sub: [] });
    } else {
      if (!myVote?.main) {
        setMyVote({ main: id, sub: [] });
      } else if (myVote?.main === id) {
        setMyVote(null);
      } else if (myVote?.sub.includes(id))
        setMyVote((old) => ({ ...old, sub: old.sub.filter((place) => place !== id) }));
      else {
        setMyVote((old) => ({ ...old, sub: [...old.sub, id] }));
      }
    }
  };

  return (
    <BottomFlexDrawer
      bottom={{
        text: isTodayVote || !isFirstPage ? "선택 완료" : "다음",
        func: isFirstPage && isTodayVote ? () => setIsFirstPage(false) : () => {},
      }}
      isDrawerUp
      isHideBottom
      setIsModal={setIsModal}
      zIndex={900}
      height={468 + iPhoneNotchSize()}
    >
      <Flex direction="column" w="100%">
        <Flex mb={4} justify="space-between">
          <Box>
            <Box mb={1} lineHeight="28px" fontWeight="bold" fontSize="18px">
              {isFirstPage ? 1 : 2}지망 투표
            </Box>
            <Box color="gray.500" fontSize="12px" lineHeight="16px">
              {isFirstPage && "원하시는 카페가 없으신가요?"}
              {!isFirstPage && (
                <Box as="span">
                  원하시는 2지망 카페를 선택해 주세요{" "}
                  <b style={{ color: "var(--color-blue)" }}>(다중 선택)</b>
                </Box>
              )}
            </Box>
          </Box>
          {isFirstPage && (
            <Button
              mt="auto"
              as="div"
              fontSize="13px"
              fontWeight={500}
              size="xs"
              variant="ghost"
              height="20px"
              color="var(--color-blue)"
            >
              직접 입력
            </Button>
          )}
        </Flex>
        <Box
          overflow="auto"
          h="312px"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {thumbnailCardInfoArr?.map((props, idx) => {
            const id = props.id;
            return (
              <Box key={idx} mb={3}>
                <PickerRowButton
                  {...props}
                  participantCnt={props.participants.length}
                  onClick={() => handleClickPlaceButton(id)}
                  pickType={
                    !isFirstPage && myVote?.sub.includes(id)
                      ? "second"
                      : myVote?.main !== id
                        ? null
                        : isFirstPage
                          ? "first"
                          : "main"
                  }
                />
              </Box>
            );
          })}
        </Box>
      </Flex>
    </BottomFlexDrawer>
  );
}

export default VoteDrawer;
