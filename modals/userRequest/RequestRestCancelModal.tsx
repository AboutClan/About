import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IRest } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IRequestRestCancelModal extends IModal {
  rest: IRest;
}

function RequestRestCancelModal({ setIsModal, rest }: IRequestRestCancelModal) {
  const toast = useToast();

  const queryClient = useQueryClient();

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "해제되었습니다.");
      queryClient.refetchQueries([USER_INFO]);
      setIsModal(false);
    },
  });

  const onClick = () => {
    setRole({ role: "human" });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "해제",
      func: onClick,
    },
    sub: {},
  };

  return (
    <ModalLayout title="휴식 해제" footerOptions={footerOptions} setIsModal={setIsModal}>
      휴식 상태를 해제하겠어요?
      <Flex flexDir="column" align="start" mt={5} lineHeight={1.8}>
        <Item>
          <span>휴식 타입:</span>
          <span>{rest?.type}휴식</span>
        </Item>
        <Item>
          <span>휴식 기간:</span>
          <span>
            {dayjsToFormat(dayjs(rest?.startDate), "M월 D일")} ~{" "}
            {dayjsToFormat(dayjs(rest?.endDate), "M월 D일")}
          </span>
        </Item>
      </Flex>
    </ModalLayout>
  );
}

const Item = styled.div`
  font-size: 13px;

  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    margin-left: var(--gap-2);
  }
`;

export default RequestRestCancelModal;
