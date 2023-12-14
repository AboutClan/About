import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { PopOverIcon } from "../../components/common/Icon/PopOverIcon";
import {
  ModalBody,
  ModalFooterTwo,
  ModalHeader,
  ModalLayout,
} from "../../components/modals/Modals";
import { useFailToast } from "../../hooks/custom/CustomToast";
import { useGroupStudyParticipationMutation } from "../../hooks/groupStudy/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { userInfoState } from "../../recoil/userAtoms";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/reactTypes";

interface IParticipateModal extends IModal {
  fee: number;
  id: number;
}

function ParticipateModal({ fee, id, setIsModal }: IParticipateModal) {
  const failToast = useFailToast();
  const userInfo = useRecoilValue(userInfoState);
  const [selectBtn, setSelectBtn] = useState<"point" | "deposit">("point");

  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate: getDeposit } = usePointSystemMutation("deposit");
  const { mutate: participate } = useGroupStudyParticipationMutation(
    "post",
    id
  );
  const feePoint = (fee + 1000) * 0.15;

  const onSubmit = () => {
    if (selectBtn === "point" && userInfo?.point < feePoint) {
      failToast("free", "포인트가 부족합니다.");
      return;
    }
    if (selectBtn === "deposit") {
      if (userInfo?.deposit < fee) {
        failToast("free", "보증금이 부족합니다. ");
        return;
      }
      if (userInfo?.deposit - 1000 <= fee) {
        failToast(
          "free",
          "보증금을 사용한 뒤에도 1000원 이상 보유해야 합니다."
        );
        return;
      }
    }
    //participate();
    setIsModal(false);
  };

  return (
    <ModalLayout onClose={() => setIsModal(false)} size="xxl">
      <ModalHeader text="가입 신청" />
      <ModalBody>
        <ModalSubtitle>
          소모임 가입에는 150 포인트 또는 1000원이 소모됩니다. 이는 그룹장에게
          전달되어 활동 지원금으로 사용됩니다.
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
            <span>{feePoint} 포인트</span>{" "}
          </Fee>
          <Fee>
            <span>필요 활동비:</span>
            <span>{fee + 1000}원</span>
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
      </ModalBody>
      <HrDiv />
      <ModalFooterTwo
        rightText="가입 신청"
        onClickLeft={() => setIsModal(false)}
        onClickRight={onSubmit}
      />
    </ModalLayout>
  );
}

const Layout = styled.div``;

const PointContainer = styled.div`
  line-height: 2;
  width: 206px;
  padding: var(--padding-md) var(--padding-sub);
  border-radius: 4px;
  border: var(--border-main);

  margin-bottom: var(--margin-main);
`;

const Point = styled.div`
  display: flex;
  > span:first-child {
    margin-right: var(--margin-md);
  }
  > span:nth-child(2) {
    display: inline-block;
    width: 80px;
    color: var(--color-mint);
  }
`;

const HrDiv = styled.div`
  height: 4px;
  background-color: var(--font-h56);
`;

const Text = styled.div`
  margin-bottom: var(--margin-sub);
`;

const Fee = styled.div`
  display: flex;
  > span:first-child {
    margin-right: var(--margin-md);
  }
  > span:nth-child(2) {
    display: inline-block;
    width: 72px;
    color: var(--color-red);
  }
`;

const SelectContainer = styled.div`
  margin-top: var(--margin-main);
  > div {
    display: flex;
    > button {
      flex: 1;
    }
    > button:first-child {
      margin-right: var(--margin-sub);
    }
  }
`;

export default ParticipateModal;
