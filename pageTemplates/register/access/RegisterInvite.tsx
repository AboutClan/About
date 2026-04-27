import { Badge, Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../../components/atoms/Input";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoByUidQuery } from "../../../hooks/user/queries";
import { DispatchNumber, DispatchString } from "../../../types/hooks/reactTypes";

interface RegisterInviteProps {
  codeText: string;
  setCodeText: DispatchString;
  discount: number;
  setDiscount: DispatchNumber;
}

function RegisterInvite({ codeText, setCodeText, discount, setDiscount }: RegisterInviteProps) {
  const toast = useToast();
  const [trigger, setTrigger] = useState(false);

  const { data, isLoading } = useUserInfoByUidQuery(codeText, {
    enabled: !!trigger,
    onSuccess(result) {
      const temperature = result.temperature.temperature;
      if (result.role === "manager") {
        setDiscount(20000);
      }
      if (temperature >= 42) {
        setDiscount(15000);
      } else if (temperature >= 40) {
        setDiscount(10000);
      } else {
        setDiscount(5000);
      }
      setTrigger(false);
    },
    onError() {
      setTrigger(false);
      setDiscount(0);
      toast("info", "존재하지 않는 코드입니다. 추천인을 확인해 주세요!");
    },
  });

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center" w="full" mb={20}>
        <Stack spacing={2} mb={5}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            06
          </Badge>
          <Heading fontSize="2xl">추천인 코드</Heading>
          <Text color="gray.500">동아리 지인에게 초대를 받으셨나요?</Text>
        </Stack>{" "}
        <Flex w="full">
          <Input
            size="sm"
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            placeholder="추천인 코드 입력"
          />
          <Button
            size="sm"
            ml={3}
            colorScheme="black"
            isLoading={isLoading}
            isDisabled={!!discount}
            onClick={() => {
              if (codeText === "") {
                toast("info", "초대코드를 입력해 주세요!");
                return;
              }
              setTrigger(true);
            }}
          >
            확인
          </Button>
        </Flex>
        {discount > 0 && data && (
          <Box mt={8} fontSize="15px" color="gray.700">
            추천인 <b>{data?.name}님</b> 확인 완료!
            <br /> 결제 시 <b>가입비 {discount}원</b>이 할인됩니다.
          </Box>
        )}
      </Flex>
    </>
  );
}

export default RegisterInvite;
