import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";

import { isWebView } from "../../utils/appEnvUtils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

const kakaoAppKey = "05926725a12017416a7d5059eb8e3af4";

interface IKakaoShareBtn {
  title: string;
  subtitle: string;
  img: string;
  url: string;
  isBig?: boolean;
  isFull?: boolean;
  temp?: boolean;
  isTemp?: boolean;
  date?: string;
  extraCnt?: number;
  variant?: "unstyled";
}

function KakaoShareBtn({
  title,
  subtitle,
  img,
  url,
  isBig,
  isFull,
  temp,
  isTemp,
  variant,
  date,
  extraCnt,
}: IKakaoShareBtn) {
  // ✅ 유니크 컨테이너 id (같은 화면에 여러 개 있어도 안 꼬임)
  const containerId = useMemo(() => {
    const safe = (url || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
    return `kakao-share-button-${safe || "default"}`;
  }, [url]);

  const handleShareOnApp = useCallback(() => {
    if (isWebView()) nativeMethodUtils.share(url);
  }, [url]);

  const toPathFromUrl = (rawUrl: string) => {
    try {
      const u = new URL(rawUrl);

      const hostOk =
        u.host === "study-about.club" ||
        u.host === "www.study-about.club" ||
        u.host === "about20s.club" || // ✅ 단축 도메인도 허용
        u.host === "www.about20s.club"; // ✅

      if (!hostOk) return null;

      const path = u.pathname.replace(/^\/+/, "");
      const qs = u.search.replace(/^\?/, "");
      const merged = qs ? `${path}?${qs}` : path;
      return merged || "home";
    } catch {
      return null;
    }
  };

  const buildKakaoLink = (url: string) => {
    const path = toPathFromUrl(url);
    if (!path) return { mobileWebUrl: url, webUrl: url };

    const exec = `path=${encodeURIComponent(path)}`;
    return {
      mobileWebUrl: url,
      webUrl: url,
      iosExecutionParams: exec,
      androidExecutionParams: exec,
    };
  };

  // ✅ Kakao init (브라우저에서만)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isWebView()) return;
    if (!window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
    }
  }, []);

  // ✅ 버튼 생성 (브라우저에서만) + 생성 직전에 container 비우기
  useEffect(() => {
    
    if (typeof window === "undefined") return;
    
    if (isWebView()) return;
    if (!window.Kakao) return;


    const formattedDate = date ? ` (${dayjsToFormat(dayjs(date), "M월 D일")})` : "";
    const buttonTitle = extraCnt && extraCnt < 4 ? `${extraCnt}자리 남음!` : "모임 확인하기";
    const link = buildKakaoLink(url);
  
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = ""; // ✅ 여기서만 비우기

    window.Kakao.Link.createDefaultButton({
      container: `#${containerId}`,
      objectType: "feed",
      content: {
        title: `${title}${formattedDate}`,
        description: subtitle,
        imageUrl: img,
        imageWidth: 400,
        imageHeight: 200,
        link,
      },
      buttons: [{ title: buttonTitle, link }],
    });
  }, [containerId, img, url, subtitle, title, date, extraCnt]);

  return (
    <Layout
      id={containerId}
      isFull={!!isFull}
      temp={!!temp}
      // ✅ WebView에서만 native share
      onClick={isWebView() ? handleShareOnApp : undefined}
    >
      {variant === "unstyled" ? (
        <Box w="full" textAlign="start">
          카카오톡으로 공유하기
        </Box>
      ) : isTemp ? (
        <Button
          as="div"
          color="mint"
          bg="white"
          border="1px solid var(--color-mint)"
          _focus={{ bg: "white", boxShadow: "none" }}
          _hover={{ bg: "white", boxShadow: "none" }}
        >
          카카오톡 공유
        </Button>
      ) : !isBig ? (
        <Box color="gray.700">
          <i className="fa-light fa-share-nodes fa-lg" />
        </Box>
      ) : (
        <Button as="div" colorScheme="mint" flex={1} size="lg" maxW="var( --view-max-width)">
          카카오톡으로 공유하기
        </Button>
      )}
    </Layout>
  );
}

const Layout = styled.div<{ isFull: boolean; temp: boolean }>`
  width: ${(props) => (props.isFull ? "100%" : "auto")};
  display: flex;
  width: 100%;
`;

export default KakaoShareBtn;
