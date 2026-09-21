import { useEffect, useRef, useState } from "react";

import { useToast } from "@/hooks/custom/CustomToast";
import { CoordinatesProps } from "@/types/common";
import { isInAppBrowser } from "@/utils/appEnvUtils";

// Android 는 첫 측위(콜드 스타트)가 느리다. getCurrentPosition 은 단발 요청이라
// 공급자가 예열되는 동안 타임아웃으로 죽고, 그 사이 도착했을 좌표를 놓친다.
// 그래서 watchPosition 으로 계속 듣다가 첫 좌표가 오면 즉시 끊는다.
const GEO_WATCH_OPTIONS: PositionOptions = {
  // 지도 중심을 잡는 용도라 정밀도보다 속도가 중요하다.
  // true 로 두면 GPS 단독 측위를 강제해 실내 콜드 스타트가 더 느려진다.
  enableHighAccuracy: false,
  // 최근 좌표가 있으면 즉시 사용한다.
  maximumAge: 60_000,
  // 개별 timeout 은 두지 않는다. 예열 중 일시적 실패로 감시가 끊기면
  // "기다리면 결국 잡히는" 좌표를 놓치기 때문이다. 전체 제한은 아래에서 건다.
};

// 감시 전체 제한. 이 시간까지 좌표가 하나도 안 오면 실패로 처리한다.
const GEO_OVERALL_TIMEOUT = 20_000;

const TIMEOUT_ERROR = {
  code: 3,
  message: "위치 확인 시간 초과",
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as GeolocationPositionError;

/** 첫 좌표가 오면 resolve 하고 감시를 끊는다. */
const watchForFirstPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    let watchId: number | null = null;
    let isSettled = false;
    // 기다리다 실패했을 때 원인을 알리기 위해 마지막 에러를 들고 있는다.
    let lastError: GeolocationPositionError | null = null;

    const cleanUp = () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      if (isSettled) return;
      isSettled = true;
      cleanUp();
      reject(lastError ?? TIMEOUT_ERROR);
    }, GEO_OVERALL_TIMEOUT);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (isSettled) return;
        isSettled = true;
        cleanUp();
        resolve(position);
      },
      (error) => {
        lastError = error;
        // 권한 거부만 즉시 종료한다. 나머지(측위 실패 등)는 공급자가 예열되는 중일 수
        // 있으므로 감시를 유지한 채 계속 기다린다.
        if (error.code !== error.PERMISSION_DENIED || isSettled) return;
        isSettled = true;
        cleanUp();
        reject(error);
      },
      GEO_WATCH_OPTIONS,
    );
  });

export function useUserCurrentLocation() {
  const toast = useToast();
  const [coordinate, setCoordinate] = useState<CoordinatesProps | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  // 인앱 브라우저라 측위가 막힌 경우. 토스트로는 "기본 브라우저로 열기"를 줄 수 없어서
  // 호출부가 안내 모달을 띄울 수 있게 플래그로 노출한다.
  const [isInAppBrowserBlocked, setIsInAppBrowserBlocked] = useState(false);
  const mountedRef = useRef(false);
  // 첫 측위가 20초까지 걸릴 수 있어 그 사이 버튼을 여러 번 누르면 감시가 중복으로 돌고
  // 실패 토스트도 그만큼 반복된다. 진행 중인 요청이 있으면 그 결과를 함께 쓴다.
  const inFlightRef = useRef<Promise<CoordinatesProps | null> | null>(null);

  // 수동 refetch 및 granted 자동 요청 공통 실행 함수
  // silent: true면 실패해도 토스트를 띄우지 않는다 (마운트 시 자동 조회용).
  const requestCurrentLocation = (opts?: { silent?: boolean }) => {
    if (inFlightRef.current) return inFlightRef.current;

    const promise = runCurrentLocationRequest(opts).finally(() => {
      inFlightRef.current = null;
    });
    inFlightRef.current = promise;

    return promise;
  };

  const runCurrentLocationRequest = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    if (!("geolocation" in navigator)) {
      setCoordinate(null);
      if (!silent) toast("error", "현재 기기에서 위치 정보를 사용할 수 없습니다.");
      return null;
    }

    setIsLoading(true);

    let position: GeolocationPosition | null = null;
    let error: GeolocationPositionError | null = null;

    try {
      position = await watchForFirstPosition();
    } catch (watchError) {
      error = watchError as GeolocationPositionError;
    }

    setIsLoading(false);

    if (position) {
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      setCoordinate(coords);
      return coords;
    }

    console.error("위치 오류:", error?.code, error?.message);
    setCoordinate(null);

    if (!silent && error) {
      // GeolocationPositionError.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
      // 원인별로 다른 메시지를 보여줘야 "권한을 껐는지" "GPS를 못 잡는지" "그냥 느린지" 구분이 된다.
      if (error.code === error.PERMISSION_DENIED) {
        toast(
          "error",
          "위치 접근 권한이 꺼져 있어요. 기기(또는 앱) 설정에서 위치 권한을 허용해 주세요.",
        );
      } else if (isInAppBrowser()) {
        // 인앱 브라우저는 사이트 팝업을 허용해도 호스트 앱의 OS 위치 권한이 없으면
        // POSITION_UNAVAILABLE 로 떨어진다. 실내/실외 문제가 아니라 브라우저 문제라
        // "다시 시도"가 의미 없다. 기본 브라우저로 빠져나가도록 안내 모달을 띄운다.
        setIsInAppBrowserBlocked(true);
      } else if (error.code === error.TIMEOUT) {
        toast("error", "위치를 확인하는 데 시간이 너무 오래 걸려요. 다시 시도해 주세요.");
      } else {
        // POSITION_UNAVAILABLE: GPS/네트워크 위치 확인 실패 (실내, 기내 모드 등)
        toast(
          "error",
          "위치 정보를 확인할 수 없습니다. 실내라면 창가나 실외에서 다시 시도해 주세요.",
        );
      }
    }

    return null;
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
    isInAppBrowserBlocked,
    dismissInAppBrowserBlocked: () => setIsInAppBrowserBlocked(false),
  };
}
