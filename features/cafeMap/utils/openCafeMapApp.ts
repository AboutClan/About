import {
  ANDROID_APP_STORE_URL,
  IOS_APP_STORE_URL,
} from "@/features/cafeMap/screens/CafeMapAppInstallDrawer";
import { navigateExternalLink } from "@/utils/navigateUtils";
import { getDeviceOS } from "@/utils/validationUtils";

// 카공지도 앱이 등록한 커스텀 스킴.
// 출처: cafe-map-app/App.tsx의 APP_SCHEME, android/app/src/main/AndroidManifest.xml의
// <data android:scheme="kagongmap" />, ios/어바웃/Info.plist의 CFBundleURLSchemes.
const CAFE_MAP_APP_SCHEME = "kagongmap";
const CAFE_MAP_ANDROID_PACKAGE = "club.about20s.cafemap";

// iOS에서 "앱이 설치되어 있는가"를 웹에서 직접 알 수 있는 방법은 없다. 스킴을 열어본 뒤
// 이 시간 안에 앱으로 전환되지 않으면(=페이지가 계속 보이면) 미설치로 보고 스토어로 보낸다.
const IOS_APP_LAUNCH_TIMEOUT_MS = 1500;

// 카공지도 앱을 연다. 설치되어 있지 않으면 스토어 설치 페이지로 보낸다.
//
// 안드로이드: intent:// 하나로 끝난다. 앱이 있으면 실행, 없으면 browser_fallback_url로
// 이동하는 판단을 OS가 직접 하기 때문에 설치 여부를 추측할 필요가 없다. 어바웃 앱 웹뷰는
// intent://를 IntentModule.openIntent로 넘기고(app/App.tsx의 onShouldStartLoadWithRequest),
// 거기서 browser_fallback_url을 처리한다(IntentModule.java).
//
// iOS: 동등한 수단이 없어 "스킴을 열어보고 일정 시간 안에 화면이 가려지지 않으면 미설치"로
// 판단한다. 앱으로 전환되면 visibilitychange/pagehide가 먼저 오므로 타이머를 취소한다.
export const openCafeMapApp = () => {
  if (typeof window === "undefined") return;

  const os = getDeviceOS();

  if (os === "Android") {
    const fallback = encodeURIComponent(ANDROID_APP_STORE_URL);
    window.location.href =
      `intent://#Intent;scheme=${CAFE_MAP_APP_SCHEME};package=${CAFE_MAP_ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${fallback};end`;
    return;
  }

  if (os === "iOS") {
    let didLeave = false;

    const cancel = () => {
      didLeave = true;
    };

    // 앱으로 전환되는 순간 문서가 숨겨진다. 둘 중 무엇이 먼저 올지는 웹뷰/사파리마다 달라
    // 둘 다 듣는다.
    document.addEventListener("visibilitychange", cancel, { once: true });
    window.addEventListener("pagehide", cancel, { once: true });

    setTimeout(() => {
      document.removeEventListener("visibilitychange", cancel);
      window.removeEventListener("pagehide", cancel);

      if (didLeave || document.hidden) return;
      navigateExternalLink(IOS_APP_STORE_URL);
    }, IOS_APP_LAUNCH_TIMEOUT_MS);

    // 어바웃 앱(iOS)에서는 이 스킴이 onShouldStartLoadWithRequest의 허용 목록에 있어야
    // Linking으로 넘어간다. 목록에 없으면 웹뷰가 로드를 시도하다 실패하는데, onError가
    // 경고만 남기고 넘어가므로(app/App.tsx) 위 타이머가 그대로 스토어로 보낸다.
    window.location.href = `${CAFE_MAP_APP_SCHEME}://`;
    return;
  }

  // PC 등 그 외 환경: 설치할 앱이 없으므로 카공지도 웹으로 보낸다.
  window.location.href = "/cafe-map";
};
