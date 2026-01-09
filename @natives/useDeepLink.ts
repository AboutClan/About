/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";

const sendMessageToNative = (message: { type: "webviewReady" }) => {
  if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
    return true;
  }
  return false;
};

export const useDeepLink = () => {
  useEffect(() => {
    sendMessageToNative({ type: "webviewReady" });
  }, []);

  // const router = useRouter();
  // const toast = useToast();

  // useEffect(() => {
  //   const t = (title: string, desc?: any) => {
  //     toast("success", title + "/" + typeof desc === "string" ? desc : JSON.stringify(desc));
  //   };

  //   t("DL: hook mounted");

  //   const handleMessage = (event: any) => {
  //     const raw = event?.data ?? event?.nativeEvent?.data;

  //     t("DL: message fired", {
  //       rawType: typeof raw,
  //       rawPreview: typeof raw === "string" ? raw.slice(0, 80) : String(raw),
  //     });

  //     if (!raw) {
  //       t("DL: raw is empty");
  //       return;
  //     }

  //     try {
  //       const text = typeof raw === "string" ? raw : JSON.stringify(raw);

  //       let data: any;
  //       try {
  //         data = JSON.parse(text);
  //       } catch {
  //         t("DL: JSON.parse fail", text.slice(0, 120));
  //         return;
  //       }

  //       t("DL: parsed", { name: data?.name, path: data?.path });

  //       if (data?.name !== "deeplink") {
  //         t("DL: ignore (not deeplink)", data?.name);
  //         return;
  //       }

  //       const params = data?.params ?? {};
  //       const qs = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : "";

  //       const target = `${data.path}${qs}`;
  //       t("DL: navigating", target);

  //       router.push(target);
  //     } catch (e: any) {
  //       t("DL: error", e?.message ?? String(e));
  //       console.error("❌ Failed to parse message:", e, raw);
  //     }
  //   };

  //   // ✅ 리스너 먼저
  //   window.addEventListener("message", handleMessage);
  //   document.addEventListener("message", handleMessage);
  //   t("DL: listeners attached");

  //   // ✅ webview ready 전송
  //   const sent = sendMessageToNative({ type: "webviewReady" });
  //   t("DL: webviewReady sent", sent ? "OK" : "NO ReactNativeWebView");

  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //     document.removeEventListener("message", handleMessage);
  //     t("DL: listeners removed");
  //   };
  // }, [router, toast]);

  // return null;
};
