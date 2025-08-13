import { Box, Button, Flex } from "@chakra-ui/react";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";

interface StudyPageChallengeProps {}

function StudyPageChallenge({}: StudyPageChallengeProps) {
  return (
    <>
      <SectionHeader title="챌린지에 도전하고 상품 받아가세요!" subTitle="스터디 챌린지" />
      <Flex mt={4}>
        <Flex
          flexDir="column"
          alignItems="center"
          mr={2}
          flex={1}
          px={4}
          py={5}
          border="var(--border-main)"
          borderRadius="8px"
        >
          <Box fontSize="18px" lineHeight="26px" color="mint" fontWeight="bold">
            87시간 20분
          </Box>
          <Box fontSize="13px" lineHeight="18px" color="gray.500" fontWeight="medium">
            월간 참여 시간
          </Box>
          <Box
            mt={2}
            bg="mint"
            color="white"
            borderRadius="full"
            fontSize="10px"
            fontWeight="bold"
            px={3}
            py={1.5}
          >
            참여 이전 상태
          </Box>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          flex={1}
          px={4}
          py={5}
          border="var(--bo`rder-main)"
          borderRadius="8px"
        >
          <Box fontSize="18px" lineHeight="26px" color="mint" fontWeight="bold">
            87시간 20분
          </Box>
          <Box fontSize="13px" lineHeight="18px" color="gray.500" fontWeight="medium">
            월간 참여 시간
          </Box>
          <Flex mt={2} flexDir="column" flex={1} justify="center" bg="yellow">
            <Button bg="black" variant="ghost" size="sm" border="none">
              <Flex>
                <Box fontSize="11px" fontWeight="medium" lineHeight="14px">
                  수정하기
                </Box>
                <ShortArrowIcon dir="right" color="gray" size="sm" />
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default StudyPageChallenge;
