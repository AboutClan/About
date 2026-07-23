import { PlaceSpaceType,StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";

// 장소명/주소 문자열 검사나 ID 하드코딩이 아니라, 데이터 필드(spaceType/brand)만으로 판별한다.
// 필드가 없는 기존 일반 카페는 항상 "cafe"로 취급된다.
export const getPlaceSpaceType = (place: StudyPlaceProps): PlaceSpaceType => place.spaceType ?? "cafe";

export const isKagongjokPlace = (place: StudyPlaceProps): boolean =>
  place.spaceType === "study_space" && place.brand === "kagongjok";
