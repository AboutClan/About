/* eslint-disable */

import { AspectRatio, Button, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";
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
import { IconKakao } from "../public/icons/Icons";

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
  console.log(22, session);
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
      signIn(provider, { callbackUrl: `${window.location.origin}/home` });
      return;
    }
    setIsLoading(true);

    if (userInfo?.role === "waiting") {
      setIsWaitingModal(true);
      setIsLoading(false);
      return;
    }
    signIn(provider, {
      callbackUrl: `${window.location.origin}/home`,
    });
    await new Promise(() => setTimeout(() => setIsLoading(false), 3000));
  };

  const waitingFooterOptions: IFooterOptions = {
    main: {},
  };

  return (
    <>
      <Layout>
        <ImageWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <AspectRatio pos="relative" ratio={2 / 1}>
            <Image
              alt="aboutPoster"
              fill={true}
              sizes="400px"
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%A1%9C%EA%B3%A0+short.webp"
              priority
            />
          </AspectRatio>
        </ImageWrapper>
        <MainWrapper key={kakaoProvider.id}>
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
            leftIcon={<i className="fa-solid fa-user" />}
            pr="32px"
          >
            <span>게스트 로그인</span>
            <div />
          </Button>
          <Message>활동 및 가입신청은 카카오 로그인을 이용해주세요!</Message>
          <Link mt="4px" href="https://open.kakao.com/o/sjDgVzmf" isExternal fontSize="12px">
            로그인이 안되시나요?
          </Link>
        </MainWrapper>
        <ForceLogoutDialog />
      </Layout>
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

const Layout = styled.div`
  width: 100vw;
  max-width: var(--max-width);

  position: fixed;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled(motion.div)`
  width: 100%;
`;

const MainWrapper = styled.div`
  width: 100%;
  padding: 28px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.span`
  font-size: 12px;
  text-align: center;
  color: var(--color-red);
`;

export default Login;
