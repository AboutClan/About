import { useEffect, useState } from "react";

import { useToast } from "./CustomToast";

interface Location {
  lat: number;
  lon: number;
}

export function useCurrentLocation() {
  const toast = useToast();
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setLocation({ lat, lon });
    };

    const handleError = (error: GeolocationPositionError) => {
      toast("error", `위치 정보를 가져오는 데 실패했습니다`);
      console.error("위치 오류: ", error);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return { currentLocation: location };
}
