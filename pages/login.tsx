/* eslint-disable */

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
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
    await signIn(provider, {
      callbackUrl: `${window.location.origin}/home`,
    });

    setIsLoading(false);
  };

  const waitingFooterOptions: IFooterOptions = {
    main: {},
  };

  return (
    <>
      <Box position="relative">
        <Image src="/loginBackground.jpg" alt="loginBackground" width={750} height={1624} />
      </Box>

      <Flex
        width="300px"
        direction="column"
        align="center"
        position="fixed"
        bottom="10%"
        left="50%"
        transform="translate(-50%,0)"
      >
        <Button
          size="lg"
          fontSize="16px"
          width="100%"
          backgroundColor="#FEE500"
          rounded="md"
          isLoading={isLoading}
          onClick={() => customSignin("member")}
          mb="8px"
          display="flex"
          justifyContent="space-between"
          leftIcon={<IconKakao />}
          pr="32px"
        >
          <span>카카오 로그인</span>
          <div />
        </Button>
        <Button
          size="lg"
          fontSize="16px"
          width="100%"
          rounded="md"
          background="var(--gray-200)"
          onClick={() => setIsModal(true)}
          mb="16px"
          justifyContent="space-between"
          leftIcon={<IconUser />}
          pr="32px"
        >
          <span>게스트 로그인</span>
          <div />
        </Button>
        <Box fontSize="13px" color="var(--gray-700)">
          활동 및 신규 가입은 <u style={{ textUnderlineOffset: "4px" }}> 카카오 로그인</u>을
          이용해주세요!
        </Box>
        <Link mt="8px" href="https://open.kakao.com/o/sjDgVzmf" isExternal fontSize="13px">
          <u style={{ textUnderlineOffset: "4px", color: "var(--gray-700)" }}>
            로그인이 안되시나요?
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
    </>
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
