import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IMapOptions, IMarkerOptions } from "@/types/externals/naverMapTypes";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";

const MIN_RADIUS_KM = 3;
const MIN_VIEWPORT_RADIUS_KM = 0.1; // 100m — 화면이 아무리 좁아도 0 으로 떨어지지 않게.
const MAX_RADIUS_KM = 1000;
const RADIUS_BUFFER = 1.25;
const DEFAULT_RADIUS_KM = 5;

interface VoteMapProps {
  mapOptions: IMapOptions;
  markersOptions: IMarkerOptions[];
  resizeToggle?: boolean;
  handleMarker?: (id: string, currentZoom: number, ids?: string[]) => void;
  zoomChange?: (zoom: number) => void;
  /** 지도 빈 곳을 탭했을 때 (마커 탭·드래그에는 호출되지 않음) */
  onMapClick?: () => void;
  centerChange?: (info: {
    lat: number;
    lon: number;
    radiusKm: number;
    viewportRadiusKm: number;
  }) => void;
  selectedMarkerId?: string | null;
  circleCenter?: {
    lat: number;
    lon: number;
    size?: "sm" | "md" | "lg";
  }[];
  /**
   * 이 점들이 모두 보이도록 지도를 맞춘다(mapOptions의 zoom보다 우선).
   * 매 렌더 새 배열이 되지 않도록 호출 측에서 useMemo로 감쌀 것.
   * getMapOptions의 minZoom(10)보다 더 넓은 범위는 담기지 않는다.
   */
  fitBounds?: { lat: number; lon: number }[];
  centerValue?: {
    lat: number;
    lng: number;
  };
  onMapReady?: () => void;
  /**
   * 이 좌표가 화면(viewport) 기준 targetY(px) 높이, 가로 가운데에 오도록 지도를 옮긴다
   * (헤더·드로어에 가려지지 않는 영역 가운데 맞추기용). zoom 이 있으면 먼저 그 줌까지 확대한다.
   * 같은 좌표를 다시 요청할 수 있게 매번 새 객체로 넘길 것.
   */
  focusRequest?: { lat: number; lon: number; targetY: number; zoom?: number } | null;
  /** focusRequest 이동이 끝났을 때, 그 좌표가 놓인 화면(viewport) 위치 */
  onFocusSettled?: (point: { x: number; y: number }) => void;
}

