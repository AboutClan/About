import { useEffect, useLayoutEffect, useState } from "react";

import { isEverytimeAndroidInAppBrowser } from "../../utils/appEnvUtils";
import { APP_SAFE_AREA_BOTTOM_CSS_VAR, isApp } from "../../utils/validationUtils";

// SSR에서 useLayoutEffect를 쓰면 "useLayoutEffect does nothing on the server" 경고가 뜬다.
// 서버에서는 어차피 effect가 실행되지 않으므로 useEffect(사실상 no-op)를 쓰고,
// 클라이언트에서는 브라우저가 첫 페인트를 하기 전에 동기적으로 실행되는
// useLayoutEffect를 써서 하단 흰 여백이 짧게 보였다 사라지는 현상을 없앤다.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Layout 최상단에서 한 번만 호출한다. document.documentElement에
// --app-safe-area-bottom CSS 변수를 설정해, getSafeAreaBottom()을 쓰는 모든 컴포넌트
// (BottomNav, Drawer, CTA, 댓글/채팅 입력창, WritingNavigation, ControlButton 등)가
// 컴포넌트별로 에브리타임 분기를 따로 두지 않고 CSS 상속만으로 같은 값을 받게 한다.
export function useAppSafeAreaBottomCssVar(): boolean {
  const [isEverytimeAndroidInApp, setIsEverytimeAndroidInApp] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // 어바웃 RN WebView: 네이티브 컨테이너가 이미 처리하므로 0px.
    // 에브리타임 Android 인앱 브라우저: env(safe-area-inset-bottom)이 실제로는
    // 필요 없는 48px을 잘못 보고하므로 0px.
    // 그 외(iOS Safari/PWA/인앱브라우저, Android Chrome·Samsung Internet·PWA 등):
    // env(safe-area-inset-bottom, 0px) 그대로 사용.
    const isEverytime = !isApp() && isEverytimeAndroidInAppBrowser();
    const value = isApp() || isEverytime ? "0px" : "env(safe-area-inset-bottom, 0px)";

    document.documentElement.style.setProperty(APP_SAFE_AREA_BOTTOM_CSS_VAR, value);
    setIsEverytimeAndroidInApp(isEverytime);
  }, []);

  return isEverytimeAndroidInApp;
}
