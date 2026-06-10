import { useEffect, useRef, useState } from "react";

import { CoordinatesProps } from "../../types/common";
import { useToast } from "./CustomToast";

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(false);

  // 수동 refetch 및 granted 자동 요청 공통 실행 함수
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
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  };

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      return;
    }

    if (!("permissions" in navigator) || !navigator.permissions?.query) {
      // permissions API 미지원 → 자동 요청 안 함
      setCoordinate(null);
      return;
    }

    let permissionStatus: PermissionStatus | null = null;
    let handleChange: (() => void) | null = null;

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permission) => {
        permissionStatus = permission;

        if (permission.state === "granted") {
          requestCurrentLocation();
          return;
        }

        // denied / prompt → 즉시 null 확정 (userInfo fallback)
        setCoordinate(null);

        if (permission.state === "prompt") {
          // 사용자가 나중에 권한을 승인하면 자동으로 위치 갱신
          handleChange = () => {
            if (permission.state === "granted") {
              requestCurrentLocation();
            }
          };
          permission.addEventListener("change", handleChange);
        }
      })
      .catch((error) => {
        console.error("권한 확인 오류:", error);
        setCoordinate(null);
      });

    return () => {
      if (permissionStatus && handleChange) {
        permissionStatus.removeEventListener("change", handleChange);
      }
    };
  }, []);

  return {
    currentLocation: coordinate,
    isLoadingLocation: isLoading,
    refetchCurrentLocation: requestCurrentLocation,
  };
}
