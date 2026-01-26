// hooks/useKakaoShare.ts
import dayjs from "dayjs";

import { isWebView } from "../../utils/appEnvUtils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

/**
 * rawUrl(절대 URL) -> "path?query" 형태로 변환
 * 예) https://study-about.club/study/123?type=results -> "study/123?type=results"
 */
const toPathFromUrl = (rawUrl: string) => {
  try {
    const u = new URL(rawUrl);

    const hostOk =
      u.host === "study-about.club" ||
      u.host === "www.study-about.club" ||
      u.host === "about20s.club" ||
      u.host === "www.about20s.club";

    if (!hostOk) return null;

    const path = u.pathname.replace(/^\/+/, "");
    const qs = u.search.replace(/^\?/, "");
    return qs ? `${path}?${qs}` : path || "home";
  } catch {
    return null;
  }
};

/**
 * 카카오 링크가 이미 /_open?path=... 형태라면,
 * 그 안의 path를 꺼내서 최종 path로 정규화.
 */
const extractPathFromOpenUrl = (rawUrl: string) => {
  try {
    const u = new URL(rawUrl);

    const hostOk =
      u.host === "study-about.club" ||
      u.host === "www.study-about.club" ||
      u.host === "about20s.club" ||
      u.host === "www.about20s.club";

    if (!hostOk) return null;
    if (u.pathname !== "/_open") return null;

    const p = u.searchParams.get("path");
    if (!p) return null;

    // path 파라미터는 이미 encodeURIComponent 되어있다고 가정
    const decoded = decodeURIComponent(p);
    const cleaned = decoded.replace(/^\/+/, "");
    return cleaned || "home";
  } catch {
    return null;
  }
};

/**
 * 공유 url이 상대경로로 들어오는 경우 방어
 * 예) "/group/149" -> "https://study-about.club/group/149"
 * 예) "group/149"  -> "https://study-about.club/group/149"
 */
const normalizeToAbsolute = (rawUrl: string) => {
  const s = String(rawUrl || "").trim();
  if (!s) return "";

  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  const path = s.replace(/^\/+/, "");
  return `https://study-about.club/${path}`;
};

/**
 * 카카오에서 사용할 link 객체 생성
 * - 웹 fallback: https://study-about.club/_open?path=...
 * - 앱 열기: androidExecutionParams/iosExecutionParams로 "path=..." 전달 (RN에서 이미 처리 중)
 */
const buildKakaoLink = (url: string) => {
  const abs = normalizeToAbsolute(url);

  // ✅ 혹시 url이 이미 /_open?path=... 형태면 unwrap 후 사용
  const unwrapped = extractPathFromOpenUrl(abs);

  // ✅ 최종 path 계산
  const path = unwrapped ?? toPathFromUrl(abs);
  if (!path) return { mobileWebUrl: abs, webUrl: abs };

  // ✅ 웹 fallback은 항상 _open으로 (study-about.club 유지)
  const openUrl = `https://study-about.club/_open?path=${encodeURIComponent(path)}`;

  // ✅ 앱 실행 파라미터 (RN: toAboutSchemeIfKakaoLink가 ?path=... 읽음)
  const execParams = `path=${encodeURIComponent(path)}`;

  return {
    webUrl: openUrl,
    mobileWebUrl: openUrl,
    androidExecutionParams: execParams,
    iosExecutionParams: execParams,
  };
};

export function useKakaoShare() {
  const shareToKakao = ({
    title,
    subtitle,
    img,
    url,
    date,
    extraCnt,
  }: {
    title: string;
    subtitle: string;
    img: string;
    url: string;
    date?: string;
    extraCnt?: number;
  }) => {
    // ✅ 앱(WebView)에서는 네이티브 공유 사용 (기존 유지)
    if (isWebView()) {
      nativeMethodUtils.share(url);
      return;
    }

    if (!window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
    }

    const formattedDate = date ? ` (${dayjsToFormat(dayjs(date), "M월 D일")})` : "";

    const buttonTitle = extraCnt && extraCnt < 4 ? `${extraCnt}자리 남음!` : "모임 확인하기";

    const link = buildKakaoLink(url);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.Kakao.Link as any).sendDefault({
      objectType: "feed",
      content: {
        title: `${title}${formattedDate}`,
        description: subtitle,
        imageUrl: img,
        imageWidth: 400,
        imageHeight: 200,
        link, // ✅ webUrl/mobileWebUrl + executionParams 포함
      },
      buttons: [{ title: buttonTitle, link }], // ✅ 동일 link 사용
    });
  };

  return { shareToKakao };
}
