import { Badge, Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import Accordion from "../../../components/molecules/Accordion";
import { ACCORDION_CONTENT_FAQ } from "../../../constants/contentsText/accordionContents";

function RegisterFAQ() {
  const [size, setSize] = useState(3);

  const content = [
    ...ACCORDION_CONTENT_FAQ.slice(0, 2),
    {
      title: "가입 완료 후에는 어떻게 하나요?",
      content:
        "회비 결제와 함께 동아리 가입이 완료됩니다. 가입 후 안내되는 [신규 인원 가이드]를 확인해 주세요!",
    },
    ...ACCORDION_CONTENT_FAQ.slice(2),
  ];

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center" w="full">
        <Stack spacing={2} mb={5}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            05
          </Badge>

          <Heading fontSize="2xl">자주 묻는 질문</Heading>
          <Text color="gray.500">
            가입 후에는 <b>신규 인원 가이드</b>를 꼭 확인해 주세요!
          </Text>
        </Stack>{" "}
        <Box w="full" textAlign="start">
          <Accordion contentArr={content.slice(0, size)} />
          {content.length > size && (
            <Button
              mt={2}
              w="100%"
              h="40px"
              bgColor="white"
              border="0.5px solid #E8E8E8"
              onClick={() => setSize((old) => old + 3)}
            >
              더 보기
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
}

export default RegisterFAQ;
