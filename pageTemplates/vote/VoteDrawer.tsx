import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";

import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import {
  StudyDailyInfoProps,
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/studyDetails";
import {
  IStudyVotePlaces,
  IStudyVoteWithPlace,
} from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";

export interface VoteDrawerItemProps {
  place: StudyPlaceProps;
  voteCnt: number;
  favoritesCnt: number;
  myFavorite: "first" | "second";
}

interface VoteDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  location: ActiveLocation;
  // myVote: IStudyVoteWithPlace;
  // setMyVote: DispatchType<IStudyVoteWithPlace>;
  // setActionType: DispatchType<"timeSelect">;
  setIsDrawerDown: DispatchBoolean;
}

function VoteDrawer({ studyVoteData, location, setIsDrawerDown }: VoteDrawerProps) {
  const { data: userInfo, isLoading } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;
  const savedPrefer = preference || { place: null, subPlace: [] };
  const { currentLocation } = useCurrentLocation();
  const toast = useToast();
  const participations = studyVoteData?.participations;
  const items = participations && getSortedMainPlace(participations, savedPrefer);
  const [placeItems, setPlaceItems] = useState<VoteDrawerItemProps[]>(items);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const [myVote, setMyVote] = useState<IStudyVoteWithPlace>();

  const preferPlaces = {
    main: participations?.find((study) => study.place._id === savedPrefer.place)?.place.fullname,
    sub: participations
      ?.filter((study) => savedPrefer.subPlace.includes(study.place._id))
      .map((study) => study.place.fullname),
  };
  useEffect(() => {
    if (!studyVoteData) return;
    const participations = convertStudyToParticipations(studyVoteData, location);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      currentLocation,
      null,
      location,
    );
    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [studyVoteData]);

  //선택지 항목 필터 및 정렬
  useEffect(() => {
    if (!myVote?.place) {
      const items = getSortedMainPlace(participations, savedPrefer);
      if (JSON.stringify(items) !== JSON.stringify(placeItems)) {
        setPlaceItems(items);
      }
      return;
    }

    const placeId = myVote.place._id;
    const subPlaceIds = new Set(myVote.subPlace?.map((obj) => obj._id));
    const sortedItem = placeItems.sort((a, b) => b.voteCnt - a.voteCnt);

    const noSubPlaceItems = sortedItem.filter((item) => !subPlaceIds.has(item.place._id));
    const subPlaceItems = sortedItem.filter((item) => subPlaceIds.has(item.place._id));

    setPlaceItems(
      [...subPlaceItems, ...noSubPlaceItems].filter((place) => place.place._id !== placeId),
    );
  }, [myVote?.place, myVote?.subPlace, savedPrefer]);

  const mainPlace = items?.find((item) => item.place._id === myVote?.place?._id);
  const bodyWidth = document.body.clientWidth > 400 ? 400 : document.body.clientWidth;
  const bodyHeight = document.body.clientHeight;

  const handleQuickVote = () => {
    if (savedPrefer?.place && !preferPlaces?.main) {
      toast("warning", "즐겨찾기 장소와 현재 선택중인 지역이 다릅니다.");
      return;
    }
    if (!savedPrefer?.place) {
      if (savedPrefer?.subPlace?.length) {
        toast("warning", "1지망 장소가 등록되어 있지 않습니다.");
      } else toast("warning", "즐겨찾기중인 장소가 없습니다.");
      return;
    }
    setMyVote((old) => ({
      ...old,
      place: participations.find((study) => study.place._id === savedPrefer?.place)?.place,
      subPlace: participations
        .filter((study) => savedPrefer?.subPlace?.includes(study.place._id))
        ?.map((par) => par.place),
    }));
  };

  return (
    <>
      <BottomDrawerLg
        height={bodyHeight - bodyWidth * 0.8 - 74}
        setIsModal={setIsDrawerDown}
        isLittleClose
        isxpadding={false}
        isOverlay={false}
      >
        <Flex direction="column" px={5} w="100%">
          {/* {mainPlace ? (
          <VoteDrawerMainItem
            voteCnt={mainPlace?.voteCnt}
            favoritesCnt={mainPlace?.favoritesCnt}
            myVotePlace={myVote.place}
            setMyVote={setMyVote}
            // setActionType={setActionType}
          />
        ) : (
          <VoteDrawerQuickVoteItem preferPlaces={preferPlaces} handleQuickVote={handleQuickVote} />
        )} */}
          <Flex justify="space-between">
            <Box>
              <Box>1지망 투표</Box>
              <Box>원하시는 카페가 없으신가요?</Box>
            </Box>
            <Button
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
          </Flex>
          <Box overflow="auto" h="300px">
            {thumbnailCardInfoArr?.map((props, idx) => (
              <Box key={idx} mb={3}>
                <PickerRowButton
                  {...props}
                  participantCnt={props.participants.length}
                  pickType="main"
                />
              </Box>
            ))}
          </Box>
        </Flex>
      </BottomDrawerLg>{" "}
    </>
  );
}

const getSortedMainPlace = (
  studyData: StudyParticipationProps[],
  myFavorites: IStudyVotePlaces,
): VoteDrawerItemProps[] => {
  const mainPlace = myFavorites?.place;
  const subPlaceSet = new Set(myFavorites?.subPlace);
  console.log(25, studyData);
  const sortedVoteCntItem = studyData.sort((a, b) => a.members.length - b.members.length);

  const sortedArr = !myFavorites
    ? sortedVoteCntItem
    : [...sortedVoteCntItem].sort((a, b) => {
        const x = a.place._id;
        const y = b.place._id;
        if (x === mainPlace) return -1;
        if (y === mainPlace) return 1;
        if (subPlaceSet.has(x) && subPlaceSet.has(y)) return 0;
        if (subPlaceSet.has(x)) return -1;
        if (subPlaceSet.has(y)) return 1;
        return 0;
      });

  const results = sortedArr.map((par) => ({
    fullname: par.place.fullname,
    voteCnt: par.members.length,
    // favoritesCnt: par.place?.prefCnt || 0,
    locationDetail: par.place.locationDetail,
    place: par.place,
    myFavorite: (par.place._id === mainPlace
      ? "first"
      : subPlaceSet.has(par.place._id)
        ? "second"
        : null) as "first" | "second" | null,
  }));

  return results;
};

export default VoteDrawer;
