import { useEffect, useState } from "react";

import { CoordinateProps } from "../../types/common";
import { useToast } from "./CustomToast";

export function useCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinateProps>(null);

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCoordinate({ lat, lon });
    };

    const handleError = (error: GeolocationPositionError) => {
      toast("error", `위치 정보를 가져오는 데 실패했습니다`);
      console.error("위치 오류: ", error);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0,
    });
  }, []);

  return { currentLocation: coordinate };
}
