import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";

import { IModal } from "../types/components/modalTypes";

export interface IAlertModalOptions {
  title: string;
  subTitle: string;
  func: () => void;
  subFunc?: () => void;
  text?: string;
  defaultText?: string;
}

interface IAlertModal extends IModal {
  options: IAlertModalOptions;
  colorType?: "mint" | "red";
  isLoading?: boolean;
}

export default function AlertModal({
  setIsModal,
  options: { title, subTitle, func, subFunc, text = "취소합니다", defaultText },
  isLoading,
  colorType = "mint",
}: IAlertModal) {
  const cancelRef = React.useRef();

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
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setIsModal(false)}
        isOpen={true}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent maxWidth="300px" mx="16px" zIndex={2000}>
          <AlertDialogHeader p="16px" fontSize="18px">
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody p="0 16px">{subTitle}</AlertDialogBody>
          <AlertDialogFooter p="16px">
            <Button onClick={subFunc ? subFunc : () => setIsModal(false)}>
              {defaultText || "취소"}
            </Button>
            <Button isLoading={isLoading} onClick={handleProcess} colorScheme={colorType} ml="12px">
              {text}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
