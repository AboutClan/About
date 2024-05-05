import { Dayjs } from "dayjs";
import styled from "styled-components";

import { IHighlightedText } from "../../../atoms/HighlightedText";
import BoardHeaderText from "./_component/BoardHeaderText";
import BoardUserBlocks from "./_component/BoardUserBlocks";
import TimeBoard from "./_component/TimeBoard";

export interface ITimeBoardParticipant {
  name: string;
  time: {
    start: Dayjs;
    end: Dayjs;
  };
}

interface ITimeBoard {
  headerText: IHighlightedText;
  participants: ITimeBoardParticipant[];
}

export default function UserTimeBoard({ participants, headerText }: ITimeBoard) {
  return (
    <UserTimeBoardContainer>
      <BoardHeaderText headerText={headerText} />
      <BoardContainer participants={participants}>
        <TimeBoard />
        <BoardUserBlocks participants={participants} />
      </BoardContainer>
    </UserTimeBoardContainer>
  );
}

const UserTimeBoardContainer = styled.div`
  margin: 16px auto;
  width: 344px;
`;

const BoardContainer = styled.div`
  min-height: 160px;
  display: flex;
  flex-direction: column;
  padding-top: 8px; /* pt-2 */
  position: relative;
  border-radius: var(--rounded-lg); /* rounded-lg */
  background-color: white;
  box-shadow: var(--shadow); /* shadow-md */
  height: ${({ participants }) => `${participants.length * 38 + 52}px`};
`;
