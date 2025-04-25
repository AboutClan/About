import { Box } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import Textarea from "../../components/atoms/Textarea";
import { useCompleteToast, useFailToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestSecedeModal({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const failToast = useFailToast();

  const [value, setValue] = useState("");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      completeToast("free", "탈퇴가 완료되었습니다.");
      signOut({ callbackUrl: "/login" });
    },
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const onSecede = () => {
    mutate({
      category: "탈퇴",
      content: value,
    });
  };

  const footerOptions: IFooterOptions = {
    main: { text: "회원탈퇴", func: onSecede },
    sub: {},
  };

  return (
    <ModalLayout title="회원탈퇴" footerOptions={footerOptions} setIsModal={setIsModal}>
      <ModalSubtitle>탈퇴하시겠습니까?</ModalSubtitle>
      <span>
        보증금 환급을 원하신다면 아래에 계좌번호와 성함을 남겨주세요. 확인하는대로 환급해 드리도록
        하겠습니다. 단톡방은 직접 나가주시면 됩니다 !
      </span>
      <Box h="20px" />
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
      <Message>고생하셨어요 ~!</Message>
    </ModalLayout>
  );
}

const Message = styled.div`
  margin-top: var(--gap-4);
  font-size: 14px;
  text-align: center;
  font-weight: 600;
`;

export default RequestSecedeModal;
