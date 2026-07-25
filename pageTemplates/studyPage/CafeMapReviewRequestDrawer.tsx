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
import dayjs from "dayjs";

import { CAFE_MAP_REVIEW_POPUP_AT } from "../../constants/keys/localStorage";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getDeviceOS } from "../../utils/validationUtils";
import { ANDROID_APP_STORE_URL, IOS_APP_STORE_URL } from "./CafeMapAppInstallDrawer";

interface Props {
  onClose: () => void;
}

export default function CafeMapReviewRequestDrawer({ onClose }: Props) {
  const os = getDeviceOS();

  const handleReviewClick = () => {
    localStorage.setItem(CAFE_MAP_REVIEW_POPUP_AT, "DONE");

    const reviewUrl =
      os === "iOS"
        ? `${IOS_APP_STORE_URL}?action=write-review`
        : `${ANDROID_APP_STORE_URL}&showAllReviews=true`;

    navigateExternalLink(reviewUrl);
    onClose();
  };

  const handleLaterClick = () => {
    localStorage.setItem(CAFE_MAP_REVIEW_POPUP_AT, dayjs().format("YYYYMMDD"));
    onClose();
  };

  return (
    <Drawer placement="bottom" onClose={handleLaterClick} isOpen>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="20px" maxW="var(--max-width)" mx="auto">
        <DrawerBody p={0}>
          <VStack spacing={0} pt={3} px={5}>
            <Box w="56px" h="4px" borderRadius="4px" bg="gray.300" opacity={0.6} mb={5} />

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

            <Text fontSize="20px" fontWeight={800} color="gray.800" mb={1} textAlign="center">
              카공지도, 도움이 되셨나요?
            </Text>
            <Text fontSize="14px" color="gray.400" textAlign="center" mb={6} lineHeight={1.5}>
              짧은 별점과 리뷰가
              <br />더 좋은 카공지도를 만드는 데 큰 힘이 됩니다!
            </Text>

            <Flex direction="column" w="100%" mb="auto">
              <Button onClick={handleReviewClick} as="div" w="full" size="lg" colorScheme="mint">
                별점 남기기
              </Button>

              <Button
                my={3}
                h="24px"
                color="gray.500"
                fontWeight="semibold"
                variant="ghost"
                onClick={handleLaterClick}
              >
                나중에 할게요
              </Button>
            </Flex>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
