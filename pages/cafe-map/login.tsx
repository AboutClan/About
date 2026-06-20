import { Box, Button, Checkbox, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import ForceLogoutDialog from "../../modals/login/ForceLogoutDialog";
import { ModalLayout } from "../../modals/Modals";
import { setAuthIntent } from "../../utils/authIntentUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getSafeAreaBottom } from "../../utils/validationUtils";

function LoginPage() {
  const router = useRouter();
  const { status, page, error: errorParam } = router.query;
  const { data: session } = useSession();
  const toast = useToast();
  const [errorUserUid, setErrorUserUid] = useState<string>(null);
  // 화면 비율 계산 (SSR-safe)
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateRatio = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (!width) return;
      setRatio(height / width);
    };

    updateRatio();
    window.addEventListener("resize", updateRatio);
    return () => window.removeEventListener("resize", updateRatio);
  }, []);

  const statusParam = typeof status === "string" ? status : null;
  const pageParam = typeof page === "string" ? page : null;
  const errorCode = typeof errorParam === "string" ? errorParam : null;

  const [loadingType, setLoadingType] = useState<"kakao" | "guest" | "apple" | null>(null);

  const { data: userInfo } = useUserInfoQuery({
    enabled: !!session,
  });
  console.log(35);
  useEffect(() => {
    switch (statusParam) {
      case "logout":
        toast("success", "로그아웃 되었습니다.");
        break;
      case "noMember":
        toast("error", "동아리에 소속되어 있지 않습니다.");
        break;
      case "waiting":
        toast("warning", "카카오 로그인을 통해 가입을 완료할 수 있습니다.");
        break;
    }
  }, [statusParam, toast]);

  useEffect(() => {
    if (!errorCode) return;

    let uid: string | null = null;
    try {
      const match = document.cookie.split("; ").find((row) => row.startsWith("signin_error_uid="));
      if (match) {
        uid = decodeURIComponent(match.split("=")[1]);
        // 읽은 즉시 삭제 (1회성)
        document.cookie = "signin_error_uid=; Path=/login; Max-Age=0; SameSite=Lax";
      }
    } catch {}

    if (uid) {
      setErrorUserUid(uid);
    } else {
      setErrorUserUid("정보 없음");
    }
  }, [errorCode, toast]);

  const [isModal, setIsModal] = useState(false);

  // 약관 동의 바텀시트
  const [consentOpen, setConsentOpen] = useState(false);
  const [consentPending, setConsentPending] = useState<"kakao" | "apple" | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const allAgreed = agreeTerms && agreePrivacy;

  const openConsent = (provider: "kakao" | "apple") => {
    if (loadingType) return;
    setConsentPending(provider);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setConsentOpen(true);
  };

  const handleConsentConfirm = () => {
    if (!allAgreed || !consentPending) return;
    setConsentOpen(false);
    customSignin(consentPending);
  };

  const customSignin = async (provider: "kakao" | "apple" = "kakao") => {
    if (loadingType) return;
    setLoadingType(provider);

    try {
      // 카공지도.com에서 접근한 경우 OAuth 시작 도메인을 study-about.club로 통일
      // (state 쿠키 도메인과 redirect_uri 도메인 불일치 방지)
      if (
        typeof window !== "undefined" &&
        /xn--ob0b42knwutje\.com$/.test(window.location.hostname)
      ) {
        window.location.href = "https://study-about.club/cafe-map/login";
        return;
      }

      // 소셜 로그인 진행 중 자동 게스트 로그인이 끼어들지 않도록 플래그 설정
      setAuthIntent();

      // OAuth 에러 발생 시 미들웨어가 cafe-map으로 돌려보낼 수 있도록 마커 쿠키 설정
      const res = await fetch("/api/auth/cafe-map-pending", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("[cafe-map] failed to set cafe_map_auth_pending cookie", res.status);
        setLoadingType(null);
        return;
      }

      console.log("[cafe-map] pending cookie api completed");

      await signOut({ redirect: false });

      const returnTo = typeof router.query.returnTo === "string" ? router.query.returnTo : null;
      const callbackUrl = returnTo
        ? `/cafe-map/login/callback?returnTo=${encodeURIComponent(returnTo)}`
        : "/cafe-map/login/callback";

      await signIn(provider, { callbackUrl });
      // signIn은 브라우저를 OAuth 공급자로 redirect하므로 여기 이후는 실행되지 않음
    } catch (err) {
      console.error("[cafe-map] customSignin error", err);
      setLoadingType(null);
    }
  };

  return (
    <>
      <Box height="100dvh" position="relative">
        <Button
          position="fixed"
          top="12px"
          opacity={0.8}
          right="12px"
          zIndex={1000}
          p={1}
          color="gray.600"
          fontWeight={600}
          variant="unstyled"
          onClick={() => {
            router.push(`/cafe-map/login/account`);
            return;
            navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
          }}
        >
          관리자 로그인
        </Button>
        <Image
          src="/배경.png"
          alt="loginBackground"
          layout="fill"
          sizes="1624px"
          objectFit="cover"
        />
        <Flex
          justify="center"
          direction="column"
          position="fixed"
          align="center"
          w="38%"
          maxW="var(--max-width)"
          top="37%"
          left="50%"
          transform="translate(-50%,-50%)"
        >
          <Box mb={3} position="relative" w="full" aspectRatio={0.65 / 1}>
            <Image src="/심볼2.png" alt="main-logo" fill />
          </Box>
        </Flex>

        <Flex w="full" h="full" direction="column" alignItems="center" overflow="hidden">
          <Flex
            direction="column"
            align="center"
            position="fixed"
            width="100%"
            maxW="var(--max-width)"
            px="20px"
            bottom={getSafeAreaBottom(40)}
            left="50%"
            transform="translate(-50%,0)"
          >
            {/* 카카오 로그인 버튼 */}
            <Button
              variant="unstyled"
              maxW="400px"
              width="100%"
              aspectRatio={7.4 / 1}
              backgroundColor="#FEE500"
              isLoading={loadingType === "kakao"}
              onClick={() => openConsent("kakao")}
              display="flex"
              justifyContent="space-between"
              leftIcon={<KakaoIcon />}
              pl="18px"
              lineHeight="20px"
              pr="32px"
              fontSize="13px"
              mb={3}
              fontWeight="semibold"
              borderRadius="8px"
            >
              <span>카카오톡으로 5초만에 시작하기</span>
              <div />
            </Button>

            {/* 애플 로그인 버튼 (iPhone에서만 노출) */}
            {true && (
              <Button
                variant="unstyled"
                maxW="400px"
                width="100%"
                aspectRatio={7.4 / 1}
                backgroundColor="white"
                border="1px solid"
                borderColor="gray.200"
                isLoading={loadingType === "apple"}
                onClick={() => openConsent("apple")}
                display="flex"
                justifyContent="space-between"
                leftIcon={<AppleIcon />}
                pl="18px"
                lineHeight="20px"
                pr="32px"
                fontSize="13px"
                mb={3}
                fontWeight="semibold"
                borderRadius="8px"
              >
                <span>Apple로 시작하기</span>
                <div />
              </Button>
            )}

            {/* 게스트 로그인 버튼 */}
            <Button
              variant="unstyled"
              maxW="400px"
              width="100%"
              aspectRatio={7.42 / 1}
              backgroundColor="gray.900"
              color="white"
              onClick={() => {
                router.back();
              }}
              display="flex"
              isLoading={loadingType === "guest"}
              justifyContent="space-between"
              leftIcon={<UserIcon />}
              pl="18px"
              lineHeight="20px"
              pr="32px"
              fontSize="13px"
              mb={5}
              fontWeight="semibold"
              borderRadius="8px"
            >
              <span>로그인 없이 이용하기</span>
              <div />
            </Button>
          </Flex>
          <ForceLogoutDialog />
        </Flex>
      </Box>
      {consentOpen && (
        <>
          <Box
            pos="fixed"
            inset={0}
            zIndex={800}
            bg="rgba(0,0,0,0.5)"
            onClick={() => setConsentOpen(false)}
          />
          <Flex
            pos="fixed"
            left={0}
            right={0}
            bottom={0}
            zIndex={801}
            bg="white"
            borderTopRadius="20px"
            flexDir="column"
            maxW="var(--max-width)"
            mx="auto"
            px={5}
            pb={getSafeAreaBottom(24)}
          >
            <Flex justify="center" pt={3} pb={2}>
              <Box w="40px" h="4px" borderRadius="2px" bg="gray.200" />
            </Flex>

            <Box fontWeight={700} fontSize="17px" color="gray.900" pt={1} pb={3}>
              카공지도 이용을 위해 약관 동의가 필요해요
            </Box>

            <Box
              fontSize="13px"
              color="gray.500"
              lineHeight="22px"
              bg="gray.50"
              borderRadius="12px"
              px={4}
              py={3}
              mb={5}
            >
              카공지도는 누구나 믿고 사용할 수 있는 카공 장소 정보를 위해
              <br />
              허위 리뷰, 광고성 리뷰, 불쾌한 콘텐츠, 스팸, 사칭, 악용 행위를 허용하지 않습니다.
              <br />
              <br />
              부적절한 리뷰나 사용자는 신고 또는 차단할 수 있으며,
              <br />
              신고된 내용뿐 아니라 전체 리뷰를 정기적으로 확인해,
              <br />
              24시간 이내 삭제 및 이용 제한 조치를 진행합니다.
            </Box>

            <Flex
              flexDir="column"
              gap={3}
              pb={4}
              borderBottom="1px solid"
              borderColor="gray.100"
              mb={5}
            >
              <Checkbox
                isChecked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                colorScheme="mint"
                size="md"
              >
                <Box fontSize="13px" color="gray.700">
                  <Box as="span" fontWeight={600} color="gray.900">
                    [필수]{" "}
                  </Box>
                  이용약관 및 커뮤니티 안전 정책에 동의합니다
                </Box>
              </Checkbox>
              <Checkbox
                isChecked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                colorScheme="mint"
                size="md"
              >
                <Box fontSize="13px" color="gray.700">
                  <Box as="span" fontWeight={600} color="gray.900">
                    [필수]{" "}
                  </Box>
                  개인정보처리방침에 동의합니다
                </Box>
              </Checkbox>
            </Flex>

            <Button
              w="full"
              h="52px"
              borderRadius="10px"
              colorScheme={allAgreed ? "mint" : undefined}
              bg={allAgreed ? undefined : "gray.200"}
              color={allAgreed ? "white" : "gray.400"}
              fontWeight={700}
              fontSize="15px"
              isDisabled={!allAgreed}
              onClick={handleConsentConfirm}
              _disabled={{ cursor: "not-allowed", opacity: 1 }}
            >
              동의하고 시작하기
            </Button>
          </Flex>
        </>
      )}

      {errorUserUid && (
        <ModalLayout
          title="로그인 실패"
          setIsModal={() => setErrorUserUid(null)}
          footerOptions={{
            main: {
              text: "채널 방문하기",
              func: async () => {
                navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
              },
            },
          }}
        >
          오류가 발생해 로그인에 실패했어요 😢
          <br />
          아래 채널로 이 화면을 캡처해 보내주세요!
          <br />
          최대한 빠르게 해결해 드리겠습니다 🚀
          <Box mt={3} color="red">
            UID: {errorUserUid}
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

export default LoginPage;

export function KakaoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 3C6.0815 3 2.5 5.77943 2.5 9.2074C2.5 11.3393 3.88525 13.2187 5.9947 14.3366L5.10715 17.5933C5.02873 17.8811 5.35638 18.1104 5.60798 17.9437L9.49856 15.3645C9.82688 15.3963 10.1605 15.4149 10.5 15.4149C14.9182 15.4149 18.5 12.6355 18.5 9.2074C18.5 5.77943 14.9182 3 10.5 3Z"
        fill="black"
      />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="21px" height="21px">
      <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.758 6.9295C13.758 7.35805 13.6736 7.78241 13.5097 8.17835C13.3457 8.5743 13.1054 8.93407 12.8024 9.23713C12.4994 9.54019 12.1397 9.7806 11.7437 9.94464C11.3478 10.1087 10.9235 10.1931 10.495 10.1932C9.62946 10.1933 8.79939 9.84953 8.18733 9.2376C7.57527 8.62567 7.23137 7.79566 7.23129 6.93017C7.23124 6.50162 7.31561 6.07726 7.47956 5.68132C7.64352 5.28538 7.88386 4.92561 8.18686 4.62255C8.79879 4.01049 9.6288 3.66659 10.4943 3.6665C11.3598 3.66642 12.1899 4.01015 12.8019 4.62208C13.414 5.23401 13.7579 6.06401 13.758 6.9295ZM10.4946 11.1915C5.79528 11.1915 3.96729 14.1822 3.96729 15.5735C3.96729 16.9642 7.85862 17.3348 10.4946 17.3348C13.1306 17.3348 17.022 16.9642 17.022 15.5735C17.022 14.1822 15.194 11.1915 10.4946 11.1915Z"
        fill="#BDBDBD"
      />
    </svg>
  );
}
