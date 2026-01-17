import { Box, Flex, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";

import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { isApp, isIOS } from "../../utils/validationUtils";

const ANDROID_STORE_APP_URL = "market://details?id=com.about.studyaboutclubapp";
const ANDROID_STORE_WEB_URL =
  "https://play.google.com/store/apps/details?id=com.about.studyaboutclubapp";

const IOS_STORE_URL = "https://apps.apple.com/kr/app/%EC%96%B4%EB%B0%94%EC%9B%83/id6737145787";

function ForceUpdateModal({ onClose }: CloseProps) {
  const ios = useMemo(() => isIOS(), []);
  const app = useMemo(() => isApp(), []);

  const openStore = useCallback(() => {
    if (typeof window === "undefined") return;

    // ✅ iOS: 앱스토어 웹 링크로 이동 (사파리/인앱/웹뷰 모두 동작)
    if (ios) {
      window.location.href = IOS_STORE_URL;
      return;
    }

    // ✅ Android: 앱이면 market:// 우선 시도, 아니면 웹 링크
    if (app) {
      // market://가 막히면 그냥 웹 링크로 한번 더 보내는 방식
      window.location.href = ANDROID_STORE_APP_URL;
      setTimeout(() => {
        window.location.href = ANDROID_STORE_WEB_URL;
      }, 500);
      return;
    }

    // Android 웹
    window.location.href = ANDROID_STORE_WEB_URL;
  }, [ios, app]);

  const footerOptions: IFooterOptions = {
    main: {
      text: "업데이트 하러가기",
      func: openStore,
    },
    isFull: true,
  };

  return (
    <ModalLayout title="새로운 버전 업데이트" footerOptions={footerOptions} setIsModal={onClose}>
      <Text mb={5}>
        더 안정적이고 편리해진 서비스를 이용하기 위해
        <br />
        최신 버전으로 업데이트가 필요합니다.
      </Text>

      <Box bg="#f5f5f5" border="1px solid" borderColor="#eeeeee" borderRadius={12} p={4}>
        <Text fontSize={12} fontWeight={700} color="#424242" mb={2} textAlign="left">
          주요 업데이트 내용
        </Text>

        <Flex gap={2} align="flex-start" color="#424242" mb={1}>
          <Text fontSize={12} lineHeight="18px">
            •
          </Text>
          <Text flex={1} fontSize={12} lineHeight="18px" textAlign="left">
            알림(푸시) 클릭 시 해당 페이지로 바로 이동
          </Text>
        </Flex>

        <Flex gap={2} align="flex-start" color="#424242">
          <Text fontSize={12} lineHeight="18px">
            •
          </Text>
          <Text flex={1} fontSize={12} lineHeight="18px" textAlign="left">
            앱 디자인 및 사용자 편의성 대폭 개선
          </Text>
        </Flex>
      </Box>
    </ModalLayout>
  );
}

export default ForceUpdateModal;
