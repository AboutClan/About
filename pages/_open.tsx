import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // 1. 쿼리 파라미터에서 path 추출 (예: gather/123)
    const rawPath = Array.isArray(router.query.dl) ? router.query.dl[0] : router.query.dl;
    // 2. 경로 정규화: 앞뒤 공백 제거 및 맨 앞의 슬래시(/)를 완전히 제거
    // 앱의 정규식이 about20s:// 바로 뒤에 경로가 오는 것을 기대하므로 슬래시가 없어야 합니다.
    const cleanPath =
      typeof rawPath === "string" && rawPath.trim() ? rawPath.trim().replace(/^\/+/, "") : "home";

    const WEB_BASE = "https://study-about.club/";
    const webUrl = WEB_BASE + cleanPath;

    // 3. 딥링크 생성 (앱 내부 정규식 최적화)
    const t = Date.now();
    const sep = cleanPath.includes("?") ? "&" : "?";

    // ✅ 핵심: about20s:// 뒤에 슬래시 없이 바로 경로를 붙입니다.
    // 시스템이 슬래시를 자동으로 추가하는 것을 방지하기 위해 가장 단순한 구조를 유지합니다.
    const appUrl = `about20s://${cleanPath}${sep}__t=${t}`;

    let didHide = false;
    const onVisibility = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 4. 앱 실행 시도
    window.location.replace(appUrl);

    // 5. Fallback: 앱이 실행되지 않을 경우 웹으로 리다이렉트
    const FALLBACK_MS = 1500;
    const timer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      // 앱이 실행되어 백그라운드로 전환(didHide)되지 않은 경우에만 웹으로 이동
      if (!didHide) {
        window.location.replace(webUrl);
      }
    }, FALLBACK_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, [router.isReady, router.query.dl]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "10px",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>앱으로 이동 중입니다...</p>
        <p style={{ color: "#666" }}>이동이 되지 않으면 잠시만 기다려 주세요.</p>
      </div>
    </>
  );
}
