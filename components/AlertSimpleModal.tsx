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
export interface IAlertSimpleModalOptions {
  title: string;
  subTitle: string;
  func: () => void;
  text?: string;
}

interface IAlertSimpleModal extends IModal {
  options: IAlertSimpleModalOptions;
  colorType?: "mintTheme" | "redTheme";
}

export default function AlertSimpleModal({
  setIsModal,
  options: { title, subTitle },
}: IAlertSimpleModal) {
  const cancelRef = React.useRef();

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
        <AlertDialogContent mx="40px" zIndex={2000}>
          <AlertDialogHeader p="16px" fontSize="18px">
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody p="0 16px">{subTitle}</AlertDialogBody>
          <AlertDialogFooter p="16px">
            <Button colorScheme="mintTheme" onClick={() => setIsModal(false)}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
