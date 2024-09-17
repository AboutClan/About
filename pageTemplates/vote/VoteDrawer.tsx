import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import { StudyVoteMapActionType } from "../../pages/vote";
import { DispatchType } from "../../types/hooks/reactTypes";
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
  setActionType: DispatchType<StudyVoteMapActionType>;
}

function VoteDrawer({ studyVoteData, myVote, setMyVote, setActionType }: VoteDrawerProps) {
  const savedPreferPlace: { place: IPlace; subPlace: IPlace[] } = {
    place: studyVoteData.find((par) => par.myPrefer === "main")?.place,
    subPlace: studyVoteData.filter((par) => par.myPrefer === "sub").map((item) => item.place),
  };
  const savedPrefer: { place: string; subPlace: string[] } = {
    place: studyVoteData.find((par) => par.myPrefer === "main")?.place._id,
    subPlace: studyVoteData.filter((par) => par.myPrefer === "sub").map((item) => item.place._id),
  };

  const items = getSortedMainPlace(studyVoteData, savedPrefer);
  const [placeItems, setPlaceItems] = useState<VoteDrawerItemProps[]>(items);

  //선택지 항목 필터 및 정렬
  useEffect(() => {
    if (!myVote?.place) {
      const items = getSortedMainPlace(studyVoteData, savedPrefer);
      setPlaceItems(items);
      return;
    }

    const placeId = myVote.place._id;
    const subPlaceIds = new Set(myVote.subPlace?.map((obj) => obj._id));

    const sortedItem = placeItems.sort((a, b) => (a.voteCnt > b.voteCnt ? -1 : 1));
    const noSubPlaceItems = sortedItem.filter((item) => !subPlaceIds.has(item.place._id));
    const subPlaceItems = sortedItem.filter((item) => subPlaceIds.has(item.place._id));

    setPlaceItems(
      [...subPlaceItems, ...noSubPlaceItems].filter((place) => place.place._id !== placeId),
    );
  }, [myVote?.place, myVote?.subPlace]);

  const mainPlace = items?.find((item) => item.place._id === myVote?.place?._id);
  const bodyWidth = document.body.clientWidth > 400 ? 400 : document.body.clientWidth;
  const bodyHeight = document.body.clientHeight;

  return (
    <BottomDrawerLg
      height={bodyHeight - bodyWidth * 0.8 - 74}
      setIsModal={() => {}}
      isxpadding={false}
      isOverlay={false}
    >
      {mainPlace ? (
        <VoteDrawerMainItem
          voteCnt={mainPlace?.voteCnt + 5}
          favoritesCnt={mainPlace?.favoritesCnt + 14}
          myVotePlace={myVote.place}
          setMyVote={setMyVote}
          setActionType={setActionType}
        />
      ) : (
        <VoteDrawerQuickVoteItem savedPreferPlace={savedPreferPlace} setMyVote={setMyVote} />
      )}

      <Box overflow="auto" w="100%" flex={1}>
        {placeItems?.map((item, idx) => (
          <VoteDrawerItem
            item={item}
            savedPrefer={savedPrefer}
            myVote={myVote}
            setMyVote={setMyVote}
            setPlaceItems={setPlaceItems}
            key={idx}
          />
        ))}
      </Box>
    </BottomDrawerLg>
  );
}

const getSortedMainPlace = (
  studyData: IParticipation[],
  myFavorites: IStudyVotePlaces,
): VoteDrawerItemProps[] => {
  const mainPlace = myFavorites?.place;
  const subPlaceSet = new Set(myFavorites?.subPlace);

  const sortedVoteCntItem = studyData.sort((a, b) =>
    a.attendences.length > b.attendences.length ? -1 : 1,
  );

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
