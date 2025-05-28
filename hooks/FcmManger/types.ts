import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

export interface DeviceInfo extends Pick<IUserSummary, "uid"> {
  fcmToken: string;
  deviceId?: string;
  platform: "android" | "ios" | "web";
}
