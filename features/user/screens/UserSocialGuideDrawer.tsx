import { Box, Flex } from "@chakra-ui/react";

import Avatar from "@/components/atoms/Avatar";
import RightDrawer from "@/components/modals/drawer/RightDrawer";
import SocialingScoreBadge from "@/components/molecules/SocialingScoreBadge";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { getDisplayName } from "@/utils/stringUtils";

interface UserSocialGuideDrawerProps {
  onClose: () => void;
}

function UserSocialGuideDrawer({ onClose }: UserSocialGuideDrawerProps) {
  const { data: userInfo } = useUserInfoQuery();

  return (
    <RightDrawer title="혜택" px={false} onClose={onClose}>
      <Flex px={5} justify="space-between" py={3}>
        <Flex fontSize="16px" w="full">
          <Box>
            <Box as="span" fontWeight="bold" fontSize="18px">
              {getDisplayName(userInfo)}
            </Box>
            님의 소셜링 온도 =
          </Box>
          <Box ml={1}>
            <SocialingScoreBadge user={userInfo} size="sm" />
          </Box>
        </Flex>
      </Flex>
      <Flex
        py={4}
        flexDir="row-reverse"
        justify="space-between"
        align="center"
        px={10}
        borderTop="var(--border)"
      >
        <Avatar size="xl2" user={{ avatar: { type: 16, bg: 8 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            모임 우선 승인
          </Box>
          <Box as="p" fontSize="14px">
            공식 행사나 인기 모임에서는
            <br />
            소셜링 온도를 적극 반영해 승인해요.
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} justify="space-between" px={10} align="center">
        <Avatar size="xl2" user={{ avatar: { type: 10, bg: 3 } }} />
        <Flex flexDir="column" align="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            랭킹 상품 지급
          </Box>
          <Box as="p" textAlign="end">
            월마다 열활 멤버, 인기 멤버에게
            <br />
            다양한 상품이 지급돼요.
          </Box>
        </Flex>
      </Flex>
      {/* <Box bg="mint">받은 혜택 자세히 보기</Box> */}
      {/* <ValueBoxCol
        items={[
          { left: "123", right: "555" },
          { left: "123", right: "555" },
          { left: "123", right: "555" },
        ]}
      /> */}
      {/* <InfoCol infoArr={[{ left: "234", right: "1515" }]} />
      <InfoBoxCol
        infoBoxPropsArr={[
          { category: "55", text: "12" },
          { category: "55", text: "12" },
        ]}
      /> */}
    </RightDrawer>
  );
}

export default UserSocialGuideDrawer;
