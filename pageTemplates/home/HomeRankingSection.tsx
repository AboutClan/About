import { AspectRatio, Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

function HomeRankingSection() {
  return (
    <>
      <AspectRatio w="100%" ratio={1.25} position="relative">
        <Image
          fill
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%9E%AD%ED%82%B9.png"
          alt="rankingBanner"
        />
      </AspectRatio>
      <Flex p="16px" direction="column">
        <Box fontSize="20px" fontWeight={600}>
          동아리 점수 랭킹 페이지
        </Box>
        <Box as="p" py="16px">
          동아리 활동을 통해 얻은 점수를 확인하고 자신의 랭킹과 활동 기록을 한눈에 볼 수 있는
          공간입니다. 다양한 활동을 통해 점수를 획득하고, 본인의 순위를 확인해 보세요!
        </Box>
        <Box>
          <Link href="/statistics">
            <Button colorScheme="mintTheme">랭킹 페이지로 이동하기</Button>
          </Link>
        </Box>
      </Flex>
    </>
  );
}

export default HomeRankingSection;
