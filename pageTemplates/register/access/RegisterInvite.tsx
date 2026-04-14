import { Badge, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { Input } from "../../../components/atoms/Input";
import { useToast } from "../../../hooks/custom/CustomToast";
import { DispatchString } from "../../../types/hooks/reactTypes";

interface RegisterInviteProps {
  codeText: string;
  setCodeText: DispatchString;
  handleClick: () => void;
}

function RegisterInvite({ codeText, setCodeText, handleClick }: RegisterInviteProps) {
  const toast = useToast();

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center" w="full">
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
            placeholder="초대코드 입력"
          />
          <Button
            size="sm"
            ml={3}
            colorScheme="black"
            onClick={() => {
              if (codeText === "") {
                toast("info", "초대코드를 입력해 주세요!");
                return;
              }
              if (
                codeText !== "4815246867" &&
                codeText !== "2026040912" &&
                codeText !== "3953423614"
              ) {
                setCodeText("");
                toast("info", "등록되지 않은 초대코드입니다.");
                return;
              }
              handleClick();
            }}
          >
            확인
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export default RegisterInvite;
