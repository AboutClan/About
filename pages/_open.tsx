import { useRouter } from "next/router";
import { useEffect } from "react";

const PKG = "com.about.studyaboutclubapp";
const WEB_FALLBACK = "https://study-about.club/";

export default function OpenInApp() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const raw = String(router.query.path || "");
    const path = raw.replace(/^\/+/, "") || "home";
    const webUrl = `${WEB_FALLBACK}${path}`;

    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    const schemeUrl = `about20s://${path}`;

    // 1) 즉시 앱 실행 시도
    if (isAndroid) {
      // intent는 Kakao 인앱브라우저에서 성공률이 더 높음
      const intentUrl = `intent://${path}#Intent;scheme=about20s;package=${PKG};end`;
      location.href = intentUrl;
    } else if (isIOS) {
      location.href = schemeUrl;
    } else {
      location.href = webUrl;
      return;
    }

    // 2) 실패 시 웹으로 fallback
    const t = setTimeout(() => {
      location.href = webUrl;
    }, 1500);

    return () => clearTimeout(t);
  }, [router.isReady, router.query.path]);

  // 로딩 UI는 아무거나
  return (
    <div style={{ padding: 24 }}>
      앱으로 여는 중...
      <br />안 열리면 잠시 후 웹으로 이동합니다.
    </div>
  );
}
