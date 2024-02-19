import { signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import AlertModal, { IAlertModalOptions } from "../../components2/AlertModal";
import DailyCheckWinModal from "../../modals/aboutHeader/dailyCheckModal/DailyCheckWinModal";
import AlphabetModal from "../../modals/common/AlphabetModal";
import WriteDrawer from "../../modals/home/writeDrawer";
import ErrorUserInfoPopUp from "../../modals/pop-up/ErrorUserInfoPopUp";
import { transferAlphabetState } from "../../recoil/transferDataAtoms";
import { transferDailyCheckWinState } from "../../recoils/transferRecoils";
import { DispatchBoolean } from "../../types/reactTypes";
interface IBaseModal {
  isGuest: boolean;
  isError: boolean;
  setIsError: DispatchBoolean;
}

export const LOGOUT_ALERT_OPTIONS: IAlertModalOptions = {
  title: "로그아웃",
  subTitle: "로그아웃 하시겠습니까?",
  func: signOut,
  text: "로그아웃",
};

function BaseModal({ isGuest, isError, setIsError }: IBaseModal) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isWriteModal = !!searchParams.get("write");
  const isLogoutModal = !!searchParams.get("logout");

  const [transferAlphabet, setTransferAlphabet] = useRecoilState(
    transferAlphabetState
  );
  console.log(2, isLogoutModal);
  const dailyCheckWin = useRecoilValue(transferDailyCheckWinState);

  const cancelLogout = () => {
    newSearchParams.delete("logout");
    const params = newSearchParams.toString();
    router.replace(pathname + params ? `?${params}` : "");
  };

  return (
    <>
      {!!dailyCheckWin && <DailyCheckWinModal />}
      {isLogoutModal && (
        <AlertModal options={LOGOUT_ALERT_OPTIONS} setIsModal={cancelLogout} />
      )}
      {isError && <ErrorUserInfoPopUp setIsModal={setIsError} />}
      {isWriteModal && <WriteDrawer />}
      {transferAlphabet && (
        <AlphabetModal
          setIsModal={() => setTransferAlphabet(null)}
          alphabet={transferAlphabet}
        />
      )}
    </>
  );
}

export default BaseModal;
