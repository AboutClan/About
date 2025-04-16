import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRecoilState, useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import DailyCheckWinModal from "../../modals/aboutHeader/dailyCheckModal/DailyCheckWinModal";
import CollectionModal from "../../modals/common/CollectionModal";
import WriteDrawer from "../../modals/home/writeDrawer";
import ErrorUserInfoPopUp from "../../modals/pop-up/ErrorUserInfoPopUp";
import { transferCollectionState, transferDailyCheckWinState } from "../../recoils/transferRecoils";
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

export default BaseModal;
