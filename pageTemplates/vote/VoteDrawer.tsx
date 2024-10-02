import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";

import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { IParticipation, IPlace } from "../../types/models/studyTypes/studyDetails";
import {
  IStudyVotePlaces,
  IStudyVoteWithPlace,
} from "../../types/models/studyTypes/studyInterActions";
import VoteDrawerItem from "./voteDrawer/VoteDrawerItem";
import VoteDrawerMainItem from "./voteDrawer/VoteDrawerMainItem";
import VoteDrawerQuickVoteItem from "./voteDrawer/VoteDrawerQuickVoteItem";

export interface VoteDrawerItemProps {
  place: IPlace;
  voteCnt: number;
  favoritesCnt: number;
  myFavorite: "first" | "second";
}

interface VoteDrawerProps {
  studyVoteData: IParticipation[];
  myVote: IStudyVoteWithPlace;
  setMyVote: DispatchType<IStudyVoteWithPlace>;
  setActionType: DispatchType<"timeSelect">;
  setIsDrawerDown: DispatchBoolean;
}

function VoteDrawer({
  studyVoteData,
  myVote,
  setMyVote,
  setActionType,
  setIsDrawerDown,
}: VoteDrawerProps) {
  const { data: userInfo, isLoading } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;
  const savedPrefer = preference || { place: null, subPlace: [] };
  const toast = useToast();
  const items = getSortedMainPlace(studyVoteData, savedPrefer);
  const [placeItems, setPlaceItems] = useState<VoteDrawerItemProps[]>(items);

  const preferPlaces = {
    main: studyVoteData?.find((study) => study.place._id === savedPrefer.place)?.place.fullname,
    sub: studyVoteData
      ?.filter((study) => savedPrefer.subPlace.includes(study.place._id))
      .map((study) => study.place.fullname),
  };

  //선택지 항목 필터 및 정렬
  useEffect(() => {
    if (!myVote?.place) {
      const items = getSortedMainPlace(studyVoteData, savedPrefer);
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
  console.log(studyVoteData, placeItems);
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
      place: studyVoteData.find((study) => study.place._id === savedPrefer?.place)?.place,
      subPlace: studyVoteData
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
        {mainPlace ? (
          <VoteDrawerMainItem
            voteCnt={mainPlace?.voteCnt}
            favoritesCnt={mainPlace?.favoritesCnt}
            myVotePlace={myVote.place}
            setMyVote={setMyVote}
            setActionType={setActionType}
          />
        ) : (
          <VoteDrawerQuickVoteItem preferPlaces={preferPlaces} handleQuickVote={handleQuickVote} />
        )}

        <Box overflow="auto" w="100%" flex={1} id=".vote_favorite">
          {placeItems?.map((item, idx) => (
            <VoteDrawerItem
              item={item}
              savedPrefer={savedPrefer}
              myVote={myVote}
              setMyVote={setMyVote}
              setPlaceItems={setPlaceItems}
              isFavoriteLocation={!!preferPlaces?.main}
              userLoading={isLoading}
              key={idx}
            />
          ))}
        </Box>
      </BottomDrawerLg>{" "}
    </>
  );
}

const getSortedMainPlace = (
  studyData: IParticipation[],
  myFavorites: IStudyVotePlaces,
): VoteDrawerItemProps[] => {
  const mainPlace = myFavorites?.place;
  const subPlaceSet = new Set(myFavorites?.subPlace);

  const sortedVoteCntItem = studyData.sort((a, b) => a.attendences.length - b.attendences.length);

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
    voteCnt: par.attendences.length,
    favoritesCnt: par.place?.prefCnt || 0,
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
