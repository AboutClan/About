import { Box, Button, Flex } from "@chakra-ui/react";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { UserModalInfoProps } from "../../pages/admin/response/locationActive";
import Avatar from "../atoms/Avatar";

interface ProfileDetailBlockProps {
    userActiveInfo
  handleInfoButton: (info: UserModalInfoProps) => void;
}

function ProfileDetailBlock({ handleInfoButton }: ProfileDetailBlockProps) {
  return (
    <Flex border="var(--border-main)" pl={2}>
      <Flex
        flexDir="column"
        justify="space-around"
        align="center"
        pr={2}
        borderRight="var(--border-main)"
      >
        <Avatar {...ABOUT_USER_SUMMARY} size="md" />
        <Box>이승주</Box>
      </Flex>
      <Flex direction="column" flex={1}>
        <Flex p={2} borderBottom="var(--border-main)" pr={3}>
          <Box flex={1.4}>서포터즈</Box>
          <Box flex={0.9}>27세</Box>
          <Box flex={1.4}>인하대역</Box>
          <Box flex={2}>2024-06-06</Box>{" "}
          <Box flex={1} textAlign="center">
            <i className="fa-regular fa-circle" />
          </Box>
        </Flex>
        <Flex align="center" py={2} pl={2} pr={2}>
          <Box flex={1.3}>스터디 13(12)회</Box>
          <Box flex={0.8}>번개 2회</Box>
          <Box flex={1}>소모임 4회</Box>
          <Button ml="auto" mr={1} size="sm" colorScheme="mintTheme">
            정보
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ProfileDetailBlock;
