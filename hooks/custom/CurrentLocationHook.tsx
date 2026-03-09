import { useEffect, useRef, useState } from "react";

import { CoordinatesProps } from "../../types/common";
import { useToast } from "./CustomToast";

const LOCATION_PROMPTED_KEY = "location_prompted_once";

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(false);

  const requestCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      toast("error", "현재 기기에서 위치 정보를 사용할 수 없습니다.");
      return null;
    }

    setIsLoading(true);

    return new Promise<CoordinatesProps | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinate(coords);
          setIsLoading(false);
          resolve(coords);
        },
        (error) => {
          console.error("위치 오류:", error);
          setCoordinate(null);
          setIsLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 },
      );
    });
  };

  const getCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      return null;
    }

    try {
      // 일부 브라우저는 permissions 미지원일 수 있음
      if ("permissions" in navigator && navigator.permissions?.query) {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (permission.state === "granted") {
          return await requestCurrentLocation();
        }

        if (permission.state === "denied") {
          setCoordinate(null);
          return null;
        }

        // prompt 상태일 때: 이미 한 번 물어봤으면 다시 자동 요청 안 함
        const promptedOnce = localStorage.getItem(LOCATION_PROMPTED_KEY) === "true";
        if (promptedOnce) {
          setCoordinate(null);
          return null;
        }

        localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
        return await requestCurrentLocation();
      }

      // permissions API 미지원 브라우저 fallback
      const promptedOnce = localStorage.getItem(LOCATION_PROMPTED_KEY) === "true";
      if (promptedOnce) {
        setCoordinate(null);
        return null;
      }

      localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
      return await requestCurrentLocation();
    } catch (error) {
      console.error("권한 확인 오류:", error);
      setCoordinate(null);
      return null;
    }
  };

  // 자동 요청은 최초 1회만
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    getCurrentLocation();
  }, []);

  return {
    currentLocation: coordinate,
    isLoadingLocation: isLoading,
    refetchCurrentLocation: requestCurrentLocation, // 수동 재요청은 이걸로
  };
}
