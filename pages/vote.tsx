import { Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getStudyVoteIcon } from "../assets/icons/MapChoiceIcon";
import ScreenOverlay from "../components2/atoms/ScreenOverlay";
import VoteMap from "../components2/organisms/VoteMap";
import VoteMapController from "../components2/organisms/VoteMapController";
import MapBottomNav from "../components2/services/studyVote/MapBottomNav";
import { STUDY_PREFERENCE_LOCAL } from "../constants/keys/queryKeys";
import { STUDY_DISTANCE } from "../constants2/serviceConstants/studyConstants/studyDistanceConstants";
import { useToast } from "../hooks/custom/CustomToast";
import {
  useStudyPreferenceQuery,
  useStudyVoteQuery,
} from "../hooks/study/queries";
import {
  getVoteLocationCenterDot,
  getVoteLocationMaxBound,
} from "../libs/study/getStudyVoteMap";
import StudyPresetModal from "../modals/userRequest/StudyPresetModal";
import { myStudyState, studyDateStatusState } from "../recoils/studyRecoils";
import { PLACE_TO_LOCATION } from "../storage/study";
import { IMapOptions, IMarkerOptions } from "../types2/lib/naverMapTypes";
import { ActiveLocation } from "../types2/serviceTypes/locationTypes";
import {
  IParticipation,
  IPlace,
  IStudyPlaces,
  IStudyVote,
} from "../types2/studyTypes/studyVoteTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";

export type ChoiceRank = "first" | "second" | "third";

