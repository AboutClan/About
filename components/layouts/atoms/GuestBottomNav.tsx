import { Box, Button, Flex } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";

function GuestBottomNav() {
  const customSignin = async () => {
    await signOut({ redirect: false });
    await signIn("kakao", {
      callbackUrl: `${window.location.origin}/home`,
    });
  };

  return (
    <Flex
      position="fixed"
      bottom="0"
      transform="translateY(calc(-1 * var(--bottom-nav-height) - env(safe-area-inset-bottom)))"
      w="100%"
      maxW="var(--max-width)"
      bg="gray.50" // 기존 흰색 대신 살짝 밝은 톤으로 구분 강화
      zIndex="100"
      px="4"
      py="2"
      align="center"
      justify="space-between"
      borderTop="1px solid"
      borderColor="gray.200" // 더 명확한 구분
      boxShadow="0px -4px 12px rgba(0, 0, 0, 0.05)"
      borderTopRadius="lg"
      fontSize="13px"
      fontWeight="500"
    >
      <Flex direction="column" fontSize="11px" lineHeight="short">
        <Box fontWeight="700" color="gray.700">
          게스트 모드로 둘러보는 중이에요 👀
        </Box>
        <Box color="gray.500">가입 후에 모든 모임에 참여할 수 있어요!</Box>
      </Flex>

      <Button size="sm" colorScheme="mint" onClick={customSignin}>
        로그인 / 동아리 가입
      </Button>
    </Flex>
  );
}

export default GuestBottomNav;
