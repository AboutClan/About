/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { registerPushServiceWithApp } from "./apis";
import { DeviceInfo } from "./types";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  useEffect(() => {

    if (!uid) {
      return;
    }

    if (!isWebView()) {
      return;
    }

    const initializePushService = async () => {
      try {
        await waitForDeviceInfo(uid);
      } catch (e) {
        console.error("[PushInit] waitForDeviceInfo error", e);
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
    };

    const finishResolve = (deviceInfo: DeviceInfo) => {
      if (settled) return;
      settled = true;
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

      let data: any;
      try {
        data = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch (e) {
        console.warn(TAG, "JSON parse failed (ignore this message)", e);
        return; // 다른 메시지일 수 있으니 reject하지 않음
      }

      if (data?.name !== "deviceInfo") {
        return;
      }

      const deviceInfo = data as DeviceInfo;


      try {
        await registerPushServiceWithApp({
          uid,
          fcmToken: (deviceInfo as any)?.fcmToken,
          platform: (deviceInfo as any)?.platform || "web",
        });

        if (typeof window !== "undefined") {
          (window as any).AboutAppBridge = (window as any).AboutAppBridge || {};
          (window as any).AboutAppBridge.platform = (deviceInfo as any)?.platform || "web";
          (window as any).__ABOUT_PLATFORM__ = (deviceInfo as any)?.platform || null;
        }

        finishResolve(deviceInfo);
      } catch (e) {
        console.error(TAG, "registerPushServiceWithApp ❌ failed", e);
        finishReject(e);
      }
    };


    window.addEventListener("message", handleDeviceInfo as any);
    document.addEventListener("message", handleDeviceInfo as any);

    try {
      nativeMethodUtils.getDeviceInfo();
    } catch (e) {
      console.error(TAG, "nativeMethodUtils.getDeviceInfo() threw", e);
      finishReject(e);
    }
  });
};
