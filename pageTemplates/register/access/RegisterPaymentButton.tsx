/* eslint-disable @typescript-eslint/no-explicit-any */

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "react-query";

import BottomNav from "../../../components/layouts/BottomNav";
import { USER_INFO, USER_POINT_SYSTEM } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  usePointSystemMutation,
  useUserRegisterControlMutation,
} from "../../../hooks/user/mutations";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { gaEvent } from "../../../libs/gtag";
import { isWebView } from "../../../utils/appEnvUtils";
import { navigateExternalLink } from "../../../utils/navigateUtils";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

declare const cookiepayments: {
  init: (args: { api_id: string }) => void;
  payrequest: (args: Record<string, any>) => void;
};

function safeDecode(v: string | undefined) {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

interface RegisterPaymentButtonProps {
  type: "register" | "point";
  value: number;
  isFree?: boolean;
}

function RegisterPaymentButton({ type, value, isFree = false }: RegisterPaymentButtonProps) {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading2, setIsLoading2] = useState(false);

  // 가입 승인/결제리턴 처리 중복 방지

  const approveOnceRef = useRef(false);
  const handledReturnRef = useRef(false);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (session === undefined) return;

    const status = first(router.query.status);
    if (status) return;

    if (!session?.user?.uid) {
      toast("error", "안전한 정보 확인을 위해 다시 한번만 로그인해주세요!");
      setTimeout(() => {
        signIn("kakao", {
          callbackUrl: `${window.location.origin}/register/access`,
        });
      }, 1000);
    }
  }, [router.isReady, router.query.status, session, toast, router]);

  const { mutate: sendRequest } = useUserRequestMutation();

  const { mutate: chargePoint } = usePointSystemMutation("point", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      queryClient.invalidateQueries({ queryKey: [USER_POINT_SYSTEM, "point"], exact: false });
      toast("success", "충전이 완료되었습니다!");
      setTimeout(() => {
        router.push("/user");
      }, 500);
      setIsLoading2(false);
      approveOnceRef.current = false;
      handledReturnRef.current = false;
    },
    onError() {
      toast("error", "충전에 실패했어요. 관리자에게 문의주세요!");
      setIsLoading2(false);
      approveOnceRef.current = false;
      handledReturnRef.current = false;
    },
  });

  const { mutate: approve, isLoading } = useUserRegisterControlMutation("post", {
    onSuccess() {
      gaEvent("sign_up_complete");
      router.replace("/register/access", undefined, { shallow: true });
      toast("success", "가입이 완료되었습니다!");
      queryClient.resetQueries([USER_INFO]);
      setTimeout(() => {
        router.push("/home");
      }, 500);
      setTimeout(() => {
        navigateExternalLink("https://pf.kakao.com/_SaWXn/109551233");
      }, 1000);
    },
    onError() {
      // 요구사항: 실패는 toast만 띄우고 UI 유지
      toast("error", "가입 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsLoading2(false);
      // 재시도 가능
      approveOnceRef.current = false;
      handledReturnRef.current = false; // 🔥 이거 추가
    },
  });
  useEffect(() => {
    if (isFree === false) return;
    if (!session?.user?.uid) {
      toast("error", "계정 오류가 발생했어요. 관리자에게 문의주세요!");
      return;
    }
    sendRequest({
      title: "친구 초대 가입",
      category: "건의",
      content: `가입자: ${session.user.uid} `,
    });

    approve(session.user.uid);
  }, [isFree, session]);

  // 기존 view 계산은 유지 (UI/기능 영향 없고, 디버깅에도 유용)
  useMemo(() => {
    if (!router.isReady) return { type: "loading" };

    const status = first(router.query.status);
    const reason = first(router.query.reason);
    const orderNo = first(router.query.orderNo);
    const msg = safeDecode(first(router.query.msg));

    if (!status) return { type: "pre" };

    if (status === "success") {
      return {
        type: "success",
        title: "결제가 완료됐어요",
        desc:
          type === "point"
            ? "충전된 포인트를 확인해 주세요."
            : "이제 바로 활동을 시작할 수 있어요.",
        orderNo,
      };
    }

    switch (reason) {
      case "RETURN_FAIL":
        return {
          type: "fail",
          title: "결제가 완료되지 않았어요",
          desc: msg || "결제 과정에서 실패했어요. 다시 시도해 주세요.",
          action: "retry",
          orderNo,
        };
      case "DECRYPT_FAIL":
        return {
          type: "fail",
          title: "결제 확인에 실패했어요",
          desc: "결제 정보를 확인하는 과정에서 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
          action: "retry",
          orderNo,
        };
      case "MISSING_KEYS":
        return {
          type: "fail",
          title: "결제 정보가 누락됐어요",
          desc: "결제 확인에 필요한 정보가 일부 누락됐어요.",
          action: "retry",
          orderNo,
        };
      case "PAYCERT_FAIL":
        return {
          type: "pending",
          title: "결제 확인 중이에요",
          desc: "결제 확인에 일시적인 문제가 발생했어요. 이미 결제가 완료되었을 수 있으니 바로 다시 결제하지 말아주세요.",
          action: "none",
          orderNo,
        };
      case "SERVER_ERROR":
        return {
          type: "fail",
          title: "일시적인 오류가 발생했어요",
          desc: msg || "잠시 후 다시 시도해 주세요.",
          action: "retry",
          orderNo,
        };
      default:
        return {
          type: "fail",
          title: "결제가 실패했어요",
          desc: msg || "다시 시도해 주세요.",
          action: "retry",
          orderNo,
        };
    }
  }, [router.isReady, router.query]);

  // ✅ 결제 리턴 처리: 성공이면 approve, 실패면 toast만 (UI는 그대로 유지)
  useEffect(() => {
    if (!router.isReady) return;

    const status = first(router.query.status);
    if (!status) return; // 결제 리턴 아님

    if (!session?.user?.uid) return;

    if (handledReturnRef.current) return;

    const reason = first(router.query.reason);

    if (status !== "success") {
      handledReturnRef.current = true;
      setIsLoading2(false);

      if (reason === "PAYCERT_FAIL") {
        toast("info", "결제 확인 중이에요. 바로 다시 결제하지 말아주세요.");
        return;
      }

      const title =
        reason === "RETURN_FAIL"
          ? "결제가 완료되지 않았어요."
          : reason === "DECRYPT_FAIL"
          ? "결제 확인에 실패했어요."
          : reason === "MISSING_KEYS"
          ? "결제 정보가 누락됐어요."
          : reason === "SERVER_ERROR"
          ? "일시적인 오류가 발생했어요."
          : "결제가 실패했어요.";

      toast("error", title);

      // ✅ 실패 케이스는 바로 query 제거(중복 토스트 방지)

      router.replace(type === "point" ? "/user/point/charge" : "/register/access", undefined, {
        shallow: true,
      });
      return;
    }
    if (approveOnceRef.current) return;
    approveOnceRef.current = true;
    handledReturnRef.current = true;
    setIsLoading2(false);

    if (type === "point") {
      chargePoint({ value, message: "포인트 충전", sub: "point" });
    } else {
      approve(session.user.uid);
    }
  }, [
    router.isReady,
    session,
    router.query,
    session?.user?.uid,
    approve,
    chargePoint,
    toast,
    router,
  ]);

  const makeOrderNo = () => `ORD-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  useEffect(() => {
    if (typeof cookiepayments === "undefined") return;

    const apiId = process.env.NEXT_PUBLIC_COOKIEPAY_API_ID;

    console.log("cookiepay apiId exists:", apiId);

    cookiepayments.init({ api_id: apiId as string });
    setReady(true);
  }, []);

  const onClickNext = () => {
    if (isWebView()) {
      if (type === "point") {
        toast("info", "원활한 결제를 위해 웹사이트로 전환합니다.");
        setTimeout(() => {
          navigateExternalLink("https://study-about.club/user/point/charge");
        }, 1000);
      } else {
        toast("info", "원활한 가입 완료를 위해 웹사이트로 전환합니다.");
        setTimeout(() => {
          navigateExternalLink("https://study-about.club/register/access");
        }, 1000);
      }
      return;
    }

    if (!session?.user.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
      return;
    }

    // UI/기능은 동일하게 유지하되, 크래시 방지
    if (!ready) {
      toast("error", "결제 모듈을 불러오는 중이에요. 잠시만 기다려주세요.");
      return;
    }
    setIsLoading2(true);
    const orderNo = makeOrderNo(); // ✅ 매번 새로 생성
    if (type === "point") {
      cookiepayments.payrequest({
        ORDERNO: orderNo,
        PRODUCTNAME: "포인트 충전",
        AMOUNT: value + "",
        BUYERNAME: session.user.name,
        PAYMETHOD: "CARD",
        RETURNURL: "https://study-about.club/api/cookiepay/return2",
        BUYERID: session.user.uid,
        BUYEREMAIL: session.user.name,
      });
    } else {
      cookiepayments.payrequest({
        ORDERNO: orderNo,
        PRODUCTNAME: "회원가입",
        AMOUNT: "20000",
        BUYERNAME: session.user.name,
        PAYMETHOD: "CARD",
        RETURNURL: "https://study-about.club/api/cookiepay/return",
        BUYERID: session.user.uid,
        BUYEREMAIL: session.user.name,
      });
    }
  };

  return (
    <>
      <BottomNav
        isLoading={isLoading || isLoading2}
        onClick={onClickNext}
        text={type === "point" ? "포인트 충전하기" : "결제하고 가입 완료하기"}
      />
    </>
  );
}

export default RegisterPaymentButton;
