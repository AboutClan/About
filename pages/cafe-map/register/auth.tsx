// pages/register/auth.tsx
// ✅ PC: 팝업 + postMessage
// ✅ 모바일/인앱: 팝업 실패 시 redirect + callback이 이 페이지로 ?web_transaction_id=... 로 돌려줌
// ✅ 둘 다 handleWebTransactionId() 하나로 처리

import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import Slide from "../../../components/layouts/PageSlide";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import { useToken } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { isWebView } from "../../../utils/appEnvUtils";
import { setAuthIntent } from "../../../utils/authIntentUtils";
import { setLocalStorageObj } from "../../../utils/storageUtils";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URI ?? "http://localhost:3001";
const NICE_REQUEST_NO_KEY = "nice_request_no";

export function formatKoreanPhone(raw: string) {
  const digits = (raw ?? "").replace(/\D/g, "");

  // 02 (서울) 예외 처리
  if (digits.startsWith("02")) {
    if (digits.length === 9) return digits.replace(/^(\d{2})(\d{3})(\d{4})$/, "$1-$2-$3");
    if (digits.length === 10) return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "$1-$2-$3");
    return digits;
  }

  // 휴대폰(010) / 지역번호(0xx) 일반
  if (digits.length === 10) return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
  if (digits.length === 11) return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");

  return digits;
}

type NiceResultData = {
  birthdate: string;
  gender: "1" | "2";
  name: string;
  national_info: "0" | "1";
  mobile_no: string;
};

