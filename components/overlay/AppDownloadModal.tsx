import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";

import { useToast } from "../../hooks/custom/CustomToast";
import { CloseProps } from "../../types/components/modalTypes";
import { getDeviceOS } from "../../utils/validationUtils";

function AppDownloadModal({ onClose }: CloseProps) {
  const toast = useToast();
  const openStore = () => {
    if (typeof window === "undefined") return;

    const os = getDeviceOS();

    if (os === "iOS") {
      window.location.href = "itms-apps://apps.apple.com/kr/app/id6737145787";
      setTimeout(() => {
        window.location.href = "https://apps.apple.com/kr/app/id6737145787";
      }, 300);
      return;
    }

    if (os === "Android") {
      window.location.href = "market://details?id=com.about.studyaboutclubapp";
      setTimeout(() => {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.about.studyaboutclubapp";
      }, 300);
      return;
    }

    toast("error", "지원하는 단말기가 아닙니다.");
  };

  return (
    <Flex
      pos="fixed"
      zIndex={2000}
      bottom={0}
      left={0}
      w="full"
      h="110px"
      maxW="var(--max-width)"
      align="center"
      borderTop="var(--border-main)"
      // ✅ 앱(흰 배경)과 더 확실히 구분
      bg="gray.100"
      boxShadow="0 -6px 20px rgba(0,0,0,0.08)"
      overflow="hidden"
      // ✅ iOS 하단 홈바/가림 대비 (CSS env 지원 브라우저에서만 적용)
      pb="env(safe-area-inset-bottom)"
    >
      {/* ✅ 배경 이미지 레이어: 클릭/터치 가림 방지 */}
      <Box
        pos="absolute"
        left={0}
        top={0}
        h="full"
        w="220px"
        pointerEvents="none"
        opacity={0.95}
        backgroundImage="url('/background-clip.png')"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="70% 50%"
      />

      {/* ✅ 아래 UI는 기존과 동일 (단, 가림 방지로 zIndex만 부여) */}
      <Button onClick={onClose} variant="unstyled" p={3} mx={2} zIndex={1}>
        <XIcon />
      </Button>

      <Box borderRadius="12px" overflow="hidden" zIndex={1}>
        <Image src="/어바웃.jpg" width={60} height={60} alt="앱 아이콘" />
      </Box>

      <Flex ml={3} flexDir="column" color="black" zIndex={1} justify="center">
        <Box fontWeight={600} fontSize="20px" mb="2px">
          어바웃
        </Box>
        <Box fontSize="14px">20대 모든 순간을 위한 플랫폼</Box>
      </Flex>

      <Button onClick={openStore} ml="auto" mr={5} colorScheme="black" zIndex={1}>
        다운로드
      </Button>
    </Flex>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="black"
    >
      <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
    </svg>
  );
}

export default AppDownloadModal;
