import { Box, Button, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import DailyCheckWinModal from "../../modals/aboutHeader/dailyCheckModal/DailyCheckWinModal";
import CollectionModal from "../../modals/common/CollectionModal";
import WriteDrawer from "../../modals/home/writeDrawer";
import ErrorUserInfoPopUp from "../../modals/pop-up/ErrorUserInfoPopUp";
import { transferCollectionState, transferDailyCheckWinState, transferStudyRewardState } from "../../recoils/transferRecoils";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isWriteModal = !!searchParams.get("write");
  const isLogoutModal = !!searchParams.get("logout");

  const [transferCollection, setTransferCollection] = useRecoilState(transferCollectionState);
  const [transferStudyReward, setTransferStudyReward] = useRecoilState(transferStudyRewardState);
  // const [transferStudyVoteDate, setTransferStudyVoteDate] = useRecoilState(
  //   transferStudyVoteDateState,
  // );

  const dailyCheckWin = useRecoilValue(transferDailyCheckWinState);

  const cancelLogout = () => {
    newSearchParams.delete("logout");
    const params = newSearchParams.toString();
    router.replace(pathname + params ? `?${params}` : "");
  };

  return (
    <>
      {!!dailyCheckWin && <DailyCheckWinModal />}
      {isLogoutModal && <AlertModal options={LOGOUT_ALERT_OPTIONS} setIsModal={cancelLogout} />}
      {isError && <ErrorUserInfoPopUp setIsModal={setIsError} />}
      {/* {transferStudyVoteDate && (
        <StudyLinkModal
          date={transferStudyVoteDate}
          onClose={() => setTransferStudyVoteDate(null)}
        />
      )} */}
      {isWriteModal && <WriteDrawer />}
      {transferCollection && (
        <CollectionModal
          setIsModal={() => setTransferCollection(null)}
          collection={transferCollection}
        />
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
            {true
              ? "모임장의 승인이 필요한 소모임이에요."
              : "즉시 가입이 가능한 소모임이에요."}
            <br />23}
          </Box>
          <Box color="gray.500" mr="auto" fontSize="12px" fontWeight={600}>
            매월 <b>참여권 {2}장</b>이 소모됩니다.
          </Box>
          <Box p={5}>
            <Image
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/freepik__background__12597-removebg-preview.png"
              width={160}
              height={160}
              alt="studyResult"
            />
          </Box>
          <Flex direction="column" mt="auto" w="100%">
            <Button
              w="full"
              size="lg"
              colorScheme="black"
              onClick={() => {}}
            >
              {!true ? "가입 신청하기" : "가입하기"}
            </Button>
            <Button
              my={2}
              size="md"
              color="gray.700"
              fontWeight="semibold"
              variant="ghost"
              onClick={() => {}}
            >
              다음에 할게요
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}
    </>
  );
}

// function StudyLinkModal({ date, onClose }: { date: Dayjs; onClose: () => void }) {
//   return (
//     <ModalLayout
//       title="신청 완료"
//       footerOptions={{
//         main: {
//           text: "확인",
//         },
//       }}
//       setIsModal={onClose}
//     >
//       <Box mb={5} fontSize="22px" fontWeight="bold" color="mint">
//         + 50 Point
//       </Box>
//       <Box color="gray.700" lineHeight="20px">
//         <b>{dayjsToFormat(date.locale("ko"), "M월 D일(ddd)")}</b> 스터디 신청이 완료되었습니다.
//         <br />
//         매칭이 성공되면 스터디 톡방도 입장해 주세요!
//       </Box>
//     </ModalLayout>
//   );
// }

export default BaseModal;
