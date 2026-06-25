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

import { ModalLayout } from "../../modals/Modals";
import { getDeviceOS } from "../../utils/validationUtils";

const ANDROID_BETA_OPENCHAT_URL = "https://open.kakao.com/o/seSpN6Ai";
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
      setShowAndroidModal(true);
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

      {/* 안드로이드 베타 모달 */}
      {showAndroidModal && (
        <ModalLayout
          title="안드로이드 앱 베타 안내"
          setIsModal={setShowAndroidModal}
          footerOptions={{
            main: {
              text: "오픈채팅방 입장",
              func: () => window.open(ANDROID_BETA_OPENCHAT_URL, "_blank"),
            },
          }}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="13px" color="gray.600" lineHeight={1.8} textAlign="center">
              안드로이드 앱은 현재{" "}
              <Text as="span" fontWeight={700} color="gray.800">
                베타 버전
              </Text>
              으로만 출시되어 있어요. 사용을 위해서는 아래 오픈채팅방에
              <br />
              <Text as="span" fontWeight={700} color="var(--color-mint)">
                구글 이메일 주소
              </Text>
              를 남겨주세요!
            </Text>

            <Flex
              direction="column"
              bg="var(--gray-100)"
              borderRadius="10px"
              p={4}
              gap={1}
              fontSize="13px"
              color="gray.700"
            >
              <Flex align="flex-start" gap={1}>
                <Text flexShrink={0}>🎁</Text>
                <Text lineHeight={1.6}>
                  베타 이용 시 앱 출시 후{" "}
                  <Text as="span" fontWeight={700}>
                    포인트 지급
                  </Text>
                </Text>
              </Flex>
              <Flex align="flex-start" gap={1} textAlign="start">
                <Text flexShrink={0}>☕</Text>
                <Text lineHeight={1.6} ml={0}>
                  베타 참여자 중 추첨을 통해{" "}
                  <Text as="span" fontWeight={700}>
                    총 10명
                  </Text>
                  커피 기프티콘 지급
                </Text>
              </Flex>
            </Flex>
          </VStack>
        </ModalLayout>
      )}
    </>
  );
}
