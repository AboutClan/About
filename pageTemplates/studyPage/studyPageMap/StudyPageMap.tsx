import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { CoordinatesProps } from "../../../types/common";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import {
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import { getDistanceFromLatLonInKm } from "../../../utils/mathUtils";
import { RightReviewDrawer } from "../../study/StudyReview";
import { CafeListDrawer } from "../CafeListDrawer";
import { LocationAddDrawer } from "../LocationAddDrawer";
import PlaceInfoDrawer from "../PlaceInfoDrawer";
import StudyMapMenuDrawer from "../StudyMapMenuDrawer";
import { StudyReviewDrawer } from "../StudyReviewDrawer";
import { StudyPageTopNav } from "./StudyPageTopNav";
import StudyMapTopNav from "./TopNav";

interface KmPlaceProps extends StudyPlaceProps {
  _diffKm: number;
}
interface StudyPageMapProps {
  isDefaultOpen?: boolean;
  handleVotePick?: (place: StudyPlaceProps) => void;
  onClose?: () => void;
  isDown?: boolean;
  type?: "mainPlace";
  isCafeMap: boolean;
  defaultLocation?: CoordinatesProps;
}

function StudyPageMap({
  isDefaultOpen = false,
  onClose,
  handleVotePick,
  isDown,
  type,
  isCafeMap,
  defaultLocation,
}: StudyPageMapProps) {
  const router = useRouter();

  const { data: userInfo } = useUserInfoQuery();
  const {
    currentLocation: currentLocation2,
    refetchCurrentLocation,
    isLoadingLocation,
  } = useUserCurrentLocation();
  const modalParam = router.query.modal;
  const currentLocation = defaultLocation || currentLocation2;
  const { updateQuery } = useOverlayRouter();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollLockY = useRef(0);
  const [zoomNumber, setZoomNumber] = useState<number>(15);
  const [tempToggle, setTempToggle] = useState(false);
  const [currentMapCenter, setCurrentMapCenter] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  /** 데이터 */
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<StudyPlaceFilter>(
    type === "mainPlace" ? "main" : null,
  );
  const [reviewId, setReviewId] = useState<string>();
  const [drawerType, setDrawerType] = useState<"menu" | "list" | "placeInfo" | "addCafe">(null);

  const { data: placeData, isLoading: isLoading2 } = useStudyPlacesQuery(
    filterType || "best",
    null,
  );

  useEffect(() => {
    if (modalParam !== "reviewPlace" && modalParam !== "addReview") {
      setReviewId(null);
      if (modalParam !== "placeDrawer" && drawerType === "placeInfo") {
        setDrawerType(null);
        setSelectedPlaceId(null);
      }
      if (modalParam !== "list" && !ids.length && drawerType === "list") {
        setDrawerType(null);
        setIds([]);
      }
    }
    if (modalParam !== "addCafe" && drawerType === "addCafe") {
      setDrawerType(null);
    }
    if (modalParam !== "menu" && drawerType === "menu") {
      setDrawerType(null);
    }
  }, [modalParam]);

  useEffect(() => {
    if (isCafeMap || isDefaultOpen) {
      setIsMapExpansion(true);
      return;
    }
    if (!router.query.modal) {
      setIsMapExpansion(false);
      setPlaceInfo(null);
    }
  }, [router.query.modal, isCafeMap, isDefaultOpen]);

  // 초기 지도 map-option 세팅
  useEffect(() => {
    if (!userInfo) return;
    const myLocation = {
      lat: userInfo.locationDetail.latitude,
      lon: userInfo.locationDetail.longitude,
    };
    const zoom = defaultLocation ? 16 : mapOptions?.zoom || (isMapExpansion ? 15 : 16);

    const options = getMapOptions(currentLocation || myLocation, zoom);
    setZoomNumber(zoom);
    setMapOptions(options);
  }, [userInfo, isMapExpansion, currentLocation, defaultLocation]);
  console.log(zoomNumber);
  useEffect(() => {
    if (!placeInfo) {
      updateQuery({
        modal: null,
      });
      return;
    }
    setMapOptions((prev) =>
      getMapOptions(
        {
          lat: placeInfo.location.latitude,
          lon: placeInfo.location.longitude,
        },
        prev?.zoom,
      ),
    );
  }, [placeInfo]);

  useEffect(() => {
    if (!placeData?.length) return;
    setMarkersOptions(
      getStudyPlaceMarkersOptions(
        placeData,
        null,
        zoomNumber,
        isMapExpansion && !defaultLocation ? currentLocation : null,
        defaultLocation,
      ),
    );
  }, [placeData, zoomNumber, currentLocation, defaultLocation, isMapExpansion]);

  const handleMarker = (id: string, currentZoom: number, ids?: string[]) => {
    if (ids && ids.length > 1) {
      setIds(ids);
      setDrawerType("list");
      updateQuery({
        modal: "list",
      });
      return;
    }
    const findPlace = placeData?.find((place) => place._id === id);
    if (!findPlace) return;
    setSelectedPlaceId(id);
    setPlaceInfo(findPlace);
    setDrawerType("placeInfo");
    setMapOptions((prev) => ({
      ...prev,
      zoom: currentZoom,
    }));
    updateQuery({
      modal: "placeDrawer",
    });
  };

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
      setFilterType("all");
    } else setFilterType("all");

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
      if (window.scrollY <= 0 && deltaY > 0) {
        e.preventDefault();
      }
    };
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

  return (
    <>
      <Box>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          mx={!isMapExpansion ? 5 : 0}
          top={0}
          left={0}
          zIndex={isDefaultOpen && !isDown ? 1000 : isMapExpansion ? 1000 : 0}
          {...(!isMapExpansion ? { aspectRatio: 1 / 1, height: "inherit" } : { height: "100svh" })}
          w={isMapExpansion ? "full" : "auto"}
          bg="transparent"
          onClick={() => {
            if (!isMapExpansion) {
              updateQuery({
                modal: "map",
              });
              setIsMapExpansion(true);
            }
          }}
        >
          <ClipLayer $rounded={!isMapExpansion}>
            {isMapExpansion && (
              <StudyPageTopNav
                isCafeMap={isCafeMap}
                handleCenterLocation={(location) => {
                  setMapOptions(getMapOptions(location, zoomNumber));
                }}
                openMenu={() => {
                  updateQuery({
                    modal: "menu",
                  });
                  setDrawerType("menu");
                }}
                onClose={onClose}
              />
            )}
            <StudyMapTopNav
              isCafeMap={isCafeMap}
              isMainType={type === "mainPlace"}
              addCafe={() => {
                updateQuery({
                  modal: "addCafe",
                });
                setDrawerType("addCafe");
              }}
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
              openList={() => {
                updateQuery({
                  modal: "list",
                });
                setDrawerType("list");
              }}
              onClose={() => {
                if (onClose) {
                  updateQuery({
                    modal: undefined,
                  });

                  if (isMapExpansion) {
                    setIsMapExpansion(false);
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
              selectedMarkerId={selectedPlaceId}
              zoomChange={(zoom: number) => setZoomNumber(zoom)}
              centerChange={setCurrentMapCenter}
            />

            {((isLoading && !isLoading2) || (isLoadingLocation && tempToggle)) && (
              <MainLoadingAbsolute size="sm" />
            )}
          </ClipLayer>
        </Box>
      </Box>
      {drawerType === "addCafe" && (
        <LocationAddDrawer
          onClose={() => {
            router.back();
            setDrawerType(null);
          }}
        />
      )}
      {drawerType === "placeInfo" && (
        <PlaceInfoDrawer
          handleVotePick={
            isDefaultOpen && !isDown && !isCafeMap ? () => handleVotePick(placeInfo) : undefined
          }
          placeInfo={placeInfo}
          onClose={() => {
            setDrawerType(null);
            setPlaceInfo(null);
            setSelectedPlaceId(null);
            router.back();
          }}
          isDown={isDown}
          isChange={!!defaultLocation}
          pickReviewPlace={(id: string) => {
            setReviewId(id);
            updateQuery({
              modal: "reviewPlace",
            });
          }}
        />
      )}
      {drawerType === "list" && (
        <CafeListDrawer
          type={ids.length ? "ids" : "drawer"}
          onClose={() => {
            setIds([]);
            router.back();
            setDrawerType(null);
          }}
          pickReviewPlace={(id: string) => {
            setReviewId(id);
            updateQuery({
              modal: "reviewPlace",
            });
          }}
          placeData={(placeData as KmPlaceProps[])
            ?.filter((place) => {
              if (ids.length) {
                return ids.includes(place._id);
              }
              const diffKm = getDistanceFromLatLonInKm(
                currentMapCenter?.lat ?? mapOptions.center.y,
                currentMapCenter?.lon ?? mapOptions.center.x,
                place.location.latitude,
                place.location.longitude,
              );
              place._diffKm = diffKm;
              return diffKm < 3;
            })
            ?.sort((a, b) => a._diffKm - b._diffKm)}
        />
      )}
      {reviewId && (
        <StudyReviewDrawer
          placeInfo={placeData.find((p) => p._id === reviewId)}
          onClose={() => {
            router.back();
            setReviewId(null);
          }}
          zIndex={3000}
          handleClick={() => {
            updateQuery({
              modal: "addReview",
            });
          }}
        />
      )}
      {modalParam === "addReview" && (
        <RightReviewDrawer
          placeId={placeData.find((p) => p._id === reviewId)._id}
          onClose={() => {
            router.back();
          }}
          zIndex={4000}
        />
      )}
      {drawerType === "menu" && (
        <StudyMapMenuDrawer
          onClose={() => {
            setDrawerType(null);
            router.back();
          }}
          addCafe={() => {
            updateQuery({
              modal: "addCafe",
            });
            setDrawerType("addCafe");
          }}
        />
      )}

      {(isLoading || isLoading2) && (
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
