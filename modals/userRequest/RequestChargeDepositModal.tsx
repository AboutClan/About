import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import { CopyBtn } from "../../components/Icons/CopyIcon";
import { ACCOUNT_SHORT } from "../../constants/contentsText/Private";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemQuery } from "../../hooks/user/queries";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestChargeDepositModal({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const [isFirst, setIsFirst] = useState(true);

  const resetQueryData = useResetQueryData();

  const { data: deposit } = usePointSystemQuery("deposit");
  const { mutate: sendRequest } = useUserRequestMutation();
  const { mutate: getDeposit } = usePointSystemMutation("deposit", {
    onSuccess() {
      completeToast("success");
      resetQueryData([USER_INFO], () => setIsModal(false));
    },
    onError: errorToast,
  });

  const onComplete = () => {
    const userRequestInfo: IUserRequest = {
      category: "충전",
    };
    sendRequest(userRequestInfo);
    getDeposit({ value: 2000, message: "보증금 충전" });
  };

  const myDeposit = deposit;

  const footerOptions: IFooterOptions = {
    main: {
      text: isFirst ? "충전 신청" : "입금 완료",
      func: () => (isFirst ? setIsFirst(false) : onComplete()),
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="보증금 충전" setIsModal={setIsModal}>
      {myDeposit &&
        (isFirst ? (
          <>
            <MainItem>
              <span>보유 보증금</span>
              <MyDeposit>{myDeposit}원</MyDeposit>
            </MainItem>
            <MainItem>
              <span>충전 금액</span>
              <ChargeDeposit>+ 2000원</ChargeDeposit>
            </MainItem>
            <Hr />
            <MainItem>
              <span>충전 후 보증금</span>
              <span>= {myDeposit + 2000}원</span>
            </MainItem>
          </>
        ) : (
          <>
            <MainItem>
              <span>입금 계좌</span>
              <div>
                <span> {ACCOUNT_SHORT}</span>
                <CopyBtn text={ACCOUNT_SHORT} />
              </div>
            </MainItem>
            <MainItem>
              <span>입금자 명</span>
              <span>{session.user.name}</span>
            </MainItem>
            <MainItem>
              <span>입금 금액</span>
              <span>2000원</span>
            </MainItem>
            <Message>위의 계좌로 입금 후 완료 버튼을 눌러주세요!</Message>
          </>
        ))}
    </ModalLayout>
  );
}

const MainItem = styled.div`
  padding: var(--gap-2) 0;
  display: flex;
  justify-content: space-between;
  > span:first-child {
    font-weight: 600;
    color: var(--gray-800);
  }
  > div {
    span:first-child {
      margin-right: 8px;
    }
  }
`;

const Hr = styled.div`
  height: 1.5px;
  background-color: var(--gray-200);
  margin: var(--gap-1) 0;
`;

const MyDeposit = styled.span`
  margin-left: var(--gap-3);
`;

const ChargeDeposit = styled.span`
  color: var(--color-mint);
`;

const Message = styled.div`
  padding-top: auto;
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
`;

export default RequestChargeDepositModal;
