/* eslint-disable */

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useToast } from "../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../hooks/user/queries";
import ForceLogoutDialog from "../modals/login/ForceLogoutDialog";
import GuestLoginModal from "../modals/login/GuestLoginModal";
import { IFooterOptions, ModalLayout } from "../modals/Modals";
import { IconKakao, IconUser } from "../public/icons/Icons";

const Login: NextPage<{
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}> = ({ providers }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();

  const status = router.query?.status;
  const kakaoProvider = Object.values(providers).find((p) => p.id == "kakao");
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isWaitingModal, setIsWaitingModal] = useState(false);

  const { data: userInfo } = useUserInfoQuery({
    enabled: !!session,
  });

  useEffect(() => {
    switch (status) {
      case "logout":
        toast("success", "로그아웃 되었습니다.");
        break;
      case "noMember":
        toast("error", "동아리에 소속되어 있지 않습니다.");
        break;
      case "waiting":
        toast("warning", "가입 대기중입니다.");
        break;
    }
  }, [status]);

  const customSignin = async (type: "member" | "guest") => {
    const provider = type === "member" ? kakaoProvider.id : "guest";
    if (provider === "guest") {
      setIsModal(false);
      await signIn(provider, { callbackUrl: `${window.location.origin}/home` });

      return;
    }
    setIsLoading(true);

    if (userInfo?.role === "waiting") {
      setIsWaitingModal(true);
      setIsLoading(false);
      return;
    }

    if (session?.user?.name === "guest") {
      await signOut({ redirect: false });
    }

    await signIn(provider, {
      callbackUrl: `${window.location.origin}/home`,
    });

    setIsLoading(false);
  };

  const waitingFooterOptions: IFooterOptions = {
    main: {},
  };

  return (
    <Flex direction="column" alignItems="center" height="100vh" overflow="hidden">
      <Box position="relative" width="100%" height="100%">
        <Image
          src="/loginBackground.jpg"
          alt="loginBackground"
          layout="fill"
          sizes="1624px"
          objectFit="cover"
        />
      </Box>
      <Flex
        direction="column"
        align="center"
        position="fixed"
        width="100%"
        px="32px"
        bottom="9%"
        left="50%"
        transform="translate(-50%,0)"
      >
        <Button
          maxW="calc(var(--max-width) - 2 * 20px)"
          size="lg"
          fontSize="16px"
          width="100%"
          backgroundColor="#FEE500"
          borderRadius="4px"
          isLoading={isLoading}
          onClick={() => customSignin("member")}
          mb="8px"
          aspectRatio={2 / 1}
          display="flex"
          justifyContent="space-between"
          leftIcon={<IconKakao />}
          pr="32px"
        >
          <span>카카오톡으로 시작하기</span>
          <div />
        </Button>
        <Button
          size="lg"
          maxW="calc(var(--max-width) - 2 * 20px)"
          fontSize="16px"
          width="100%"
          borderRadius="4px"
          backgroundColor="var(--gray-200)"
          onClick={() => setIsModal(true)}
          mb="16px"
          justifyContent="space-between"
          leftIcon={<IconUser />}
          pr="32px"
        >
          <span>게스트로 구경하기</span>
          <div />
        </Button>

        <Link mt={1} href="https://open.kakao.com/o/sjDgVzmf" isExternal fontSize="13px">
          <u
            style={{
              textUnderlineOffset: "4px",
              color: "var(--gray-600)",
              textDecorationColor: "var(--gray-600)",
            }}
          >
            관리자에게 문의하기
          </u>
        </Link>
      </Flex>
      <ForceLogoutDialog />

      {isModal && <GuestLoginModal setIsModal={setIsModal} customSignin={customSignin} />}
      {isWaitingModal && (
        <ModalLayout
          title="가입 대기"
          setIsModal={setIsWaitingModal}
          footerOptions={waitingFooterOptions}
        >
          가입 대기중입니다. <br /> 며칠 내에 카톡으로 연락드려요!
        </ModalLayout>
      )}
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

const Message = styled.span`
  font-size: 12px;
  text-align: center;
`;

export default Login;
