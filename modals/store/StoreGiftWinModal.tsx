import styled from "styled-components";
import {
  ModalBody,
  ModalFooterOne,
  ModalHeader,
  ModalLayout,
} from "../../components/modals/Modals";

import { selectRandomWinners } from "../../helpers/validHelpers";
import { IGiftEntry } from "../../pages/store";
import { IModal } from "../../types/reactTypes";
interface IStoreGiftWinModal extends IModal {
  applicants: IGiftEntry;
  winCnt: number;
}

function StoreGiftWinModal({
  setIsModal,
  applicants,
  winCnt,
}: IStoreGiftWinModal) {
  const users = applicants.users;

  const winners: number[] = selectRandomWinners(
    applicants.max,
    winCnt,
    applicants.giftId
  );
  console.log(4, winners);
  return (
    <ModalLayout onClose={() => setIsModal(false)} size="md">
      <ModalHeader text="당첨자 발표" />
      <ModalBody>
        <Message>당첨을 축하합니다!</Message>
        <Winner>
          {winners.map((num, idx) => {
            console.log(4, num);
            console.log(users.length);
            return (
              <Win key={idx}>
                {!num || users.length < num ? "비공개" : users[num]?.name}
              </Win>
            );
          })}
        </Winner>
      </ModalBody>
      <ModalFooterOne text="확인" onClick={() => setIsModal(false)} />
    </ModalLayout>
  );
}

const Message = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: var(--font-h2);
  margin-top: var(--margin-sub);
  margin-bottom: 30px;
`;

const Winner = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border-radius: var(--border-radius-sub);
  justify-content: space-around;
  border: var(--border-mint);
`;

const Win = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--font-h2);
`;

export default StoreGiftWinModal;