export default function StudyVoteMap() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const toast = useToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");
  const isPreset = !!searchParams.get("preset");

  const location = convertLocationLangTo(
    searchParams.get("location") as ActiveLocation,
    "kr"
  );

  const moveToLink = () => {
    router.push(`/home?${newSearchParams.toString()}`);
  };

  const myStudy = useRecoilValue(myStudyState);

  const [preferInfo, setPreferInfo] = useState<{
    preset: "first" | "second" | null;
    prefer: IStudyPlaces;
  }>();
  const [myVote, setMyVote] = useState<IStudyVote>();
  const [precision, setPrecision] = useState<0 | 1 | 2>(1);
  const [voteScore, setVoteScore] = useState(2);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [subSecond, setSubSecond] = useState<string[]>();
  const [morePlaces, setMorePlaces] = useState<string[]>();
  const [centerValue, setCenterValue] = useState<{ lat: number; lng: number }>(
    null
  );

  const [isAlert, setIsAlert] = useState(false);

  const studyDateStatus = useRecoilValue(studyDateStatusState);

  const subPlacePoint = myVote?.subPlace?.length || 0;

  const { data: studyVoteData } = useStudyVoteQuery(date, location, {
    enabled: !!location && !!date,
  });

  const preferenceStorage = localStorage.getItem(STUDY_PREFERENCE_LOCAL);
  const { data: studyPreference, isLoading } = useStudyPreferenceQuery({
    enabled: !preferenceStorage,
    onSuccess() {
      setMyVote(null);
    },
  });

  console.log(2, studyPreference);

  //스터디 프리셋 적용
  useEffect(() => {
    console.log(
      "first",
      data?.user,
      location,
      preferenceStorage,
      studyPreference
    );
    if (data?.user?.location !== location) return;
    if (!preferenceStorage && !studyPreference) return;
    if (myVote?.subPlace.length) return;

    const savedPrefer = JSON.parse(preferenceStorage);
    console.log("prefer", savedPrefer, studyPreference);
    if (!savedPrefer && !studyPreference) {
      if (!isAlert) {
        toast(
          "info",
          "최초 1회 프리셋 등록이 필요합니다. 앞으로는 더 빠르게 투표할 수 있고, 이후 마이페이지에서도 변경이 가능합니다."
        );
        setIsAlert(true);
        newSearchParams.append("preset", "on");
        router.replace(pathname + "?" + newSearchParams.toString());
      }
    } else if (
      dayjs(savedPrefer?.date).isBefore(dayjs().subtract(1, "month")) ||
      !savedPrefer?.date
    ) {
      if (!isAlert) {
        toast(
          "info",
          "설정한 프리셋 기간이 만료되었습니다. 다시 등록해주세요!"
        );
        newSearchParams.append("preset", "on");
        router.replace(pathname + "?" + newSearchParams.toString());
        setIsAlert(true);
      }
    } else if (savedPrefer?.prefer) {
      setPreferInfo({
        preset: "first",
        prefer: savedPrefer.prefer,
      });
    } else {
      // setPreferInfo({ preset: "first", prefer: studyPreference });
      // localStorage.setItem(
      //   STUDY_PREFERENCE_LOCAL,
      //   JSON.stringify({
      //     prefer: studyPreference,
      //   })
      // );
    }
  }, [data?.user, studyPreference, preferenceStorage, isLoading]);

  useEffect(() => {
    if (!studyVoteData) return;

    if (preferInfo?.preset === "first") {
      const savedPrefer = JSON.parse(preferenceStorage);
      const prefer = savedPrefer?.prefer;

      const place = studyVoteData.some((par) => par.place._id === prefer?.place)
        ? prefer.place
        : null;
      const subPlace = prefer?.subPlace.filter((sub) =>
        studyVoteData.some((par) => par.place._id === sub)
      );
      setMyVote((old) => (place ? { ...old, place, subPlace } : { ...old }));
    } else if (preferInfo?.preset === null) setMyVote(null);
  }, [preferInfo, studyVoteData]);

  useEffect(() => {
    if (!studyVoteData) return;

    setMarkersOptions(getMarkersOptions(studyVoteData, myVote, subSecond));
  }, [studyVoteData, myVote]);

  //2지망 장소 추천 및 투표 점수 추가
  useEffect(() => {
    if (
      !studyVoteData ||
      !data?.user?.uid ||
      preferInfo?.preset ||
      studyDateStatus !== "not passed"
    )
      return;
    const place = myVote?.place;

    if (place) {
      const { sub1, sub2 } = getSecondRecommendations(studyVoteData, place);
      setMorePlaces([...sub1, ...sub2]);
      if (precision === 2) setSubSecond(sub2);
      setMyVote((old) => ({
        ...old,
        subPlace:
          precision === 0
            ? []
            : precision === 2
            ? [...sub1, ...sub2]
            : [...sub1],
      }));
      setVoteScore(
        (old) =>
          old + getPlaceVoteRankScore(place, studyVoteData, data.user.uid)
      );
    } else {
      setMyVote((old) => ({ ...old, subPlace: [] }));
      setVoteScore(2);
    }
  }, [myVote?.place, precision]);

  const mapOptions = getMapOptions(location);

  const handlePlaceVote = (id: string) => {
    if (id === myVote?.place) {
      setPreferInfo(undefined);
    }
    setMyVote((old) => setVotePlaceInfo(id, old));
  };

  return (
    <>
      <ScreenOverlay darken={true} onClick={moveToLink} />
      <Flex justify="center" align="center" h="calc(100dvh - 96px)">
        <Layout isChange={!!myStudy}>
          <Flex justify="space-between" p="8px">
            <UnorderedList color="white">
              <ListItem>인원이 적을 때 신청하면 추가 포인트!</ListItem>
              <ListItem>신청 장소 수에 비례해 추가 포인트!</ListItem>
            </UnorderedList>
            <Flex
              direction="column"
              alignItems="flex-end"
              color="red.400"
              fontWeight={600}
            >
              <div>현재 획득 포인트</div>
              <div>+ {voteScore + subPlacePoint} POINT</div>
            </Flex>
          </Flex>
          <MapLayout>
            <VoteMap
              mapOptions={mapOptions}
              markersOptions={markersOptions}
              handleMarker={handlePlaceVote}
              centerValue={centerValue}
            />
            <VoteMapController
              preset={preferInfo?.preset}
              setPreset={(preset) =>
                setPreferInfo((old) => ({ ...old, preset }))
              }
              precision={precision}
              setPrecision={setPrecision}
              setCenterValue={setCenterValue}
              setMyVote={setMyVote}
            />
          </MapLayout>
          <MapBottomNav
            myVote={myVote}
            setMyVote={setMyVote}
            voteScore={voteScore + subPlacePoint}
            morePlaces={morePlaces}
          />
        </Layout>
      </Flex>
      {isPreset && <StudyPresetModal />}
    </>
  );
}

export const getSecondRecommendations = (
  voteData: IParticipation[],
  placeId: string
): { sub1: string[]; sub2: string[] } => {
  let temp1: string[] = [];
  let temp2: string[] = [];
  temp1 = [...getRecommendations(placeId, 1)];
  temp2 = [...getRecommendations(placeId, 2)];

  const newSubPlaces1: string[] = [];
  const newSubPlaces2: string[] = [];
  temp1.forEach((subPlace) => {
    if (voteData.some((par) => par.place._id === subPlace)) {
      newSubPlaces1.push(subPlace);
    }
  });
  temp2.forEach((subPlace) => {
    if (voteData.some((par) => par.place._id === subPlace)) {
      newSubPlaces2.push(subPlace);
    }
  });
  return { sub1: newSubPlaces1, sub2: newSubPlaces2 };
};

