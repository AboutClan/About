import { Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useQueryClient } from "react-query";

import { GROUP_STUDY } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../hooks/groupStudy/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface InviteOuterModalProps extends IModal {}

function InviteOuterModal({ setIsModal }: InviteOuterModalProps) {
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};

  const { mutate: mutate2, isLoading } = useGroupWaitingStatusMutation(+id, {
    onSuccess() {
      toast("success", "가입되었습니다.");
      queryClient.invalidateQueries([GROUP_STUDY]);
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "초대",
      func: () => mutate2({ status: "agree", userId: null }),
      isLoading,
    },
    sub: {},
  };

  const queryClient = useQueryClient();

  return (
    <ModalLayout title="외부 인원 초대" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Flex justify="center" align="center" h="80px" fontSize="18px">
        외부 인원을 초대합니다.
      </Flex>
    </ModalLayout>
  );
}

export default InviteOuterModal;
