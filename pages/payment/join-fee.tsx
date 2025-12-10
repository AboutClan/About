// pages/payment/join-fee.tsx
import { Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Header from "../../components/layouts/Header";
import TossJoinFeeWidget from "../../components/TossJoinFeeWidget";

export default function JoinFeePaymentPage() {
  const router = useRouter();
  const { uid, amount } = router.query;

  const numericAmount = Number(amount || 20000);

  if (!uid) {
    return (
      <Box maxW="480px" mx="auto" mt={10} px={4}>
        <Heading as="h1" fontSize="xl" mb={3}>
          잘못된 접근입니다
        </Heading>
        <Text fontSize="sm" color="gray.600">
          로그인 상태를 다시 확인한 뒤, 가입 완료 화면에서 다시 시도해 주세요.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Header title="결제" />
      <>
        <TossJoinFeeWidget
          uid={uid as string}
          amount={numericAmount}
          orderName={`About 동아리 회비 ${numericAmount.toLocaleString()}원`}
        />
      </>
    </>
  );
}
