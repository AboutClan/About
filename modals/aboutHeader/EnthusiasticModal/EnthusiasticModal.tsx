import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { useCompleteToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useCounterQuery } from "../../../hooks/sub/counter/queries";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { ModalSubtitle } from "../../../styles/layout/modal";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";

interface IEnthusiasticModal extends IModal {}

const LOCATION_WIN = {
  수원: 3,
  양천: 5,
  안양: 6,
  강남: 6,
};

function EnthusiasticModal({ setIsModal }: IEnthusiasticModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const failToast = useFailToast();
  const location = session?.user.location;
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const { data: memberCnt, isLoading } = useCounterQuery("enthusiasticMember", location, {
    enabled: !!location,
  });

  const { mutate } = useUserInfoFieldMutation("role", {
    onSuccess() {
      completeToast("free", "이번 달 열공멤버가 되었습니다!");
      setIsModal(false);
    },
  });

  const isExpired = LOCATION_WIN[location] <= memberCnt;

  const footerOptions: IFooterOptions = {
    main: {
      text: "지원하기",
      func: () => setIsConfirmModal(true),
    },
    sub: {},
    isFull: true,
  };

  const alertOptions: IAlertModalOptions = {
    title: " 열공멤버에 지원하시겠어요?",
    subTitle: "자동으로 등록됩니다.",
    func: () => {
      if (isExpired) {
        failToast("free", "이미 마감되었습니다.");
        setIsConfirmModal(false);
        return;
      }
      mutate({ role: "enthusiastic" });
    },
    text: "신청",
  };

  return (
    <>
      <ModalLayout
        title={`${dayjs().month() + 2}월 열공멤버 신청 `}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <ModalSubtitle>매 달마다 선착순으로 열공멤버 신청을 받습니다!</ModalSubtitle>
        <CurrentMember>
          현재 인원:
          <span>{!isLoading && (isExpired ? "모집 마감" : `${memberCnt + 1 || 1}명`)}</span>
        </CurrentMember>
        <Container>
          <li>
            <b>모집 인원:</b> {LOCATION_WIN[location]}명
          </li>
          <li>
            <b>지원 조건</b>
          </li>
          <Condition>
            <li>만 19~23세의 대학생</li>
            <li>인원 당 1회만 등록 가능</li>
            <li>
              한달 동안
              <b>
                <u>4번 스터디 참여 또는 신청</u>
              </b>
            </li>
            <span>(미오픈 투표, FREE 오픈, 개인스터디 = 2회당 1번)</span>
          </Condition>
          <Win>
            <b>300 POINT 지급 !</b>
          </Win>
        </Container>
      </ModalLayout>
      {isConfirmModal && <AlertModal options={alertOptions} setIsModal={setIsConfirmModal} />}
    </>
  );
}

const CurrentMember = styled.div`
  border: var(--border-mint);
  width: max-content;
  padding: var(--gap-1) var(--gap-2);
  border-radius: var(--rounded-lg);
  font-size: 13px;
  > span {
    margin-left: var(--gap-1);
    color: var(--color-mint);
  }
`;

const Container = styled.ul`
  margin-top: var(--gap-3);
  margin-left: var(--gap-4);
  font-size: 14px;

  > li {
    margin-bottom: var(--gap-1);
  }
`;

const Condition = styled.ol`
  margin-left: var(--gap-4);
  font-size: 13px;
  > li {
    > b {
      margin-left: var(--gap-1);
      color: var(--color-mint);
    }
  }
  > span {
    font-size: 12px;
    color: var(--gray-600);
  }
`;

const Win = styled.li`
  > b {
    color: var(--color-mint);
  }
`;

export default EnthusiasticModal;
