import { IAlertModalOptions } from "@/components/AlertModal";
import AlertSimpleModal from "@/components/AlertSimpleModal";
import { IModal } from "@/types/components/modalTypes";

export default function AlertNotCompletedModal({ setIsModal }: IModal) {
  const options: IAlertModalOptions = {
    title: "준비중",
    subTitle: "준비중인 기능입니다.",
    func: () => setIsModal(false),
  };
  return <AlertSimpleModal options={options} setIsModal={setIsModal} />;
}