export default function Auth() {
  const router = useRouter();
  const toast = useToast();
  const token = useToken();

  const getStoredRequestNo = () =>
    currentRequestNoRef.current ||
    sessionStorage.getItem(NICE_REQUEST_NO_KEY) ||
    localStorage.getItem(NICE_REQUEST_NO_KEY) ||
    "";

  const clearStoredRequestNo = () => {
    sessionStorage.removeItem(NICE_REQUEST_NO_KEY);
    localStorage.removeItem(NICE_REQUEST_NO_KEY);
  };

  // PC 팝업 플로우에서 바로 이어가려고 ref도 유지
  const currentRequestNoRef = useRef("");
  // 모바일 redirect 콜백에서 받은 web_transaction_id를 토큰 준비 전까지 보관
  const pendingTransactionRef = useRef<string | null>(null);

  const process = async () => {
    setAuthIntent();
    await signOut({ redirect: false });
    await signIn("kakao", { callbackUrl: "/cafe-map/register/auth" });
  };

  const handleWebTransactionId = useCallback(
    async (webTransactionId: string) => {
      const jwt = token ?? "";
      if (!jwt) {
        toast("error", "로그인이 필요합니다.");
        process();
        return;
      }

      const requestNo = getStoredRequestNo();
      if (!requestNo) {
        toast("error", "재인증이 필요합니다.");
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
            web_transaction_id: webTransactionId,
            request_no: requestNo,
          }),
        });

        const finalData = await res.json();
        const resultData: NiceResultData = (finalData.data ?? finalData) as NiceResultData;

        if (resultData?.national_info === "1") {
          toast("info", "현재 운영 정책상 국내 국적자만 가입이 가능합니다.");
          return;
        }

        const birthYear = resultData?.birthdate ? Number(resultData.birthdate.slice(0, 4)) : null;
        const currentYear = new Date().getFullYear();
        const age = currentYear - (birthYear ?? 0);
        if (!birthYear || age < 19 || age > 35) {
          toast("info", "현재 19세 ~ 35세만 가입이 가능해요!");
          return;
        }

        setLocalStorageObj(REGISTER_INFO, {
          name: resultData?.name ?? "",
          gender: resultData?.gender === "1" ? "남성" : resultData?.gender === "2" ? "여성" : "",
          birth: resultData?.birthdate ? resultData.birthdate.slice(2) : "", // 19970816 -> 970816
          telephone: resultData?.mobile_no ? formatKoreanPhone(resultData.mobile_no) : "",
        });

        // 1회성 값 정리(선택)
        sessionStorage.removeItem(NICE_REQUEST_NO_KEY);

        router.push(`/cafe-map/register/gender`);
        clearStoredRequestNo();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast("error", `인증 실패: ${message}`);
      }
    },
    [token, router, toast],
  );

  // ✅ PC 팝업: postMessage로 들어온 케이스 처리
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const webTransactionId = event.data?.web_transaction_id as string | undefined;
      if (!webTransactionId) return;

      handleWebTransactionId(webTransactionId);
    },
    [handleWebTransactionId],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // ✅ 모바일/인앱: Step 1 - URL에서 web_transaction_id를 ref에 저장하고 쿼리 즉시 제거
  // token이 아직 없을 수 있으므로 여기서 처리하지 않고 ref에만 보관
  useEffect(() => {
    if (!router.isReady) return;

    const webTransactionId = router.query.web_transaction_id;
    if (typeof webTransactionId === "string" && webTransactionId) {
      pendingTransactionRef.current = webTransactionId;
      router.replace("/cafe-map/register/auth", undefined, { shallow: true });
    }
  }, [router.isReady, router.query.web_transaction_id, router]);

  // ✅ 모바일/인앱: Step 2 - token이 준비된 후 처리
  // 모바일 redirect 후 페이지가 새로 로드될 때 token fetch가 완료되기 전에 처리하면
  // jwt가 undefined여서 "로그인이 필요합니다" 오류 → 게스트 자동로그인으로 빠지는 버그 방지
  useEffect(() => {
    if (!token) return;
    if (!pendingTransactionRef.current) return;

    const txId = pendingTransactionRef.current;
    pendingTransactionRef.current = null;
    handleWebTransactionId(txId);
  }, [token, handleWebTransactionId]);

  const startAuth = useCallback(async () => {
    const jwt = token ?? "";
    if (!jwt) {
      toast("error", "로그인이 필요합니다");
      process();
      return;
    }

    try {
      const url = new URL(`${BACKEND_URL}/auth/nice/request`);

      const isApp = isWebView();
      // 앱/웹 모두 동일한 callback URL 사용
      url.searchParams.set("returnUrl", "https://study-about.club/nice-auth/callback");
      url.searchParams.set("closeUrl", "https://study-about.club/nice-auth/callback");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        // JSON 아니면 그대로 둠
      }

      if (!response.ok) {
        toast(
          "error",
          `인증 시작 실패 (${response.status}) ${
            typeof data === "object" ? data?.message ?? "" : text
          }`,
        );
        return;
      }

      if (!data?.auth_url) throw new Error("auth_url 누락");
      if (!data?.request_no) throw new Error("request_no 누락");

      sessionStorage.setItem(NICE_REQUEST_NO_KEY, data.request_no);
      localStorage.setItem(NICE_REQUEST_NO_KEY, data.request_no);
      currentRequestNoRef.current = data.request_no;

      if (isApp) {
        // 웹뷰: 팝업 없이 현재 탭에서 NICE 인증 진행
        window.location.href = data.auth_url;
        return;
      }

      // 웹 PC: 팝업으로 인증 (기존 흐름 유지)
      const popup = window.open(data.auth_url, "niceAuthPopup", "width=500,height=700");
      if (!popup || popup.closed) {
        window.location.href = data.auth_url;
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast("error", `인증 시작 오류: ${msg || "Failed to fetch (네트워크/CORS/HTTPS 가능)"}`);
    }
  }, [token, toast]);

  return (
    <>
      <Slide>
        <Box my={5}>
          <Box fontSize="24px" fontWeight="bold" lineHeight="32px">
            안전한 서비스 이용을 위해
            <br />
            본인인증을 진행할게요
          </Box>
          <Box color="gray.500" fontSize="14px" mt={1.5}>
            딱 30초면 끝나요!
          </Box>
        </Box>

        <Flex flexDir="column" gap={3} mt={8}>
          <InfoCard
            emoji="🔒"
            title="왜 본인인증이 필요한가요?"
            desc="카공지도는 실제 이용자들이 함께 만들어가는 서비스예요. 믿을 수 있는 후기와 안전한 이용 환경을 위해 본인인증을 진행하고 있어요."
          />
          <InfoCard
            emoji="✨"
            title="가입하면 어떤 기능을 이용할 수 있나요?"
            desc="비회원은 카페 탐색 외에 대부분의 기능이 제한되어 있어요. 가입 후에는 카페 저장, 친구와 아카이브 공유, 활동 기록 관리, 스터디 시스템 등 모든 기능을 이용할 수 있어요."
          />
          <InfoCard
            emoji="🛡️"
            title="인증 정보는 안전하게 보호돼요"
            desc="본인인증에 사용된 정보는 연령 및 본인 여부 확인에만 사용되며, 별도로 저장되거나 외부에 제공되지 않아요."
          />
        </Flex>

        <Box h={24} />
      </Slide>
      <BottomNav onClick={startAuth} text="30초 만에 인증하기" />
    </>
  );
}

function InfoCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <Box bg="gray.50" borderRadius="12px" px={4} py={4} border="1px solid" borderColor="gray.100">
      <Flex align="center" mb={1.5} gap={2}>
        <Box fontSize="18px">{emoji}</Box>
        <Box fontSize="14px" fontWeight={700} color="gray.800">
          {title}
        </Box>
      </Flex>
      <Box fontSize="13px" color="gray.500" lineHeight="20px">
        {desc}
      </Box>
    </Box>
  );
}
