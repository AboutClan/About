import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Slide from "../../../components/layouts/PageSlide";
import VoteMap from "../../../components/organisms/VoteMap";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import {
  getDetailInfo,
  getMapOptions,
  getMarkersOptions,
  getStudyPlaceMarkersOptions,
} from "../../../libs/study/setStudyMapOptions";
import { findMyStudyByUserId, findStudyByPlaceId } from "../../../libs/study/studySelectors";
import { CoordinatesProps } from "../../../types/common";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import { DispatchBoolean, DispatchType } from "../../../types/hooks/reactTypes";
import { StudyPlaceProps, StudyVoteDataProps } from "../../../types/models/studyTypes/baseTypes";
import PlaceInfoDrawer from "../PlaceInfoDrawer";
import StudyInfoDrawer, { StudyInfoProps } from "../StudyInfoDrawer";
import StudyMapTopNav from "./TopNav";

interface StudyPageMapProps {
  studyVoteData: StudyVoteDataProps;
  centerLocation: CoordinatesProps;
  currentLocation: CoordinatesProps;
  setCenterLocation: DispatchType<CoordinatesProps>;
  date: string;
  myVoteCoordinates: CoordinatesProps;
  placeData: StudyPlaceProps[];
  setIsPlaceMap: DispatchBoolean;
}

function StudyPageMap({
  studyVoteData,
  centerLocation,
  currentLocation,
  setCenterLocation,
  date,
  myVoteCoordinates,
  placeData,
  setIsPlaceMap,
}: StudyPageMapProps) {
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfoQuery();
  const typeToast = useTypeToast();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);

  const isGuest = session?.user.role === "guest";

  useEffect(() => {
    if (!studyVoteData) return;

    const options = getMapOptions(
      placeInfo
        ? { lat: placeInfo?.latitude, lon: placeInfo.longitude }
        : detailInfo
        ? { lat: detailInfo.place.latitude, lon: detailInfo.place.longitude }
        : (mapOptions?.center?.x && { lat: mapOptions?.center?.x, lon: mapOptions?.center?.y }) ||
          centerLocation,
      mapOptions?.zoom || (isMapExpansion ? 12 : 13),
    );

    setMapOptions(options);
    setMarkersOptions(
      !placeData
        ? getMarkersOptions(
            studyVoteData.results,
            studyVoteData?.realTimes?.userList || null,
            currentLocation,
            myVoteCoordinates,
            studyVoteData?.participations?.filter(
              (who) =>
                who?.user?.isLocationSharingDenided === false ||
                userInfo?.friend.includes(who?.user.uid),
            ),
            detailInfo?.place._id,
          )
        : getStudyPlaceMarkersOptions(placeData, placeInfo?._id),
    );
   
    if (placeData) setIsMapExpansion(true);
  }, [
    studyVoteData,
    currentLocation,
    centerLocation,
    isMapExpansion,
    placeData,
    placeInfo,
    detailInfo,
  ]);

  const handleMarker = (id: string, type: "vote" | "place", currentZoom: number) => {
    setMapOptions({ ...mapOptions, zoom: currentZoom });
    if (type === "place") {
      const findPlace = placeData?.find((place) => place._id === id);
      setPlaceInfo(findPlace);
      return;
    }
    if (!id || !studyVoteData || studyVoteData?.participations) return;
    const findStudy = studyVoteData && findStudyByPlaceId(studyVoteData, id);
    const detailInfo = getDetailInfo(findStudy, userInfo?.uid);
    setDetailInfo(detailInfo);
  };

  const myStudy = findMyStudyByUserId(studyVoteData, userInfo?._id);

  const handleMapClick = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (!isMapExpansion) setIsMapExpansion(true);
  };

  return (
    <>
      <Slide>
        <Box
          mb={5}
          position={isMapExpansion ? "fixed" : "relative"}
          top={0}
          left={0}
          zIndex={700}
          height={isMapExpansion ? "100dvh" : 180}
          w="full"
          borderRadius="16px"
          overflow="hidden"
          border="1px solid black"
          borderColor="gray.200"
          bg="gray.100"
          onClick={handleMapClick}
        >
          <StudyMapTopNav
            handleLocationRefetch={() => {
              currentLocation ? setCenterLocation(currentLocation) : null;
            }}
            isMapExpansion={isMapExpansion}
            onClose={() => {
              setIsMapExpansion(false);
              setIsPlaceMap(false);
            }}
            isCafePlace={!!placeData}
          />

          <VoteMap
            mapOptions={mapOptions}
            markersOptions={markersOptions}
            resizeToggle={isMapExpansion}
            handleMarker={handleMarker}
            circleCenter={
              isMapExpansion && !placeData
                ? studyVoteData?.results?.map((props) => props?.center)
                : null
            }
          />
          {/* {!studyVoteData?.results && <MainLoadingAbsolute />} */}
        </Box>
      </Slide>
      {detailInfo && (
        <StudyInfoDrawer
          date={date}
          detailInfo={detailInfo}
          setDetailInfo={setDetailInfo}
          myStudy={myStudy}
        />
      )}
      {placeInfo && <PlaceInfoDrawer placeInfo={placeInfo} onClose={() => setPlaceInfo(null)} />}
    </>
  );
}

export default StudyPageMap;
