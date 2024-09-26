import axios, { AxiosError, isAxiosError } from "axios";

import { SERVER_URI } from "../../constants/system";
import { requestServer } from "../../libs/methodHelpers";
import { DeviceInfo } from "./types";

const handleApiError = (error: unknown, context: string) => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      `Failed to ${context}:`,
      axiosError.response?.data?.message || axiosError.message,
    );
  } else {
    console.error(`Failed to ${context}:`, error);
  }
  throw error;
};

export const registerPushServiceWithApp = async (deviceInfo: DeviceInfo) => {
  try {
    const response = await requestServer({
      method: "post",
      url: "fcm/register-token",
      body: deviceInfo,
    });
    return response;
  } catch (error) {
    return handleApiError(error, "subscribe push service on app");
  }
};

export const registerPushServiceWithPWA = async (subscription: PushSubscription) => {
  try {
    const response = await axios.post(`${SERVER_URI}/webpush/subscribe`, subscription);
    return response.data;
  } catch (error) {
    return handleApiError(error, "subscribe push service on PWA");
  }
};
