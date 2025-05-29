import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { urlBase64ToUint8Array } from "../../utils/convertUtils/convertBase64";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { useToast } from "../custom/CustomToast";
import { registerPushServiceWithApp, registerPushServiceWithPWA } from "./apis";
import { DeviceInfo } from "./types";
import { requestNotificationPermission } from "./utils";

export const usePushServiceInitialize = ({ uid }: { uid?: string }) => {
  const toast = useToast();
  useEffect(() => {
    if (!uid) return;
    const initializePushService = async () => {
      if (isWebView()) {
        toast("info", "어플로 접속중입니다.");
        console.log("isWebView");
        const A = await initializeAppPushService(uid);
        if (uid === "2259633694") {
          toast("info", A?.platform);
        }
      } else {
        console.log("noWeb");
        await initializePWAPushService();
      }
    };

    initializePushService();
  }, [uid]);
};

export const initializeAppPushService = (uid?: string): Promise<DeviceInfo | null> => {
  return new Promise((resolve, reject) => {
    const handleDeviceInfo = async (event: MessageEvent) => {
      try {
        const { data } = event;
        if (typeof data !== "string" || !data.includes("deviceInfo")) return;

        const deviceInfo: DeviceInfo = JSON.parse(data);
        if (!uid || !deviceInfo?.fcmToken) {
          resolve(null);
          return;
        }

        await registerPushServiceWithApp({
          uid,
          fcmToken: deviceInfo.fcmToken,
          platform: deviceInfo.platform || "android", // fallback
        });

        resolve(deviceInfo);
      } catch (error) {
        console.error("Error handling device info:", error);
        reject(error);
      } finally {
        window.removeEventListener("message", handleDeviceInfo);
      }
    };

    window.addEventListener("message", handleDeviceInfo);
    nativeMethodUtils.getDeviceInfo();

    // Optional: 타임아웃 처리
    setTimeout(() => {
      window.removeEventListener("message", handleDeviceInfo);
      resolve(null); // 또는 reject(new Error('Timeout'));
    }, 5000); // 5초 내 미응답 시
  });
};

const initializePWAPushService = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    console.log(42, hasPermission);
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
