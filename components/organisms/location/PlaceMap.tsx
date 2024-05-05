import { useEffect, useRef, useState } from "react";

interface ISpaceMap {
  lat?: number;
  lon?: number;
}

function PlaceMap({ lat, lon }: ISpaceMap) {
  const mapRef = useRef();

  const [myLat, setMyLat] = useState(null);
  const [myLon, setMyLon] = useState(null);

  useEffect(() => {
    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setMyLat(latitude);
      setMyLon(longitude);
    };

    const onError = (err) => {
      console.error(err);
    };

    if (navigator.geolocation) {
      const options = {
        maximumAge: 60000,
        timeout: 5000,
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    } else console.error("Geolocation is not supported by this browser.");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!myLat || !myLon) return;

    const option = {
      center: new naver.maps.LatLng(lat, lon),
      scaleControl: false,
      mapDataControl: false,
      zoom: 14,
    };

    const container = document.getElementById("map");
    const map = new naver.maps.Map(container, option);

    const markers = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lon),
      map,
      icon: {
        url: "/map/locationDot.svg",
        size: new naver.maps.Size(40, 40),
        scaledSize: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(15, 30),
      },
    });
    const additionalMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(myLat, myLon),
      map,
      icon: {
        url: "/map/markerMine.svg",
        size: new naver.maps.Size(40, 40),
        scaledSize: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(15, 30),
      },
    });
    markers.setMap(map);
    additionalMarker && additionalMarker.setMap(map);
  }, [lat, lon, myLat, myLon]);

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "360px" }} />;
}

export default PlaceMap;
