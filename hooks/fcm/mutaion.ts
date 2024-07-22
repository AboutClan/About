import { isEmpty } from "lodash-es";
import { useEffect } from "react";

import { isPWA, isWebView } from "../../utils/appEnvUtils";
import { urlBase64ToUint8Array } from "../../utils/convertUtils/convertBase64";
import { registerPushServiceWithApp, registerPushServiceWithPWA } from "./apis";
import { DeviceInfo } from "./types";
import { requestNotificationPermission } from "./utils";

export const usePushServiceInitialize = () => {
  useEffect(() => {
    if (isPWA()) {
      subscribePushServiceOnPWA();
    }

    if (isWebView()) {
      const deviceInfoMessageListener = ({ data }: MessageEvent) => {
        if (typeof data === "string" && data.includes("deviceInfo")) {
          subscribePushServiceOnAPP(data);
        }
      };

      window.addEventListener("message", deviceInfoMessageListener);

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("getDeviceInfo");
      }

      return () => {
        window.removeEventListener("message", deviceInfoMessageListener);
      };
    }
  }, []);
};

const subscribePushServiceOnAPP = async (data: string) => {
  try {
    const deviceInfos: DeviceInfo = JSON.parse(data);
    if (!isEmpty(deviceInfos)) {
      await registerPushServiceWithApp({
        fcmToken: deviceInfos.fcmToken,
        platform: deviceInfos.platform,
      });
    }
  } catch (err) {
    console.error("Error parsing device info message:", err);
  }
};

const subscribePushServiceOnPWA = async () => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const hasSubscription = await registration?.pushManager.getSubscription();

    if (hasSubscription) {
      return;
    }

    const publicVapidKey = process.env.NEXT_PUBLIC_PWA_KEY;
    const subscription = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    if (subscription) {
      await registerPushServiceWithPWA(subscription);
      console.log("Subscribed to push service successfully");
    }
  } catch (err) {
    console.error("Failed to subscribe to push service on PWA:", err);
  }
};
