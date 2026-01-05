/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { useToast } from "../hooks/custom/CustomToast";

const sendMessageToNative = (message: { type: "webviewReady" }) => {
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
};

export const useDeepLink = () => {
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    console.log("🌐 Setting up webview message listener...");

    // 네이티브에게 웹뷰가 준비되었음을 알림
    sendMessageToNative({ type: "webviewReady" });
    console.log("🌐 Sent webviewReady message to native");

    const handleMessage = (event: MessageEvent) => {
      console.log("🌐 Message event received:", event);
      console.log("🌐 Message data type:", typeof event.data);
      console.log("🌐 Message data:", event.data);

      if (typeof event.data !== "string") {
        console.log("🌐 Ignoring non-string message");
        return;
      }

      try {
        const data = JSON.parse(event.data);
        console.log("📩 Parsed data:", data);
        toast("success", data);

        if (data.name !== "deeplink") {
          console.log("🌐 Not a deeplink message, ignoring");
          return;
        }

        console.log("📩 Deep link data:", data);
        const target = `${data.path}${
          Object.keys(data.params).length > 0
            ? "?" + new URLSearchParams(data.params).toString()
            : ""
        }`;

        console.log("📩 Navigating to:", target);
        router.push(target);
      } catch (error) {
        console.error("❌ Failed to parse message data:", error);
      }
    };

    // iOS와 Android 모두 지원
    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      console.log("🌐 Removing webview message listener...");
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, [router]);

  const pendingTargetRef = useRef<string | null>(null);
  useEffect(() => {
    if (!router.isReady) return;

    // webviewReady 유실 방지: 0ms/300ms/800ms 정도로 2~3번만 재시도
    const timers = [
      setTimeout(() => sendMessageToNative({ type: "webviewReady" }), 0),
      setTimeout(() => sendMessageToNative({ type: "webviewReady" }), 300),
      setTimeout(() => sendMessageToNative({ type: "webviewReady" }), 800),
    ];

    const handleMessage = (event: MessageEvent) => {
      let payload: any = event.data;

      // string이면 parse 시도
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      toast("error", payload);
      if (!payload || payload.name !== "deeplink") return;

      const path = payload.path ?? "/";
      const params: Record<string, string> = payload.params ?? {};

      const qs = Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : "";

      const target = `${path}${qs}`;

      // 혹시 라우터가 바쁠 때를 대비해 1번 저장 후 처리
      pendingTargetRef.current = target;
      router.push(target).catch(() => {});
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as any);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as any);
    };
  }, [router.isReady]); // router 객체 전체 말고 isReady만
};
