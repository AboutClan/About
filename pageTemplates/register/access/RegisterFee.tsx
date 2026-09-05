import { Badge, Flex, Heading, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";

import ValueBoxCol2, { ValueBoxCol2ItemProps } from "../../../components/molecules/ValueBoxCol2";

// 노쇼 방지·활동 보증 목적의 포인트 충전분은 성별과 무관하게 고정.
// 가입비 = fee - POINT_CHARGE, 최종 결제 금액 = fee
export const POINT_CHARGE = 5000;

interface RegisterFeeProps {
  fee: number;
}

function RegisterFee({ fee }: RegisterFeeProps) {
  const valueBoxColItems: ValueBoxCol2ItemProps[] = [
    {
      left: `동아리 가입비`,
      right: `${(fee - POINT_CHARGE).toLocaleString()}원`,
      lineThroughText: `${fee.toLocaleString()}원`,
      leftSub: `(${dayjs().add(1, "month").month() + 1}월 중 인상 예정)`,
    },
    {
      left: "포인트 충전",
      right: `${POINT_CHARGE.toLocaleString()}원`,
      leftSub: "(노쇼 방지· 활동 보증 목적)",
    },
    {
      left: "최종 결제 금액",
      right: `= ${fee.toLocaleString()}원`,
      isFinal: true,
    },
  ];

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center">
        <Stack spacing={2} mb={6}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            05
          </Badge>

          <Heading fontSize="2xl">동아리 가입비</Heading>
          <Text color="gray.500">
            한 번의 가입으로, <b>20대 동안</b> 꾸준히 활동할 수 있어요.
          </Text>
        </Stack>{" "}
        <Flex direction="column" w="full">
          <ValueBoxCol2 items={valueBoxColItems} />
          <UnorderedList fontSize="12px" color="gray.500" mt="10px" ml={0}>
            <ListItem textAlign="start">
              7일 이내 탈퇴 시, 이용 이력이 없으면 전액 환불 (포인트 제외)
            </ListItem>
          </UnorderedList>
        </Flex>
      </Flex>
    </>
  );
}

export default RegisterFee;
