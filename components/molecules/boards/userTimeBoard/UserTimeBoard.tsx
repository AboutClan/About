import styled from "styled-components";
import { TimeRangeProps } from "../../../../types/models/utilTypes";

import { IHighlightedText } from "../../../atoms/HighlightedText";
import BoardHeaderText from "./_component/BoardHeaderText";
import BoardUserBlocks from "./_component/BoardUserBlocks";
import TimeBoard from "./_component/TimeBoard";

export interface ITimeBoardParticipant {
  name: string;
  time: TimeRangeProps;
}

interface ITimeBoard {
  headerText: IHighlightedText;
  members: ITimeBoardParticipant[];
}

export default function UserTimeBoard({ members, headerText }: ITimeBoard) {
  return (
    <UserTimeBoardContainer>
      <BoardHeaderText headerText={headerText} />
      <BoardContainer members={members}>
        <TimeBoard />
        <BoardUserBlocks members={members} />
      </BoardContainer>
    </UserTimeBoardContainer>
  );
}

const UserTimeBoardContainer = styled.div`
  padding: 16px;
  width: 376px;
  background-color: var(--gray-100);
`;

const BoardContainer = styled.div<{ members: ITimeBoardParticipant[] }>`
  min-height: 160px;
  display: flex;
  flex-direction: column;
  padding-top: 8px; /* pt-2 */
  position: relative;
  border-radius: var(--rounded-lg); /* rounded-lg */
  background-color: white;

  height: ${({ members }) => `${members.length * 38 + 52}px`};
`;
