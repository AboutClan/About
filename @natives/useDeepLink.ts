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

      const rawParams = data?.params && typeof data.params === "object" ? data.params : {};
      if (!path) return;
      const cleanedParams: Record<string, string> = {};
      Object.entries(rawParams).forEach(([k, v]) => {
        const key = k.startsWith("?") ? k.slice(1) : k; // ✅ 핵심
        if (!key) return;
        cleanedParams[key] = String(v ?? "");
      });

      const qs =
        Object.keys(cleanedParams).length > 0
          ? `?${new URLSearchParams(cleanedParams).toString()}`
          : "";
      const target = `${path}${qs}`;

      log("deeplink:", target);

      // ✅ 토큰 없으면 일단 보관 (화면 렌더 조건 때문에)
      if (!token) {
        pendingRef.current = target;
        return;
      }

      router.push(target).catch(() => {});
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    // webviewReady는 그대로 전송
    (window as any)?.ReactNativeWebView?.postMessage?.(JSON.stringify({ type: "webviewReady" }));

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, [router, token]);

  return null;
};
