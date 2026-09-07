import { Box, Flex } from "@chakra-ui/react";

function StudyPageIntroBox() {
  return (
    <Flex direction="column" mt={5} mb={3}>
      <Box color="gray.500" fontSize="12px" mb={1}>
        동네 친구와 함께하는 카공 스터디
      </Box>
      <Box fontWeight="bold" fontSize="20px" lineHeight="32px">
        공부도 하고, 혜택도 받고!
        <br />
        가까운 친구들과 함께, 혼자서도 OK!
      </Box>
    </Flex>
  );
}

export default StudyPageIntroBox;
