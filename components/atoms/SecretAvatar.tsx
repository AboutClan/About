import { Flex } from "@chakra-ui/react";

function SecretAvatar() {
  return (
    <Flex
      justify="center"
      align="center"
      overflow="hidden"
      w="32px"
      h="32px"
      position="relative"
      borderRadius="50%"
      bgColor="var(--gray-300)"
    >
      <i className="fa-solid fa-user-large" style={{ color: "var(--gray-700)" }} />
    </Flex>
  );
}

export default SecretAvatar;
