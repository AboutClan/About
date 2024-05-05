import { Badge } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { EventBadge } from "../../../types/models/userTypes/userInfoTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";

function RequestChagneProfileImageModalBadge({ setIsModal }) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const [selectBadge, setSelectBadge] = useState<EventBadge>(null);

  const { mutate: sendRequest } = useUserRequestMutation({
    onSuccess() {
      completeToast("apply");
    },
    onError: errorToast,
  });

  const onClick = (type: EventBadge) => {
    if (selectBadge === type) {
      setSelectBadge(null);
      return;
    }
    setSelectBadge(type);
  };

  const onApply = () => {
    sendRequest({
      category: "배지",
      writer: session?.user.name as string,
      title: selectBadge ? `${selectBadge}로 변경 신청` : "배지 해제 신청",
      content: session?.user?.uid as string,
    });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경 신청 / 해제 신청(미 선택)",
      func: onApply,
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="배지 변경 신청" setIsModal={setIsModal}>
      <Message>
        이벤트 배지는 출석체크의 랜덤 보상에서 <b>1% 확률</b>로 흭득할 수 있습니다. 배지를 선택 후
        신청을 완료하시면 관리자가 <b>보유 여부를 확인 후</b> 변경해드립니다.
      </Message>
      <Container>
        <Item isSelected={selectBadge === "딸기스무디"} onClick={() => onClick("딸기스무디")}>
          <Badge fontSize={12} colorScheme="badgePink">
            딸기스무디
          </Badge>
        </Item>
        <Item isSelected={selectBadge === "라벤더"} onClick={() => onClick("라벤더")}>
          <Badge fontSize={12} colorScheme="facebook">
            라벤더
          </Badge>
        </Item>
      </Container>
    </ModalLayout>
  );
}

const Message = styled.div`
  margin-bottom: 16px;

  font-size: 12px;
  color: var(--gray-3);
  > b,
  u {
    color: var(--gray-1);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-around;
`;

const Item = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.45;
  padding: var(--gap-5) 0;

  border: ${(props) => (props.isSelected ? "var(--border-mint)" : "var(--border)")};
  border-radius: var(--rounded-lg);
`;

export default RequestChagneProfileImageModalBadge;
