import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { PopOverIcon } from "../../components/atoms/Icons/PopOverIcon";
import { GROUP_STUDY_ALL } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useCompleteToast, useFailToast } from "../../hooks/custom/CustomToast";
import {
  useGroupParticipationMutation,
  useGroupWaitingMutation,
} from "../../hooks/groupStudy/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IFooterOptions, ModalFooterTwo, ModalLayout } from "../../modals/Modals";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";

interface IParticipateModal extends IModal {
  id: number;
  isFree: boolean;
  feeText: string;
  answer: string;
}

function ParticipateModal({ isFree, id, setIsModal, answer }: IParticipateModal) {
  const router = useRouter();
  const failToast = useFailToast();
  const completeToast = useCompleteToast();
  const { data: userInfo } = useUserInfoQuery();
  const [selectBtn, setSelectBtn] = useState<"point" | "deposit">("point");

  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const resetQueryData = useResetQueryData();

  const chargePoint = () => {
    if (selectBtn === "point") {
      getPoint({ value: 30, message: "소모임 가입" });
    }
    if (selectBtn === "deposit") {
      getDeposit({ value: -200, message: "소모임 가입" });
    }
  };

  const { mutate: participate } = useGroupParticipationMutation("post", id, {
    onSuccess() {
      if (isFree) chargePoint();
      completeToast("free", "가입이 완료되었습니다.");
      resetQueryData([GROUP_STUDY_ALL]);
      router.push("/group");
    },
  });

  const { mutate: sendRegisterForm } = useGroupWaitingMutation(id, {
    onSuccess() {
      completeToast("free", "가입 신청이 완료되었습니다.");
      resetQueryData([GROUP_STUDY_ALL]);
      router.push("/group");
    },
  });

  const feeValue = 200;
  const feePoint = 20;

  const onSubmit = () => {
    if (selectBtn === "point" && userInfo?.point < feePoint) {
      failToast("free", "포인트가 부족합니다.");
      return;
    }
    if (selectBtn === "deposit") {
      if (userInfo?.deposit < feeValue) {
        failToast("free", "보증금이 부족합니다. ");
        return;
      }
      if (userInfo?.deposit - 1000 < feeValue) {
        failToast("free", "보증금을 사용한 뒤에도 1000원 이상 보유해야 합니다.");
        return;
      }
    }

    if (isFree) participate();
    else sendRegisterForm({ answer, pointType: selectBtn });
    setIsModal(false);
  };

  <ModalFooterTwo
    rightText="가입 신청"
    onClickLeft={() => setIsModal(false)}
    onClickRight={onSubmit}
  />;

  const footerOptions: IFooterOptions = {
    main: {
      text: "가입 신청",
      func: onSubmit,
    },
    sub: {},
  };

  return (
    <ModalLayout setIsModal={setIsModal} title="가입 신청" footerOptions={footerOptions}>
      <ModalSubtitle>
        소모임 가입에는 기본 참여비로 20 포인트 또는 200원이 소모됩니다.
      </ModalSubtitle>
      <PointContainer>
        <Point>
          <span>보유 포인트:</span>
          <span>{userInfo?.point} 포인트</span>{" "}
          <PopOverIcon
            title="포인트"
            text="포인트는 동아리 활동을 통해 여러 곳에서 획득할 수 있습니다. 포인트 가이드를 참고해주세요!"
          />
        </Point>
        <Point>
          <span>보유 보증금:</span>
          <span>{userInfo?.deposit}원</span>
          <PopOverIcon
            title="보증금"
            text="0원이 되면 동아리 활동이 불가능하기에 1000원 이상 유지해야 합니다. 마이페이지에서 충전할 수 있습니다."
          />
        </Point>
      </PointContainer>
      <PointContainer>
        <Fee>
          <span>필요 포인트:</span>
          <span>20 포인트</span>{" "}
        </Fee>
        <Fee>
          <span>필요 활동비:</span>
          <span>200원</span>
        </Fee>
      </PointContainer>
      <SelectContainer>
        <Text>사용 할 재화를 선택해주세요</Text>
        <div>
          <Button
            onClick={() => setSelectBtn("point")}
            colorScheme={selectBtn === "point" ? "redTheme" : "gray"}
          >
            포인트 사용
          </Button>
          <Button
            onClick={() => setSelectBtn("deposit")}
            colorScheme={selectBtn === "deposit" ? "redTheme" : "gray"}
          >
            보증금 사용
          </Button>
        </div>
      </SelectContainer>
    </ModalLayout>
  );
}

const PointContainer = styled.div`
  line-height: 2;
  width: 206px;
  padding: var(--gap-2) var(--gap-3);
  border-radius: 4px;
  border: var(--border);

  margin-bottom: var(--gap-4);
`;

const Point = styled.div`
  display: flex;
  > span:first-child {
    margin-right: var(--gap-2);
  }
  > span:nth-child(2) {
    display: inline-block;
    width: 80px;
    color: var(--color-mint);
  }
`;

const Text = styled.div`
  margin-bottom: var(--gap-3);
`;

const Fee = styled.div`
  display: flex;
  > span:first-child {
    margin-right: var(--gap-2);
  }
  > span:nth-child(2) {
    display: inline-block;
    width: 72px;
    color: var(--color-red);
  }
`;

const SelectContainer = styled.div`
  margin-top: auto;
  margin-bottom: var(--gap-4);
  > div {
    display: flex;
    > button {
      flex: 1;
    }
    > button:first-child {
      margin-right: var(--gap-3);
    }
  }
`;

export default ParticipateModal;
