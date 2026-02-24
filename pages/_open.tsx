import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // ✅ 현재 URL 전체에서 쿼리를 직접 파싱 (Next router.query는 타이밍/형태 이슈 있을 수 있음)
    const current = new URL(window.location.href);
    const params = new URLSearchParams(current.search);

    // 1) dl 추출
    const rawPath = params.get("dl");
    const cleanPath =
      typeof rawPath === "string" && rawPath.trim() ? rawPath.trim().replace(/^\/+/, "") : "home";

    // 2) dl은 경로로 썼으니 쿼리에서 제거
    params.delete("dl");

    // 3) 트래킹/캐시버스트 추가
    // params.set("__t", String(Date.now()));

    // ✅ dl 제외한 나머지 쿼리(= web_transaction_id 등)를 붙여서 전달
    const queryString = params.toString();
    const appUrl = `about20s://${cleanPath}${queryString ? `?${queryString}` : ""}`;

    const WEB_BASE = "https://study-about.club/";
    const webUrl = `${WEB_BASE}${cleanPath}${queryString ? `?${queryString}` : ""}`;

    let didHide = false;
    const onVisibility = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener("visibilitychange", onVisibility);

    window.location.replace(appUrl);

    const timer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (!didHide) window.location.replace(webUrl);
    }, 1500);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, [router.isReady]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 10,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: "bold" }}>앱 사용 유무를 확인중입니다...</p>
      <p style={{ color: "#666" }}>이동이 되지 않으면 잠시만 기다려 주세요.</p>
    </div>
  );
}
