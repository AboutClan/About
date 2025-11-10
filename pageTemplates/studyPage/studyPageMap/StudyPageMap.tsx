import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../../components/organisms/SearchLocation";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { LocationProps } from "../../../types/common";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import {
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import RegisterOverview from "../../register/RegisterOverview";
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
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();
  const { currentLocation, refetchCurrentLocation, isLoadingLocation } = useUserCurrentLocation();
  console.log("current", currentLocation);
  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollLockY = useRef(0);
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);
  const [isAddCafeDrawer, setIsAddCafeDrawer] = useState(false);
  const [filterType, setFilterType] = useState<StudyPlaceFilter>(
    type === "mainPlace" ? "main" : null,
  );
  const [zoomNumber, setZoomNumber] = useState<number>(13);
  const [tempToggle, setTempToggle] = useState(false);

  const { data: placeData, isLoading: isLoading2 } = useStudyPlacesQuery(
    filterType || "best",
    null,
  );

  useEffect(() => {
    if (!router.query.modal) {
      setIsMapExpansion(false);
      setPlaceInfo(null);
    }
  }, [router.query.modal]);

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
    const zoom = mapOptions?.zoom || (isMapExpansion ? 11 : 13);

    const options = getMapOptions(currentLocation || myLocation, zoom);
    setZoomNumber(zoom);
    setMapOptions(options);
  }, [userInfo, isMapExpansion, currentLocation]);

  useEffect(() => {
    if (!placeData?.length) return;

    setMarkersOptions(
      getStudyPlaceMarkersOptions(
        placeData,
        placeInfo ? placeInfo._id : null,
        zoomNumber,
        isMapExpansion ? currentLocation : null,
      ),
    );

    if (placeInfo) {
      const options = getMapOptions(
        { lat: placeInfo.location.latitude, lon: placeInfo.location.longitude },
        mapOptions?.zoom,
      );
      setMapOptions(options);
    }
  }, [placeData, placeInfo, zoomNumber, currentLocation]);

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
    if (!isLoadingLocation) setTempToggle(false);
  }, [isLoadingLocation]);

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
      router.push(
        { pathname: router.pathname, query: { ...router.query, modal: "map" } },
        undefined,
        {
          shallow: true,
        },
      );
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
              openAddCafeDrawer={() => setIsAddCafeDrawer(true)}
              isDown={isDown}
              isMainType={type === "mainPlace"}
              handleLocationRefetch={async () => {
                setTempToggle(true);
                const newPos = await refetchCurrentLocation();
                if (typeof window === "undefined" || !("naver" in window)) return;
                const lat = newPos?.lat ?? userInfo?.locationDetail?.latitude;
                const lon = newPos?.lon ?? userInfo?.locationDetail?.longitude;
                if (lat == null || lon == null) return;
                const center = new naver.maps.LatLng(lat, lon);
                setMapOptions((prev) =>
                  prev ? { ...prev, center } : getMapOptions({ lat, lon }, 13),
                );
              }}
              isMapExpansion={isMapExpansion}
              onClose={() => {
                if (onClose) {
                  const { modal, ...restQuery } = router.query; // modal만 제외하고 나머지 유지
                  console.log(modal);
                  router.push({ pathname: router.pathname, query: restQuery }, undefined, {
                    shallow: true,
                  });

                  if (isMapExpansion) {
                    setIsMapExpansion(false); // 지도 확장 상태 해제
                  }
                  onClose();
                } else {
                  router.back();
                  setIsMapExpansion(false);
                }
              }}
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
            {((isLoading && !isLoading2) || (isLoadingLocation && tempToggle)) && (
              <MainLoadingAbsolute size="sm" />
            )}
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
          isDown={isDown}
        />
      )}
      {isAddCafeDrawer && <LocationAddDrawer onClose={() => setIsAddCafeDrawer(false)} />}
      {isLoading && (
        <>
          <ScreenOverlay zIndex={2000} />
          <MainLoading />
        </>
      )}
    </>
  );
}

interface LocationAddDrawerProps {
  onClose: () => void;
}

function LocationAddDrawer({ onClose }: LocationAddDrawerProps) {
  const toast = useToast();

  const [isFirstPage, setIsFirstPage] = useState(true);

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [content, setContent] = useState("");

  const { mutate, isLoading } = useStudyAdditionMutation({
    onSuccess() {
      toast("success", "요청이 완료되었어요! 운영진의 검토 후 등록됩니다.");
      onClose();
    },
  });

  const onClickNext = () => {
    if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
      toast("warning", "장소를 입력해주세요.");
      return;
    }
    if (isFirstPage) {
      setIsFirstPage(false);
    } else {
      const { latitude, longitude, address, name } = placeInfo;
      mutate({
        location: { name, latitude, longitude, address },
        status: "inactive",
      });
    }
  };

  const handleBack = () => {
    if (isFirstPage) onClose();
    else setIsFirstPage(true);
  };

  return (
    <RightDrawer title="장소 추가" onClose={handleBack}>
      <RegisterOverview>
        {isFirstPage ? (
          <>
            <span>추가하고 싶은 장소를 입력해주세요</span>
            <span>입력하신 장소는 운영진의 검토 후 추가됩니다.</span>
          </>
        ) : (
          <>
            <span>장소에 대한 코멘트를 적어주세요</span>
            <span>추천 이유나 카페에 대한 설명을 남겨주시면 좋아요!</span>
          </>
        )}
      </RegisterOverview>
      {isFirstPage ? (
        <SearchLocation
          placeHolder="ex) 사당역 투썸플레이스"
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
        />
      ) : (
        <Textarea
          placeholder="ex) 의자가 편하고 자리마다 콘센트가 있어요! 인기가 많아 주말에는 자리가 없을 수도 있습니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minHeight={200}
        />
      )}
      <BottomNav
        onClick={() => onClickNext()}
        text={isFirstPage ? "다 음" : "완 료"}
        isLoading={isLoading}
        isSlide={false}
      />
    </RightDrawer>
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
