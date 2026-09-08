import { REGISTER_GENDER } from "@/constants/keys/localStorage";
import { getLocalStorageObj, setLocalStorageObj } from "@/utils/storageUtils";

export type Gender = "남성" | "여성";

/**
 * 성별 값은 출처마다 표기가 다르다.
 * - 유저가 고른 값 / 가입 신청서: "남성" | "여성"
 * - 카카오 프로필, 승인 전 유저 문서: "male" | "female"
 * - NICE 본인인증 결과: "1" | "2"
 * 비교 전에 항상 이 함수로 한글 라벨에 맞춘다.
 */
export function normalizeGender(raw: unknown): Gender | null {
  if (raw === "남성" || raw === "male" || raw === "1") return "남성";
  if (raw === "여성" || raw === "female" || raw === "2") return "여성";
  return null;
}

/**
 * 가입비는 성별에 따라 달라지는데(남성 +5,000원), 정작 결제 화면인 /register/access에서는
 * 성별을 읽을 곳이 없다:
 * - POST /register 로 만든 가입 신청서의 성별은 승인(POST /register/approval) 시점에야
 *   유저 문서로 옮겨지고, 그 승인은 결제가 끝난 뒤에 일어난다.
 * - 그래서 GET /user/profile 의 gender는 이 구간에서 비어 있거나 카카오 원본("male")이다.
 * - REGISTER_INFO 는 가입 신청 완료 직후 비워지므로 결제 화면까지 남지 않는다.
 *
 * 그래서 유저가 성별을 고른 시점에 성별만 따로 저장해 결제 화면까지 들고 간다.
 * 공용 브라우저에서 이전 사람의 값이 남아 다른 금액이 청구되지 않도록 uid를 함께 저장하고,
 * 읽을 때 uid가 일치할 때만 사용한다.
 */
interface StoredRegisterGender {
  uid: string;
  gender: Gender;
}

export function saveRegisterGender(uid: string | undefined, gender: Gender) {
  if (!uid) return;
  setLocalStorageObj(REGISTER_GENDER, { uid, gender } satisfies StoredRegisterGender);
}

export function getRegisterGender(uid: string | undefined): Gender | null {
  if (!uid) return null;
  const stored: StoredRegisterGender | null = getLocalStorageObj(REGISTER_GENDER);
  if (stored?.uid !== uid) return null;
  return normalizeGender(stored.gender);
}

export function clearRegisterGender() {
  setLocalStorageObj(REGISTER_GENDER, null);
}
