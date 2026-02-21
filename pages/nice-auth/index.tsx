import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

import { useToken } from "../../hooks/custom/CustomHooks";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_NICE_BACKEND_URL ?? "http://localhost:3001";

export default function NiceAuthTestPage() {
  const toast = useToast();
  const token = useToken();
  const [resultVisible, setResultVisible] = useState(false);
  const [resultText, setResultText] = useState("데이터 대기 중...");
  const currentRequestNoRef = useRef("");

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (!event.data?.web_transaction_id) return;

      setResultVisible(true);
      setResultText("서버에서 복호화 중...");

      const jwt = token ?? "";
      if (!jwt) {
        setResultText("에러: 로그인이 필요합니다. (JWT 없음)");
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/auth/nice/result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            web_transaction_id: event.data.web_transaction_id,
            request_no: currentRequestNoRef.current,
          }),
        });

        const finalData = await res.json();
        setResultText(
          JSON.stringify(finalData.data ?? finalData, null, 2),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setResultText("에러: " + message);
      }
    },
    [token],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const startAuth = useCallback(async () => {
    const jwt = token ?? "";
    if (!jwt) {
      toast({
        title: "로그인이 필요합니다",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/nice/request`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await response.json();

      if (!data.auth_url) throw new Error("인증 URL 생성 실패");

      currentRequestNoRef.current = data.request_no ?? "";

      window.open(data.auth_url, "niceAuthPopup", "width=500,height=700");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "인증 시작 에러",
        description: message,
        status: "error",
        duration: 5000,
      });
    }
  }, [token, toast]);

  return (
    <>
      <Head>
        <title>NICE 본인인증 테스트</title>
        <meta name="description" content="NICE 본인인증 테스트 페이지" />
      </Head>

      <Box
        fontFamily="sans-serif"
        p={10}
        textAlign="center"
        minH="60vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6}>
          <Heading size="lg">NICE 본인인증 테스트</Heading>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={startAuth}
            px={6}
            py={3}
          >
            본인인증 시작하기
          </Button>

          {resultVisible && (
            <VStack align="stretch" w="full" maxW="400px" mt={4}>
              <Text fontWeight="semibold">인증 결과:</Text>
              <Box
                as="pre"
                p={4}
                border="1px solid"
                borderColor="gray.200"
                bg="gray.50"
                whiteSpace="pre-wrap"
                textAlign="left"
                minW="300px"
                fontSize="sm"
              >
                {resultText}
              </Box>
            </VStack>
          )}
        </VStack>
      </Box>
    </>
  );
}
