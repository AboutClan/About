import { Badge, Flex, Heading, ListItem, Stack, Text , UnorderedList } from "@chakra-ui/react";

import ValueBoxCol2 from "../../../components/molecules/ValueBoxCol2";
import { VALUE_BOX_COL_ITEMS } from "../../../pages/register/fee";

function RegisterFee() {
  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center">
        <Stack spacing={2} mb={5}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            03
          </Badge>

          <Heading fontSize="2xl">동아리 가입비</Heading>
          <Text color="gray.500">
            한 번의 결제로, <b>20대 기간 동안 무제한</b> 이용!
          </Text>
        </Stack>{" "}
        <Flex direction="column" w="full">
          <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />

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
