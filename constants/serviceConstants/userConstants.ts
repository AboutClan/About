import { IUser, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";

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
  "support",
  "block",
  "secede",
] as const;

export const ABOUT_USER_SUMMARY: Partial<IUser> = {
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

  monthScore: 30,
  temperature: {
    temperature: 36.5,
    cnt: 0,
  },
};

interface SecretUserInfos extends UserSimpleInfoProps {
  isActive: boolean;
  birth: string;
}

export const SECRET_USER_SUMMARY: SecretUserInfos = {
  _id: "",
  uid: "",
  name: "익명",
  profileImage: "",
  isActive: true,
  birth: "000101",
  comment: "익명",
  score: 10000,
  avatar: {
    type: 2,
    bg: 0,
  },
  badge: {
    badgeIdx: 0,
    badgeList: [],
  },

  monthScore: 30,

  temperature: {
    temperature: 36.5,
    cnt: 0,
  },
};
