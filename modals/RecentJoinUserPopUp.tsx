import { IModal } from "../types/components/modalTypes";
import { IUserSummary } from "../types/models/userTypes/userInfoTypes";
import { ModalLayout } from "./Modals";

interface RecentJoinUserPopUpProps extends IModal {
  users: IUserSummary[];
}

function RecentJoinUserPopUp({ users, setIsModal }: RecentJoinUserPopUpProps) {
  return (
    <ModalLayout footerOptions={{}} title="최근 함께한 인원" setIsModal={setIsModal}>
      2
    </ModalLayout>
  );
}

export default RecentJoinUserPopUp;
