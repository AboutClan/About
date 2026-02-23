// pages/nice-auth/callback.tsx
// ✅ PC(팝업): opener로 postMessage 후 close
// ✅ 모바일/인앱(redirect): /register/auth?web_transaction_id=... 로 redirect

import { Box, Spinner, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";

const AUTH_RETURN_TO = "/register/auth"; // ✅ 인증 시작 페이지로 통일

export default function NiceAuthCallbackPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let moved = false;
    const go = (url: string) => {
      if (moved) return;
      moved = true;
      window.location.replace(url);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const webTransactionId = urlParams.get("web_transaction_id");

    if (!webTransactionId) {
      alert("잘못된 접근입니다.");
      go("/");
      return;
    }

    const nextUrl = `${AUTH_RETURN_TO}?web_transaction_id=${encodeURIComponent(webTransactionId)}`;
    const payload = { web_transaction_id: webTransactionId };
    const targetOrigin = window.location.origin;

    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(payload, targetOrigin);
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => {
        try {
          window.close();
        } catch (e) {
          console.error(e);
        }

        // close가 막히면 이동
        setTimeout(() => go(nextUrl), 300);
      }, 150);

      return;
    }

    go(nextUrl);
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
