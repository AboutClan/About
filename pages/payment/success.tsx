// pages/payment/success.tsx
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { paymentKey, orderId, amount } = router.query;

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return;
    if (status !== "idle") return;

    const confirm = async () => {
      try {
        setStatus("loading");

        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "결제 승인에 실패했어요.");
        }

        // TODO: 여기서 data로부터 결제정보/회원정보를 확인해서
        // 유저 회비 상태를 갱신하는 후속 호출을 추가해도 됨.

        setStatus("ok");
        setMessage("결제가 정상적으로 완료되었어요. 이제 About 활동을 시작할 수 있어요!");
      } catch (e) {
        console.error(e);
        setStatus("error");
        setMessage(e.message || "결제 승인 중 오류가 발생했어요.");
      }
    };

    confirm();
  }, [paymentKey, orderId, amount, status]);

  const goHome = () => {
    router.push("/home");
  };

  if (status === "loading" || status === "idle") {
    return (
      <Box maxW="480px" mx="auto" mt={10} px={4}>
        <Heading as="h1" fontSize="xl" mb={3}>
          결제 승인 처리 중입니다...
        </Heading>
        <Text fontSize="sm" color="gray.600">
          창을 닫지 말고 잠시만 기다려 주세요.
        </Text>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box maxW="480px" mx="auto" mt={10} px={4}>
        <Heading as="h1" fontSize="xl" mb={3}>
          결제 승인 실패
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={5}>
          {message}
        </Text>
        <Button w="100%" colorScheme="teal" onClick={() => router.push("/payment/join-fee")}>
          다시 결제 시도하기
        </Button>
      </Box>
    );
  }

  // status === "ok"
  return (
    <Box maxW="480px" mx="auto" mt={10} px={4}>
      <Heading as="h1" fontSize="xl" mb={3}>
        결제가 완료되었습니다 🎉
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={5}>
        이제 동아리 모임과 소모임에 자유롭게 참여하실 수 있어요.
      </Text>
      <Button w="100%" colorScheme="teal" onClick={goHome}>
        홈으로 이동하기
      </Button>
    </Box>
  );
}
