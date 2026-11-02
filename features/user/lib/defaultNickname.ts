export const NICKNAME_MAX_LENGTH = 6;

// 기본 닉네임 후보(useDefaultNicknamesQuery) 텍스트가 들어간 닉네임 = 가입 때 자동으로 붙은,
// 아직 직접 정하지 않은 닉네임
export const isDefaultNickname = (
  nickname: string | null | undefined,
  defaultNicknames: string[] | undefined,
) => !!nickname && !!defaultNicknames?.some((n) => nickname.includes(n));

// 닉네임 입력 검증. 통과하면 빈 문자열, 아니면 오류 문구
export const validateNickname = (
  value: string,
  currentNickname: string | undefined,
  allNicknames: string[] | undefined,
) => {
  const nickname = value.trim();
  // 지금 닉네임을 그대로 쓰는 건 길이와 상관없이 허용 (숫자가 붙은 기본 닉네임은 6자를 넘을 수 있음)
  if (nickname && nickname === currentNickname) return "";
  if (nickname.length < 1 || nickname.length > NICKNAME_MAX_LENGTH) {
    return `1~${NICKNAME_MAX_LENGTH}글자로 입력해주세요.`;
  }
  if (allNicknames?.includes(nickname)) return "이미 사용 중인 닉네임입니다.";
  return "";
};
