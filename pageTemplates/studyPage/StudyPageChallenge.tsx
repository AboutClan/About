import { Box, Button, Flex } from "@chakra-ui/react";

import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import AvatarGroupsOverwrap from "../../components/molecules/groups/AvatarGroupsOverwrap";
import { useToast } from "../../hooks/custom/CustomToast";

function StudyPageChallenge() {
  const toast = useToast();

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
            0시간 0분
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
            시작 전
          </Box>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          flex={1}
          px={4}
          py={5}
          border="var(--border-main)"
          borderRadius="8px"
        >
          <Box fontSize="18px" lineHeight="26px" fontWeight="bold">
            0시간 0분
          </Box>
          <Box fontSize="13px" lineHeight="18px" color="gray.500" fontWeight="medium">
            목표 공부 시간
          </Box>
          <Flex mt={2} flexDir="column" flex={1} justify="center">
            <Button
              variant="ghost"
              size="sm"
              border="none"
              onClick={() => toast("info", "스터디 챌린지 오픈을 기다려주세요!")}
            >
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
      <Flex flexDir="column" align="center" mt={2} px={4} py={5} border="var(--border-main)">
        <Flex align="center" h={10}>
          <AvatarGroupsOverwrap
            users={[
              { avatar: { type: 15, bg: 7 } },
              { avatar: { type: 7, bg: 3 } },
              { avatar: { type: 13, bg: 0 } },
            ]}
            maxCnt={4}
            size="lg"
          />
        </Flex>
        <Box mt={3} mb={4}>
          --명이 함께 도전중이에요!
        </Box>
        <Button
          w="full"
          borderRadius="8px"
          colorScheme="black"
          onClick={() => toast("info", "스터디 챌린지 오픈을 기다려주세요!")}
        >
          챌린지 도전하기
        </Button>
      </Flex>
    </>
  );
}

export default StudyPageChallenge;
