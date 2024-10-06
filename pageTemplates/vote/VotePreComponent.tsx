import { Button } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { STUDY_RECOMMENDATION_DISTANCE } from "../../constants/settingValue/study/study";
import { getStudyVoteCnt } from "../../libs/study/getStudyVoteCnt";
import { getStudyVoteIcon } from "../../libs/study/getStudyVoteIcon";
import { IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { IParticipation, IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import VoteDrawer from "./VoteDrawer";
import VoteTimeDrawer from "./VoteTimeDrawer";

interface VotePreProps {
  setMarkersOptions: DispatchType<IMarkerOptions[]>;
  myVoteInfo: IStudyVoteWithPlace;
  setMyVoteInfo: DispatchType<IStudyVoteWithPlace>;
  studyVoteData: IParticipation[];
  refetchCurrentLocation: () => void;
  setIsDrawerDown: DispatchBoolean;
}

function VotePreComponent({
  setMarkersOptions,
  studyVoteData,
  myVoteInfo,
  setMyVoteInfo,
  refetchCurrentLocation,
  setIsDrawerDown,
}: VotePreProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const locationParamKr = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    if (!studyVoteData) return;

    setMarkersOptions(getMarkersOptions(studyVoteData, myVoteInfo));
  }, [studyVoteData, myVoteInfo]);
  //메인 스터디 장소가 선택되면 일정 거리 이하의 장소들이 2지망으로 자동 선택

  useEffect(() => {
    if (!studyVoteData || !myVoteInfo?.place || myVoteInfo?.subPlace?.length > 0) return;
    const subPlace = [];

    studyVoteData?.forEach((item) => {
      const distance = getDistanceFromLatLonInKm(
        myVoteInfo?.place.latitude,
        myVoteInfo?.place?.longitude,
        item.place.latitude,
        item.place.longitude,
      );
      if (distance < STUDY_RECOMMENDATION_DISTANCE) subPlace.push(item.place);
    });

    setMyVoteInfo((old) => ({ ...old, subPlace }));
  }, [studyVoteData, myVoteInfo?.place]);

  return (
    <>
      <Button
        ml={4}
        rounded="full"
        aspectRatio={1 / 1}
        bgColor="white"
        boxShadow="0 4px 8px rgba(0,0,0,0.1)"
        onClick={refetchCurrentLocation}
        position="fixed"
        bottom="80px"
        left="0"
      >
        <i className="fa-regular fa-location-crosshairs" />
      </Button>
      {studyVoteData && (
        <VoteDrawer
          myVote={myVoteInfo}
          setMyVote={setMyVoteInfo}
          studyVoteData={studyVoteData?.filter((par) => par.place.branch !== "개인 스터디")}
          setActionType={setActionType}
          setIsDrawerDown={setIsDrawerDown}
        />
      )}
      <VoteTimeDrawer
        myVote={
          myVoteInfo && {
            ...myVoteInfo,
            place: myVoteInfo.place?._id,
            subPlace: myVoteInfo.subPlace?.map((obj) => obj._id),
          }
        }
        voterCnt={getStudyVoteCnt(studyVoteData, session?.user.uid)}
        actionType={actionType}
        setActionType={setActionType}
      />
    </>
  );
}

const getMarkersOptions = (
  studyVoteData?: IParticipation[],
  myVote?: IStudyVoteWithPlace,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyVoteData) return;

  const mainPlace = studyVoteData?.find((par) => par.place._id === myVote?.place?._id)?.place;

  return studyVoteData.map((par) => {
    const placeId = par.place._id;

    const iconType =
      placeId === myVote?.place?._id
        ? "main"
        : myVote?.subPlace?.map((obj) => obj._id).includes(placeId)
          ? "sub"
          : "default";

    const polyline =
      mainPlace && myVote?.subPlace?.map((obj) => obj._id).includes(placeId)
        ? getPolyline(
            mainPlace,
            par.place,
            myVote?.subPlace?.map((obj) => obj._id).includes(placeId),
          )
        : null;
    return {
      isPicked: myVote?.place?._id === placeId,
      id: par.place._id,
      position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
      title: par.place.brand,
      icon: {
        content: getStudyVoteIcon(iconType, par.place.branch),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },

      polyline,
    };
  });
};

const getPolyline = (mainPlace: IPlace, subPlace: IPlace, isSecondSub?: boolean) => {
  const { latitude, longitude } = mainPlace;
  const { latitude: subLat, longitude: subLon } = subPlace;
  return {
    path: [new naver.maps.LatLng(latitude, longitude), new naver.maps.LatLng(subLat, subLon)],
    strokeColor: isSecondSub ? "var(--gray-500)" : "var(--color-mint)",
    strokeOpacity: 0.5,
    strokeWeight: 3,
  };
};

export default VotePreComponent;
