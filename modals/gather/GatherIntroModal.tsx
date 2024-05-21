import styled from "styled-components";

import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function GatherIntroModal({ setIsModal }: IModal) {
  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="모임 관련" setIsModal={setIsModal}>
      <Ol>
        <li>매주 금,토,일 중에 주모임이 개설됩니다.</li>
        <Ul>
          <li>수요일까지 신청을 받고 인원이 되는 경우 오픈</li>
          <li>격주에 한번 정도는 20대 초반 모임으로 진행</li>
        </Ul>
        <li>두달에 한번 정기모임이 진행됩니다.</li>
        <Ul>
          <li>파티룸, 대형술집, 여행 등</li>
        </Ul>
        <li>일반 동아리원이 모임 개설시 지원금을 받습니다.</li>
      </Ol>
    </ModalLayout>
  );
}

const Ol = styled.ol`
  margin-left: var(--gap-4);
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-200);
  line-height: 2;
  > ul:last-child {
    margin-bottom: 0;
  }
`;

const Ul = styled.ul`
  line-height: 1.6;
  font-size: 12px;
  margin-left: var(--gap-3);
  margin-top: var(--gap-1);
  margin-bottom: var(--gap-2);
  font-weight: 400;
  li {
    list-style-type: disc;
  }
`;

export default GatherIntroModal;
