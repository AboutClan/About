import { useEffect, useRef } from "react";
import styled from "styled-components";

import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";

interface IVoteMap {
  mapOptions?: IMapOptions;
  markersOptions?: IMarkerOptions[];
  handleMarker?: (id: string, currentZoom?: number) => void;
  resizeToggle?: boolean;
  centerValue?: {
    lat: number;
    lng: number;
  };
  circleCenter?: {
    lat: number;
    lon: number;
    size?: "sm" | "md" | "lg";
  }[];
  zoomChange?: (zoom: number) => void;
  isMapExpansion?: boolean;
}

export default function VoteMap({
  mapOptions,
  markersOptions,
  handleMarker,
  resizeToggle,
  centerValue,
  circleCenter,
  zoomChange,
  isMapExpansion,
}: // circleCenter,
IVoteMap) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const mapElementsRef = useRef({
    markers: [] as naver.maps.Marker[],
    polylines: [] as naver.maps.Polyline[],
    infoWindow: [] as naver.maps.InfoWindow[],
    circles: [] as naver.maps.Circle[], // ← 배열로
  });

  useEffect(() => {
    mapRef.current?.classList.toggle("expanded", !!isMapExpansion);
  }, [isMapExpansion]);

  // useEffect(() => {

  //   const container = mapRef.current;
  //   if (!container) return;

  //   const selector = ":scope > div:nth-of-type(2)";

  //   const moveLogo = () => {
  //     const el = container.querySelector(selector) as HTMLElement | null;
  //     if (el) el.style.transform = "translate(12px, -12px)";
  //   };

  //   const resetLogo = () => {
  //     const el = container.querySelector(selector) as HTMLElement | null;
  //     if (el) el.style.transform = "translate(0, 0)";
  //   };

  //   if (isMapExpansion) {
  //     // 확장 상태일 때만 위치 이동
  //     moveLogo();

  //     const mo = new MutationObserver(moveLogo);
  //     mo.observe(container, { childList: true, subtree: false });

  //     return () => mo.disconnect();
  //   } else {
  //     // 축소 시 원래 위치로 복귀
  //     resetLogo();
  //   }
  // }, [mapInstanceRef.current, isMapExpansion]);

  useEffect(() => {
    if (!mapRef?.current || typeof naver === "undefined" || !mapOptions) return;
    console.log(123, mapOptions);
    if (!mapInstanceRef.current) {
      // 처음에만 맵을 생성
      const map = new naver.maps.Map(mapRef.current, {
        ...mapOptions,
        logoControl: true,
        logoControlOptions: {
          position: naver.maps.Position.BOTTOM_LEFT,
        },
      });

      map.setZoom(mapOptions.zoom);
      mapInstanceRef.current = map;
    } else {
      // 이미 맵이 생성된 경우, 설정만 업데이트
      mapInstanceRef.current.setOptions(mapOptions);
    }
  }, [mapOptions]);

  useEffect(() => {
    if (!mapInstanceRef?.current || typeof naver === "undefined") return;

    naver.maps.Event.trigger(mapInstanceRef.current, "resize");
  }, [resizeToggle]);

  useEffect(() => {
    if (!zoomChange) return;
    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;
    const zoomListener = naver.maps.Event.addListener(map, "zoom_changed", () => {
      const newZoom = map.getZoom();
      console.log(2, newZoom);
      zoomChange(newZoom);
    });
    return () => {
      if (zoomListener) naver.maps.Event.removeListener(zoomListener);
    };
  }, [markersOptions, zoomChange]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!mapRef?.current || !map || typeof naver === "undefined") return;

    //새로운 옵션 적용 전 초기화
    mapElementsRef.current.markers.forEach((marker) => marker.setMap(null));
    mapElementsRef.current.polylines.forEach((polyline) => polyline.setMap(null));
    mapElementsRef.current.infoWindow.forEach((info) => info.close());
    mapElementsRef.current.circles.forEach((c) => c.setMap(null));

    mapElementsRef.current = { markers: [], polylines: [], infoWindow: [], circles: [] };
    //새로운 옵션 적용
    markersOptions?.forEach((markerOptions) => {
      const marker = new naver.maps.Marker({
        map,
        ...markerOptions,
      });

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
        if (handleMarker) {
          const currentZoom = map.getZoom();
          handleMarker(markerOptions.id, currentZoom);
        }
      });
      mapElementsRef.current.markers.push(marker);
    });

    if (circleCenter) {
      circleCenter?.forEach((circle2) => {
        if (!circle2) return;
        const radius = !circle2?.size
          ? 550
          : circle2?.size === "sm"
          ? 2000
          : circle2?.size === "md"
          ? 3000
          : 4000;

        const circle = new naver.maps.Circle({
          map: mapInstanceRef.current,
          center: new naver.maps.LatLng(circle2.lat, circle2.lon),
          radius: radius,
          strokeColor: "var(--color-blue)",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "var(--color-blue)",
          fillOpacity: 0.1,
        });
        const circle3 = new naver.maps.Circle({
          map: mapInstanceRef.current,
          center: new naver.maps.LatLng(circle2.lat, circle2.lon),
          radius: radius * 1.5,
          strokeColor: "var(--color-mint)",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "var(--color-mint)",
          fillOpacity: 0.05,
        });

        mapElementsRef.current.circles.push(circle, circle3);
      });
    }
  }, [markersOptions, circleCenter]);

  useEffect(() => {
    if (!centerValue || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    map.setCenter(new naver.maps.LatLng(centerValue.lat, centerValue.lng));
  }, [centerValue]);

  return <Map ref={mapRef} id="map" />;
}

const Map = styled.div`
  width: 100%;
  height: 100%;
  /* max-width: var(--max-width);
  margin: 0 auto; */
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
