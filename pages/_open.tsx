// pages/_open.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * 사용 예:
 * https://about20s.club/_open?path=group/149
 * https://about20s.club/_open?path=group/149%3Ftab%3Dmembers
 *
 * 동작:
 * 1) about20s://{path} 로 앱 열기 시도 (강제 트리거)
 * 2) 짧게 기다렸다가 앱이 안 열린 것 같으면 웹으로 fallback
 */
export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const raw = Array.isArray(router.query.path) ? router.query.path[0] : router.query.path;
    const path = typeof raw === "string" && raw.trim() ? raw.trim().replace(/^\/+/, "") : "home";

    // ✅ 너희 "실제 웹" 도메인 (원본)
    const WEB_BASE = "https://study-about.club/";
    const webUrl = WEB_BASE + path;

    // ✅ 너희 앱 스킴 (확정)
    const APP_SCHEME = "about20s:"; // ← 여기 바꿈
    const t = Date.now();

    const cleanPath = String(path || "").replace(/^\/+/, ""); // <- 이게 핵심
    const sep = cleanPath.includes("?") ? "&" : "?";
    const appUrl = `${APP_SCHEME}///${cleanPath}${sep}__t=${t}`; // ← 여기 바꿈
    // iOS/안드 공통으로 "앱 열기 시도 → 실패하면 웹" 패턴
    // - iOS Safari는 스킴 열 때 "앱을 열려고 합니다" 팝업이 뜨는 게 정상
    // - 카카오 인앱브라우저에서도 대부분 비슷하게 동작
    const t0 = Date.now();
    let didHide = false;

    const onVisibility = () => {
      // 앱이 열리면 보통 페이지가 background로 가면서 hidden 됨
      if (document.hidden) didHide = true;
    };

    document.addEventListener("visibilitychange", onVisibility);

    // 1) 앱 열기 시도(강제)
    // location.replace를 쓰면 뒤로가기가 깔끔함
    try {
      window.location.replace(appUrl);
    } catch {
      // 무시
    }

    // 2) fallback: 앱이 안 열렸으면 웹으로 이동
    // 너무 길면 UX 안 좋고, 너무 짧으면 iOS 팝업에서 아직 반응 전일 수 있음
    const FALLBACK_MS = 700;

    const timer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibility);

      // hidden이 됐다가 돌아오는 케이스도 있어서
      // "일단 hidden 안 되었고" + "충분히 시간 지났고"일 때만 fallback
      const elapsed = Date.now() - t0;
      if (!didHide && elapsed >= FALLBACK_MS) {
        window.location.replace(webUrl);
      }
    }, FALLBACK_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, [router.isReady, router.query.path]);

  // 빈 화면으로 두거나 로딩 UI 넣어도 됨
  return null;
}
