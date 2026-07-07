import { Box, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { gaEvent } from "../libs/gtag";
import { setTrafficSourceCode } from "../utils/storageUtils";

// 짧은 트래킹 링크 진입점 (예: about20s.club/e1, /c, /g).
// URL의 code를 저장해 이후 가입 퍼널 이벤트(register_apply, register_complete, sign_up_complete)에도
// 유입 소스로 계속 남긴 뒤 홈으로 보낸다.
function TrafficSourcePage() {
  const router = useRouter();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || trackedRef.current) return;
    trackedRef.current = true;

    const code = router.query.code;
    if (typeof code === "string" && code) {
      setTrafficSourceCode(code);
      gaEvent("landing_visit", { traffic_source_code: code });
    }

    router.replace("/home");
  }, [router.isReady, router.query.code, router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="40vh"
        p={8}
      >
        <Spinner size="lg" />
      </Box>
    </>
  );
}

export default TrafficSourcePage;
