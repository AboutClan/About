import { IUser, UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

export const getPlaceBranch = (text: string, isShort?: boolean) => {
  if (!text) return "";
  const textArr = text.split(" ");
  if (isShort) return textArr?.[1] || textArr?.[0];
  return textArr[0] + " " + (textArr?.[1] || "");
};

export const findParentheses = (text: string) => {
  const regex = /\(.*?\)/g; // 'g' 플래그를 추가하여 모든 일치 항목을 찾습니다.
  const found = text.match(regex);

  if (found) {
    return found; // 발견된 모든 소괄호를 포함한 문자열을 배열로 반환
  } else {
    return null; // 일치하는 결과가 없을 경우의 메시지
  }
};

export const getLocationSimpleText = (locationText: string) => {
  const locationArr = locationText.split(" ");
  return locationArr[0] + " " + locationArr?.[1];
};

export const parseUrlToSegments = (url) => {
  if (!url) return null;
  const queryStartIndex = url.indexOf("?");
  const basePath = queryStartIndex >= 0 ? url.substring(0, queryStartIndex) : url;
  const segments = basePath.split("/").filter(Boolean);
  return segments;
};

export const searchName = (
  users: IUser[] | UserSimpleInfoProps[] | UserSimpleInfoProps[],
  name: string,
) => {
  if (!users || !name) return;
  const nameLength = name.length;

  return users.filter((user) => {
    if (!user.name) return false;
    const userName = user.name;

    if (nameLength === 1) {
      // 이름에 해당 글자가 포함되는 경우

      return userName.includes(name);
    }

    if (nameLength === 2) {
      // 앞 두 글자 또는 뒤 두 글자가 같은 경우
      return userName.slice(0, 2) === name || userName.slice(-2) === name;
    }

    if (nameLength === 3) {
      // 이름 전체가 같은 경우
      return userName === name;
    }

    // 그 외에는 일치하지 않음
    return false;
  });
};

/**
 * 실명 노출을 막는 마스킹. 가운데 글자만 *로 가린다. (김철수 → 김*수, 김수 → 김*)
 * 카공지도는 어바웃 회원 실명을 그대로 보여주면 안 되는 외부 서비스라
 * 이름을 그리는 지점은 모두 이걸 거친다.
 */
export const maskUserName = (name: string | undefined | null) => {
  if (!name) return "익명";
  if (name.length <= 1) return name;
  return name.slice(0, 1) + "*" + name.slice(2);
};
