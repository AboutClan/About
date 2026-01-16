import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import ForceLogoutDialog from "../../modals/login/ForceLogoutDialog";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { isIOS } from "../../utils/validationUtils";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const toast = useToast();

  // 화면 비율 계산 (SSR-safe)
  const [ratio, setRatio] = useState<number | null>(null);
  // 디바이스 타입 (iPhone 여부 등)

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

  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");

  const [isWaitingModal, setIsWaitingModal] = useState(false);
  const [loadingType, setLoadingType] = useState<"kakao" | "guest" | "apple" | null>(null);

  const { data: userInfo } = useUserInfoQuery({
    enabled: !!session,
  });

  useEffect(() => {
    switch (statusParam) {
      case "logout":
        toast("success", "로그아웃 되었습니다.");
        break;
      case "noMember":
        toast("error", "동아리에 소속되어 있지 않습니다.");
        break;
      case "waiting":
        toast("warning", "카카오 로그인을 눌러 최종 가입을 완료해 주세요!");
        break;
    }
  }, [statusParam, toast]);

  const customSignin = async (type: "kakao" | "guest" | "apple") => {
    if (type === "guest") {
      router.push(`/login/guest`);
      return;
    }
    setLoadingType(type);

    // 게스트 → 정회원 로그인으로 전환 시, 먼저 guest 세션 정리
    if (session?.user?.name === "guest") {
      await signOut({ redirect: false });
    }

    // 다양한 statusParam에 따른 callbackUrl 분기
    if (statusParam === "before") {
      await signIn(type, {
        callbackUrl: `${window.location.origin}/${pageParam}`,
      });
      return;
    }
    if (statusParam === "access" || userInfo?.role === "waiting") {
      await signIn(type, {
        callbackUrl: `${window.location.origin}/register/access`,
      });
      return;
    }
    if (statusParam === "kakao") {
      await signIn(type, {
        callbackUrl: `${window.location.origin}/accessKakao`,
      });
      return;
    }
    if (statusParam === "friend") {
      await signIn(type, {
        callbackUrl: `${window.location.origin}/register/friend`,
      });
      return;
    }

    // 가입 대기 중인 경우
    if (statusParam === "waiting") {
      setIsWaitingModal(true);
      setLoadingType(null);
      return;
    }

    // 기본: 로그인 후 /home
    await signIn(type, {
      callbackUrl: `${window.location.origin}/home`,
    });

    setLoadingType(null);
  };

  const waitingFooterOptions: IFooterOptions = {
    main: {
      text: "카카오 채널로 이동하기",
      func: () => {
        navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
      },
    },
  };

  const isIPhone = isIOS();
  const showTopText = !isIPhone && ratio !== null && ratio >= 1.75;
  const showBottomText = ratio !== null && ratio >= 1.55;

  return (
    <>
      <Box
        height="100dvh"
        bg="linear-gradient(0deg, rgba(40, 40, 40, 0.87) 0%, rgba(40, 40, 40, 0.54) 100%)"
        position="relative"
      >
        {/* {session?.user?.uid && (
          <Box fontSize="12px" opacity={0.8} position="fixed" top="12px" right="12px" color="white">
            UID: {session?.user.uid}
          </Box>
        )} */}
        <Button
          position="fixed"
          top="0"
          left="0"
          bg="transparent"
          onClick={() => customSignin("apple")}
        ></Button>
        <Image
          src="/background-clip.png"
          alt="loginBackground"
          layout="fill"
          sizes="1624px"
          objectFit="cover"
        />
        <Flex
          justify="align-center"
          direction="column"
          position="fixed"
          align="center"
          maxW="293px"
          w="68.5%"
          top="46%"
          left="50%"
          transform="translate(-50%,-50%)"
        >
          <Box mb={3} position="relative" w="full" aspectRatio={3.8 / 1}>
            <Image src="/23.png" alt="main-logo" fill />
          </Box>
          <Box mb={6} fontWeight="bold" fontSize="14px" lineHeight="20px" color="gray.100">
            20대의 모든 순간을 위한 플랫폼
          </Box>
          <Box w="58.7%" position="relative" aspectRatio={5 / 4}>
            <Image src="/main.png" alt="main-icon" fill />
          </Box>
        </Flex>

        <Flex w="full" h="full" bg="mint" direction="column" alignItems="center" overflow="hidden">
          <Flex
            direction="column"
            align="center"
            position="fixed"
            width="100%"
            maxW="var(--max-width)"
            px="20px"
            bottom="calc(40px + env(safe-area-inset-bottom))"
            left="50%"
            transform="translate(-50%,0)"
          >
            {/* 🔹 위 안내 문구: 항상 자리 차지 + opacity만 변경 (레이아웃 점프 방지) */}
            <Box
              mb={5}
              h="16px"
              fontSize="12px"
              lineHeight="16px"
              color="white"
              opacity={showTopText ? 0.6 : 0}
              transition="opacity 0.2s ease-out"
            >
              Sign up with Social Networks
            </Box>

            {/* 카카오 로그인 버튼 */}
            <Button
              variant="unstyled"
              maxW="calc(var(--max-width) - 2 * 20px)"
              width="100%"
              aspectRatio={7.4 / 1}
              backgroundColor="#FEE500"
              isLoading={loadingType === "kakao"}
              onClick={() => customSignin("kakao")}
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
            {isIPhone && (
              <Button
                variant="unstyled"
                maxW="calc(var(--max-width) - 2 * 20px)"
                width="100%"
                aspectRatio={7.42 / 1}
                backgroundColor="white"
                isLoading={loadingType === "apple"}
                onClick={() => customSignin("apple")}
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
              maxW="calc(var(--max-width) - 2 * 20px)"
              width="100%"
              aspectRatio={7.42 / 1}
              backgroundColor="gray.900"
              color="white"
              onClick={() => customSignin("guest")}
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
              <span>게스트로 구경하기</span>
              <div />
            </Button>

            {/* 🔹 하단 안내 문구도 동일하게 고정 높이 + opacity만 변경 */}
            <Box
              mt={0}
              h="16px"
              as="u"
              fontSize="12px"
              fontWeight="medium"
              opacity={showBottomText ? 0.6 : 0}
              color="white"
              transition="opacity 0.2s ease-out"
            >
              동아리 가입은 &apos;카카오 로그인&apos;을 이용해주세요.
            </Box>
          </Flex>
          <ForceLogoutDialog />
        </Flex>
      </Box>

      {/* {isModal && <GuestLoginModal setIsModal={setIsModal} customSignin={customSignin} />} */}
      {isWaitingModal && (
        <ModalLayout
          title="가입 대기"
          setIsModal={setIsWaitingModal}
          footerOptions={waitingFooterOptions}
        >
          가입 대기중입니다. <br />
          <Box>
            <b>카카오 채널</b>을 통해 가입을 완료해 주세요!
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
