/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const useDeepLink = ({ token }: { token?: string | null }) => {
  const router = useRouter();
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    // 토큰 생기면, pending 있으면 그때 이동
    if (token && pendingRef.current) {
      const target = pendingRef.current;
      pendingRef.current = null;
      router.replace(target).catch(() => {});
    }
  }, [token, router]);

  // useDeepLink.ts
  useEffect(() => {
    const log = (...args: any[]) => console.log("[DL]", ...args);

    const handleMessage = (event: any) => {
      const raw = event?.data ?? event?.nativeEvent?.data;
      if (!raw) return;

      let data: any;
      try {
        data = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
      } catch {
        return;
      }

      if (data?.name !== "deeplink") return;

      const path = typeof data?.path === "string" ? data.path : "";
      // ✅ 앱에서 보낸 'link/' 접두사를 제거하여 Next.js 경로로 복구
      const normalizedPath = path.startsWith("link/")
        ? "/" + path.replace("link/", "")
        : path.startsWith("/")
        ? path
        : "/" + path;

      const rawParams = data?.params && typeof data.params === "object" ? data.params : {};
      const cleanedParams: Record<string, string> = {};
      Object.entries(rawParams).forEach(([k, v]) => {
        const key = k.startsWith("?") ? k.slice(1) : k;
        if (key) cleanedParams[key] = String(v ?? "");
      });

      const qs =
        Object.keys(cleanedParams).length > 0
          ? `?${new URLSearchParams(cleanedParams).toString()}`
          : "";
      const target = `${normalizedPath}${qs}`;

      log("deeplink 최종 경로:", target);

      // ✅ 토큰이 아직 없다면 대기
      if (!token && !target.includes("login")) {
        log("토큰 대기 중... pendingRef에 저장");
        pendingRef.current = target;
        return;
      }

      router.push(target).catch((err) => log("이동 실패:", err));
    };

    // 1️⃣ 리스너를 먼저 등록하여 어떤 메시지도 놓치지 않게 함
    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    // 2️⃣ 리스너 등록이 확실히 끝난 뒤(200ms) 앱에 준비 신호를 보냄
    const timer = setTimeout(() => {
      (window as any)?.ReactNativeWebView?.postMessage?.(JSON.stringify({ type: "webviewReady" }));
    }, 200);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
      clearTimeout(timer);
    };
  }, [router, token]);
  return null;
};
