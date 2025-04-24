import { DispatchBoolean } from "../hooks/reactTypes";

export interface IModal {
  setIsModal: DispatchBoolean;
}

export interface ModalProps {
  handleClick: () => void;
}

export interface CloseProps {
  onClose: () => void;
}
