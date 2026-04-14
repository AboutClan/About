import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import DailyCheckWinModal from "../../modals/aboutHeader/dailyCheckModal/DailyCheckWinModal";
import WriteDrawer from "../../modals/home/writeDrawer";
import { ModalLayout } from "../../modals/Modals";
import ErrorUserInfoPopUp from "../../modals/pop-up/ErrorUserInfoPopUp";
import {
  transferDailyCheckWinState,
  transferStudyRewardState,
} from "../../recoils/transferRecoils";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { isWebView } from "../../utils/appEnvUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface IBaseModal {
  isGuest: boolean;
  isError: boolean;
  setIsError: DispatchBoolean;
}

export const LOGOUT_ALERT_OPTIONS: IAlertModalOptions = {
  title: "로그아웃",
  subTitle: "로그아웃 하시겠습니까?",
  func: () => {
    signOut({ callbackUrl: `/login/?status=logout` });
  },
  text: "로그아웃",
};

function BaseModal({ isError, setIsError }: IBaseModal) {
  const router = useRouter();
  const userInfo = useUserInfo();

  const isWriteModal = !!router.query.write;
  const isLogoutModal = !!router.query.logout;
  const isGuestModal = !!router.query.guest;

  const [transferStudyReward, setTransferStudyReward] = useRecoilState(transferStudyRewardState);
  const dailyCheckWin = useRecoilValue(transferDailyCheckWinState);

  const replaceQuery = (nextQuery) => {
    router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const cancelLogout = () => {
    const { logout, ...rest } = router.query;
    console.log(logout);
    replaceQuery(rest);
  };

  const closeGuestModal = () => {
    const { guest, ...rest } = router.query;
    console.log(guest);
    replaceQuery(rest);
  };

  const voteOtherStudy = () => {
    replaceQuery({
      ...router.query,
      modal: "apply",
    });
    setTransferStudyReward(null);
  };

  const studySupArr = ["manager", "newbie", "studySupporters"];
  const hasStudyMembership = studySupArr.includes(userInfo?.membership);
  const toast = useToast();
  return (
    <>
      {!!dailyCheckWin && <DailyCheckWinModal />}

      {isLogoutModal && <AlertModal options={LOGOUT_ALERT_OPTIONS} setIsModal={cancelLogout} />}

      {isError && <ErrorUserInfoPopUp setIsModal={setIsError} />}

      {isWriteModal && <WriteDrawer />}

      {isGuestModal && (
        <ModalLayout
          title="게스트 안내"
          setIsModal={closeGuestModal}
          footerOptions={{
            main: {
              text: "가입 신청",
              func: async () => {
                if (isWebView()) {
                  toast("info", "원활한 가입 진행를 위해 웹사이트로 전환합니다.");
                  setTimeout(() => {
                    navigateExternalLink("https://study-about.club/login/confirm");
                  }, 1000);
                  return;
                }
                await signOut({ redirect: false });

                await signIn("kakao", { callbackUrl: "/home" });
              },
            },
            sub: {
              text: "홈 화면으로",
              func: () => {
                router.push("/home");
              },
            },
          }}
        >
          현재 게스트 로그인을 이용중이라 모임 둘러보기만 가능해요😢 가입 후 원하는 모든 모임에
          참여할 수 있습니다🚀
        </ModalLayout>
      )}

      {transferStudyReward && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={443}
          isHideBottom
          setIsModal={() => setTransferStudyReward(null)}
        >
          <Box
            py={3}
            pb={2}
            lineHeight="32px"
            w="100%"
            fontWeight="semibold"
            fontSize="20px"
            textAlign="start"
          >
            {transferStudyReward.message?.split(" ")[0] === "개인" ? "공부" : "스터디"}{" "}
            {transferStudyReward.message === "스터디 개설"
              ? "개설"
              : transferStudyReward.message?.split(" ")[0] === "개인"
              ? "인증"
              : "출석"}{" "}
            완료!
            <br />
            랜덤으로{" "}
            <b>
              {hasStudyMembership
                ? Math.floor(transferStudyReward.point * 1.2)
                : transferStudyReward.point}{" "}
              Point
            </b>
            가 적립되었습니다.
          </Box>

          <Box color="gray.500" mr="auto" fontSize="12px" fontWeight={600}>
            스터디에 참여하면 매번 포인트를 획득할 수 있어요!
          </Box>

          <Box p={5}>
            <Image src="/32.png" alt="studyReward" width={160} height={160} />
          </Box>

          <Flex direction="column" mt="auto" w="100%">
            <Button w="full" size="lg" colorScheme="black" onClick={voteOtherStudy}>
              다른 날짜 스터디도 신청하기
            </Button>
            <Button
              my={2}
              size="md"
              color="gray.700"
              fontWeight="semibold"
              variant="ghost"
              onClick={() => {
                setTransferStudyReward(null);
              }}
            >
              다음에 할게요
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}
    </>
  );
}

export default BaseModal;
