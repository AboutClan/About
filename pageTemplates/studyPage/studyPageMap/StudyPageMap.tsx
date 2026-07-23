import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import VoteMap from "../../../components/organisms/VoteMap";
import { MOCK_KAGONGJOK_PLACES } from "../../../constants/service/study/mockKagongjokPlaces";
import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useToast } from "../../../hooks/custom/CustomToast";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { isKagongjokPlace } from "../../../libs/study/kagongjokUtils";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../../libs/study/setStudyMapOptions";
import { getPlaceScore } from "../../../libs/study/studyUtils";
import { ModalLayout } from "../../../modals/Modals";
import { CoordinatesProps } from "../../../types/common";
import { IMapOptions, IMarkerOptions } from "../../../types/externals/naverMapTypes";
import {
  PlaceTypeFilter,
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import {
  getDistanceFromLatLonInKm,
  getPreciseDistanceFromLatLonInKm,
} from "../../../utils/mathUtils";
import { getSafeAreaBottom } from "../../../utils/validationUtils";
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
  isCafeMap,
  defaultLocation,
  hasBackButton = false,
  noModalUpdate = false,
}: StudyPageMapProps) {
  const router = useRouter();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const {
    currentLocation: currentLocation2,
    refetchCurrentLocation,
    isLoadingLocation,
  } = useUserCurrentLocation();
  const modalParam = router.query.modal;
  const currentLocation = defaultLocation || currentLocation2;
  const { updateQuery, replaceQuery } = useOverlayRouter();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading2TimedOut, setLoading2TimedOut] = useState(false);
  // naver SDK가 준비된 시점(VoteMap에서 map 생성 완료)을 감지해 마커 재계산을 트리거
  const [naverReadyTick, setNaverReadyTick] = useState(0);
  const [pickCenter, setPickCenter] = useState<{ lat: number; lng: number } | null>(null);
  const wasPickFilterRef = useRef(false);
  const currentLocationRef = useRef(currentLocation);
  currentLocationRef.current = currentLocation;
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
  const [filterType, setFilterType] = useState<StudyPlaceFilter>("all");
  // 전체 장소 / 일반 카페 / 카공족 — 품질 필터(filterType)와는 별도 축.
  const [placeTypeFilter, setPlaceTypeFilter] = useState<PlaceTypeFilter>("all");
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

  const placeDataRef = useRef<typeof placeData>(undefined);

  const { data: rawPlaceData, isLoading: isLoading2 } = useStudyPlacesQuery("all");
  // 카공족 실제 데이터 연동 전 UI 데모용 임시 병합. 실제 연동 시 이 useMemo와
  // mockKagongjokPlaces.ts 파일만 제거하면 원상복구된다. 서버 응답 배열/객체는 직접 변경하지 않음.
  const placeData = useMemo(
    () => (rawPlaceData ? [...rawPlaceData, ...MOCK_KAGONGJOK_PLACES] : rawPlaceData),
    [rawPlaceData],
  );
  placeDataRef.current = placeData;

  // PICK 아카이브 선택 시 필터된 장소들의 중심점으로 지도 이동
  // placeDataRef 로 stale closure 없이 항상 최신 데이터 사용
  const applyPickCentroid = useCallback((nickname: string) => {
    const filtered = placeDataRef.current?.filter((p) => p.pick === nickname);

    if (!filtered?.length) return;
    const lat = filtered.reduce((sum, p) => sum + p.location.latitude, 0) / filtered.length;
    const lon = filtered.reduce((sum, p) => sum + p.location.longitude, 0) / filtered.length;

    const zoom = 11;
    setZoomNumber(zoom);
    const opts = getMapOptions({ lat, lon }, zoom);

    if (opts) setMapOptions(opts);
    setPickCenter({ lat, lng: lon });
  }, []);

  // 현재 위치에서 가장 가까운 카페를 찾는다. onCafeSearch 의 동일 장소 판정 기준(0.1km)과 동일한
  // 오차 범위 안에 있어야 "이 장소"로 추정한다.
  const findNearestPlace = useCallback((coords: { lat: number; lon: number }) => {
    const list = placeDataRef.current;
    if (!list?.length) return null;

    let nearest: StudyPlaceProps | null = null;
    let minDist = Infinity;
    for (const place of list) {
      // 후보 카페 간 거리 차이가 수십 m 단위로 갈릴 수 있어, 반올림 없는 정밀 거리로 비교한다.
      const dist = getPreciseDistanceFromLatLonInKm(
        coords.lat,
        coords.lon,
        place.location.latitude,
        place.location.longitude,
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = place;
      }
    }
    return minDist <= 0.1 ? nearest : null;
  }, []);

  // 후기 게시판을 거치지 않고 곧바로 "카공 장소 별점 남기기" 작성 폼으로 이동한다.
  // opts.replace: LocationAddDrawer(addCafe)에서 "이미 등록된 장소"로 판정되어 넘어오는 경우,
  // addCafe 히스토리 엔트리를 addReview로 대체해야 리뷰 작성 완료 후 뒤로가기를 눌러도
  // addCafe 드로어가 다시 열리지 않는다.
  const openReviewForm = useCallback(
    (place: StudyPlaceProps, opts?: { replace?: boolean }) => {
      setReviewPlaceInfo(place);
      if (opts?.replace) {
        replaceQuery({ modal: "addReview" });
      } else {
        updateQuery({ modal: "addReview" });
      }
    },
    [updateQuery, replaceQuery],
  );

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

  // 위치 권한이 이미 granted 인 경우 currentLocation 이 userInfo 보다 먼저 resolve 되면 즉시 초기화.
  // initialLocationRef 가 아직 비어있을 때만 실행되어 userInfo effect 와 충돌하지 않는다.
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

    if (filterType === "good") {
      result = result.filter((place) => getPlaceScore(place.ratings).total >= 4.0);
    }

    if (placeTypeFilter === "cafe") {
      result = result.filter((place) => !isKagongjokPlace(place));
    } else if (placeTypeFilter === "kagongjok") {
      result = result.filter((place) => isKagongjokPlace(place));
    }

    if (amenityFilters.length > 0) {
      result = result.filter((place) =>
        amenityFilters.every((f) => {
          if (f === "hasGroupSeats") return place.studyCafeMeta?.hasGroupSeats === true;
          if (f === "hasWifi") return place.studyCafeMeta?.hasGoodWifi === true;
          if (f === "is24Hours") return place.studyCafeMeta?.is24Hours === true;
          if (f === "hasParking") return place.studyCafeMeta?.hasParking === true;
          if (f === "isUsuallySpacious") {
            return getPlaceScore(place.ratings).space >= 4;
          }
          return true;
        }),
      );
    }

    return result;
  }, [
    placeData,
    markerCenter,
    markerRadiusKm,
    filterType,
    amenityFilters,
    selectedPickNickname,
    placeTypeFilter,
  ]);
  useEffect(() => {
    if (!visiblePlaceData.length) {
      setMarkersOptions([]);
      return;
    }
    setMarkersOptions(
      getStudyPlaceMarkersOptions(
        visiblePlaceData,
        null,
        zoomNumber,
        isMapExpansion && !defaultLocation ? currentLocation : null,
        defaultLocation,
      ),
    );
  }, [
    visiblePlaceData,
    zoomNumber,
    currentLocation,
    defaultLocation,
    isMapExpansion,
    naverReadyTick,
  ]);

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
      wasPickFilterRef.current = true;
      applyPickCentroid(selectedPickNickname);
      setDrawerType("about");
    } else if (filterType !== "about") {
      if (wasPickFilterRef.current) {
        wasPickFilterRef.current = false;
        const loc = currentLocationRef.current;
        if (loc) {
          const opts = getMapOptions(loc, 14);
          if (opts) {
            setMapOptions(opts);
            setZoomNumber(14);
          }
        }
      }
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

  // isLoading2(데이터 쿼리)가 5초 초과 시 로딩 오버레이를 강제 숨김
  useEffect(() => {
    if (!isLoading2) {
      setLoading2TimedOut(false);
      return;
    }
    setLoading2TimedOut(false);
    const timer = setTimeout(() => setLoading2TimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [isLoading2]);

  // CafeListDrawer로 넘길 정렬된 placeData. 부모 리렌더마다 새 배열이 만들어지는
  // 것을 막고, filter 안에서 cache 객체를 mutate 하던 side-effect도 제거.
  const sortedListPlaces = useMemo(() => {
    if (!placeData) return undefined;
    const typeFiltered =
      placeTypeFilter === "cafe"
        ? placeData.filter((place) => !isKagongjokPlace(place))
        : placeTypeFilter === "kagongjok"
        ? placeData.filter((place) => isKagongjokPlace(place))
        : placeData;

    if (ids.length) {
      return typeFiltered.filter((place) => ids.includes(place._id));
    }
    const centerLat = currentMapCenter?.lat ?? mapOptions?.center?.y;
    const centerLon = currentMapCenter?.lon ?? mapOptions?.center?.x;
    if (centerLat == null || centerLon == null) return [];
    return typeFiltered
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
    placeTypeFilter,
  ]);

  return (
    <>
      <Box>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          mx={!isMapExpansion ? 5 : "auto"}
          top={0}
          left={0}
          right={isMapExpansion ? 0 : undefined}
          maxW={isMapExpansion ? "var(--max-width)" : undefined}
          zIndex={
            noModalUpdate ? 3500 : isDefaultOpen && !isDown ? 1000 : isMapExpansion ? 1000 : 0
          }
          {...(!isMapExpansion
            ? { aspectRatio: 1 / 1, height: "inherit" }
            : { bottom: isCafeMap ? getSafeAreaBottom(52) : 0 })}
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
                if (!newPos) {
                  toast("error", "위치 정보를 확인할 수 없습니다.");
                  return null;
                }
                if (typeof window !== "undefined" && "naver" in window) {
                  const center = new naver.maps.LatLng(newPos.lat, newPos.lon);
                  setMapOptions((prev) => (prev ? { ...prev, center } : getMapOptions(newPos, 13)));
                }
                return newPos;
              }}
              findNearestPlace={findNearestPlace}
              openList={() => {
                if (filterType === "about") {
                  applyPickCentroid(selectedPickNickname);
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
              placeTypeFilter={placeTypeFilter}
              setPlaceTypeFilter={setPlaceTypeFilter}
              amenityFilters={amenityFilters}
              setAmenityFilters={setAmenityFilters}
              selectedPickNickname={selectedPickNickname}
              setSelectedPickNickname={setSelectedPickNickname}
              openAboutDrawer={() => setDrawerType("about")}
              pickReviewPlace={(place) => {
                setReviewPlaceInfo(place);
                updateQuery({ modal: "reviewPlace" });
              }}
              openReviewForm={openReviewForm}
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
            />

            <VoteMap
              mapOptions={mapOptions}
              markersOptions={markersOptions}
              resizeToggle={isMapExpansion}
              handleMarker={handleMarker}
              selectedMarkerId={selectedPlaceId}
              zoomChange={(zoom: number) => setZoomNumber(zoom)}
              centerChange={handleCenterChange}
              centerValue={pickCenter}
              onMapReady={() => setNaverReadyTick((t) => t + 1)}
            />
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
          onExistingPlace={(place) => openReviewForm(place, { replace: true })}
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

      {(isLoading || (isLoading2 && !loading2TimedOut) || (isLoadingLocation && tempToggle)) && (
        <>
          <ScreenOverlay zIndex={2000} />
          <MainLoading
            top={isCafeMap ? "calc(50dvh + 30px - env(safe-area-inset-bottom, 0px) / 2)" : "50%"}
          />
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

export function CafeMapLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="_레이어_2"
      data-name="레이어 2"
      viewBox="0 0 305.17 82.31"
      height="32"
    >
      <g id="_레이어_1-2" data-name="레이어 1">
        <g>
          <path
            fill="#25b5a8"
            d="M140.92,34.53c-.22,0-.68.05-1.54.16-1.42.17-3.57.43-5.05.43h-2.19V15.48c0-.85-.58-1.18-1.2-1.4-1.8-.68-5.8-1.43-7.65-1.43-.47,0-.83.2-1.06.57-.29.43-.66,1.58-.83,2.26l-.13.5.51.11c1.62.35,3.22,1.03,3.83,1.49.66.49.79.59.79,1.23v50.69l.42.07c.47.08,1.06.11,1.63.11.82,0,1.61-.07,2.02-.18.88-.22.97-1.03,1.02-1.42.24-2.04.65-6.15.65-8.64v-19.64h9.56l.11-.35c.35-1.11.72-2.82.72-3.59,0-1.32-1.01-1.32-1.61-1.32Z"
          />
          <path
            fill="#25b5a8"
            d="M118.09,20.81c-.57,0-1.41.05-2.3.11-.99.06-2.02.13-2.77.13h-12.96c-2.11,0-4.29.01-6.22-.34l-.31-.06-.18.26c-.29.4-.97,1.87-.97,2.33,0,.43.29.73.45.89.56.53,2.07,1.84,3.94,2.66l.18.08.19-.06c1.44-.5,2.58-.79,4.1-.79h11.71c-.96,2.48-2.06,4.74-3.29,6.71h-11.04c-2.11,0-4.29.01-6.22-.34l-.31-.06-.18.26c-.27.38-.97,1.79-.97,2.28,0,.44.3.74.45.89.56.53,2.07,1.84,3.93,2.66l.18.08.18-.06c1.45-.5,2.58-.79,4.1-.79h6.38c-4.08,5.04-9.44,9.47-15.55,12.84l-.42.23.21.43c.47.95,1.43,2.28,1.9,2.76.22.22.54.43.98.43.24,0,.52-.06.83-.22,11.97-6.3,22.78-19.08,25.71-30.38.25-.95.16-1.73-.25-2.26-.23-.29-.67-.65-1.46-.65Z"
          />
          <path
            fill="#25b5a8"
            d="M170.63,47.2c-9.18,0-13.99,5.8-13.99,11.53s4.8,11.53,13.99,11.53,13.99-5.8,13.99-11.53-4.8-11.53-13.99-11.53ZM178.89,58.73c0,3.33-2.55,6.68-8.26,6.68s-8.26-3.36-8.26-6.68,2.55-6.68,8.26-6.68,8.26,3.35,8.26,6.68Z"
          />
          <path
            fill="#25b5a8"
            d="M157.23,22.29l.18.08.19-.06c2.25-.71,3.42-.85,4.58-.85h19.62c-.24,4.78-.78,11.03-1.31,15.08l-.06.44.43.11c.62.15,1.97.26,2.83.26.2,0,.37,0,.5-.02.59-.07,1.04-.28,1.3-1.07,1.54-5.81,2.41-16.45,2.41-17.82s-.7-2.13-1.96-2.13c-.75,0-1.82.07-2.87.15-1.03.07-2.08.14-2.8.14h-18.51c-2.97,0-5.62-.05-7.93-.63l-.32-.08-.2.26c-.18.23-1.1,1.53-1.1,2.12s.36.92.5,1.05c1.04,1.04,2.61,2.07,4.52,2.96Z"
          />
          <path
            fill="#25b5a8"
            d="M195.33,39.03c-.23,0-.8.04-1.62.11-1.97.16-5.25.42-8.42.42h-12.29v-9.95c0-.9-.61-1.14-1.18-1.3-1.82-.53-4.8-.89-6.33-.89-.47,0-.83.2-1.08.6-.28.49-.58,1.44-.7,2.21l-.07.47.46.1c1.69.36,2.44.78,3.05,1.29.23.2.35.42.35,1.08v6.39h-12.34c-4.62,0-6.84-.06-10.31-.63l-.29-.05-.18.24c-.43.56-1.16,1.57-1.16,2.12,0,.51.37.93.49,1.05,1.63,1.69,3.89,2.75,5.5,3.33l.15.06.16-.05c2.17-.63,4.29-1.21,6.4-1.21h30.77c2.47,0,5.21.12,7.62.23l1.79.08.12-.37c.37-1.18.72-3.26.72-4,0-1.32-1.01-1.32-1.61-1.32Z"
          />
          <path
            fill="#25b5a8"
            d="M222.07,35.76c3.39-4.45,5.58-8.51,6.49-12.05.25-.95.16-1.73-.25-2.26-.23-.29-.67-.65-1.46-.65-.57,0-1.41.05-2.3.11-.99.06-2.02.13-2.77.13h-11.79c-2.11,0-4.29.01-6.22-.34l-.31-.06-.18.26c-.27.38-.97,1.79-.97,2.27,0,.44.3.74.45.89.56.53,2.08,1.84,3.94,2.66l.18.08.19-.06c1.44-.5,2.58-.79,4.1-.79h10.46c-3.77,8.63-13.6,18.18-21.58,23.31l-.4.26.24.41c.46.8,1.37,2.15,1.71,2.5.28.28.64.42,1.02.42.31,0,.62-.09.92-.28,4.71-2.57,10.64-7.58,15.57-13.16,3.94,4.68,6.33,7.6,10.36,12.68l.3.38.39-.29c.99-.74,2.36-2.01,3.06-2.82.55-.64.54-1.34-.03-1.9-4.47-4.47-6.98-7.16-11.09-11.7Z"
          />
          <path
            fill="#25b5a8"
            d="M242.21,14.07c-1.8-.68-5.8-1.43-7.65-1.43-.47,0-.83.2-1.06.57-.29.44-.66,1.58-.83,2.26l-.12.5.51.11c1.62.35,3.22,1.03,3.83,1.49.66.49.79.59.79,1.23v50.69l.42.07c.47.08,1.06.11,1.63.11.82,0,1.62-.07,2.02-.18.88-.22.97-1.03,1.02-1.42.24-2.04.65-6.15.65-8.64V15.48c0-.85-.58-1.18-1.2-1.4Z"
          />
          <path
            fill="#25b5a8"
            d="M303.56,51.64c-.23,0-.8.04-1.62.11-1.97.16-5.25.42-8.42.42h-11.53v-9.68h13.35l.11-.34c.36-1.09.67-3.17.67-3.9,0-1.32-1.01-1.32-1.61-1.32-.22,0-.75.06-1.74.17-1.62.19-4.06.47-5.5.47h-18.77v-13.42h25.95l.12-.33c.36-1.01.67-3.11.67-3.84,0-1.2-1.05-1.2-1.49-1.2-.26,0-.9.06-2.02.16-1.47.13-3.48.31-4.46.31h-19.73c-.78,0-2.05-.11-3.28-.21-1.23-.1-2.4-.2-3.14-.2-.68,0-1.54.51-1.78,2.96l-.05.48.48.06c2.1.28,2.95.88,2.95,2.07v14.01c0,1.74.39,4.06,3.77,4.06h9.77v9.68h-12.87c-4.62,0-6.84-.06-10.31-.64l-.29-.05-.18.23c-.43.55-1.16,1.57-1.16,2.12s.4.96.49,1.05c1.32,1.38,3.28,2.58,5.5,3.39l.15.06.16-.05c2.17-.63,4.29-1.21,6.4-1.21h30.77c2.47,0,5.21.12,7.62.23l1.79.08.12-.37c.37-1.16.72-3.31.72-4.06,0-1.32-1.01-1.32-1.61-1.32Z"
          />
        </g>

        <path
          fill="#2eb6aa"
          d="M1.04,81.28l18.05-3.3,16.86,4.31c.08.02.15.03.24.03.08,0,.16,0,.23-.03l16.86-4.31,18.05,3.3c.36.07.71-.07.93-.35.21-.28.26-.66.11-.98l-8.76-19.33c-.11-.24-.3-.41-.54-.5l-10.42-3.73c-.37.54-.74,1.08-1.11,1.62l10.51,3.76,7.85,17.31-16.46-3.02c-.14-.03-.28-.02-.41.01l-16.82,4.3-16.83-4.3c-.08-.02-.15-.03-.23-.03-.06,0-.11,0-.17.01l-16.47,3.02,7.85-17.31,10.5-3.76c-.37-.54-.74-1.08-1.1-1.62l-10.42,3.73c-.24.09-.44.27-.55.5L0,79.96"
        />
        <path
          fill="#2eb6aa"
          d="M63.92,74.89l-11.21-2.27-16.52,4.53-16.52-4.53-11.22,2.27,4.65-10.98,7.94-2.62,3.85.98c4.89,5.33,8.87,9,9.17,9.28.6.56,1.38.84,2.14.84s1.54-.29,2.15-.84c.3-.27,4.27-3.95,9.17-9.28l3.83-.98,7.94,2.62,4.65,10.98Z"
        />
        <path
          fill="#c4e5e7"
          d="M31.23,64.36c.39.4.77.78,1.12,1.14-.35-.36-.73-.74-1.12-1.14ZM63.23,23.2s0-.1-.03-.15C61.13,9.99,49.83,0,36.19,0S11.23,9.99,9.16,23.05c0,.05-.02.1-.03.15-.21,1.36-.31,2.75-.31,4.16,0,2.7.39,5.31,1.12,7.78,1.03,2.83,2.62,5.81,4.51,8.79l2.29-3.88c-2.39-3.65-3.77-8-3.77-12.69,0-10.05,6.38-18.6,15.31-21.83,0,0,0-.01,0-.02.04-.31.08-.58.2-.88.24-.58.8-1.63,1.4-1.87.38-.15.81.03.97.35.19.39.05.78-.29,1.03-.26.19-.37.52-.52.8,0,.02-.02.04-.03.05,1.65-.46,3.38-.73,5.16-.81.23-.44.51-.85.86-1.2.23-.23.51-.32.8-.26.27.06.52.29.56.58.07.5-.12.57-.39.87,1.51.05,2.98.25,4.41.57.15-.45.4-.85.65-1.25.13-.21.31-.37.48-.54.34-.33.83-.33,1.13-.03.34.34.28.85-.09,1.16-.32.28-.52.67-.67,1.06,9.54,2.88,16.49,11.74,16.49,22.22,0,4.68-1.39,9.04-3.77,12.68l2.29,3.88c1.89-2.97,3.47-5.95,4.51-8.79.73-2.46,1.12-5.08,1.12-7.78,0-1.42-.11-2.81-.32-4.16Z"
        />
        <path
          fill="#c4e5e7"
          d="M55.95,46.87c-2.47,3.53-5.25,6.98-7.94,10.06-.38.44-.75.86-1.13,1.28-.19.21-.37.41-.56.62s-.37.41-.55.61c-1.44,1.59-2.8,3.04-4.03,4.31-3.26,3.36-5.56,5.47-5.56,5.47,0,0-1.51-1.39-3.83-3.72-.35-.36-.73-.74-1.12-1.14-.1-.1-.2-.2-.3-.3-.1-.10-.2-.21-.3-.31-1.23-1.27-2.59-2.71-4.03-4.3-.18-.2-.36-.41-.55-.61-.55-.62-1.11-1.25-1.69-1.91-2.68-3.09-5.47-6.53-7.95-10.06h7.18c3.63,2.34,7.95,3.7,12.59,3.7s8.96-1.36,12.58-3.7h7.18Z"
        />
        <polygon fill="#fff" points="41.93 44.69 30.44 44.69 31.34 42.56 41.03 42.56 41.93 44.69" />
        <path
          fill="#fff"
          d="M19.97,17.78h32.43c.1,0,.19.08.19.19v18.24c0,.1-.08.18-.18.18H19.97c-.1,0-.19-.08-.19-.19v-18.24c0-.1.08-.18.18-.18Z"
        />

        <g>
          <g>
            <path
              fill="#2eb6aa"
              d="M53.83,15.73H18.54c-.47,0-.84.38-.84.84v21.88h36.98v-21.88c0-.47-.38-.84-.84-.84ZM52.59,36.21c0,.1-.08.19-.18.19H19.97c-.1,0-.18-.09-.18-.19v-18.24c0-.1.08-.19.18-.19h32.44c.1,0,.18.08.18.19v18.24Z"
            />
            <path
              fill="#24b5a8"
              d="M19.97,17.78h32.43c.1,0,.19.08.19.19v18.24c0,.1-.08.18-.18.18H19.97c-.1,0-.19-.08-.19-.19v-18.24c0-.1.08-.18.18-.18Z"
            />
            <polygon
              fill="#7ac8c4"
              points="58.36 44.69 41.93 44.69 41.03 42.56 31.34 42.56 30.44 44.69 14.01 44.69 14.46 43.93 16.75 40.05 17.7 38.45 54.67 38.45 55.62 40.05 57.91 43.93 58.36 44.69"
            />
            <polygon
              fill="#7ac8c4"
              points="41.93 44.69 30.44 44.69 31.34 42.56 41.03 42.56 41.93 44.69"
            />
            <path
              fill="#2eb6aa"
              d="M58.36,44.69v1.51c0,.37-.3.67-.67.67H14.68c-.37,0-.67-.3-.67-.67v-1.51h44.35Z"
            />
            <path
              fill="#fff"
              d="M19.97,17.78h32.43c.1,0,.19.08.19.19v18.24c0,.1-.08.18-.18.18H19.97c-.1,0-.19-.08-.19-.19v-18.24c0-.1.08-.18.18-.18Z"
            />
            <polygon
              fill="#fff"
              points="41.93 44.69 30.44 44.69 31.34 42.56 41.03 42.56 41.93 44.69"
            />
          </g>

          <g id="Q7ipVE.tif">
            <path
              fill="#2eb6aa"
              d="M48.86,23.96c-.15-.86-.72-1.46-1.61-1.56-.25-.03-.5-.03-.76,0-.4.03-.78.17-1.16.28-.05.02-.12.02-.12-.05v-1.12c-.01-.36-.07-.61-.46-.69h-17.45c-.26.06-.42.22-.43.48-.02.5-.04.99,0,1.5l.03.39c0,.14,0,.29.02.44l.06.51c.18,1.46.63,3.05,1.25,4.38.58,1.24,1.27,2.28,2.22,3.26.51.53,1.07.99,1.7,1.38.07.04.15.06.19.15-.08.05-.16.04-.26.04h-6.77c-.13,0-.17.15-.17.24,0,.1.07.17.16.21l.92.34c.4.15,1.36.36,1.79.41l1.13.13c.18.02.35-.03.54.03h12.69c.45,0,.88-.05,1.31-.11l.58-.09c.88-.13,1.73-.38,2.56-.75.11-.05.1-.21.07-.29-.04-.09-.13-.12-.24-.12h-6.91s-.07-.03-.08-.04c-.01-.01.01-.06.04-.08,1.68-1.05,2.9-2.49,3.83-4.24.07-.12.15-.19.29-.17.1.01.49-.05.62-.07l.52-.09c.11-.02.21-.04.32-.07,1.56-.38,3.06-1.2,3.5-2.86.15-.58.18-1.19.08-1.78ZM47.32,26.46c-.66.74-1.67,1.11-2.63,1.28-.13.02-.48.1-.52.07-.02-.01-.05-.06-.03-.1.48-1.22.81-2.49.96-3.79,0-.07.05-.14.11-.17.48-.21,1.47-.52,1.98-.41.61.13.77.6.77,1.18,0,.74-.14,1.37-.64,1.93Z"
            />
          </g>
        </g>

        <g>
          <path
            fill="#2eb6aa"
            d="M31.63,11.45c-.17,1.01-.44,2-1.24,2.68-.32.27-.76.3-1.07.02-.27-.24-.37-.74-.07-1.04.37-.36.62-.73.72-1.23.1-.48.23-1.12.18-1.61-.07-.74-.33-1.22-.67-1.74-.12-.18-.25-.36-.38-.56-.49-.74-.91-1.54-.82-2.45,0,0,0-.01,0-.02.04-.31.08-.58.2-.88.24-.58.8-1.63,1.4-1.87.38-.15.81.03.97.35.19.39.05.78-.29,1.03-.26.19-.37.52-.52.8,0,.02-.02.04-.03.05-.57,1.11.28,1.93.97,3.08.17.28.33.59.46.92.08.21.11.39.16.6.14.63.12,1.23.02,1.86Z"
          />
          <path
            fill="#2eb6aa"
            d="M44.22,12.85c-.19.53-.5.98-.96,1.33-.36.28-.87.18-1.1-.16-.24-.35-.16-.78.17-1.06.36-.3.53-.77.63-1.23.29-1.39.22-2.12-.59-3.3-.02-.03-.04-.07-.07-.1-.38-.55-.75-1.08-.95-1.73-.22-.72-.18-1.02,0-1.69.02-.06.03-.12.05-.18.15-.45.4-.85.65-1.25.13-.21.31-.37.48-.54.34-.33.83-.33,1.13-.03.34.34.28.85-.09,1.16-.32.28-.52.67-.67,1.06,0,.03-.02.06-.03.09-.32.87.3,1.64.78,2.36.23.34.42.67.6,1.04.09.17.16.35.21.54.35,1.16.16,2.59-.24,3.68Z"
          />
          <path
            fill="#2eb6aa"
            d="M38.18,10.78c-.15,1.27-.35,2.61-1.42,3.41-.33.25-.77.18-1.03-.11-.24-.26-.26-.76.03-1.01.42-.37.62-.82.74-1.37.13-.62.17-1.26.08-1.9-.21-.64-.54-1.18-.92-1.71-.16-.23-.31-.46-.44-.68-.48-.86-.67-1.77-.25-2.81.06-.14.12-.28.19-.42.23-.44.51-.85.86-1.2.23-.23.51-.32.8-.26.27.06.52.29.56.58.07.5-.12.57-.39.87-.19.21-.42.52-.63,1.14-.25.72.18,1.36.67,2.09.44.66.94,1.4,1.06,2.35.05.34.11.67.07,1.03Z"
          />
        </g>
      </g>
    </svg>
  );
}
