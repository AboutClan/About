import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";

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
  centerValue?: {
    lat: number;
    lng: number;
  };
}

function VoteMap({
  mapOptions,
  markersOptions,
  resizeToggle,
  handleMarker,
  zoomChange,
  centerChange,
  selectedMarkerId,
  circleCenter,
  centerValue,
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
      return;
    }

    mapInstanceRef.current.setOptions(mapOptions);
  }, [mapOptions]);

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

    mapElementsRef.current.markers.forEach((marker) => marker.setMap(null));
    mapElementsRef.current.polylines.forEach((polyline) => polyline.setMap(null));
    mapElementsRef.current.infoWindow.forEach((info) => info.close());
    mapElementsRef.current.circles.forEach((circle) => circle.setMap(null));

    mapElementsRef.current = {
      markers: [],
      polylines: [],
      infoWindow: [],
      circles: [],
    };

    markerMapRef.current = {};
    markerIconMapRef.current = {};
    markerSelectedIconMapRef.current = {};

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
  }, [markersOptions, circleCenter, handleMarker]);

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