function VoteMap({
  mapOptions,
  markersOptions,
  resizeToggle,
  handleMarker,
  zoomChange,
  onMapClick,
  centerChange,
  selectedMarkerId,
  circleCenter,
  fitBounds,
  centerValue,
  onMapReady,
  focusRequest,
  onFocusSettled,
}: VoteMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  const mapElementsRef = useRef<{
    markers: naver.maps.Marker[];
    polylines: naver.maps.Polyline[];
    infoWindow: naver.maps.InfoWindow[];
    circles: naver.maps.Circle[];
  }>({
    markers: [],
    polylines: [],
    infoWindow: [],
    circles: [],
  });

  const markerMapRef = useRef<Record<string, naver.maps.Marker>>({});
  const markerIconMapRef = useRef<Record<string, naver.maps.MarkerOptions["icon"]>>({});
  const markerSelectedIconMapRef = useRef<Record<string, naver.maps.MarkerOptions["icon"]>>({});
  const prevSelectedMarkerIdRef = useRef<string | null>(null);

  // selectedMarkerId를 effect deps에 넣지 않고 ref로만 읽어, 마커 클릭 시
  // 마커 전체 destroy/recreate가 일어나지 않도록 한다. 아이콘 swap은 아래
  // 전용 effect([selectedMarkerId])에서 처리됨.
  const selectedMarkerIdRef = useRef<string | null>(selectedMarkerId);
  selectedMarkerIdRef.current = selectedMarkerId;

  // map 인스턴스가 생성된 시점을 effect deps 로 사용할 수 있도록 state 로 마킹.
  // 이게 없으면 idle / zoom_changed listener effect 가 첫 mount 에 mapInstance 가
  // 아직 null 이라 early-return 되어 리스너가 영영 등록되지 않는다.
  const [mapReady, setMapReady] = useState(false);

  // 부모가 매 렌더 새 콜백을 넘겨도 focus effect 가 다시 돌지 않게 ref 로 읽는다.
  const onFocusSettledRef = useRef(onFocusSettled);
  onFocusSettledRef.current = onFocusSettled;

  useEffect(() => {
    if (!mapRef.current || typeof naver === "undefined" || !mapOptions) return;

    if (!mapInstanceRef.current) {
      const map = new naver.maps.Map(mapRef.current, {
        ...mapOptions,
        logoControl: true,
        logoControlOptions: {
          position: naver.maps.Position.BOTTOM_LEFT,
        },
      });

      map.setZoom(mapOptions.zoom);
      mapInstanceRef.current = map;
      setMapReady(true);
      onMapReady?.();
      return;
    }

    mapInstanceRef.current.setOptions(mapOptions);
  }, [mapOptions]);

  // mapOptions가 갱신되면 setOptions가 zoom을 되돌려 놓기 때문에,
  // fitBounds도 그 뒤에 다시 적용해야 한다. (deps에 mapOptions가 없으면
  // 기준점을 추가한 직후 줌이 기본값으로 되돌아간다.)
  useEffect(() => {
    if (!mapReady || !fitBounds?.length || typeof naver === "undefined") return;

    const map = mapInstanceRef.current;
    if (!map) return;

    const lats = fitBounds.map((p) => p.lat);
    const lons = fitBounds.map((p) => p.lon);

    const bounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(Math.min(...lats), Math.min(...lons)),
      new naver.maps.LatLng(Math.max(...lats), Math.max(...lons)),
    );

    // 지도 컨테이너 레이아웃이 잡힌 뒤에 맞춰야 좁은 화면에서 계산이 어긋나지 않는다.
    const raf = requestAnimationFrame(() => {
      naver.maps.Event.trigger(map, "resize");
      map.fitBounds(bounds);
    });

    return () => cancelAnimationFrame(raf);
  }, [fitBounds, mapReady, mapOptions]);

  useEffect(() => {
    if (!mapInstanceRef.current || typeof naver === "undefined") return;

    naver.maps.Event.trigger(mapInstanceRef.current, "resize");
  }, [resizeToggle]);

  useEffect(() => {
    if (!mapReady) return;
    if (!zoomChange) return;

    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;

    const zoomListener = naver.maps.Event.addListener(map, "zoom_changed", () => {
      zoomChange(map.getZoom());
    });

    return () => {
      naver.maps.Event.removeListener(zoomListener);
    };
  }, [mapReady, zoomChange]);

  useEffect(() => {
    if (!mapReady || !onMapClick) return;

    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;

    const clickListener = naver.maps.Event.addListener(map, "click", () => onMapClick());

    return () => {
      naver.maps.Event.removeListener(clickListener);
    };
  }, [mapReady, onMapClick]);

  useEffect(() => {
    if (!mapReady) return;
    if (!centerChange) return;

    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;

    const idleListener = naver.maps.Event.addListener(map, "idle", () => {
      const center = map.getCenter();
      // naver.maps.LatLng: .lat()/.lng() 메서드와 .y(lat)/.x(lng) 필드 둘 다 지원.
      const readLat = (p: naver.maps.LatLng) =>
        typeof p.lat === "function" ? p.lat() : (p as unknown as { y: number }).y;
      const readLng = (p: naver.maps.LatLng) =>
        typeof p.lng === "function" ? p.lng() : (p as unknown as { x: number }).x;

      const lat = readLat(center as naver.maps.LatLng);
      const lng = readLng(center as naver.maps.LatLng);

      // bounds 의 NE 코너까지 거리 = 화면 대각선 절반 = 화면이 커버하는 반경.
      // radiusKm: 마커 prefetch 용 — buffer(1.25) 적용, [MIN_RADIUS_KM, MAX] clamp.
      // viewportRadiusKm: 리스트 등 "지금 화면에 보이는 것"용 — buffer 없이 화면 대각선
      // 그대로, 단 [MIN_VIEWPORT_RADIUS_KM=0.1, MAX] clamp (줌 끝까지 확대해도 100m 보장).
      let radiusKm = DEFAULT_RADIUS_KM;
      let viewportRadiusKm = DEFAULT_RADIUS_KM;
      try {
        const bounds = map.getBounds() as naver.maps.LatLngBounds | undefined;
        const ne = bounds?.getNE?.() as naver.maps.LatLng | undefined;
        if (ne) {
          const neLat = readLat(ne);
          const neLng = readLng(ne);
          if (typeof neLat === "number" && typeof neLng === "number") {
            const diagonalKm = getDistanceFromLatLonInKm(lat, lng, neLat, neLng);
            radiusKm = Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, diagonalKm * RADIUS_BUFFER));
            viewportRadiusKm = Math.min(
              MAX_RADIUS_KM,
              Math.max(MIN_VIEWPORT_RADIUS_KM, diagonalKm),
            );
          }
        }
      } catch {
        radiusKm = DEFAULT_RADIUS_KM;
        viewportRadiusKm = DEFAULT_RADIUS_KM;
      }

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
      }

      if (lat == null || lng == null) return;
      centerChange({ lat, lon: lng, radiusKm, viewportRadiusKm });
    });

    return () => {
      naver.maps.Event.removeListener(idleListener);
    };
  }, [mapReady, centerChange]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!mapRef.current || !map || typeof naver === "undefined") return;

    // 기존 요소를 미리 보관 (새 마커 생성 후 제거해 깜박임 방지)
    const prevMarkers = mapElementsRef.current.markers;
    const prevPolylines = mapElementsRef.current.polylines;
    const prevInfoWindows = mapElementsRef.current.infoWindow;
    const prevCircles = mapElementsRef.current.circles;

    mapElementsRef.current = {
      markers: [],
      polylines: [],
      infoWindow: [],
      circles: [],
    };

    markerMapRef.current = {};
    markerIconMapRef.current = {};
    markerSelectedIconMapRef.current = {};

    // ① 새 마커를 먼저 생성
    markersOptions?.forEach((markerOptions) => {
      const marker = new naver.maps.Marker({
        map,
        ...markerOptions,
      });

      if (markerOptions.id) {
        markerMapRef.current[markerOptions.id] = marker;
        markerIconMapRef.current[markerOptions.id] = markerOptions.icon;
        markerSelectedIconMapRef.current[markerOptions.id] =
          markerOptions.selectedIcon ?? markerOptions.icon;
      }

      if (markerOptions?.isPicked) {
        map.setCenter(markerOptions.position);
      }

      if (markerOptions.infoWindow) {
        const info = new naver.maps.InfoWindow(markerOptions.infoWindow);
        info.open(map, marker);
        mapElementsRef.current.infoWindow.push(info);
      }

      if (markerOptions.polyline) {
        const polyline = new naver.maps.Polyline({
          map,
          ...markerOptions.polyline,
        });
        mapElementsRef.current.polylines.push(polyline);
      }

      naver.maps.Event.addListener(marker, "click", () => {
        if (!handleMarker || !markerOptions.id) return;

        handleMarker(markerOptions.id, map.getZoom(), markerOptions.ids);
      });

      mapElementsRef.current.markers.push(marker);
    });

    circleCenter?.forEach((circleItem) => {
      if (!circleItem) return;

      const radius = !circleItem.size
        ? 1000
        : circleItem.size === "sm"
          ? 2000
          : circleItem.size === "md"
            ? 3000
            : 4000;

      const circle = new naver.maps.Circle({
        map,
        center: new naver.maps.LatLng(circleItem.lat, circleItem.lon),
        radius,
        strokeColor: "var(--color-blue)",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "var(--color-blue)",
        fillOpacity: 0.1,
      });

      mapElementsRef.current.circles.push(circle);

      if (circleItem.size) {
        const outerCircle = new naver.maps.Circle({
          map,
          center: new naver.maps.LatLng(circleItem.lat, circleItem.lon),
          radius: radius * 1.5,
          strokeColor: "var(--color-mint)",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "var(--color-mint)",
          fillOpacity: 0.05,
        });

        mapElementsRef.current.circles.push(outerCircle);
      }
    });

    const currentSelectedId = selectedMarkerIdRef.current;
    if (currentSelectedId) {
      const selectedMarker = markerMapRef.current[currentSelectedId];
      const selectedIcon = markerSelectedIconMapRef.current[currentSelectedId];

      if (selectedMarker && selectedIcon) {
        selectedMarker.setIcon(selectedIcon);
        selectedMarker.setZIndex(999);
        prevSelectedMarkerIdRef.current = currentSelectedId;
      }
    }

    // ② 새 마커 생성 완료 후 기존 마커 제거 (깜박임 방지)
    prevMarkers.forEach((marker) => marker.setMap(null));
    prevPolylines.forEach((polyline) => polyline.setMap(null));
    prevInfoWindows.forEach((info) => info.close());
    prevCircles.forEach((circle) => circle.setMap(null));
  }, [markersOptions, circleCenter, handleMarker, mapReady]);

  useEffect(() => {
    const prevMarkerId = prevSelectedMarkerIdRef.current;

    if (prevMarkerId) {
      const prevMarker = markerMapRef.current[prevMarkerId];
      const prevIcon = markerIconMapRef.current[prevMarkerId];

      if (prevMarker && prevIcon) {
        prevMarker.setIcon(prevIcon);
        prevMarker.setZIndex(100);
      }
    }

    if (!selectedMarkerId) {
      prevSelectedMarkerIdRef.current = null;
      return;
    }

    const nextMarker = markerMapRef.current[selectedMarkerId];
    const selectedIcon = markerSelectedIconMapRef.current[selectedMarkerId];

    if (nextMarker && selectedIcon) {
      nextMarker.setIcon(selectedIcon);
      nextMarker.setZIndex(999);
    }

    prevSelectedMarkerIdRef.current = selectedMarkerId;
  }, [selectedMarkerId]);

  useEffect(() => {
    if (!centerValue || !mapInstanceRef.current || typeof naver === "undefined") return;

    mapInstanceRef.current.panTo(new naver.maps.LatLng(centerValue.lat, centerValue.lng));
  }, [centerValue]);

  // mapOptions effect(setOptions) 보다 뒤에 선언되어야, 같은 렌더에서 중심이 되돌려지지 않는다.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !focusRequest || !map || typeof naver === "undefined") return;

    if (focusRequest.zoom && map.getZoom() < focusRequest.zoom) {
      map.setZoom(focusRequest.zoom, false);
    }
    // 좌표를 지도 중심에 둔 뒤, 지도 중심(화면 기준)과 targetY 의 차이만큼 중심을 아래로 민다.
    // 지도 박스는 헤더 아래에서 시작하므로 실제 위치를 재서 계산한다.
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mapCenterY = rect.top + rect.height / 2;
    // 이동이 짧으면 idle 이 panBy 호출 중에 바로 오므로 이동 전에 등록한다.
    // idle 이 오지 않는 경우를 대비해 타이머로도 한 번 알린다.
    const settledPoint = { x: rect.left + rect.width / 2, y: focusRequest.targetY };
    let notified = false;
    const notify = () => {
      if (notified) return;
      notified = true;
      onFocusSettledRef.current?.(settledPoint);
    };
    const idleListener = naver.maps.Event.addListener(map, "idle", notify);
    const fallbackTimer = setTimeout(notify, 600);

    map.setCenter(new naver.maps.LatLng(focusRequest.lat, focusRequest.lon));
    map.panBy(new naver.maps.Point(0, mapCenterY - focusRequest.targetY));

    return () => {
      clearTimeout(fallbackTimer);
      naver.maps.Event.removeListener(idleListener);
    };
  }, [focusRequest, mapReady]);

  return <Map ref={mapRef} id="map" />;
}

export default VoteMap;

const Map = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
  contain: paint;

  &.expanded > div:nth-of-type(2) {
    transform: translate(12px, -12px);
  }
`;
