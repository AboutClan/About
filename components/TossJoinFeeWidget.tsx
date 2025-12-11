// components/payment/TossJoinFeeWidget.tsx
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

interface TossJoinFeeWidgetProps {
  uid: string;
  amount: number;
  orderName: string;
}

export default function TossJoinFeeWidget({ uid, amount, orderName }: TossJoinFeeWidgetProps) {
  const router = useRouter();
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!clientKey) {
          console.error("Toss client key is missing");
          return;
        }

        const tossPayments = await loadTossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");

        // 회원 결제: uid를 customerKey로 사용
        const _widgets = tossPayments.widgets({
          customerKey: uid || "about-guest",
        });

        // ------ 주문의 결제 금액 설정 ------
        await _widgets.setAmount({
          currency: "KRW",
          value: amount,
        });

        // ------ 결제 UI + 이용약관 UI 렌더링 ------
        await Promise.all([
          _widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          _widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setWidgets(_widgets);
        setIsReady(true);
      } catch (e) {
        console.error(e);
      }
    };

    if (typeof window !== "undefined") {
      init();
    }
  }, [uid, amount]);

  const handlePayment = async () => {
    if (!widgets) return;
    setIsRequesting(true);

    try {
      const origin = window.location.origin;
      const orderId = `ABOUT-FEE-${uid}-${Date.now()}`;

      // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
      await widgets.requestPayment({
        orderId,
        orderName, // 예: "About 동아리 회비 20,000원"
        successUrl: `${origin}/payment/success`,
        failUrl: `${origin}/payment/fail`,
        // 필요하면 아래 추가
        // customerEmail: "...",
        // customerName:  "...",
        // customerMobilePhone: "...",
      });
    } catch (e) {
      console.error(e);
      setIsRequesting(false);
    }
  };

  return (
    <Box mt={4}>
      {/* 결제 UI 붙는 자리 */}
      <Box id="payment-method" />
      {/* 이용약관 UI 붙는 자리 */}
      <Box id="agreement" mt={4} />

      <Divider my={6} />

      <Box mx={5} display="flex" justifyContent="space-between" mb={3}>
        <Text fontSize="sm" color="gray.600">
          결제 금액
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {amount.toLocaleString()}원
        </Text>
      </Box>

      <Flex mx={5} flexDir="column">
        <Button
          w="full"
          size="md"
          colorScheme="teal"
          isDisabled={!isReady || isRequesting}
          isLoading={isRequesting}
          onClick={handlePayment}
          mt={2}
        >
          결제하기
        </Button>
        <Button
          size="md"
          w="full"
          colorScheme="teal"
          isDisabled={!isReady || isRequesting}
          isLoading={isRequesting}
          onClick={() => {
            router.push(`/home`);
          }}
          mt={2}
        >
          테스트용 (결제 완료)
        </Button>
      </Flex>
    </Box>
  );
}
