import { useEffect, useRef } from "react";
import styled from "styled-components";

import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";

interface VoteMapProps {
  mapOptions: IMapOptions;
  markersOptions: IMarkerOptions[];
  resizeToggle?: boolean;
  handleMarker?: (id: string, currentZoom: number, ids?: string[]) => void;
  zoomChange?: (zoom: number) => void;
  centerChange?: (center: { lat: number; lon: number }) => void;
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
      return;
    }

    mapInstanceRef.current.setOptions(mapOptions);
  }, [mapOptions]);

  useEffect(() => {
    if (!mapInstanceRef.current || typeof naver === "undefined") return;

    naver.maps.Event.trigger(mapInstanceRef.current, "resize");
  }, [resizeToggle]);

  useEffect(() => {
    if (!zoomChange) return;

    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;

    const zoomListener = naver.maps.Event.addListener(map, "zoom_changed", () => {
      zoomChange(map.getZoom());
    });

    return () => {
      naver.maps.Event.removeListener(zoomListener);
    };
  }, [zoomChange]);

  useEffect(() => {
    if (!centerChange) return;

    const map = mapInstanceRef.current;
    if (!map || typeof naver === "undefined") return;

    const idleListener = naver.maps.Event.addListener(map, "idle", () => {
      const center = map.getCenter();

      centerChange({
        lat: center.y,
        lon: center.x,
      });
    });

    return () => {
      naver.maps.Event.removeListener(idleListener);
    };
  }, [centerChange]);

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

    if (selectedMarkerId) {
      const selectedMarker = markerMapRef.current[selectedMarkerId];
      const selectedIcon = markerSelectedIconMapRef.current[selectedMarkerId];

      if (selectedMarker && selectedIcon) {
        selectedMarker.setIcon(selectedIcon);
        selectedMarker.setZIndex(999);
        prevSelectedMarkerIdRef.current = selectedMarkerId;
      }
    }
  }, [markersOptions, circleCenter, selectedMarkerId, handleMarker]);

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

    mapInstanceRef.current.setCenter(new naver.maps.LatLng(centerValue.lat, centerValue.lng));
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
