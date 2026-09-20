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

import DrawerHandle from "@/components/atoms/DrawerHandle";
import { CAFE_MAP_INSTALL_POPUP } from "@/constants/keys/localStorage";
import {
  deferPopup,
  readPopupState,
  snoozePopup,
} from "@/features/cafeMap/utils/cafeMapPopup";
import { useBackGuard } from "@/hooks/custom/useBackGuard";
import { getDeviceOS } from "@/utils/validationUtils";

export const ANDROID_APP_STORE_URL =
  "https://play.google.com/store/apps/details?id=club.about20s.cafemap";
export const IOS_APP_STORE_URL = "https://apps.apple.com/kr/app/id6776977905";
// 설치로 이어진 경우. 실제 설치 여부를 알 수 없으니 영구 차단 대신 길게 미뤄둔다.
const INSTALLED_DEFER_DAYS = 30;
// "나중에"를 누른 경우. 반복 거절하면 간격을 늘린다.
const LATER_SNOOZE_DAYS = 7;
const REPEATED_LATER_SNOOZE_DAYS = 30;
// 오버레이 탭·뒤로가기처럼 의사 표시가 약한 닫기.
const SOFT_SNOOZE_DAYS = 1;

interface Props {
  onClose: () => void;
}

export default function CafeMapAppInstallDrawer({ onClose }: Props) {
  const os = getDeviceOS();

  // 이 드로어는 로컬 state로만 열려서 히스토리에 없다. 뒤로가기는 오버레이를 탭한 것과 같게
  // 처리한다. 예전엔 둘 다 아무 기록을 남기지 않아 재진입할 때마다 다시 떴어서,
  // 지금은 약하게나마(1일) 숨긴다.
  const handleSoftClose = () => {
    snoozePopup(CAFE_MAP_INSTALL_POPUP, SOFT_SNOOZE_DAYS);
    onClose();
  };

  useBackGuard(true, handleSoftClose);

  const handleInstall = () => {
    if (os !== "iOS" && os !== "Android") return;

    // 스토어로 보낸 뒤에도 기록이 없어서 설치를 마치고 돌아오면 또 떴다.
    deferPopup(CAFE_MAP_INSTALL_POPUP, INSTALLED_DEFER_DAYS);
    window.open(os === "iOS" ? IOS_APP_STORE_URL : ANDROID_APP_STORE_URL, "_blank");
    onClose();
  };

  const handleLater = () => {
    const { dismissCount } = readPopupState(CAFE_MAP_INSTALL_POPUP);
    snoozePopup(
      CAFE_MAP_INSTALL_POPUP,
      dismissCount >= 1 ? REPEATED_LATER_SNOOZE_DAYS : LATER_SNOOZE_DAYS,
    );
    onClose();
  };

  return (
    <>
      <Drawer placement="bottom" onClose={handleSoftClose} isOpen>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px" maxW="var(--max-width)" mx="auto">
          <DrawerBody p={0}>
            <VStack spacing={0} px={5}>
              <DrawerHandle mb={2} />

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
                  onClick={handleLater}
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
