import { Box, Flex } from "@chakra-ui/react";
import { navigateExternalLink } from "../../utils/navigateUtils";

function UserInviteFriendSection() {
  return (
    <Box px={5}>
      <Flex
        w="full"
        as="button"
        borderRadius="20px"
        mt={10}
        mb={5}
        px={5}
        py={3}
        bg="gray.50"
        border="var(--border-main)"
        onClick={() => {
          navigateExternalLink("https://pf.kakao.com/_SaWXn/chat");
        }}
      >
        <Flex flexDir="column" flex={1} alignItems="flex-start">
          <Box color="mint" mb={2} fontSize="16px" fontWeight={600}>
            친구 초대
          </Box>
          <Box color="gray.600" textAlign="start" fontSize="12px">
            친구에게 About을 소개해 주세요.
            <br />
            친구 가입시 둘 다 3,000 포인트 획득! <br />
          </Box>
        </Flex>
        <Flex ml={8} align="center">
          <Flex
            justify="center"
            align="center"
            w="40px"
            h="40px"
            borderRadius="full"
            bg="mint"
            color="white"
          >
            <RightIcon />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default UserInviteFriendSection;

const RightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="white"
  >
    <path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" />
  </svg>
);
