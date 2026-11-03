import { AVATAR_IMAGES } from "@/assets/images/avatarImages";
import { COLOR_TABLE_LIGHT } from "@/constants/colorConstants";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

/**
 * 모임 화면에서 멤버를 보여 주는 규칙: 익명 처리 없이 그 멤버의 아바타/프로필 사진과 닉네임을 보여 준다.
 * 닉네임이 없는 경우(주로 구글폼으로만 신청해 회원과 연결되지 않은 신청자)는 기본 닉네임 중 하나를 쓴다.
 * 기본 닉네임 목록(pool)은 서버 RANDOM_NICKNAME_POOL을 useDefaultNicknamesQuery로 받아 넘긴다.
 */

/** 목록을 아직 못 받았을 때 */
const FALLBACK_NICKNAME = "어바웃 멤버";

const hashText = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
};

/** seed가 같으면 늘 같은 기본 닉네임 */
export const getFallbackNickname = (seed: string, pool?: readonly string[]) =>
  pool?.length ? pool[hashText(seed) % pool.length] : FALLBACK_NICKNAME;

/** seed가 같으면 늘 같은 기본 아바타(캐릭터·배경색) */
export const getFallbackAvatar = (seed: string) => ({
  type: hashText(seed) % AVATAR_IMAGES.length,
  bg: hashText(`${seed}-bg`) % COLOR_TABLE_LIGHT.length,
});

/** 화면에 쓸 이름: 닉네임, 없으면 기본 닉네임 */
export const getDisplayNickname = (
  user: (Partial<UserSimpleInfoProps> & { nickname?: string }) | undefined,
  seed: string,
  pool?: readonly string[],
) => user?.nickname || getFallbackNickname(seed, pool);

/**
 * ProfileCommentCard 등 이름을 그리는 컴포넌트에 넘길 때 name·nickname 자리에 닉네임을 넣는다.
 * (getDisplayName은 nickname이 비면 name을 마스킹하므로 nickname도 채워야 기본 닉네임이 그대로 보인다)
 */
export const withDisplayNickname = <T extends Partial<UserSimpleInfoProps>>(
  user: T,
  seed: string,
  pool?: readonly string[],
  /** 관리자·모임장이 볼 때: "닉네임 (실명)" */
  showRealName?: boolean,
) => {
  const displayName = withRealName(
    getDisplayNickname(user, seed, pool),
    showRealName ? user?.name : null,
  );
  return { ...user, name: displayName, nickname: displayName } as T;
};

/** "닉네임 (실명)". 실명이 없거나 닉네임과 같으면 닉네임만 */
export const withRealName = (nickname: string, realName?: string | null) =>
  realName && realName !== "익명" && realName !== nickname ? `${nickname} (${realName})` : nickname;

/** 공개 페이지(/gather/[id]/p)에서 멤버 프로필을 눌렀을 때 */
export const PUBLIC_PROFILE_LOCKED_TOAST = "참여자끼리만 서로 확인할 수 있어요.";

/** 모임 참여자·신청자의 실명까지 볼 수 있는 사람: 운영진(previliged·manager) 또는 그 모임의 모임장 */
export const canSeeRealName = (
  viewer: { _id?: string; role?: string } | undefined | null,
  organizer: { _id?: string } | string | undefined | null,
) => {
  if (!viewer) return false;
  if (viewer.role === "previliged" || viewer.role === "manager") return true;
  const organizerId = typeof organizer === "string" ? organizer : organizer?._id;
  return !!viewer._id && viewer._id === organizerId;
};
