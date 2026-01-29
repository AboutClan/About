import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // 1. 경로 추출 및 정규화 (앞의 슬래시 제거)
    const rawPath = Array.isArray(router.query.path) ? router.query.path[0] : router.query.path;
    const cleanPath = String(rawPath || "").replace(/^\/+/, "") || "home";

    const WEB_BASE = "https://study-about.club/";
    const webUrl = WEB_BASE + cleanPath;

    // 2. 딥링크 생성 (앱 정규식 /^about20s:\/\/([^?]+)(\?.*)?$/ 통과용)
    const t = Date.now();
    const sep = cleanPath.includes("?") ? "&" : "?";

    // ✅ 포인트: 'about20s://' 바로 다음에 'link'라는 호스트를 넣어
    // 시스템이 슬래시를 추가하더라도 경로가 깨지지 않게 방어합니다.
    const appUrl = `about20s://link/${cleanPath}${sep}__t=${t}`;

    let didHide = false;
    const onVisibility = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 3. 리다이렉트 실행
    window.location.replace(appUrl);

    // 4. Fallback 처리
    const FALLBACK_MS = 1500;
    const timer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (!didHide) {
        window.location.replace(webUrl);
      }
    }, FALLBACK_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, [router.isReady, router.query.path]);

  return (
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
  );
}
