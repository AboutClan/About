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
import { useGatherStatusMutation } from "../../../hooks/gather/mutations";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { GatherExpireModalDialogType } from "./GatherExpireModal";

interface IGatherExpireModalExpireDialog {
  modal: GatherExpireModalDialogType;
  setIsComplete: DispatchBoolean;
}

function GatherExpireModalExpireDialog({ modal, setIsComplete }: IGatherExpireModalExpireDialog) {
  const toast = useToast();
  const errorToast = useErrorToast();

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const completeRef = useRef();
  const gatherId = +router.query.id;

  const { mutate: statusOpen } = useGatherStatusMutation(gatherId, {
    onSuccess() {
      setIsComplete(true);
      toast("success", "모임이 개설되었어요!");
    },
    onError: errorToast,
  });

  useEffect(() => {
    if (modal === "expire") onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const onComplete = () => {
    statusOpen("open");
    onClose();
  };

  return (
    <Layout>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={completeRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent m="auto var(--gap-4)">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              모집을 완료하겠습니까?
            </AlertDialogHeader>
            <AlertDialogBody>완료를 하면 해당 인원으로 모임이 확정됩니다.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={completeRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="mint" onClick={onComplete} ml="var(--gap-1)">
                모집완료
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
}

const Layout = styled.div``;

export default GatherExpireModalExpireDialog;
