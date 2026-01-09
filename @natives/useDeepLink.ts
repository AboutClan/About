/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/router";
import { useEffect } from "react";

const sendMessageToNative = (message: { type: "webviewReady" }) => {
  if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
    return true;
  }
  return false;
};

export const useDeepLink = () => {
  const router = useRouter();

  useEffect(() => {
    const log = (...args: any[]) => console.log("[DL]", ...args);

    const handleMessage = (event: any) => {
      const raw = event?.data ?? event?.nativeEvent?.data;

      if (!raw) {
        log("raw is empty");
        return;
      }

      // RN WebView 쪽에서 string으로 오지만, 혹시 모를 케이스 방어
      const text =
        typeof raw === "string"
          ? raw
          : (() => {
              try {
                return JSON.stringify(raw);
              } catch {
                return String(raw);
              }
            })();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        log("JSON.parse failed:", text.slice(0, 160));
        return;
      }

      // 우리가 처리할 건 { name: "deeplink", path, params } 만
      if (data?.name !== "deeplink") {
        // log("ignore message:", data?.name);
        return;
      }

      const path = typeof data?.path === "string" ? data.path : "";
      const params = data?.params && typeof data.params === "object" ? data.params : {};

      if (!path) {
        log("deeplink missing path:", data);
        return;
      }

      const qs =
        Object.keys(params).length > 0
          ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
          : "";

      const target = `${path}${qs}`;
      log("navigate:", target);

      // 중복 이동 방지(가끔 같은 메시지가 2번 올 수 있음)
      if (router.asPath === target) {
        log("skip (already on target)");
        return;
      }

      router.push(target).catch((err) => {
        log("router.push error:", err?.message ?? String(err));
      });
    };

    // ✅ RN WebView는 환경에 따라 window/document 둘 중 하나로 들어올 수 있음
    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    // ✅ 리스너 붙인 다음 webviewReady
    const sent = sendMessageToNative({ type: "webviewReady" });
    log("webviewReady sent:", sent ? "OK" : "NO ReactNativeWebView");

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return null;
};
