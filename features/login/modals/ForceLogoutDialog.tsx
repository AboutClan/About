import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

function ForceLogoutDialog() {
  const router = useRouter();
  const forceSignOut = (router.query.force_signout as string) === "true";

  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (forceSignOut) onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSignOut]);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      size="xs"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            강제 로그아웃
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>관리자가 당신의 권한을 변경하여 강제 로그아웃되었습니다.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="red" onClick={onClose} width="100%">
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ForceLogoutDialog;
