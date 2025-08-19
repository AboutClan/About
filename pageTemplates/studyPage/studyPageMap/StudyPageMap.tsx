import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import { StudyPlaceProps } from "../../../types/models/studyTypes/baseTypes";
import { detectDevice } from "../../../utils/validationUtils";
import PlaceInfoDrawer from "../PlaceInfoDrawer";
import StudyMapTopNav from "./TopNav";

function StudyPageMap() {
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfoQuery();
  const typeToast = useTypeToast();
  const isGuest = session?.user.role === "guest";
  const { currentLocation } = useUserCurrentLocation();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);
  const [filterType, setFilterType] = useState<"main" | "all">("main");

  const { data: placeData } = useStudyPlacesQuery("all", null);
  console.log(53, placeData);
  const isPC = detectDevice() === "PC" && userInfo?.locationDetail?.lat;

  useEffect(() => {
    const options = getMapOptions(
      placeInfo
        ? { lat: placeInfo.location.latitude, lon: placeInfo.location.longitude }
        : isPC
        ? { lat: userInfo.locationDetail.lat, lon: userInfo.locationDetail.lon }
        : (mapOptions?.center?.x && { lat: mapOptions?.center?.x, lon: mapOptions?.center?.y }) ||
          currentLocation,
      mapOptions?.zoom || (isMapExpansion ? 12 : 13),
    );

    setMapOptions(options);
    setMarkersOptions(getStudyPlaceMarkersOptions(placeData, placeInfo?._id));

    // if (placeData) setIsMapExpansion(true);
  }, [currentLocation, isMapExpansion, placeData, userInfo, placeInfo]);

  const handleMarker = (id: string, currentZoom: number) => {
    setMapOptions({ ...mapOptions, zoom: currentZoom });

    const findPlace = placeData?.find((place) => place._id === id);
    setPlaceInfo(findPlace);
    return;

    // if (!id || !studyVoteData || studyVoteData?.participations) return;
    // const findStudy = studyVoteData && findStudyByPlaceId(studyVoteData, id);
    // const detailInfo = getDetailInfo(findStudy, userInfo?.uid);
    // setDetailInfo(detailInfo);
  };

  // const myStudy = findMyStudyByUserId(studyVoteData, userInfo?._id);

  const handleMapClick = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (!isMapExpansion) {
      setIsMapExpansion(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <>
      <>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          mx={!isMapExpansion ? 5 : 0}
          top={0}
          left={0}
          zIndex={700}
          {...(!isMapExpansion ? { aspectRatio: 1 / 1, height: "inherit" } : { height: "100dvh" })}
          w={isMapExpansion ? "full" : "auto"}
          borderRadius={isMapExpansion ? "0" : "16px"}
          overflow="hidden"
          border="1px solid black"
          borderColor="gray.200"
          bg="gray.100"
          onClick={handleMapClick}
        >
          <StudyMapTopNav
            handleLocationRefetch={() => {
              isPC
                ? { lat: userInfo.locationDetail.lat, lon: userInfo.locationDetail.lon }
                : currentLocation
                ? setMapOptions((old) => ({
                    ...old,
                    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
                  }))
                : null;
            }}
            isMapExpansion={isMapExpansion}
            onClose={() => {
              setIsMapExpansion(false);
            }}
            isCafePlace={!!placeData}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <VoteMap
            mapOptions={mapOptions}
            markersOptions={markersOptions}
            resizeToggle={isMapExpansion}
            handleMarker={handleMarker}
            // circleCenter={
            //   isMapExpansion && !placeData
            //     ? studyVoteData?.results?.map((props) => props?.center)
            //     : null
            // }
          />
          {/* {!studyVoteData?.results && <MainLoadingAbsolute />} */}
        </Box>{" "}
      </>
      {/* {detailInfo && (
        <StudyInfoDrawer
          date={date}
          detailInfo={detailInfo}
          setDetailInfo={setDetailInfo}
          myStudy={myStudy}
        />
      )} */}
      {placeInfo && <PlaceInfoDrawer placeInfo={placeInfo} onClose={() => setPlaceInfo(null)} />}
      {isLoading && (
        <>
          <ScreenOverlay zIndex={2000} />
          <MainLoading />
        </>
      )}
    </>
  );
}

export default StudyPageMap;
