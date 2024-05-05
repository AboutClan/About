/* eslint-disable */
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions } from "../Modals";

interface IConfirmModal extends IModal {
  content: IConfirmContent;
}

export interface IConfirmContent {
  title: string;
  text?: string;
  onClickRight: () => void;
}

function ConfirmModal({ content }: IConfirmModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
      func: content.onClickRight,
    },
    sub: {
      text: "취소",
    },
  };
  return null;
}

export default ConfirmModal;
