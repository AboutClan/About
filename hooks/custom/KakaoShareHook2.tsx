// hooks/useKakaoShare.ts
import dayjs from "dayjs";

import { isWebView } from "../../utils/appEnvUtils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

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

const buildKakaoLink = (url: string) => {
  const path = toPathFromUrl(url);
  if (!path) return { mobileWebUrl: url, webUrl: url };

  const openUrl = `https://about20s.club/_open?path=${encodeURIComponent(path)}`;

  return {
    mobileWebUrl: openUrl,
    webUrl: openUrl,

    // ✅ 카카오톡이 앱 실행할 때 넘겨줄 파라미터
    // (kakao{NATIVE_APP_KEY}://kakaolink?{androidExecutionParams} 형태로 호출됨)
    androidExecutionParams: `path=${encodeURIComponent(path)}`,
    iosExecutionParams: `path=${encodeURIComponent(path)}`,
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
        link, // ✅ 여기
      },
      buttons: [{ title: buttonTitle, link }], // ✅ 여기
    });
  };

  return { shareToKakao };
}
