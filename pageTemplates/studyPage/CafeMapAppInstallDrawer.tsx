import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { getDeviceOS } from "../../utils/validationUtils";

const ANDROID_APP_STORE_URL = "https://play.google.com/store/apps/details?id=club.about20s.cafemap";
const IOS_APP_STORE_URL = "https://apps.apple.com/kr/app/id6776977905";
const DRAWER_HIDDEN_KEY = "cafeMapAppInstallDrawerHidden";

interface Props {
  onClose: () => void;
}

export default function CafeMapAppInstallDrawer({ onClose }: Props) {
  const os = getDeviceOS();
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  const handleInstall = () => {
    if (os === "iOS") {
      window.open(IOS_APP_STORE_URL, "_blank");
      onClose();
      return;
    }

    if (os === "Android") {
      window.open(ANDROID_APP_STORE_URL, "_blank");
      onClose();
      return;
    }
  };

  const handleNeverShow = () => {
    localStorage.setItem(DRAWER_HIDDEN_KEY, String(Date.now()));
    onClose();
  };

  return (
    <>
      <Drawer placement="bottom" onClose={onClose} isOpen>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px" maxW="var(--max-width)" mx="auto">
          <DrawerBody p={0}>
            <VStack spacing={0} pt={3} px={5}>
              {/* 드래그 핸들 */}
              <Box w="56px" h="4px" borderRadius="4px" bg="gray.300" opacity={0.6} mb={5} />

              {/* 앱 아이콘 */}
              <Box
                w="72px"
                h="72px"
                borderRadius="18px"
                overflow="hidden"
                boxShadow="0 6px 18px rgba(0,0,0,0.12)"
                mb={4}
              >
                <Image src="/appIcon.png" w="full" h="full" objectFit="cover" alt="앱 아이콘" />
              </Box>

              <Text fontSize="20px" fontWeight={800} color="gray.800" mb={1}>
                카공지도 앱 설치
              </Text>
              <Text fontSize="14px" color="gray.400" textAlign="center" mb={6} lineHeight={1.5}>
                앱을 설치하면 더 빠르고 편리하게 이용할 수 있어요!
              </Text>

              <Flex direction="column" w="100%" mb="auto">
                <Button onClick={handleInstall} as="div" w="full" size="lg" colorScheme="mint">
                  앱 설치하기
                </Button>

                <Button
                  my={3}
                  h="24px"
                  color="gray.500"
                  fontWeight="semibold"
                  variant="ghost"
                  onClick={handleNeverShow}
                >
                  나중에
                </Button>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
