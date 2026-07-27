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
import { useQueryClient } from "react-query";

import { HOME_APP_REVIEW_POPUP_AT } from "../../constants/keys/localStorage";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserPointMutation } from "../../hooks/user/mutations";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getDeviceOS } from "../../utils/validationUtils";

export const HOME_APP_REVIEW_REWARD_POINT = 500;
export const HOME_APP_REVIEW_REWARD_SUB = "home_app_review";

const IOS_APP_STORE_URL = "https://apps.apple.com/kr/app/id6737145787";
const ANDROID_APP_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.about.studyaboutclubapp";

interface Props {
  onClose: () => void;
}

export default function HomeAppReviewRewardDrawer({ onClose }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const os = getDeviceOS();

  const { mutate, isLoading } = useUserPointMutation({
    onSuccess() {
      toast("success", `${HOME_APP_REVIEW_REWARD_POINT}포인트가 지급되었어요!`);
      queryClient.invalidateQueries(["pointLog", "sub", HOME_APP_REVIEW_REWARD_SUB]);
      queryClient.invalidateQueries([USER_INFO]);
    },
  });

  const handleReviewClick = () => {
    localStorage.setItem(HOME_APP_REVIEW_POPUP_AT, "DONE");

    const reviewUrl =
      os === "iOS"
        ? `${IOS_APP_STORE_URL}?action=write-review`
        : `${ANDROID_APP_STORE_URL}&showAllReviews=true`;

    navigateExternalLink(reviewUrl);
    mutate({
      point: HOME_APP_REVIEW_REWARD_POINT,
      message: "어바웃 앱 스토어 리뷰 리워드",
      sub: HOME_APP_REVIEW_REWARD_SUB,
    });
    onClose();
  };

  const handleLaterClick = () => {
    localStorage.setItem(HOME_APP_REVIEW_POPUP_AT, dayjs().format("YYYYMMDD"));
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
              <Image src="/어바웃.jpg" w="full" h="full" objectFit="cover" alt="앱 아이콘" />
            </Box>

            <Text fontSize="20px" fontWeight={800} color="gray.800" mb={1} textAlign="center">
              앱 별점과 리뷰를 남겨주세요!
            </Text>
            <Text fontSize="14px" color="gray.400" textAlign="center" mb={1} lineHeight={1.5}>
              멤버분들의 짧은 별점과 리뷰가
              <br />더 좋은 어바웃을 만드는 데 큰 힘이 됩니다!
            </Text>

            <Flex direction="column" w="100%" mb="auto" mt={6}>
              <Button
                onClick={handleReviewClick}
                as="div"
                w="full"
                size="lg"
                colorScheme="mint"
                isLoading={isLoading}
              >
                별점 남기고 {HOME_APP_REVIEW_REWARD_POINT}P 받기
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
