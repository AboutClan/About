/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { registerPushServiceWithApp } from "./apis";
import { DeviceInfo } from "./types";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  useEffect(() => {
    if (!uid) return;
    const initializePushService = async () => {
      if (isWebView()) {
        try {
          await waitForDeviceInfo(uid);
        } catch (e) {
          console.error("error");
        }
      }
    };

    initializePushService();
  }, [uid]);
};
const waitForDeviceInfo = (uid?: string): Promise<DeviceInfo> => {
  const TAG = "[waitForDeviceInfo]";

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    let settled = false; // resolve/reject 중복 방지

    const cleanup = () => {
      window.removeEventListener("message", handleDeviceInfo as any);
      document.removeEventListener("message", handleDeviceInfo as any);
      clearTimeout(timeoutId);
      console.log(TAG, "cleanup done");
    };

    const finishResolve = (deviceInfo: DeviceInfo) => {
      if (settled) return;
      settled = true;
      console.log(TAG, "✅ RESOLVE", {
        tookMs: Date.now() - startedAt,
        uid,
        platform: (deviceInfo as any)?.platform,
        hasFcmToken: Boolean((deviceInfo as any)?.fcmToken),
      });
      cleanup();
      resolve(deviceInfo);
    };

    const finishReject = (err: any) => {
      if (settled) return;
      settled = true;
      console.error(TAG, "❌ REJECT", {
        tookMs: Date.now() - startedAt,
        uid,
        err,
      });
      cleanup();
      reject(err);
    };

    // ⏱️ deviceInfo가 안 오면 무한 대기 방지
    const timeoutId = setTimeout(() => {
      finishReject(new Error("deviceInfo timeout (no message received)"));
    }, 8000);

    const handleDeviceInfo = async (event: MessageEvent) => {
      // 어떤 타겟에서 왔는지(대충) 확인용
      const from = event?.currentTarget === window ? "window" : "document";

      const raw = (event as any)?.data;

      // 너무 시끄러우면 아래 로그는 주석 처리
      console.log(TAG, "message received", {
        from,
        rawType: typeof raw,
        rawPreview:
          typeof raw === "string" ? raw.slice(0, 200) : JSON.stringify(raw)?.slice(0, 200),
      });

      let data: any;
      try {
        data = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch (e) {
        console.warn(TAG, "JSON parse failed (ignore this message)", e);
        return; // 다른 메시지일 수 있으니 reject하지 않음
      }

      if (data?.name !== "deviceInfo") {
        console.log(TAG, "ignored message (not deviceInfo):", data?.name);
        return;
      }

      const deviceInfo = data as DeviceInfo;

      console.log(TAG, "🎯 deviceInfo received", {
        uid,
        platform: (deviceInfo as any)?.platform,
        fcmTokenLen: String((deviceInfo as any)?.fcmToken ?? "").length,
        appVersion: (deviceInfo as any)?.appVersion,
        buildNumber: (deviceInfo as any)?.buildNumber,
      });

      try {
        console.log(TAG, "calling registerPushServiceWithApp...");
        await registerPushServiceWithApp({
          uid,
          fcmToken: (deviceInfo as any)?.fcmToken,
          platform: (deviceInfo as any)?.platform || "web",
        });
        console.log(TAG, "registerPushServiceWithApp ✅ success");

        if (typeof window !== "undefined") {
          (window as any).AboutAppBridge = (window as any).AboutAppBridge || {};
          (window as any).AboutAppBridge.platform = (deviceInfo as any)?.platform || "web";
          console.log(TAG, "AboutAppBridge.platform set:", (window as any).AboutAppBridge.platform);
        }

        finishResolve(deviceInfo);
      } catch (e) {
        console.error(TAG, "registerPushServiceWithApp ❌ failed", e);
        finishReject(e);
      }
    };

    console.log(TAG, "start", { uid });

    window.addEventListener("message", handleDeviceInfo as any);
    document.addEventListener("message", handleDeviceInfo as any);

    console.log(TAG, "listeners attached -> requesting nativeMethodUtils.getDeviceInfo()");
    try {
      nativeMethodUtils.getDeviceInfo();
      console.log(TAG, "nativeMethodUtils.getDeviceInfo() sent");
    } catch (e) {
      console.error(TAG, "nativeMethodUtils.getDeviceInfo() threw", e);
      finishReject(e);
    }
  });
};
