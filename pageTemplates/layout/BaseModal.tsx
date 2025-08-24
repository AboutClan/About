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
import {
  transferCollectionState,
  transferDailyCheckWinState,
  transferStudyRewardState,
} from "../../recoils/transferRecoils";
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
    router.replace(pathname + (params ? `?${params}` : ""));
  };

  const voteOtherStudy = () => {
    newSearchParams.set("drawer", "apply");
    const params = newSearchParams.toString();
    setTransferStudyReward(null);
    router.replace(pathname + (params ? `?${params}` : ""));
  };
  console.log(transferStudyReward);
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
            {transferStudyReward.message?.split(" ")[0] === "개인" ? "공부" : "스터디"}{" "}
            {transferStudyReward.message === "스터디 개설"
              ? "개설"
              : transferStudyReward.message?.split(" ")[0] === "개인"
              ? "인증"
              : "출석"}{" "}
            완료!
            <br />
            <b>{transferStudyReward.point} Point</b>가 적립되었습니다.
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
