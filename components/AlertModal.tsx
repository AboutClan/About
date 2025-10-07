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
  children2?: React.ReactNode;
}

interface IAlertModal extends IModal {
  options: IAlertModalOptions;
  colorType?: "mint" | "red";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function AlertModal({
  setIsModal,
  options: { title, subTitle, func, subFunc, text = "취소합니다", defaultText, children2 },
  isLoading,
  children,
  colorType = "red",
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
          sub: { text: defaultText || "취 소", func: subFunc ? subFunc : () => setIsModal(false) },
          colorType: colorType,
        }}
        isCloseButton={false}
        setIsModal={setIsModal}
      >
        {children2 || subTitle || children}
      </ModalLayout>
    </>
  );
}
