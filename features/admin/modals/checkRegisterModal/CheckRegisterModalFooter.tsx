import { useDisclosure } from "@chakra-ui/react";

import { ModalFooterTwo } from "@/components/modals/Modals";
import { useUserRegisterControlMutation } from "@/features/user/hooks/mutations";
import { useErrorToast, useToast } from "@/hooks/custom/CustomToast";
import AlertDialog from "@/modals/AlertDialog";
import { IModal } from "@/types/components/modalTypes";
import { IRefetch } from "@/types/hooks/reactTypes";

interface ICheckRegisterModalFooter extends IModal, IRefetch {
  uid: string;
}

function CheckRegisterModalFooter({ setIsModal, setIsRefetch, uid }: ICheckRegisterModalFooter) {
  const toast = useToast();
  const errorToast = useErrorToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: approve } = useUserRegisterControlMutation("post", {
    onSuccess() {
      toast("success", "가입이 승인되었습니다.");
    },
    onError: errorToast,
  });

  const { mutate: deleteForm } = useUserRegisterControlMutation("delete", {
    onSuccess() {
      toast("success", "가입이 거절되었습니다.");
    },
    onError: errorToast,
  });

  const onClickAgree = () => {
    approve({ uid });
    setIsRefetch(true);
    setIsModal(false);
  };

  const onClickDelete = () => {
    onClose();
    deleteForm({ uid });
    setIsModal(false);
    setIsRefetch(true);
  };

  return (
    <>
      <ModalFooterTwo
        leftText="거절"
        rightText="승인"
        onClickLeft={onOpen}
        onClickRight={onClickAgree}
        isFull={true}
      />
      <AlertDialog isOpen={isOpen} onClose={onClose} onSubmit={onClickDelete} />
    </>
  );
}

export default CheckRegisterModalFooter;
