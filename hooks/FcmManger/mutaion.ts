import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { urlBase64ToUint8Array } from "../../utils/convertUtils/convertBase64";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { isEmpty, isNil } from "../../utils/validationUtils";
import { registerPushServiceWithApp, registerPushServiceWithPWA } from "./apis";
import { DeviceInfo } from "./types";
import { requestNotificationPermission } from "./utils";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  useEffect(() => {
    const initializePushService = async () => {
      if (isWebView()) {
        console.log("isWebView");
        await initializeAppPushService(uid);
      } else {
        console.log("noWeb");
        await initializePWAPushService();
      }
    };

    initializePushService();
  }, [uid]);
};

const initializeAppPushService = async (uid?: string) => {
  const handleDeviceInfo = async (event: MessageEvent) => {
    try {
      const { data } = event;
      if (typeof data !== "string" || !data.includes("deviceInfo")) return;

      const deviceInfo: DeviceInfo = JSON.parse(data);
      if (isNil(uid) || isEmpty(deviceInfo)) return;

      await registerPushServiceWithApp({
        uid,
        fcmToken: deviceInfo.fcmToken,
        deviceId: deviceInfo.deviceId,
      });
    } catch (error) {
      console.error("Error handling device info:", error);
    }
  };

  window.addEventListener("message", handleDeviceInfo);
  nativeMethodUtils.getDeviceInfo();

  return () => {
    window.removeEventListener("message", handleDeviceInfo);
  };
};

const initializePWAPushService = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    console.log(42, hasPermission);
    if (!hasPermission) return;
    const registration =
      (await navigator.serviceWorker.getRegistration()) ||
      (await navigator.serviceWorker.register("/worker.js", { scope: "/" }));
    console.log("regist", registration);
    let subscription = await registration.pushManager.getSubscription();
    console.log("SUB", subscription);
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
