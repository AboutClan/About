// hooks/useKakaoShare.ts
import dayjs from "dayjs";

import { isWebView } from "../../utils/appEnvUtils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

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
    console.log(1, url);
    if (isWebView()) {
      console.log(2, url);
      nativeMethodUtils.share(url);
      return;
    }

    if (!window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
    }

    const formattedDate = date ? ` (${dayjsToFormat(dayjs(date), "M월 D일")})` : "";
    const buttonTitle = extraCnt && extraCnt < 4 ? `${extraCnt}자리 남음!` : "모임 확인하기";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.Kakao.Link as any).sendDefault({
      objectType: "feed",
      content: {
        title: `${title}${formattedDate}`,
        description: subtitle,
        imageUrl: img,
        imageWidth: 400,
        imageHeight: 200,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: buttonTitle,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  };

  return { shareToKakao };
}
