import { Box } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import InfoList from "../../components/atoms/lists/InfoList";
import Textarea from "../../components/atoms/Textarea";
import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestSecedeModal({ setIsModal }: IModal) {
  const toast = useToast();
  const failToast = useFailToast();

  const [value, setValue] = useState("");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      toast("success", "탈퇴가 완료되었습니다.");
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
    main: { text: "회원 탈퇴", func: onSecede, isDisabled: !value },
    sub: {},
  };

  return (
    <ModalLayout title="회원탈퇴" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box mb={5}>
        정말 탈퇴하시겠습니까? <br />
        About은 계속 성장중인 20대 모임 플랫폼입니다.
        <br /> 나중을 위해 휴식 신청을 해 보는 건 어떨까요?
      </Box>
      <InfoList
        items={[
          "멤버님의 모든 활동 정보가 삭제됩니다.",
          "포인트를 환급받을 계좌번호를 남겨주세요.",
          "재가입시 가입비를 다시 지불해야 합니다.",
        ]}
      />
      <Box h="20px" />
      <Textarea
        value={value}
        placeholder="탈퇴시 내용 작성"
        onChange={(e) => setValue(e.target.value)}
      />
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
