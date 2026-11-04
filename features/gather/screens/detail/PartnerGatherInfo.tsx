import { Box, Flex, Text } from "@chakra-ui/react";

import Divider from "@/components/atoms/Divider";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

interface PartnerGatherInfoProps {
  data: IGather;
}

/**
 * 제휴 프로그램(partnerGather) 상세: 참여 현황 대신 할인 혜택과 장소, 외부 프로그램 안내를 보여 준다.
 * 신청·결제·운영은 파트너가 하고, 하단 신청하기는 applyUrl로 이동한다.
 */
function PartnerGatherInfo({ data }: PartnerGatherInfoProps) {
  return (
    <>
      <Box px={5} pb={4}>
        {data.benefit && (
          <Box
            bg="mint.50"
            border="1px solid"
            borderColor="mint.100"
            borderRadius="8px"
            px={4}
            py={3}
          >
            <Text fontSize="12px" fontWeight={600} color="mint">
              어바웃 회원 혜택
            </Text>
            <Text mt={1} fontSize="14px" fontWeight={700} color="gray.800" whiteSpace="pre-wrap">
              {data.benefit}
            </Text>
          </Box>
        )}
        {data.location?.main && (
          <Flex mt={3} fontSize="12px" color="gray.600" align="center">
            <Box as="span" mr={1}>
              📍
            </Box>
            <Box as="span" fontWeight={600}>
              {data.location.main}
            </Box>
            {data.location.sub && (
              <Box as="span" ml={1} color="gray.500">
                {data.location.sub}
              </Box>
            )}
          </Flex>
        )}
        <Text mt={3} fontSize="12px" color="gray.500">
          어바웃 외부 파트너 프로그램이에요. 신청·결제·운영은 파트너가 직접 진행하고, 아래
          신청하기로 들어가면 할인이 적용돼요.
        </Text>
      </Box>
      <Divider />
    </>
  );
}

export default PartnerGatherInfo;
