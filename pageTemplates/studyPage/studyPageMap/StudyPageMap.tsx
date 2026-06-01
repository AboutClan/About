import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoading, MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { ModalLayout } from "../../../modals/Modals";
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
import StudyMapNav, { ARCHIVE_OPTIONS } from "./TopNav";

interface StudyPageMapProps {
  isDefaultOpen?: boolean;
  handleVotePick?: (place: StudyPlaceProps) => void;
  onClose?: () => void;
  isDown?: boolean;
  type?: "mainPlace";
  isCafeMap: boolean;
  defaultLocation?: CoordinatesProps;
  hasBackButton?: boolean;
  noModalUpdate?: boolean;
}

function StudyPageMap({
  isDefaultOpen = false,
  onClose,
  handleVotePick,
  isDown,
  type,
  isCafeMap,
  defaultLocation,
  hasBackButton = false,
  noModalUpdate = false,
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
  const [zoomNumber, setZoomNumber] = useState<number>(14);
  const [tempToggle, setTempToggle] = useState(false);
  const [currentMapCenter, setCurrentMapCenter] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // 마커 필터 기준점. currentMapCenter 와 달리 자주 바뀌지 않음.
  // 이 값이 변경되어야만 visiblePlaceData / markersOptions 가 재계산된다.
  const [markerCenter, setMarkerCenter] = useState<{ lat: number; lon: number } | null>(null);

  // 화면 bounds 기반으로 idle 시점에 갱신되는 반경. 기본 5km, hysteresis 로 churn 방지.
  const [markerRadiusKm, setMarkerRadiusKm] = useState(5);

  // 화면에 실제로 보이는 영역 반경 (buffer/floor 없음). cafeList 필터·라벨용.
  // markerRadiusKm 와 달리 hysteresis 없이 idle 마다 직접 반영 — 리스트는
  // 사용자가 보는 것과 어긋나면 안 되고, 줌 단계마다 자연스레 단계적으로 변한다.
  const [viewportRadiusKm, setViewportRadiusKm] = useState(5);
  // VoteMap idle 콜백. center 와 radius 를 한 번에 처리하고, useCallback 으로
  // 안정화해 VoteMap 의 idle listener effect 가 재등록되지 않게 한다.
  const handleCenterChange = useCallback(
    (info: { lat: number; lon: number; radiusKm: number; viewportRadiusKm: number }) => {
      setCurrentMapCenter({ lat: info.lat, lon: info.lon });
      setViewportRadiusKm(info.viewportRadiusKm);
      setMarkerRadiusKm((prev) => {
        // 0.5km 미만 차이는 numerical noise → 무시.
        if (Math.abs(info.radiusKm - prev) < 0.5) return prev;
        // zoom out 으로 더 넓어진 경우 → 즉시 반영 (마커 누락 방지).
        if (info.radiusKm > prev) return info.radiusKm;
        // zoom in 으로 좁아진 경우 → 30% 이상 줄어들 때만 반영 (hysteresis).
        if (info.radiusKm < prev * 0.7) return info.radiusKm;
        return prev;
      });
    },
    [],
  );

  /** 데이터 */
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<StudyPlaceFilter>(
    type === "mainPlace" ? "main" : null,
  );
  const [reviewPlaceInfo, setReviewPlaceInfo] = useState<StudyPlaceProps | null>(null);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [unregisteredCafe, setUnregisteredCafe] = useState<NaverLocationProps | null>(null);
  const [prefilledCafeLocation, setPrefilledCafeLocation] = useState<{
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedPickNickname, setSelectedPickNickname] = useState<string | null>(null);

  useEffect(() => {
    if (filterType !== "about") setSelectedPickNickname(null);
  }, [filterType]);
  const [drawerType, setDrawerType] = useState<"menu" | "list" | "placeInfo" | "addCafe" | "about">(
    null,
  );

  const { data: placeData, isLoading: isLoading2 } = useStudyPlacesQuery(
    (filterType === "about" ? "all" : filterType) || "best",
    null,
  );
  console.log(21, placeData);
  useEffect(() => {
    if (noModalUpdate) return;
    if (modalParam !== "reviewPlace" && modalParam !== "addReview") {
      setReviewPlaceInfo(null);
      if (modalParam !== "placeDrawer" && drawerType === "placeInfo") {
        setDrawerType(null);
        setSelectedPlaceId(null);
      }
      if (modalParam !== "list" && drawerType === "list") {
        setDrawerType(null);
        setIds([]);
      }
    }
    if (modalParam === "addCafe" && drawerType !== "addCafe") {
      setDrawerType("addCafe");
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

  // 초기 지도 위치를 한 번만 결정하기 위한 snapshot.
  // userInfo 도착 시점에 currentLocation 이 이미 있으면 그 값, 없으면 userInfo location 으로 고정.
  // 이후 currentLocation 이 늦게 resolve 되어도 ref 가 바뀌지 않으므로 지도가 튀지 않는다.
  const initialLocationRef = useRef<{ lat: number; lon: number } | null>(null);

  // 게스트(isCafeMap) 전용: sessionStorage 캐시 등으로 currentLocation 이 userInfo 보다 먼저
  // resolve 된 경우 즉시 지도를 초기화. userInfo effect 의 snapshot 조건과 동일하게
  // initialLocationRef 가 아직 비어있을 때만 실행되어 두 effect 가 충돌하지 않는다.
  useEffect(() => {
    if (!isCafeMap || !currentLocation || initialLocationRef.current) return;
    initialLocationRef.current = currentLocation;
    setMarkerCenter((prev) => prev ?? currentLocation);
    const zoom = 14;
    setMapOptions(getMapOptions(currentLocation, zoom));
    setZoomNumber(zoom);
  }, [isCafeMap, currentLocation]);

  // 초기 지도 map-option 세팅
  useEffect(() => {
    if (!userInfo) return;
    const myLocation = {
      lat: userInfo.locationDetail.latitude,
      lon: userInfo.locationDetail.longitude,
    };

    // 최초 1회만 snapshot. 이후 currentLocation 변경에 의한 재실행이 와도 이 값은 유지.
    if (!initialLocationRef.current) {
      initialLocationRef.current = currentLocation || myLocation;
      // 지도 중심과 markerCenter 의 최초 기준점을 동일하게 묶는다.
      // 이후 currentLocation 이 늦게 resolve 되어도 markerCenter 가 흔들리지 않게 함.
      setMarkerCenter((prev) => prev ?? initialLocationRef.current);
    }

    const zoom = defaultLocation ? 16 : mapOptions?.zoom || (isMapExpansion ? 14 : 16);
    const options = getMapOptions(initialLocationRef.current, zoom);
    setZoomNumber(zoom);
    setMapOptions(options);
    // currentLocation 은 의도적으로 deps 에서 제외 — 늦게 도착해도 지도를 다시 움직이지 않기 위함.
    // 사용자가 명시적으로 "현재 위치" 버튼을 누르면 handleLocationRefetch 가 setMapOptions 를 직접 호출.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, isMapExpansion, defaultLocation]);
  useEffect(() => {
    if (!placeInfo) {
      if (!noModalUpdate) {
        updateQuery({
          modal: null,
        });
      }
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

  // 기준점 초기화 + drift 감지. currentMapCenter 가 markerCenter 에서 3km 이상
  // 멀어진 경우에만 markerCenter 를 갱신. naver map idle 이후에만 currentMapCenter
  // 가 갱신되므로, 지도 이동 중 실시간 refilter 가 발생하지 않음.
  useEffect(() => {
    if (!markerCenter) {
      // 우선순위: initialLocationRef.current(지도 초기 중심과 동일) > defaultLocation > currentMapCenter.
      // currentLocation 은 직접 사용하지 않는다 — 늦게 resolve 되어도 기준점이 흔들리지 않게 하기 위함.
      // 일반적으로는 위 map-init effect 에서 이미 동기화되며, 이 분기는 fallback.
      if (initialLocationRef.current) {
        setMarkerCenter(initialLocationRef.current);
      } else if (defaultLocation) {
        setMarkerCenter({ lat: defaultLocation.lat, lon: defaultLocation.lon });
      } else if (currentMapCenter) {
        setMarkerCenter(currentMapCenter);
      }
      return;
    }
    if (!currentMapCenter) return;
    const drift = getDistanceFromLatLonInKm(
      markerCenter.lat,
      markerCenter.lon,
      currentMapCenter.lat,
      currentMapCenter.lon,
    );
    if (drift >= 3) {
      setMarkerCenter(currentMapCenter);
    }
  }, [currentMapCenter, markerCenter, defaultLocation]);

  // markerCenter 기준 markerRadiusKm 이내 place 만 추출. placeData / markerCenter /
  // markerRadiusKm 가 바뀔 때만 재계산. currentMapCenter 가 계속 흔들려도 영향 없음.
  const visiblePlaceData = useMemo(() => {
    if (!placeData?.length) return [];

    let result = placeData;

    if (filterType === "about") {
      result = result.filter((place) => place.pick === selectedPickNickname);
    } else if (markerCenter) {
      result = result.filter((place) => {
        const d = getDistanceFromLatLonInKm(
          markerCenter.lat,
          markerCenter.lon,
          place.location.latitude,
          place.location.longitude,
        );
        return d < markerRadiusKm;
      });
    }

    if (amenityFilters.length > 0) {
      result = result.filter((place) =>
        amenityFilters.every((f) => {
          if (f === "hasGroupSeats") return place.studyCafeMeta?.hasGroupSeats === true;
          if (f === "hasWifi") return place.studyCafeMeta?.hasGoodWifi === true;
          if (f === "is24Hours") return place.studyCafeMeta?.is24Hours === true;
          if (f === "hasParking") return place.studyCafeMeta?.hasParking === true;
          if (f === "isUsuallySpacious") {
            const ratings = place.ratings;
            if (!ratings?.length) {
              if (place.rating >= 4) {
                return true;
              } else {
                return false;
              }
            }
            const avgSpace = ratings.reduce((acc, r) => acc + r.space, 0) / ratings.length;
            return avgSpace >= 4;
          }
          return true;
        }),
      );
    }

    return result;
  }, [placeData, markerCenter, markerRadiusKm, filterType, amenityFilters, selectedPickNickname]);
  useEffect(() => {}, [currentMapCenter, markerCenter]);

  useEffect(() => {
    if (!visiblePlaceData.length) return;
    setMarkersOptions(
      getStudyPlaceMarkersOptions(
        visiblePlaceData,
        null,
        zoomNumber,
        isMapExpansion && !defaultLocation ? currentLocation : null,
        defaultLocation,
      ),
    );
  }, [visiblePlaceData, zoomNumber, currentLocation, defaultLocation, isMapExpansion]);

  const handleMarker = useCallback(
    (id: string, currentZoom: number, ids?: string[]) => {
      if (ids && ids.length > 1) {
        setIds(ids);
        setDrawerType("list");
        if (!noModalUpdate) {
          updateQuery({
            modal: "list",
          });
        }
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
      if (!noModalUpdate) {
        updateQuery({
          modal: "placeDrawer",
        });
      }
    },
    [placeData, updateQuery, noModalUpdate],
  );

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
    let touchStartedInScrollable = false;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      let el = e.target as HTMLElement | null;
      touchStartedInScrollable = false;
      while (el && el !== document.body) {
        const { overflowY, overflowX } = getComputedStyle(el);
        if (
          ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) ||
          ((overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth)
        ) {
          touchStartedInScrollable = true;
          break;
        }
        el = el.parentElement;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const deltaY = y - startY;
      if (!touchStartedInScrollable && window.scrollY <= 0 && deltaY > 0) {
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
    if (filterType === "about" && selectedPickNickname) {
      setZoomNumber(11);
      setMapOptions((prev) => (prev ? { ...prev, zoom: 11 } : prev));
      setDrawerType("about");
    } else if (filterType !== "about") {
      setDrawerType((prev) => (prev === "about" ? null : prev));
    }
  }, [filterType, selectedPickNickname]);

  useEffect(() => {
    if (!isMapExpansion) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [isMapExpansion, filterType]);

  // CafeListDrawer로 넘길 정렬된 placeData. 부모 리렌더마다 새 배열이 만들어지는
  // 것을 막고, filter 안에서 cache 객체를 mutate 하던 side-effect도 제거.
  const sortedListPlaces = useMemo(() => {
    if (!placeData) return undefined;
    if (ids.length) {
      return placeData.filter((place) => ids.includes(place._id));
    }
    const centerLat = currentMapCenter?.lat ?? mapOptions?.center?.y;
    const centerLon = currentMapCenter?.lon ?? mapOptions?.center?.x;
    if (centerLat == null || centerLon == null) return [];
    return placeData
      .map((place) => ({
        place,
        diffKm: getDistanceFromLatLonInKm(
          centerLat,
          centerLon,
          place.location.latitude,
          place.location.longitude,
        ),
      }))
      .filter((entry) => entry.diffKm < viewportRadiusKm)
      .sort((a, b) => a.diffKm - b.diffKm)
      .map((entry) => entry.place);
  }, [
    placeData,
    ids,
    currentMapCenter?.lat,
    currentMapCenter?.lon,
    mapOptions?.center?.y,
    mapOptions?.center?.x,
    viewportRadiusKm,
  ]);

  return (
    <>
      <Box>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          mx={!isMapExpansion ? 5 : 0}
          top={0}
          left={0}
          zIndex={
            noModalUpdate ? 3500 : isDefaultOpen && !isDown ? 1000 : isMapExpansion ? 1000 : 0
          }
          {...(!isMapExpansion ? { aspectRatio: 1 / 1, height: "inherit" } : { bottom: 0 })}
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
            <StudyMapNav
              isCafeMap={isCafeMap}
              isMainType={type === "mainPlace"}
              isMapExpansion={isMapExpansion}
              hasBackButton={hasBackButton}
              handleCenterLocation={(location, zoomBoost = 0) => {
                const newZoom = zoomNumber + zoomBoost;
                if (zoomBoost > 0) setZoomNumber(newZoom);
                setMapOptions(getMapOptions(location, newZoom));
              }}
              openMenu={() => {
                updateQuery({ modal: "menu" });
                setDrawerType("menu");
              }}
              addCafe={() => {
                updateQuery({ modal: "addCafe" });
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
              openList={() => {
                if (filterType === "about") {
                  setDrawerType("about");
                  return;
                }
                updateQuery({ modal: "list" });
                setDrawerType("list");
              }}
              onClose={() => {
                if (onClose) {
                  if (!noModalUpdate) updateQuery({ modal: undefined });
                  if (isMapExpansion) setIsMapExpansion(false);
                  onClose();
                } else {
                  router.back();
                  setIsMapExpansion(false);
                }
              }}
              filterType={filterType}
              setFilterType={setFilterType}
              amenityFilters={amenityFilters}
              setAmenityFilters={setAmenityFilters}
              selectedPickNickname={selectedPickNickname}
              setSelectedPickNickname={setSelectedPickNickname}
              openAboutDrawer={() => setDrawerType("about")}
              onCafeSearch={(result) => {
                const existingPlace = placeData?.find((p) => {
                  if (p.location.name === result.title) return true;
                  const dist = getDistanceFromLatLonInKm(
                    result.latitude,
                    result.longitude,
                    p.location.latitude,
                    p.location.longitude,
                  );
                  return dist < 0.1;
                });
                if (existingPlace) {
                  setSelectedPlaceId(existingPlace._id);
                  setPlaceInfo(existingPlace);
                  setDrawerType("placeInfo");
                  if (!noModalUpdate) updateQuery({ modal: "placeDrawer" });
                } else {
                  setUnregisteredCafe(result);
                }
              }}
              pickReviewPlace={(place: StudyPlaceProps) => {
                setReviewPlaceInfo(place);
                updateQuery({ modal: "reviewPlace" });
              }}
            />

            <VoteMap
              mapOptions={mapOptions}
              markersOptions={markersOptions}
              resizeToggle={isMapExpansion}
              handleMarker={handleMarker}
              selectedMarkerId={selectedPlaceId}
              zoomChange={(zoom: number) => setZoomNumber(zoom)}
              centerChange={handleCenterChange}
            />

            {((isLoading && !isLoading2) || (isLoadingLocation && tempToggle)) && (
              <MainLoadingAbsolute size="sm" />
            )}
          </ClipLayer>
        </Box>
      </Box>
      {drawerType === "addCafe" && (
        <LocationAddDrawer
          placeArr={placeData}
          prefilledLocation={prefilledCafeLocation}
          onClose={() => {
            router.back();
            setDrawerType(null);
            setPrefilledCafeLocation(null);
          }}
        />
      )}
      {unregisteredCafe && (
        <ModalLayout
          title={unregisteredCafe.title}
          footerOptions={{
            main: {
              text: "장소 등록",
              func: () => {
                setPrefilledCafeLocation({
                  name: unregisteredCafe.title,
                  address: unregisteredCafe.address ?? unregisteredCafe.roadAddress ?? "",
                  latitude: unregisteredCafe.latitude,
                  longitude: unregisteredCafe.longitude,
                });
                setUnregisteredCafe(null);
                updateQuery({ modal: "addCafe" });
                setDrawerType("addCafe");
              },
            },
            sub: {
              text: "닫 기",
              func: () => {
                setUnregisteredCafe(null);
              },
            },
          }}
          setIsModal={() => setUnregisteredCafe(null)}
        >
          카공지도에 존재하지 않는 카페입니다.
          <br />
          해당 카페를 카공지도에 추가할까요?
        </ModalLayout>
      )}
      {/* {unregisteredCafe && (
        <Modal isOpen onClose={() => setUnregisteredCafe(null)} isCentered>
          <ModalOverlay />
          <ModalContent mx={4} borderRadius="16px">
            <ModalHeader fontSize="16px" fontWeight={700} pb={1}>
              {unregisteredCafe.title}
            </ModalHeader>
            <ModalBody pb={4}>
              <Text fontSize="14px" color="gray.700" fontWeight={500}>
                등록되지 않은 카페입니다.
              </Text>
              <Text fontSize="12px" color="gray.400" mt={1}>
                {unregisteredCafe.address ?? unregisteredCafe.roadAddress}
              </Text>
            </ModalBody>
            <ModalFooter gap={2} pt={0}>
              <Button
                flex={1}
                variant="outline"
                borderColor="gray.200"
                fontSize="14px"
                h="48px"
                onClick={() => setUnregisteredCafe(null)}
              >
                취소
              </Button>
              <Button
                flex={1}
                colorScheme="mint"
                fontSize="14px"
                h="48px"
                onClick={() => {
                  setPrefilledCafeLocation({
                    name: unregisteredCafe.title,
                    address: unregisteredCafe.address ?? unregisteredCafe.roadAddress ?? "",
                    latitude: unregisteredCafe.latitude,
                    longitude: unregisteredCafe.longitude,
                  });
                  setUnregisteredCafe(null);
                  updateQuery({ modal: "addCafe" });
                  setDrawerType("addCafe");
                }}
              >
                카페 등록
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )} */}
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
            if (!noModalUpdate) router.back();
          }}
          isDown={isDown}
          isChange={!!defaultLocation}
          pickReviewPlace={(place: StudyPlaceProps) => {
            setReviewPlaceInfo(place);
            updateQuery({
              modal: "reviewPlace",
            });
          }}
          zIndex={noModalUpdate ? 4000 : 1000}
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
          pickReviewPlace={(place: StudyPlaceProps) => {
            setReviewPlaceInfo(place);
            updateQuery({
              modal: "reviewPlace",
            });
          }}
          placeData={sortedListPlaces}
          radiusKm={viewportRadiusKm}
        />
      )}
      {drawerType === "about" && (
        <CafeListDrawer
          type="about"
          onClose={() => setDrawerType(null)}
          pickReviewPlace={(place: StudyPlaceProps) => {
            setReviewPlaceInfo(place);
            updateQuery({ modal: "reviewPlace" });
          }}
          placeData={placeData?.filter((p) => p.pick === selectedPickNickname) ?? []}
          pickNickname={selectedPickNickname}
          pickTitle={ARCHIVE_OPTIONS.find((o) => o.nickname === selectedPickNickname)?.title}
          pickSubtitle={ARCHIVE_OPTIONS.find((o) => o.nickname === selectedPickNickname)?.subtitle}
        />
      )}
      {reviewPlaceInfo && (
        <StudyReviewDrawer
          placeInfo={reviewPlaceInfo}
          onClose={() => {
            router.back();
            setReviewPlaceInfo(null);
          }}
          zIndex={3000}
          handleClick={() => {
            updateQuery({
              modal: "addReview",
            });
          }}
        />
      )}
      {modalParam === "addReview" && reviewPlaceInfo && (
        <RightReviewDrawer
          placeId={reviewPlaceInfo._id}
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
  position: relative;
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
