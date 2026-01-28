// pages/_open.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OpenPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const raw = Array.isArray(router.query.path) ? router.query.path[0] : router.query.path;
    const path = typeof raw === "string" && raw.trim() ? raw.trim().replace(/^\/+/, "") : "home";

    const WEB_BASE = "https://study-about.club/";
    const webUrl = WEB_BASE + path;

    // ✅ 핵심: about20s://{path} 로 만든다 (/// 금지)
    const cleanPath = String(path || "").replace(/^\/+/, "") || "home";
    // 캐시/중복 방지용
    const t = Date.now();
    const sep = cleanPath.includes("?") ? "&" : "?";

    // ✅ 딥링크는 반드시 about20s:// 로
    const appUrl = `about20s://${cleanPath}${sep}__t=${t}`;
    const t0 = Date.now();
    let didHide = false;

    const onVisibility = () => {
      if (document.hidden) didHide = true;
    };

    document.addEventListener("visibilitychange", onVisibility);

    try {
      window.location.replace(appUrl);
    } catch {
      console.log(1);
    }

    // iOS/카카오 인앱에서 약간 넉넉히 주는 게 안정적일 때가 많음
    const FALLBACK_MS = 900;

    const timer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibility);
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

  return null;
}
