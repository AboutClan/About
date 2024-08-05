import { useEffect } from "react";

import { isWebView } from "../../utils/appEnvUtils";
import { urlBase64ToUint8Array } from "../../utils/convertUtils/convertBase64";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { isEmpty } from "../../utils/validationUtils";
import { registerPushServiceWithApp, registerPushServiceWithPWA } from "./apis";
import { DeviceInfo } from "./types";
import { requestNotificationPermission } from "./utils";

export const usePushServiceInitialize = () => {
  useEffect(() => {
    if (isWebView()) {
      const deviceInfoMessageListener = ({ data }: MessageEvent) => {
        if (typeof data === "string" && data.includes("deviceInfo")) {
          subscribePushServiceOnAPP(data);
        }
      };

      window.addEventListener("message", deviceInfoMessageListener);

      nativeMethodUtils.getDeviceInfo();

      return () => {
        window.removeEventListener("message", deviceInfoMessageListener);
      };
    } else {
      subscribePushServiceOnPWA();
    }
  }, []);
};

const subscribePushServiceOnAPP = async (data: string) => {
  try {
    const deviceInfos: DeviceInfo = data ? JSON.parse(data) : {};
    const hasInfos = !isEmpty(deviceInfos);

    if (hasInfos) {
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
    const register = await navigator.serviceWorker.register("/worker.js", {
      scope: "/",
    });
    const hasSubscription = await register.pushManager.getSubscription();

    if (hasSubscription) {
      return;
    }

    const publicVapidKey = process.env.NEXT_PUBLIC_PWA_KEY;
    const subscription = await register?.pushManager.subscribe({
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
