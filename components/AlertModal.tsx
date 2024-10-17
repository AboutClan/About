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
  text?: string;
}

interface IAlertModal extends IModal {
  options: IAlertModalOptions;
  colorType?: "mint" | "red";
}

export default function AlertModal({
  setIsModal,
  options: { title, subTitle, func, text = "취소합니다" },
  colorType = "mint",
}: IAlertModal) {
  const cancelRef = React.useRef();

  const handleProcess = () => {
    func();
    setIsModal(false);
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
        <AlertDialogContent maxWidth="var(--max-width)" mx="16px" zIndex={2000}>
          <AlertDialogHeader p="16px" fontSize="18px">
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody p="0 16px">{subTitle}</AlertDialogBody>
          <AlertDialogFooter p="16px">
            <Button onClick={() => setIsModal(false)}>아니요</Button>
            <Button onClick={handleProcess} colorScheme={colorType} ml="12px">
              {text}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
