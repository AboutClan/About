import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { CoordinatesProps } from "../../types/common";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { useToast } from "./CustomToast";

const LocationAccessStorage = "locationAccess";

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);
  const locationAccessStorage = localStorage.getItem(LocationAccessStorage);
  const todayDateStr = dayjsToStr(dayjs().date(0));

  // ✅ 위치 요청 함수 (초기 + refetch 둘 다 이걸 사용)
  const getCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      toast("error", "현재 기기에서 위치 정보를 사용할 수 없습니다.");
      return null;
    }

    return new Promise<CoordinatesProps | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          const coords = { lat, lon };
          setCoordinate(coords);
          resolve(coords);
        },
        (error) => {
          setCoordinate(null);
          if (locationAccessStorage !== todayDateStr) {
            toast(
              "error",
              "스터디 장소 추천을 위해, 설정 > 앱 권한에서 위치 접근을 허용해 주세요!",
            );
            localStorage.setItem(LocationAccessStorage, todayDateStr);
          }
          console.error("위치 오류: ", error);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 },
      );
    });
  };

  // ✅ 초기 1회 호출
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    currentLocation: coordinate,
    refetchCurrentLocation: getCurrentLocation, // ✅ 새로 추가
  };
}
