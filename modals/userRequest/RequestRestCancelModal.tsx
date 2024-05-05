import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { useCompleteToast } from "../../hooks/custom/CustomToast";
import { useStudyArrivedCntQuery } from "../../hooks/study/queries";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IRest } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IRequestRestCancelModal extends IModal {
  rest: IRest;
}

function RequestRestCancelModal({ setIsModal, rest }: IRequestRestCancelModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();

  const { data: studyArrivedCnt } = useStudyArrivedCntQuery(session?.user.uid, {
    enabled: !!session,
  });
  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      completeToast("free", "해제되었습니다.");
    },
  });

  const onClick = () => {
    if (studyArrivedCnt >= 2) setRole({ role: "member" });
    else setRole({ role: "human" });
    setIsModal(false);
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
      <ModalSubtitle>휴식 상태를 해제하시겠어요?</ModalSubtitle>
      <Container>
        <Item>
          <span>휴식 타입:</span>
          <span>{rest?.type}휴식</span>
        </Item>
        <Item>
          <span>휴식 기간:</span>
          <span>
            {dayjsToFormat(dayjs(rest?.startDate), "MM월 D일")} ~{" "}
            {dayjsToFormat(dayjs(rest?.endDate), "MM월 D일")}
          </span>
        </Item>
        <Item>
          <span>신청 횟수:</span>
          <span>{rest?.restCnt}회</span>
        </Item>
        <Item>
          <span>누적 날짜:</span>
          <span>{rest?.cumulativeSum}일</span>
        </Item>
      </Container>
    </ModalLayout>
  );
}

const Container = styled.div`
  line-height: 1.7;
`;

const Item = styled.div`
  font-size: 12px;

  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    margin-left: var(--gap-2);
  }
`;

export default RequestRestCancelModal;
