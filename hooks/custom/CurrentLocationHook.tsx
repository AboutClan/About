import { useEffect, useState } from "react";

import { CoordinatesProps } from "../../types/common";
import { useToast } from "./CustomToast";

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const handleSuccess = (position: GeolocationPosition) => {
      if (!isMounted) return;
      const { latitude: lat, longitude: lon } = position.coords;
      setCoordinate({ lat, lon });
    };

    const handleError = (error: GeolocationPositionError) => {
      if (!isMounted) return;
      setCoordinate(null);
      toast("error", `스터디 장소 추천을 위해, 설정 > 앱 권한에서 위치 접근을 허용해 주세요!`);
      console.error("위치 오류: ", error);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    return () => {
      isMounted = false; // 컴포넌트 언마운트 대비
    };
  }, []);

  return { currentLocation: coordinate };
}
