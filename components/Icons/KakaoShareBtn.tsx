import { Box, Button } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import styled from "styled-components";

import { REVIEW_DATA } from "../../storage/Review";
import { isWebView } from "../../utils/appEnvUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { ShareIcon } from "./ShareIcon";

const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_JS;

interface IKakaoShareBtn {
  type?: string;
  title: string;
  subtitle: string;
  img?: string;
  location?: string;
  url: string;
  isBig?: boolean;
  isFull?: boolean;
  temp?: boolean;
  isTemp?: boolean;
  variant?: "unstyled";
}

function KakaoShareBtn({
  type,
  title,
  subtitle,
  img,
  location,
  url,
  isBig,
  isFull,
  temp,
  isTemp,
  variant,
}: IKakaoShareBtn) {
  const handleShareOnApp = useCallback(() => {
    if (isWebView()) {
      nativeMethodUtils.share(url);
    }
  }, []);

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
    if (type === "gather" && !img) return;

    if (window.Kakao && !isWebView()) {
      const options =
        type === "gather" || type === "study"
          ? {
              container: "#kakao-share-button",
              objectType: "feed",
              content: {
                title,
                description: subtitle,
                imageUrl: img,
                imageWidth: 800,
                imageHeight: 400,
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
            }
          : type === "study2"
          ? {
              container: "#kakao-share-button",
              objectType: "location",
              content: {
                title,
                description: subtitle,
                imageUrl: img,
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
              address: location,
              // addressTitle: "카카오 본사",
              buttons: [
                {
                  title: "웹으로 이동",
                  link: {
                    mobileWebUrl: url,
                    webUrl: url,
                  },
                },
              ],
            }
          : type === "secretSquare"
          ? {
              container: "#kakao-share-button",
              objectType: "feed",
              content: {
                title,
                description: subtitle,
                imageWidth: 800,
                imageHeight: 400,
                imageUrl: img,
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
            }
          : {
              container: "#kakao-share-button",
              objectType: "feed",
              content: {
                title,
                description: subtitle,
                imageUrl: REVIEW_DATA[0]?.images[0],
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
            };

      window.Kakao.Link.createDefaultButton(options);
    }
  }, [img, type, url, subtitle]);

  return (
    <Layout id="kakao-share-button" isFull={isFull} temp={temp} onClick={handleShareOnApp}>
      {variant === "unstyled" ? (
        <Box>카카오톡으로 공유하기</Box>
      ) : isTemp ? (
        <Button
          color="mint"
          bg="white"
          border="1px solid var(--color-mint)"
          _focus={{ bg: "white", boxShadow: "none" }}
          _hover={{ bg: "white", boxShadow: "none" }}
        >
          카카오톡 공유
        </Button>
      ) : !isBig ? (
        <ShareIcon />
      ) : (
        <Button as="div" colorScheme="mint" flex={1} size="lg" maxW="var( --view-max-width)">
          카카오톡으로 공유하기
        </Button>
      )}
    </Layout>
  );
}

const Layout = styled.button<{ isFull: boolean; temp: boolean }>`
  width: ${(props) => (props.isFull ? "100%" : "undefined")};
  display: flex;
  width: 100%;
`;

export default KakaoShareBtn;
