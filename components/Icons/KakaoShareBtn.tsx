import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import styled from "styled-components";

import { isWebView } from "../../utils/appEnvUtils";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

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
  const handleShareOnApp = useCallback(() => {
    if (isWebView()) {
      nativeMethodUtils.share(url);
    }
  }, [url]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized() &&
      !isWebView()
    ) {
      window.Kakao.init(kakaoAppKey);
    }
  }, []);

  useEffect(() => {
    if (isWebView() || !window.Kakao) {
      return;
    }

    const formattedDate = date ? ` (${dayjsToFormat(dayjs(date), "M월 D일")})` : "";
    const buttonTitle = extraCnt && extraCnt < 4 ? `${extraCnt}자리 남음!` : "모임 확인하기";
    const link = {
      mobileWebUrl: url,
      webUrl: url,
    };

    const options = {
      container: "#kakao-share-button",
      objectType: "feed",
      content: {
        title: `${title}${formattedDate}`,
        description: subtitle,
        imageUrl: img,
        imageWidth: 400,
        imageHeight: 200,
        link,
      },
      buttons: [
        {
          title: buttonTitle,
          link,
        },
      ],
    };

    window.Kakao.Link.createDefaultButton(options);
  }, [img, url, subtitle, title, date, extraCnt]);

  return (
    <Layout id="kakao-share-button" isFull={isFull} temp={temp} onClick={handleShareOnApp}>
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
  width: ${(props) => (props.isFull ? "100%" : "undefined")};
  display: flex;
  width: 100%;
  background-color: pink;
`;

export default KakaoShareBtn;
