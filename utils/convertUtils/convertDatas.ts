import * as CryptoJS from "crypto-js";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import { enToKrMapping, krToEnMapping } from "../../constants/location";
import { USER_BADGE_ARR } from "../../constants/serviceConstants/badgeConstants";
import { StudyPlaceProps } from "../../types/models/studyTypes/baseTypes";
import { UserBadge, UserRole } from "../../types/models/userTypes/userInfoTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { ActiveLocation, Location, LocationEn } from "../../types/services/locationTypes";
import { getRandomImage } from "../imageUtils";

export const convertPlaceToStudyPlace = (place: PlaceInfoProps): StudyPlaceProps => {
  return {
    fullname: place.name,
    brand: "",
    branch: "",
    image: getRandomImage(STUDY_MAIN_IMAGES),
    latitude: place.latitude,
    longitude: place.longitude,
    coverImage: "",
    locationDetail: place.address,
    registerDate: "",
    _id: place._id,
    reviews: null,
  };
};

export const decodeByAES256 = (encodedTel: string) => {
  const key = process.env.NEXT_PUBLIC_CRYPTO_KEY;
  if (!key) return encodedTel;

  const bytes = CryptoJS.AES.decrypt(encodedTel, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export const getNextBadge = (currentBadge: UserBadge): UserBadge => {
  const idx = USER_BADGE_ARR.indexOf(currentBadge as (typeof USER_BADGE_ARR)[number]);
  if (idx === -1 || idx === USER_BADGE_ARR.length - 1) {
    return null;
  } else if (idx < USER_BADGE_ARR.length - 1) {
    return USER_BADGE_ARR[idx + 1];
  }
};

type ReturnLocationLang<T> = T extends "kr" ? ActiveLocation : LocationEn;

export const convertLocationLangTo = <T extends "kr" | "en">(
  location: Location | LocationEn,
  to: T,
): ReturnLocationLang<T> => {
  if (to === "kr") {
    return enToKrMapping[location as LocationEn] as ReturnLocationLang<T>;
  }
  if (to === "en") {
    return krToEnMapping[location as ActiveLocation] as ReturnLocationLang<T>;
  }

  throw new Error("Invalid 'to' parameter or location type");
};

export const getUserRole = (role: UserRole) => {
  switch (role) {
    case "human":
      return "수습 멤버";
    case "member":
      return "동아리원";
    case "manager":
      return "운영진";
    case "previliged":
      return "운영진";
    case "resting":
      return "휴식 멤버";
    case "enthusiastic":
      return "열활 멤버";
  }
};

export const getRestInfo = (restData: string) => {
  const [type, date, content] = restData.split(`/`);
  return {
    type,
    date,
    content,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffleArray = (array: any[]) => {
  if (!array) return;
  return array.sort(() => Math.random() - 0.5);
};
