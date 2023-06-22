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
import { SetStateAction, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { ModalHeaderX } from "../../components/ui/Modal";
import {
  useGatherParticipate,
  useGatherStatusClose,
  useGatherStatusEnd,
  useGatherStatusOpen,
} from "../../hooks/gather/mutations";
import { useCompleteToast, useFailToast } from "../../hooks/ui/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { gatherDataState } from "../../recoil/interactionAtoms";
import { ModalMain, ModalXs } from "../../styles/layout/modal";

function ExpireGatherModal({
  setIsModal,
}: {
  setIsModal?: React.Dispatch<SetStateAction<boolean>>;
}) {
  const failToast = useFailToast({ type: "applyGather" });
  const failPreApplyToast = useFailToast({ type: "applyPreGather" });
  const completeToast = useCompleteToast({ type: "applyGather" });
  const [isFirst, setIsFirst] = useState(true);
  const { data } = useUserInfoQuery();
  const gatherData = useRecoilValue(gatherDataState);

  const gatherId = gatherData?.id;
  const { mutate: statusOpen } = useGatherStatusOpen({
    onSuccess() {
      console.log("SUC");
    },
  });
  const { mutate: statusClose } = useGatherStatusClose();
  const { mutate: statusEnd } = useGatherStatusEnd();

  const [password, setPassword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onClickPre = () => {
    setIsFirst(false);
  };

  const { mutate } = useGatherParticipate({
    onSuccess() {
      console.log("suc");
    },
  });
  const onApply = (type: "expire" | "cancel") => {
    if (type === "expire") {
      onOpen();
      return;
    }
    if (type === "cancel") {
      onOpenCancel();
      return;
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCancel,
    onOpen: onOpenCancel,
    onClose: onCloseCancel,
  } = useDisclosure();
  const completeRef = useRef();
  const cancelRef = useRef();

  const onComplete = () => {
    console.log(4);
    statusOpen({ gatherId });
  };

  const onCancel = () => {
    statusClose({ gatherId });
  };

  return (
    <>
      <Layout>
        <ModalHeaderX title="모집 종료" setIsModal={setIsModal} />
        <ModalMain>
          <Main>
            <Button
              color="white"
              backgroundColor="var(--color-mint)"
              marginBottom="16px"
              size="lg"
              onClick={() => onApply("expire")}
            >
              모집 마감
            </Button>
            <Button onClick={() => onApply("cancel")} size="lg">
              모임 취소
            </Button>
          </Main>
        </ModalMain>
      </Layout>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={completeRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent margin="auto 14px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              모집을 완료하겠습니까?
            </AlertDialogHeader>

            <AlertDialogBody>
              완료를 하면 해당 인원으로 모임이 확정됩니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={completeRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="mintTheme" onClick={onComplete} ml={3}>
                모집완료
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isOpenCancel}
        leastDestructiveRef={cancelRef}
        onClose={onCloseCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent margin="auto 14px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              모집을 취소하시겠습니까?
            </AlertDialogHeader>

            <AlertDialogBody>
              모집 취소를 하면 해당 모임이 완전 취소됩니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseCancel}>
                취소
              </Button>
              <Button colorScheme="mintTheme" onClick={onCancel} ml={3}>
                모집취소
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

const Layout = styled(ModalXs)``;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 100%;
  > div:last-child {
    margin-top: 10px;
  }
`;

const Input = styled.input`
  margin-left: 8px;
  background-color: var(--font-h7);
  padding: 4px 8px;
  border-radius: var(--border-radius);
`;

const Footer = styled.footer``;

const CodeText = styled.span``;

export default ExpireGatherModal;
