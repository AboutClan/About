import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import styled from "styled-components";

import { REVIEW_DATA } from "../../../storage/Review";
import { isWebView } from "../../../utils/appEnvUtils";
import { NATIVE_METHODS } from "../../../utils/nativeMethodUtils";

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
}: IKakaoShareBtn) {
  const handleShareOnApp = () => {
    if (!isWebView()) return;

    NATIVE_METHODS.SHARE(url);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  return (
    <Layout id="kakao-share-button" isFull={isFull} onClick={handleShareOnApp}>
      {!isBig ? (
        <i className="fa-light fa-share-nodes fa-lg" />
      ) : (
        <Button as="div" colorScheme="mintTheme" width="100%" size="lg">
          공유하기
        </Button>
      )}
    </Layout>
  );
}

const Layout = styled.button<{ isFull: boolean }>`
  padding: ${(props) => (props.isFull ? 0 : "8px")};
  width: ${(props) => (props.isFull ? "100%" : "undefined")};
`;

export default KakaoShareBtn;
