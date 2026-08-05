// TEMP DIAGNOSTIC — 실기기(특히 갤럭시 에브리타임 인앱 브라우저)에서 실제 UA와
// safe-area 계산값을 확인하기 위한 임시 컴포넌트.
//
// TODO(remove-before-prod): 실기기 확인이 끝나면 반드시 삭제할 것.
// 제거 방법: 이 파일을 지우고, 이 컴포넌트를 렌더하는 곳(현재 pageTemplates/layout/Layout.tsx)의
// import문과 <SafeAreaDebugOverlay /> 렌더 라인만 삭제하면 된다. 다른 코드에는 영향을 주지 않는다.
//
// 활성화: 확인하려는 페이지 URL에 ?safeAreaDebug=1 쿼리를 붙여서 접속.
// (기본적으로는 아무것도 렌더링하지 않아 운영 환경에서도 안전하다.)
//
// 앱 인앱 브라우저에서는 콘솔을 열어볼 수 없어, 값을 화면에 토스트로 띄운다.
// (닫기 전까지 사라지지 않으므로 스크린샷으로 공유하면 된다)
//
// 주의: utils/appEnvUtils.ts의 isEverytimeAndroidInAppBrowser()가 쓰는 /everytime/i는
// 실기기 캡처로 검증되지 않은 추정 패턴이다. 이 토스트로 실제 userAgent를 확인하기 전까지
// 그 정규식이 맞다고 확정하지 말 것 — 실제 UA에 "everytime"이 없다면 현재 분기는
// 전혀 작동하지 않는다.
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

import {
  getUserAgent,
  isAndroid,
  isEverytimeAndroidInAppBrowser,
  isPWA,
  isWebView,
} from "../../utils/appEnvUtils";

function measureSafeAreaInsetBottom(): string {
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.bottom = "0";
  probe.style.left = "0";
  probe.style.height = "0px";
  probe.style.paddingBottom = "env(safe-area-inset-bottom, 0px)";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).paddingBottom;
  document.body.removeChild(probe);
  return value;
}

function SafeAreaDebugOverlay() {
  const toast = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("safeAreaDebug") !== "1") return;

    const info: [string, string][] = [
      ["userAgent", getUserAgent()],
      ["isAndroid()", String(isAndroid())],
      ["isWebView()", String(isWebView())],
      ["isPWA()", String(isPWA())],
      ["isEverytimeAndroidInAppBrowser()", String(isEverytimeAndroidInAppBrowser())],
      ["env(safe-area-inset-bottom)", measureSafeAreaInsetBottom()],
    ];

    // eslint-disable-next-line no-console
    console.log("[SafeAreaDebug]", Object.fromEntries(info));

    // 필드마다 별도 토스트로 띄운다. 하나로 합치면 userAgent가 길어 나머지 값이
    // 잘려 보일 수 있어, 각각 닫기 전까지 유지되는 토스트로 분리했다.
    info.forEach(([label, value], index) => {
      toast({
        id: `safe-area-debug-${label}`,
        title: label,
        description: value || "(빈 값)",
        status: "info",
        duration: null,
        isClosable: true,
        position: "top",
        containerStyle: {
          marginTop: `${index * 4}px`,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          maxWidth: "92vw",
        },
      });
    });
  }, [toast]);

  return null;
}

export default SafeAreaDebugOverlay;
