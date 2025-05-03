import { Box } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import DailyCheckWinModal from "../../modals/aboutHeader/dailyCheckModal/DailyCheckWinModal";
import CollectionModal from "../../modals/common/CollectionModal";
import WriteDrawer from "../../modals/home/writeDrawer";
import { ModalLayout } from "../../modals/Modals";
import ErrorUserInfoPopUp from "../../modals/pop-up/ErrorUserInfoPopUp";
import {
  transferCollectionState,
  transferDailyCheckWinState,
  transferStudyVoteDateState,
} from "../../recoils/transferRecoils";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
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
  const [transferStudyVoteDate, setTransferStudyVoteDate] = useRecoilState(
    transferStudyVoteDateState,
  );

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
      {transferStudyVoteDate && (
        <StudyLinkModal
          date={transferStudyVoteDate}
          onClose={() => setTransferStudyVoteDate(null)}
        />
      )}
      {isWriteModal && <WriteDrawer />}
      {transferCollection && (
        <CollectionModal
          setIsModal={() => setTransferCollection(null)}
          collection={transferCollection}
        />
      )}
    </>
  );
}

function StudyLinkModal({ date, onClose }: { date: Dayjs; onClose: () => void }) {
  return (
    <ModalLayout
      title="신청 완료"
      footerOptions={{
        main: {
          text: "확인",
        },
      }}
      setIsModal={onClose}
    >
      <Box mb={5} fontSize="22px" fontWeight="bold" color="mint">
        + 50 Point
      </Box>
      <Box color="gray.700" lineHeight="20px">
        <b>{dayjsToFormat(date.locale("ko"), "M월 D일(ddd)")}</b> 스터디 신청이 완료되었습니다.
        <br />
        매칭이 성공되면 스터디 톡방도 입장해 주세요!
      </Box>
    </ModalLayout>
  );
}

export default BaseModal;
