import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

import { isEverytimeAndroidInAppBrowser } from "../../utils/appEnvUtils";

// SSR에서 useLayoutEffect를 쓰면 "useLayoutEffect does nothing on the server" 경고가 뜬다.
// 서버에서는 어차피 effect가 실행되지 않으므로 useEffect(사실상 no-op)를 쓰고,
// 클라이언트에서는 브라우저가 첫 페인트를 하기 전에 동기적으로 실행되는
// useLayoutEffect를 써서 하단 흰 여백이 짧게 보였다 사라지는 현상을 없앤다.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// 서버 렌더/최초 클라이언트 렌더에는 navigator를 알 수 없으므로 항상 false(=safe-area 적용)로
// 시작한다. 이 기본값은 getSafeAreaBottom()이 서버에서 렌더링하는 값과 항상 같으므로
// hydration mismatch가 발생하지 않는다.
export const EverytimeAndroidInAppBrowserContext = createContext(false);

// Layout 최상단에서만 호출해야 하는 훅. 값을 실제로 계산(navigator 접근)하는 유일한 지점이며,
// 계산된 값은 EverytimeAndroidInAppBrowserContext.Provider를 통해 하위 컴포넌트로 내려준다.
//
// BottomNav/CafeMapBottomNav 등 하위 컴포넌트가 각자 이 훅을 다시 호출해 독립적으로
// 값을 계산하면, 컴포넌트마다 마운트 시점이 다를 경우 서로 다른 렌더 사이클에 값이
// 갱신되어 BottomNav의 실제 높이와 Layout의 paddingBottom이 잠깐 어긋날 수 있다.
// 그래서 계산은 여기서만 하고, 하위에서는 반드시 useEverytimeAndroidInAppBrowser()로
// Context를 통해 "이미 계산된 같은 값"만 읽도록 강제한다.
export function useDetectEverytimeAndroidInAppBrowser(): boolean {
  const [isEverytimeAndroidInApp, setIsEverytimeAndroidInApp] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setIsEverytimeAndroidInApp(isEverytimeAndroidInAppBrowser());
  }, []);

  return isEverytimeAndroidInApp;
}

// BottomNav, CafeMapBottomNav 등 Layout 하위 컴포넌트에서 사용. Layout이 Provider로
// 감싸지 않은 채로 쓰이면(예: 테스트 환경) Context 기본값인 false로 안전하게 동작한다.
export function useEverytimeAndroidInAppBrowser(): boolean {
  return useContext(EverytimeAndroidInAppBrowserContext);
}
