import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { urlBase64ToUint8Array } from "../../utils/convertUtils/convertBase64";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { registerPushServiceWithApp, registerPushServiceWithPWA } from "./apis";
import { DeviceInfo } from "./types";
import { requestNotificationPermission } from "./utils";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  useEffect(() => {
    const initializePushService = async () => {
      if (isWebView()) {
        try {
          const deviceInfo = await waitForDeviceInfo(uid);
          console.log(deviceInfo);
        } catch (e) {
          console.log("error");
        }
      } else {
        await initializePWAPushService();
      }
    };

    initializePushService();
  }, [uid]);
};
const waitForDeviceInfo = (uid?: string): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    const handleDeviceInfo = async (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.name !== "deviceInfo") return;

        const deviceInfo = data;

        await registerPushServiceWithApp({
          uid,
          fcmToken: deviceInfo.fcmToken,
          platform: deviceInfo?.platform || "android",
        });

        resolve(deviceInfo); // ✅ deviceInfo 반환 가능
        window.removeEventListener("message", handleDeviceInfo);
      } catch (e) {
        reject(e);
        window.removeEventListener("message", handleDeviceInfo);
      }
    };

    window.addEventListener("message", handleDeviceInfo);
    document.addEventListener("message", handleDeviceInfo);
    nativeMethodUtils.getDeviceInfo();
  });
};
const initializePWAPushService = async () => {
  try {
    const hasPermission = await requestNotificationPermission();

    if (!hasPermission) return;
    const registration =
      (await navigator.serviceWorker.getRegistration()) ||
      (await navigator.serviceWorker.register("/worker.js", { scope: "/" }));

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const publicVapidKey = process.env.NEXT_PUBLIC_PWA_KEY;
      if (!publicVapidKey) throw new Error("Missing NEXT_PUBLIC_PWA_KEY");

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      console.log("New subscription created.");
    } else {
      console.log("Existing subscription found.");
    }
    console.log("subs", subscription);

    // 서버에 구독 정보 전송
    const response = await registerPushServiceWithPWA(subscription);
    console.log(1342, response);
    if (response) {
      console.log("Successfully registered push subscription with the server.");
    }
  } catch (error) {
    console.error("Failed to initialize PWA push service:", error);
  }
};
