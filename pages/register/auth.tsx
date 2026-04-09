// pages/register/auth.tsx
// ✅ PC: 팝업 + postMessage
// ✅ 모바일/인앱: 팝업 실패 시 redirect + callback이 이 페이지로 ?web_transaction_id=... 로 돌려줌
// ✅ 둘 다 handleWebTransactionId() 하나로 처리

import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import Slide from "../../components/layouts/PageSlide";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useToken } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import RegisterReview from "../../pageTemplates/register/access/RegisterReview";
import { isWebView } from "../../utils/appEnvUtils";
import { setLocalStorageObj } from "../../utils/storageUtils";

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

  const process = async () => {
    await signOut({ redirect: false });
    await signIn("kakao");
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

        setLocalStorageObj(REGISTER_INFO, {
          name: resultData?.name ?? "",
          gender: resultData?.gender === "1" ? "남성" : resultData?.gender === "2" ? "여성" : "",
          birth: resultData?.birthdate ? resultData.birthdate.slice(2) : "", // 19970816 -> 970816
          telephone: resultData?.mobile_no ? formatKoreanPhone(resultData.mobile_no) : "",
        });

        // 1회성 값 정리(선택)
        sessionStorage.removeItem(NICE_REQUEST_NO_KEY);

        router.push(`/register/gender`);
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

  // ✅ 모바일/인앱: callback이 ?web_transaction_id=... 로 redirect해 준 케이스 처리
  useEffect(() => {
    if (!router.isReady) return;

    const webTransactionId = router.query.web_transaction_id;
    if (typeof webTransactionId === "string" && webTransactionId) {
      handleWebTransactionId(webTransactionId);

      // ✅ 쿼리 제거: /register/auth 로 통일
      router.replace("/register/auth", undefined, { shallow: true });
    }
  }, [router.isReady, router.query.web_transaction_id, handleWebTransactionId, router]);

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
      if (isApp) {
        url.searchParams.set("returnUrl", `https://study-about.club/_open?dl=nice-auth/callback`);
        url.searchParams.set("closeUrl", "https://study-about.club/_open?dl=nice-auth/callback");
      } else {
        url.searchParams.set("returnUrl", `https://study-about.club/nice-auth/callback`);
        url.searchParams.set("closeUrl", "https://study-about.club/nice-auth/callback");
      }

      // url.searchParams.set("returnUrl", "localhost:3000/_open?dl=nice-auth/callback");
      // url.searchParams.set("closeUrl", "localhost:3000/_open?dl=nice-auth/callback");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const text = await response.text(); // ✅ 먼저 text로 받기 (JSON 파싱 실패 대비)
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
      localStorage.setItem(NICE_REQUEST_NO_KEY, data.request_no); // ✅ 추가
      currentRequestNoRef.current = data.request_no;

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
          <Box fontSize="24px" fontWeight="semibold" lineHeight="32px" w="max-content">
            안전한 모임 이용을 위해 <br /> 본인인증을 진행할게요
          </Box>
          <Box color="gray.600" fontSize="14px" mt={1.5}>
            어바웃은 신뢰 기반의 프로필로 활동하는 동아리에요!
          </Box>
        </Box>
        <RegisterReview isShort />
        <Box h={20} />
      </Slide>
      <BottomNav onClick={startAuth} text="30초 만에 인증하기" />
    </>
  );
}