const getRecommendations = (
  placeId: string,
  targetDistance: number
): string[] => {
  let placesAtDistance = new Set<string>();
  const location = PLACE_TO_LOCATION[placeId];
  const targets = STUDY_DISTANCE[location][targetDistance];
  if (targets) {
    targets.forEach((pair) => {
      if (pair[0] === placeId) placesAtDistance.add(pair[1]);
      else if (pair[1] === placeId) placesAtDistance.add(pair[0]);
    });
  }
  return Array.from(placesAtDistance);
};

export const getPlaceVoteRankScore = (
  placeId: string,
  voteData: IParticipation[],
  uid: string
) => {
  const mainVoteAttCnt = voteData
    .find((par) => par.place._id === placeId)
    ?.attendences.filter((att) => att.user.uid !== uid).length;
  switch (mainVoteAttCnt) {
    case 0:
      return 10;
    case 1:
      return 5;
    case 2:
      return 2;
  }
  return 0;
};

export const getMapOptions = (
  location: ActiveLocation
): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  return {
    center: getVoteLocationCenterDot()[location],
    zoom: location === "인천" ? 12 : 13,
    minZoom: 12,
    maxBounds: getVoteLocationMaxBound()[location],
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};

export const getMarkersOptions = (
  studyVoteData?: IParticipation[],
  myVote?: IStudyVote,
  secondLine?: string[]
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyVoteData) return;

  const mainPlace = studyVoteData?.find(
    (par) => par.place._id === myVote?.place
  )?.place;

  return studyVoteData.map((par) => {
    const placeId = par.place._id;

    const iconType =
      placeId === myVote?.place
        ? "main"
        : myVote?.subPlace?.includes(placeId)
        ? "sub"
        : "default";
    const infoWindow = placeId === myVote?.place ? getInfoWindow(par) : null;
    const polyline =
      mainPlace && myVote?.subPlace?.includes(placeId)
        ? getPolyline(mainPlace, par.place, secondLine?.includes(placeId))
        : null;

    return {
      isPicked: myVote?.place === placeId,
      id: par.place._id,
      position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
      title: par.place.brand,
      icon: {
        content: getStudyVoteIcon(iconType, par.place.branch),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
      infoWindow,
      polyline,
    };
  });
};

const getInfoWindow = (par: IParticipation) => {
  return {
    content: `<div style=" font-size:12px; padding:4px 6px"><span style="font-weight:600; color:#565B67;">${par.place.brand}</span><br/><span>현재 신청 인원:<span style="color:#00c2b3; font-weight:500;"> ${par.attendences.length}명</span></span></div>`,
    borderWidth: 1,
    disableAnchor: false,
    backgroundColor: "var(--gray-8)",
    borderColor: "var(--gray-3)",
    anchorSize: new naver.maps.Size(10, 10),
    anchorColor: "var(--gray-8)",
  };
};

const getPolyline = (
  mainPlace: IPlace,
  subPlace: IPlace,
  isSecondSub?: boolean
) => {
  const { latitude, longitude } = mainPlace;
  const { latitude: subLat, longitude: subLon } = subPlace;
  return {
    path: [
      new naver.maps.LatLng(latitude, longitude),
      new naver.maps.LatLng(subLat, subLon),
    ],
    strokeColor: isSecondSub ? "#f87171" : "var(--color-mint)",
    strokeOpacity: 0.5,
    strokeWeight: 3,
  };
};

export const setVotePlaceInfo = (
  id: string,
  voteInfo?: IStudyVote
): IStudyVote => {
  if (!voteInfo?.place) return { ...voteInfo, place: id };
  else if (voteInfo.place === id) {
    return { ...voteInfo, place: undefined, subPlace: undefined };
  } else if (voteInfo?.subPlace?.includes(id)) {
    return {
      ...voteInfo,
      subPlace: voteInfo.subPlace.filter((place) => place !== id),
    };
  } else
    return {
      ...voteInfo,
      subPlace: [...(voteInfo?.subPlace || []), id],
    };
};

const Layout = styled.div<{ isChange: boolean }>`
  height: min-content;

  position: relative;
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.isChange ? "0" : "8px")};

  max-width: var(--max-width);
`;

const MapLayout = styled.div`
  aspect-ratio: 1/1;
  position: relative;
`;
