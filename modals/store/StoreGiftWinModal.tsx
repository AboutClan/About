import styled from "styled-components";

import { IGiftEntry } from "../../pages/store";
import { IModal } from "../../types/components/modalTypes";
import { selectRandomWinners } from "../../utils/validationUtils";
import { IFooterOptions, ModalLayout } from "../Modals";
interface IStoreGiftWinModal extends IModal {
  applicants: IGiftEntry;
  winCnt: number;
}

function StoreGiftWinModal({ setIsModal, applicants, winCnt }: IStoreGiftWinModal) {
  const users = applicants.users.reduce((acc, curr) => {
    for (let i = 0; i < curr.cnt; i++) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const winners: number[] = selectRandomWinners(applicants.max, winCnt, applicants.giftId);

  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
    },
  };

  return (
    <ModalLayout title="당첨자 발표" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Message>당첨을 축하합니다!</Message>
      <Winner>
        {winners.map((num, idx) => (
          <Win key={idx}>{users[num]?.name || "비공개"}</Win>
        ))}
      </Winner>
    </ModalLayout>
  );
}

const Message = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--color-mint);
  margin-top: var(--gap-1);
  margin-bottom: var(--gap-5);
`;

const Winner = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: center;

  border-radius: var(--rounded-lg);
  justify-content: space-around;
  border: var(--border-mint);
`;

const Win = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-2);
`;

export default StoreGiftWinModal;
