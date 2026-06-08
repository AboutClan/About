// pages/nice-auth/callback.tsx
// ✅ PC(팝업): opener로 postMessage 후 close
// ✅ 모바일/인앱(redirect): localStorage "nice_auth_return_page" 기준으로 redirect
//    (기본값: /register/auth, cafe-map 흐름에서는 /cafe-map/register/auth)

import { Box, Spinner, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";

const DEFAULT_RETURN_TO = "/register/auth";

function getReturnPage(): string {
  try {
    const saved = localStorage.getItem("nice_auth_return_page");
    if (saved) {
      localStorage.removeItem("nice_auth_return_page");
      return saved;
    }
  } catch {}
  return DEFAULT_RETURN_TO;
}

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

    const returnTo = getReturnPage();
    const nextUrl = `${returnTo}?web_transaction_id=${encodeURIComponent(webTransactionId)}`;
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
