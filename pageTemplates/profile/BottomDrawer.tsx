import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import { DispatchType } from "../../types/hooks/reactTypes";
import { DeclareRequest } from "../../types/models/userTypes/userRequestTypes";

interface IBottomDrawer {
  onClose: () => void;
  setDeclareModal?: DispatchType<DeclareRequest>;
  type?: "group";
  onSubmit?: () => void;
}

function BottomDrawer({ type, onClose, setDeclareModal, onSubmit }: IBottomDrawer) {
  const onClick = (type: DeclareRequest) => {
    setDeclareModal(type);
    onClose();
  };

  const onClickAbsent = () => {
    onSubmit();
  };

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen>
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
