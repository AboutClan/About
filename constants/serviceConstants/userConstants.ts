import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

export const USER_ROLE = [
  "waiting",
  "guest",
  "newUser",
  "human",
  "member",
  "manager",
  "previliged",
  "resting",
  "enthusiastic",
] as const;

export const ABOUT_USER_SUMMARY: IUserSummary = {
  _id: "65df1ddcd73ecfd250b42c89",
  uid: "3224546232",
  name: "어바웃",
  profileImage:
    "http://k.kakaocdn.net/dn/emQopv/btsIr9fmn76/kBSeJ7Mdmyf6QNvlaM6X11/img_110x110.jpg",
  isActive: true,
  birth: "000101",
  comment: "어바웃 운영진 계정입니다.",
  score: 10000,
  avatar: {
    type: null,
    bg: null,
  },
  location: "수원",
  monthScore: 30,
};
export const SECRET_USER_SUMMARY: IUserSummary = {
  _id: "",
  uid: "",
  name: "익명",
  profileImage: "",
  isActive: true,
  birth: "000101",
  comment: "익명",
  score: 10000,
  avatar: {
    type: 0,
    bg: 7,
  },
  location: "수원",
  monthScore: 30,
};
