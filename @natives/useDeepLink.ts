import { useRouter } from "next/router";
import { useEffect } from "react";

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
        toast("success", data?.name, data);
        console.log("📩 Parsed data:", data?.name);

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
};
