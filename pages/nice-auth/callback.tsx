import { Box, Spinner, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";

export default function NiceAuthCallbackPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const webTransactionId = urlParams.get("web_transaction_id");

    if (!webTransactionId) {
      alert("잘못된 접근입니다.");
      window.close();
      return;
    }

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { web_transaction_id: webTransactionId },
        "*",
      );
      setTimeout(() => {
        window.close();
      }, 300);
    } else {
      alert("부모 창을 찾을 수 없습니다. 인증 창을 닫고 다시 시도해 주세요.");
      window.close();
    }
  }, []);

  return (
    <>
      <Head>
        <title>인증 완료 처리 중</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="40vh"
        p={8}
        textAlign="center"
      >
        <Spinner size="lg" mb={4} />
        <Text>인증이 완료되었습니다. 잠시만 기다려주세요...</Text>
      </Box>
    </>
  );
}
