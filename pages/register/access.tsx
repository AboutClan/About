/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Button, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "react-query";

import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import Accordion from "../../components/molecules/Accordion";
import TabNav from "../../components/molecules/navs/TabNav";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol2 from "../../components/molecules/ValueBoxCol2";
import { ACCORDION_CONTENT_FAQ } from "../../constants/contentsText/accordionContents";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserRegisterControlMutation } from "../../hooks/user/mutations";
import { gaEvent } from "../../libs/gtag";
import { ModalLayout } from "../../modals/Modals";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { isWebView } from "../../utils/appEnvUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { VALUE_BOX_COL_ITEMS } from "./fee";

const JQ_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

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

function Access() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"가입 안내" | "자주 묻는 질문">("가입 안내");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  // 가입 승인/결제리턴 처리 중복 방지
  const approveOnceRef = useRef(false);
  const handledReturnRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (session === undefined) return;

    const status = first(router.query.status);
    if (status) return;

    if (!session?.user?.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
    }
  }, [router.isReady, router.query.status, session, toast, router]);

  useEffect(() => {
    if (isWebView()) {
      toast("info", "원활한 가입 기능 동작을 위해 웹사이트로 전환합니다.");
      setTimeout(() => {
        navigateExternalLink("https://study-about.club/register/access");
      }, 2000);
    }
  }, []);

  const { mutate: approve, isLoading } = useUserRegisterControlMutation("post", {
    onSuccess() {
      gaEvent("sign_up_complete");
      router.replace("/register/access", undefined, { shallow: true });
      setTimeout(() => {
        toast("success", "가입이 완료되었습니다!");
        queryClient.resetQueries([USER_INFO]);
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
        desc: "이제 바로 활동을 시작할 수 있어요.",
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
          type: "fail",
          title: "승인 확인에 실패했어요",
          desc: msg || "승인 확인이 되지 않았어요. 다시 결제하거나 다른 수단을 이용해 주세요.",
          action: "retry",
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
      const title =
        reason === "RETURN_FAIL"
          ? "결제가 완료되지 않았어요."
          : reason === "PAYCERT_FAIL"
          ? "승인 확인에 실패했어요."
          : reason === "DECRYPT_FAIL"
          ? "결제 확인에 실패했어요."
          : reason === "MISSING_KEYS"
          ? "결제 정보가 누락됐어요."
          : reason === "SERVER_ERROR"
          ? "일시적인 오류가 발생했어요."
          : "결제가 실패했어요.";

      toast("error", title);

      // ✅ 실패 케이스는 바로 query 제거(중복 토스트 방지)
      router.replace("/register/access", undefined, { shallow: true });
      return;
    }
    if (approveOnceRef.current) return;
    approveOnceRef.current = true;
    handledReturnRef.current = true;
    setIsLoading2(false);

    approve(session.user.uid);
  }, [router.isReady, session, router.query, session?.user?.uid, approve, toast, router]);

  const [ready, setReady] = useState(false);
  // const orderNo = useMemo(() => `ORD-${Date.now()}-${Math.random().toString(16).slice(2)}`, []);

  useEffect(() => {
    if (typeof cookiepayments === "undefined") return;

    const apiId = process.env.NEXT_PUBLIC_COOKIEPAY_API_ID;

    console.log("cookiepay apiId exists:", apiId);

    cookiepayments.init({ api_id: apiId as string });
    setReady(true);
  }, []);
  const makeOrderNo = () => `ORD-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const onClickNext = () => {
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
  };
  const [isBackModal, setIsBackModal] = useState(false);
  const handleBack = () => {
    setIsBackModal(true);
  };

  return (
    <>
      <Script src={JQ_SRC} strategy="afterInteractive" />
      <Header title="" func={handleBack}>
        <Button
          p={1}
          color="gray.500"
          fontWeight={600}
          variant="unstyled"
          onClick={() => {
            navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
          }}
        >
          문의하기
        </Button>
      </Header>

      <RegisterLayout>
        <RegisterOverview isNoTop>
          <span>최종 가입 안내</span>
          <span>결제 완료 후, 바로 동아리 활동을 시작할 수 있어요!</span>
        </RegisterOverview>

        <TabNav
          isFullSize
          isBlack
          tabOptionsArr={[
            {
              text: "가입 안내",
              func: () => setTab("가입 안내"),
            },
            { text: "자주 묻는 질문", func: () => setTab("자주 묻는 질문") },
          ]}
        />
        <Box mt={5}>
          {tab === "가입 안내" ? (
            <Flex direction="column">
              <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />

              <UnorderedList fontSize="12px" color="gray.600" mt="10px" ml={0}>
                <ListItem textAlign="start">
                  7일 이내 탈퇴 시, 이용 이력이 없으면 전액 환불! (포인트 제외)
                  {/* 7일 이내 탈퇴 및
                  미이용 시, 가입비는 전액 환불됩니다. (포인트 제외) */}
                </ListItem>
                {/* <ListItem textAlign="start">
                  포인트는 서비스 이용 재화로 환불되지 않습니다.
                </ListItem> */}
              </UnorderedList>

              <Flex flexDir="column" mt={8}>
                <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                  ✅ 가입을 완료하면! ✅
                </Flex>

                <InfoList items={INFO_ARR2} />
              </Flex>

              <Box mt={5}>
                <TextCheckButton
                  text="위 내용을 모두 확인했습니다."
                  isChecked={isChecked}
                  toggleCheck={() => setIsChecked((old) => !old)}
                />
              </Box>
            </Flex>
          ) : (
            <Accordion
              defaultIndex={0}
              contentArr={[
                ...ACCORDION_CONTENT_FAQ.slice(0, 2),
                {
                  title: "가입 완료 후에는 어떻게 하나요?",
                  content:
                    "회비 결제와 함께 동아리 가입이 완료됩니다. 가입 후 안내되는 [신규 인원 가이드]를 확인해 주세요!",
                },
              ]}
            />
          )}
        </Box>
      </RegisterLayout>

      <BottomNav
        isActive={isChecked} // ✅ UI/기능 동일 유지(활성 조건 변경 없음)
        isLoading={isLoading || isLoading2}
        onClick={onClickNext}
        text="결제하고 가입 완료하기"
      />
      {isBackModal && (
        <ModalLayout
          isCloseButton={false}
          title="가입을 취소하시겠어요?"
          setIsModal={() => setIsBackModal(false)}
          footerOptions={{
            main: {
              text: "이 동",
              func: () => {
                router.push("/login?status=waiting");
              },
            },
            sub: {
              text: "닫 기",
            },
          }}
        >
          <Box as="p">
            로그인 화면으로 이동합니다.
            <br />
            <b> 카카오 로그인</b>을 통해 다시 돌아올 수 있어요.
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

const INFO_ARR2 = [
  "10,000명 이상의 멤버가 활동중인 어바웃 멤버가 돼요!",
  "공부·취미·친목 등 수백 개의 모임에 참여할 수 있어요!",
  "뉴비 멤버십이 적용되고, 다양한 혜택을 받을 수 있어요!",
];

export default Access;
