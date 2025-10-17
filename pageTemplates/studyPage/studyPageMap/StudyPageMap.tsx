import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import {
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import { detectDevice } from "../../../utils/validationUtils";
import PlaceInfoDrawer from "../PlaceInfoDrawer";
import StudyMapTopNav from "./TopNav";

interface StudyPageMapProps {
  isDefaultOpen?: boolean;
  handleVotePick?: (place: StudyPlaceProps) => void;
  onClose?: () => void;
  isDown?: boolean;
}

function StudyPageMap({
  isDefaultOpen = false,
  onClose,
  handleVotePick,
  isDown,
}: StudyPageMapProps) {
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
  const [filterType, setFilterType] = useState<StudyPlaceFilter>();
  const [zoomNumber, setZoomNumber] = useState<number>(13);

  const { data: placeData, isLoading: isLoading2 } = useStudyPlacesQuery(
    filterType || "best",
    null,
  );

  const isPC = detectDevice() === "PC" && userInfo?.locationDetail?.latitude;

  useEffect(() => {
    if (isDefaultOpen) {
      setIsMapExpansion(true);
    }
  }, [isDefaultOpen]);

  // 초기 지도 map-option 세팅
  useEffect(() => {
    if (!userInfo) return;
    const myLocation = {
      lat: userInfo.locationDetail.latitude,
      lon: userInfo.locationDetail.longitude,
    };
    const options = getMapOptions(
      isPC ? myLocation : currentLocation || myLocation,
      isMapExpansion ? 12 : 13,
    );

    setMapOptions(options);
  }, [userInfo, isMapExpansion, currentLocation]);

  useEffect(() => {
    if (!placeData?.length) return;

    setMarkersOptions(
      getStudyPlaceMarkersOptions(placeData, placeInfo ? placeInfo._id : null, zoomNumber),
    );

    if (placeInfo) {
      const options = getMapOptions(
        { lat: placeInfo.location.latitude, lon: placeInfo.location.longitude },
        mapOptions?.zoom,
      );
      setMapOptions(options);
    }
  }, [placeData, placeInfo, zoomNumber]);

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

  useEffect(() => {
    if (isMapExpansion) {
      setFilterType("good");
    } else setFilterType("best");
  }, [isMapExpansion]);

  useEffect(() => {
    if (!isMapExpansion) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [isMapExpansion, filterType]);

  const handleMapClick = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (!isMapExpansion) {
      setIsMapExpansion(true);
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
          zIndex={isDefaultOpen && !isDown ? 1500 : isMapExpansion ? 1000 : "auto"}
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
                ? setMapOptions((old) => ({
                    ...old,
                    center: new naver.maps.LatLng(
                      userInfo.locationDetail.latitude,
                      userInfo.locationDetail.longitude,
                    ),
                  }))
                : currentLocation
                ? setMapOptions((old) => ({
                    ...old,
                    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
                  }))
                : null;
            }}
            isMapExpansion={isMapExpansion}
            onClose={() => {
              if (onClose) {
                onClose();
              } else {
                setIsMapExpansion(false);
              }
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
            zoomChange={(zoom: number) => setZoomNumber(zoom)}
            isMapExpansion={isMapExpansion}
            // circleCenter={
            //   isMapExpansion && !placeData
            //     ? studyVoteData?.results?.map((props) => props?.center)
            //     : null
            // }
          />

          {/* {!studyVoteData?.results && <MainLoadingAbsolute />} */}
          {isLoading2 && !isLoading2 && <MainLoadingAbsolute size="sm" />}
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
      {placeInfo && (
        <PlaceInfoDrawer
          handleVotePick={isDefaultOpen ? () => handleVotePick(placeInfo) : undefined}
          placeInfo={placeInfo}
          onClose={() => setPlaceInfo(null)}
        />
      )}
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
