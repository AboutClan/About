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
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useGatherStatusMutation, useGatherWritingMutation } from "../../../hooks/gather/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { GatherExpireModalDialogType } from "./GatherExpireModal";

interface IGatherExpireModalCancelDialog extends IModal {
  modal: GatherExpireModalDialogType;
  memberCnt: number;
}

function GatherExpireModalCancelDialog({
  memberCnt,
  modal,
  setIsModal,
}: IGatherExpireModalCancelDialog) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const errorToast = useErrorToast();

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const gatherId = +router.query.id;

  const onComplete = async (type: "delete" | "close") => {
    queryClient.removeQueries({ queryKey: [GATHER_CONTENT], exact: false });

    if (type === "delete") {
      toast("success", "모임이 삭제되었습니다.");
      router.push(`/gather`);
    }
    if (type === "close") toast("success", "모임이 취소되었습니다.");
    setIsModal(false);
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
    if (memberCnt <= 3) gatherDelete({ gatherId });
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
              {memberCnt <= 3 ? (
                <span>참여자가 적어 모임이 완전히 삭제됩니다.</span>
              ) : (
                <span>참여자가 있어 모임이 취소 상태로 변경됩니다.</span>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                닫기
              </Button>
              <Button colorScheme="mint" onClick={onCancel} ml="var(--gap-2)">
                모임 취소
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
