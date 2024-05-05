import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface IAlertDialog {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function AlertDialog({ isOpen, onClose, onSubmit }: IAlertDialog) {
  const cancelRef = useRef();
  return (
    <ChakraAlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent w="336px" m="auto var(--gap-4)">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            가입 거절
          </AlertDialogHeader>
          <AlertDialogBody>정말로 거절할거야?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="mintTheme" onClick={onSubmit} ml="var(--gap-2)">
              거절
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  );
}

export default AlertDialog;
