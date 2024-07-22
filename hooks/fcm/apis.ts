import axios from "axios";

import { SERVER_URI } from "../../constants/system";
import { DeviceInfo } from "./types";

export const registerPushServiceWithApp = async (deviceInfo: DeviceInfo) => {
  try {
    return await axios.post<null>(`${SERVER_URI}/fcm/register-token`, deviceInfo);
  } catch (error) {
    console.error("Failed to subscribe push service on app:", error);
  }
};

export const registerPushServiceWithPWA = async (subscription: PushSubscription) => {
  try {
    await axios.post<null>(`${SERVER_URI}/webpush/subscribe`, subscription);
  } catch (error) {
    console.error("Failed to subscribe push service on PWA:", error);
  }
};
