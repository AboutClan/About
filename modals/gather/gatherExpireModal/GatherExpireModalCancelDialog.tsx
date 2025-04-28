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
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useGatherStatusMutation, useGatherWritingMutation } from "../../../hooks/gather/mutations";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { GatherExpireModalDialogType } from "./GatherExpireModal";

interface IGatherExpireModalCancelDialog {
  setIsComplete: DispatchBoolean;
  modal: GatherExpireModalDialogType;
  isNoMember: boolean;
}

function GatherExpireModalCancelDialog({
  setIsComplete,
  isNoMember,
  modal,
}: IGatherExpireModalCancelDialog) {
  const toast = useToast();
  const errorToast = useErrorToast();

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const gatherId = +router.query.id;

  const onComplete = async (type: "delete" | "close") => {
    setIsComplete(true);
    if (type === "delete") {
      toast("success", "모임이 삭제되었습니다.");
      router.push(`/gather`);
    }
    if (type === "close") toast("success", "모임이 취소되었습니다.");
  };

  const { mutate: gatherDelete } = useGatherWritingMutation("delete", {
    onSuccess: () => onComplete("delete"),
    onError: errorToast,
  });
  const { mutate: statusClose } = useGatherStatusMutation(gatherId, {
    onSuccess: () => onComplete("close"),
    onError: errorToast,
  });

  useEffect(() => {
    if (modal === "cancel") onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const onCancel = () => {
    if (isNoMember) gatherDelete({ gatherId });
    else statusClose("close");
  };

  return (
    <Layout>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto var(--gap-4)">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              모집을 취소하시겠습니까?
            </AlertDialogHeader>
            <AlertDialogBody>
              {isNoMember ? (
                <span>참여자가 없어 게시글이 완전히 삭제됩니다.</span>
              ) : (
                <span>참여자가 있어 게시글이 취소 상태로 변경됩니다.</span>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="mint" onClick={onCancel} ml="var(--gap-2)">
                모집취소
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
}

const Layout = styled.div``;

export default GatherExpireModalCancelDialog;
