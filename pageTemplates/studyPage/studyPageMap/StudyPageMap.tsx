import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import {
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import PlaceInfoDrawer from "../PlaceInfoDrawer";
import StudyMapTopNav from "./TopNav";

interface StudyPageMapProps {
  isDefaultOpen?: boolean;
  handleVotePick?: (place: StudyPlaceProps) => void;
  onClose?: () => void;
  isDown?: boolean;
  type?: "mainPlace";
}

function StudyPageMap({
  isDefaultOpen = false,
  onClose,
  handleVotePick,
  isDown,
  type,
}: StudyPageMapProps) {
  const { data: userInfo } = useUserInfoQuery();
  const { currentLocation, refetchCurrentLocation } = useUserCurrentLocation();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollLockY = useRef(0);
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);
  const [filterType, setFilterType] = useState<StudyPlaceFilter>(
    type === "mainPlace" ? "main" : null,
  );
  const [zoomNumber, setZoomNumber] = useState<number>(13);

  const { data: placeData, isLoading: isLoading2 } = useStudyPlacesQuery(
    filterType || "best",
    null,
  );

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
    const options = getMapOptions(currentLocation || myLocation, isMapExpansion ? 11 : 13);

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
      // 현재 스크롤 보존 + 바디 스크롤 잠금
      scrollLockY.current = window.scrollY;
      document.documentElement.style.overscrollBehavior = "none"; // 루트 전체 차단
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 잠금 해제
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollLockY.current);
    }
    if (type === "mainPlace") {
      setFilterType("main");
      return;
    }
    if (isMapExpansion) {
      setFilterType("good");
    } else setFilterType("best");

    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMapExpansion]);

  useEffect(() => {
    if (!isMapExpansion) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const deltaY = y - startY;

      // 페이지 최상단에서 아래로 끌어내리는 제스처만 차단(PtR 방지)
      if (window.scrollY <= 0 && deltaY > 0) {
        e.preventDefault();
      }
    };

    // passive: false 가 핵심 (기본 스크롤 취소 가능)
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
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
    if (!isMapExpansion) {
      setIsMapExpansion(true);
    }
  };

  return (
    <>
      <Box>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          mx={!isMapExpansion ? 5 : 0}
          top={0}
          left={0}
          zIndex={isDefaultOpen && !isDown ? 1500 : isMapExpansion ? 1000 : "auto"}
          {...(!isMapExpansion ? { aspectRatio: 1 / 1, height: "inherit" } : { height: "100svh" })}
          w={isMapExpansion ? "full" : "auto"}
          bg="transparent"
          onClick={handleMapClick}
        >
          <ClipLayer $rounded={!isMapExpansion}>
            <StudyMapTopNav
              isMainType={type === "mainPlace"}
              handleLocationRefetch={async () => {
                const newPos = await refetchCurrentLocation();
                if (newPos) {
                  const center = new naver.maps.LatLng(newPos.lat, newPos.lon);
                  setMapOptions((prev) => (prev ? { ...prev, center } : getMapOptions(newPos, 13)));
                } else if (userInfo?.locationDetail) {
                  const center = new naver.maps.LatLng(
                    userInfo.locationDetail.latitude,
                    userInfo.locationDetail.longitude,
                  );
                  setMapOptions((prev) =>
                    prev
                      ? { ...prev, center }
                      : getMapOptions(
                          {
                            lat: userInfo.locationDetail.latitude,
                            lon: userInfo.locationDetail.longitude,
                          },
                          13,
                        ),
                  );
                }
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
          </ClipLayer>
        </Box>
      </Box>

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
          handleVotePick={isDefaultOpen && !isDown ? () => handleVotePick(placeInfo) : undefined}
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

const ClipLayer = styled.div<{ $rounded: boolean }>`
  width: 100%;
  height: 100%;
  /* 라운드/클리핑/보더는 랩퍼에서만 */
  border-radius: ${({ $rounded }) => ($rounded ? "16px" : "0")};
  overflow: hidden;
  border: 1px solid var(--gray-200);
  overscroll-behavior: contain; /* 내부 스크롤이 바깥으로 전파되지 않게 */
  touch-action: pan-x pan-y; /* 지도 제스처와 충돌 없게 */
`;

export default StudyPageMap;
