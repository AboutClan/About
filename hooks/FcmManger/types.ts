import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";

export interface DeviceInfo extends Pick<UserSimpleInfoProps, "uid"> {
  fcmToken: string;
  deviceId?: string;
  platform: "android" | "ios" | "web";
}
