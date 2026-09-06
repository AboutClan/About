import { useEffect, useRef, useState } from "react";

import { useToast } from "@/hooks/custom/CustomToast";
import { CoordinatesProps } from "@/types/common";

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(false);

  // 수동 refetch 및 granted 자동 요청 공통 실행 함수
  // silent: true면 실패해도 토스트를 띄우지 않는다 (마운트 시 자동 조회용).
  const requestCurrentLocation = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      if (!silent) toast("error", "현재 기기에서 위치 정보를 사용할 수 없습니다.");
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
          console.error("위치 오류:", error.code, error.message);
          setCoordinate(null);
          setIsLoading(false);
          if (!silent) {
            // GeolocationPositionError.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
            // 원인별로 다른 메시지를 보여줘야 "권한을 껐는지" "GPS를 못 잡는지" "그냥 느린지" 구분이 된다.
            if (error.code === error.PERMISSION_DENIED) {
              toast(
                "error",
                "위치 접근 권한이 꺼져 있어요. 기기(또는 앱) 설정에서 위치 권한을 허용해 주세요.",
              );
            } else if (error.code === error.TIMEOUT) {
              toast("error", "위치를 확인하는 데 시간이 너무 오래 걸려요. 다시 시도해 주세요.");
            } else {
              // POSITION_UNAVAILABLE: GPS/네트워크 위치 확인 실패 (실내, 기내 모드 등)
              toast("error", "위치 정보를 확인할 수 없습니다. 실내라면 창가나 실외에서 다시 시도해 주세요.");
            }
          }
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
          requestCurrentLocation({ silent: true });
          return;
        }

        // denied / prompt → 즉시 null 확정 (userInfo fallback)
        setCoordinate(null);

        if (permission.state === "prompt") {
          // 사용자가 나중에 권한을 승인하면 자동으로 위치 갱신
          handleChange = () => {
            if (permission.state === "granted") {
              requestCurrentLocation({ silent: true });
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
