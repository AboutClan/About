import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { DeclareRequest } from "../../types/models/userTypes/userRequestTypes";

interface IBottomDrawer {
  isModal: boolean;
  setIsModal: DispatchBoolean;
  setDeclareModal?: DispatchType<DeclareRequest>;
  type?: "group";
  onSubmit?: () => void;
}

function BottomDrawer({ type, isModal, setIsModal, setDeclareModal, onSubmit }: IBottomDrawer) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isModal) onOpen();
  }, [isModal, onOpen]);

  useEffect(() => {
    if (!isOpen) setIsModal(false);
  }, [isOpen, setIsModal]);

  const onClick = (type: DeclareRequest) => {
    setDeclareModal(type);
    onClose();
  };

  const onClickAbsent = () => {
    onSubmit();
  };

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="transparent">
        <DrawerBody display="flex" flexDir="column" p="0 var(--gap-2)">
          {type === "group" ? (
            <Button onClick={onClickAbsent} size="lg" color="var(--color-red)">
              탈퇴하기
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onClick("distance")}
                color="var(--color-red)"
                size="lg"
                borderBottomRadius={0}
                borderBottom="var(--border)"
                borderColor="var(--gray-500)"
              >
                거리두기
              </Button>
              <Button
                onClick={() => onClick("declare")}
                color="var(--color-red)"
                borderTopRadius={0}
                size="lg"
              >
                신고하기
              </Button>
            </>
          )}
          <Button onClick={onClose} bg="white" my="var(--gap-2)" size="lg">
            취소
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default BottomDrawer;
