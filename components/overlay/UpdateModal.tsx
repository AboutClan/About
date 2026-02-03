import { Box, Flex, Text } from "@chakra-ui/react";

import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";
import { getDeviceOS } from "../../utils/validationUtils";

// const ANDROID_STORE_APP_URL =
//   "https://play.google.com/store/apps/details?id=com.about.studyaboutclubapp";

// const IOS_STORE_APP_URL = "https://apps.apple.com/kr/app/%EC%96%B4%EB%B0%94%EC%9B%83/id6737145787";

function ForceUpdateModal({ onClose }: CloseProps) {
  const openStore = () => {
    if (typeof window === "undefined") return;

    const os = getDeviceOS();

    if (os === "iOS") {
      nativeMethodUtils.openExternalLink("itms-apps://apps.apple.com/kr/app/id6737145787");
      return;
    }

    if (os === "Android") {
      nativeMethodUtils.openExternalLink("market://details?id=com.about.studyaboutclubapp");
      return;
    }
  };
  const footerOptions: IFooterOptions = {
    main: {
      text: "업데이트 하러가기",
      func: openStore,
    },
    sub: {
      text: "닫 기",
    },
    isFull: true,
  };

  return (
    <ModalLayout title="새로운 버전 업데이트" footerOptions={footerOptions} setIsModal={onClose}>
      <Text mb={5}>
        더 안정적이고 편리한 서비스 이용을 위해
        <br /> 최신 버전 업데이트가 필요합니다.
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
            앱 알림(푸시) 클릭 시 화면 바로 이동
          </Text>
        </Flex>

        <Flex gap={2} align="flex-start" color="#424242" mb={1}>
          <Text fontSize={12} lineHeight="18px">
            •
          </Text>
          <Text flex={1} fontSize={12} lineHeight="18px" textAlign="left">
            카카오톡 링크를 통한 앱 연결 가능
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
