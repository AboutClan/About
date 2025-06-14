import React from "react";
import { ModalLayout } from "../modals/Modals";

import { IModal } from "../types/components/modalTypes";

export interface IAlertModalOptions {
  title: string;
  subTitle?: string;
  func: () => void;
  subFunc?: () => void;
  text?: string;
  defaultText?: string;
}

interface IAlertModal extends IModal {
  options: IAlertModalOptions;
  colorType?: "mint" | "red";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function AlertModal({
  setIsModal,
  options: { title, subTitle, func, subFunc, text = "취소합니다", defaultText },
  isLoading,
  children,
}: IAlertModal) {
  const handleProcess = async () => {
    func();
    if (isLoading) {
      setTimeout(() => {
        setIsModal(false);
      }, 500);
    }
  };

  return (
    <>
      <ModalLayout
        title={title}
        footerOptions={{
          main: { text, func: handleProcess },
          sub: { text: defaultText || "취소", func: subFunc ? subFunc : () => setIsModal(false) },
          colorType: "red",
        }}
        setIsModal={setIsModal}
      >
        {subTitle || children}
      </ModalLayout>
    </>
  );
}
