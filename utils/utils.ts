import * as CryptoJS from "crypto-js";

export const getUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    console.error("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    if (onError) onError(new Error("Geolocation not supported"));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("위치 정보:", position.coords);
      if (onSuccess) onSuccess(position);
    },
    (error) => {
      console.error("위치 가져오기 실패:", error);
      if (onError) onError(error);
    },
  );
};

const key = "ESWwoYQplyTZN+vifnWcRA==";

export const decodeByAES256 = (encodedTel: string) => {
  try {
    // console.log(4, key);
    if (!key) return encodedTel;

    const bytes = CryptoJS.AES.decrypt(encodedTel, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    return "Decryption Failed";
  }
};
// 전화번호 모양 판별(대충 +82/0 시작 허용, 숫자/공백/하이픈)
const looksLikePlainTel = (s: string) => /^[+]?[\d][\d\s-]{7,18}$/.test(s);

const normalizeCipher = (s: string) => {
  // 1) 공백이 +로 깨진 경우 복구
  const v = s.replace(/ /g, "+").trim();
  // // 2) 이중 따옴표로 감싼 경우 언래핑
  // if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
  //   try { v = JSON.parse(v); } catch {}
  // }
  return v;
};

export const safeDecodeTel = (input: unknown): string => {
  const raw = (input ?? "").toString().trim();
  if (!raw) return "";

  // 평문이면 그대로
  if (looksLikePlainTel(raw)) return raw;

  // 키 없으면 원본
  if (!key) return raw;

  try {
    const cipher = normalizeCipher(raw);
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    const out = bytes.toString(CryptoJS.enc.Utf8).trim();

    // 복호 결과가 정상 전화번호면 사용, 아니면 원본 유지
    return looksLikePlainTel(out) ? out : raw;
  } catch {
    return raw;
  }
};
