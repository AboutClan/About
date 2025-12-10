// pages/payment/fail.tsx
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function PaymentFailPage() {
  const router = useRouter();
  const { code, message, orderId } = router.query;

  return (
    <Box maxW="480px" mx="auto" mt={10} px={4}>
      <Heading as="h1" fontSize="xl" mb={3}>
        결제에 실패했어요 😭
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={2}>
        주문번호: {orderId}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        {code && <>에러 코드: {code}</>} <br />
        {message && <>사유: {message}</>}
      </Text>
      <Button w="100%" colorScheme="teal" onClick={() => router.push("/payment/join-fee")}>
        다시 결제 시도하기
      </Button>
    </Box>
  );
}
