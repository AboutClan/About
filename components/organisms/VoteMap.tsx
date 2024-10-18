import { useEffect, useRef } from "react";
import styled from "styled-components";

import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";

interface IVoteMap {
  mapOptions?: IMapOptions;
  markersOptions?: IMarkerOptions[];
  handleMarker?: (id: string, type?: "vote") => void;
  resizeToggle?: boolean;
  centerValue?: {
    lat: number;
    lng: number;
  };
}

export default function VoteMap({
  mapOptions,
  markersOptions,
  handleMarker,
  resizeToggle,
  centerValue,
}: IVoteMap) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const mapElementsRef = useRef({
    markers: [],
    polylines: [],
    infoWindow: [],
  });
 
  useEffect(() => {
    if (!mapRef?.current || typeof naver === "undefined" || !mapOptions) return;

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
    const map = mapInstanceRef.current;

    if (!mapRef?.current || !map || typeof naver === "undefined") return;

    //새로운 옵션 적용 전 초기화
    mapElementsRef.current.markers.forEach((marker) => marker.setMap(null));
    mapElementsRef.current.polylines.forEach((polyline) => polyline.setMap(null));
    mapElementsRef.current.infoWindow.forEach((info) => info.close());
    mapElementsRef.current = { markers: [], polylines: [], infoWindow: [] };
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
          handleMarker(markerOptions.id, markerOptions?.type);
        }
      });
      mapElementsRef.current.markers.push(marker);
    });
  }, [markersOptions]);

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
  max-width: var(--max-width);
  margin: 0 auto;
`;
