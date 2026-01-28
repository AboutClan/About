import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // 1. 쿼리 파라미터에서 path 추출 및 정규화
    const rawPath = Array.isArray(router.query.path) ? router.query.path[0] : router.query.path;
    const cleanPath =
      typeof rawPath === "string" && rawPath.trim()
        ? rawPath.trim().replace(/^\/+/, "") // 앞쪽 슬래시 강제 제거
        : "home";

    const WEB_BASE = "https://study-about.club/";
    const webUrl = WEB_BASE + cleanPath;

    // 2. 딥링크 생성 (앱 정규식 통과용: about20s://path)
    // 앱 정규식 /^about20s:\/\/([^?]+)(\?.*)?$/ 에 최적화
    const t = Date.now();
    const sep = cleanPath.includes("?") ? "&" : "?";

    // ✅ 안드로이드 시스템이 슬래시를 자동으로 보정하는 경우를 대비해
    // 앱이 "데이터"라고 인식할 수 있는 순수 경로만 전달합니다.
    const appUrl = `about20s://${cleanPath}${sep}__t=${t}`;

    let didHide = false;
    const onVisibility = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 3. 앱 실행 시도
    // window.location.replace가 가끔 무시되는 브라우저 환경을 위해 iframe 방식 병행 고려 가능하나,
    // 현재는 앱이 켜지는 것은 확인되었으므로 replace를 유지합니다.
    window.location.replace(appUrl);

    // 4. Fallback: 앱 미설치 혹은 실행 실패 시 웹으로 리다이렉트
    const FALLBACK_MS = 1500; // 타이밍 이슈 방지를 위해 시간을 넉넉히 둡니다.
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
