import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

import { IModal } from "../../types/components/modalTypes";

interface IRequestLogoutModal extends IModal {
  isModal: boolean;
}

function RequestLogoutModal({ isModal, setIsModal }: IRequestLogoutModal) {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isModal) onOpen();
    else onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModal]);

  const logout = () => {
    signOut({ callbackUrl: `/login/?status=logout` });
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent margin="auto 14px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            로그아웃
          </AlertDialogHeader>
          <AlertDialogBody>Bye Bye</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsModal(false)}>
              취소
            </Button>
            <Button color="white" backgroundColor="var(--color-mint)" onClick={logout} ml={3}>
              로그아웃
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default RequestLogoutModal;
