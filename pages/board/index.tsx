import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";

import Header from "../../components/layouts/Header";
import { navigateExternalLink } from "../../utils/navigateUtils";

function BoardPage() {
  return (
    <>
      <Header title="친구 초대 이벤트">
        <Button
          p={1}
          color="gray.500"
          fontWeight={600}
          variant="unstyled"
          onClick={() => {
            navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
          }}
        >
          문의하기
        </Button>
      </Header>
      <Flex flexDir="column" mb={40}>
        <Box pos="relative" w="full" aspectRatio={4 / 5}>
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.png"
            fill
            alt="1"
          />
        </Box>
        <Box pos="relative" w="full" aspectRatio={4 / 5}>
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.png"
            fill
            alt="2"
          />
        </Box>
        <Box pos="relative" w="full" aspectRatio={4 / 5}>
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/3.png"
            fill
            alt="3"
          />
        </Box>
      </Flex>
    </>
  );
}

export default BoardPage;
