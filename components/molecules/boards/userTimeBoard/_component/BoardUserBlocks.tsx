import { useEffect, useState } from "react";
import styled from "styled-components";

import { COLOR_TABLE } from "../../../../../constants/colorConstants";
import { transformToUserBlocks } from "../_lib/transformToUserBlocks";
import { ITimeBoardParticipant } from "../UserTimeBoard";

const BLOCK_WIDTH = 24;
export interface IUserTimeBlock {
  name: string;
  start: string;
  end: string;
  startInterval: number;
  startToEndInterval: number;
}

interface IBoardUserBlocks {
  members: ITimeBoardParticipant[];
}
export default function BoardUserBlocks({ members }: IBoardUserBlocks) {
  const [userBlocks, setUserBlocks] = useState<IUserTimeBlock[]>([]);

  useEffect(() => {
    // Assuming transformToUserBlocks is a function that transforms members into userBlocks
    const newUserBlocks = transformToUserBlocks(members);
    setUserBlocks(newUserBlocks);
  }, [members]);
  
  return (
    <BlocksContainer>
      {userBlocks?.map((userBlock, idx) => (
        <UserBlock key={idx} index={idx} userBlock={userBlock}>
          <div>{userBlock.name}</div>
          <div>
            {userBlock.start} ~ {userBlock.startToEndInterval >= 3 && userBlock.end}
          </div>
        </UserBlock>
      ))}
    </BlocksContainer>
  );
}

const BlocksContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 28px; /* pt-7 */
`;

const UserBlock = styled.div<{ index: number; userBlock: IUserTimeBlock }>`
  background-color: ${(props) => COLOR_TABLE[props.index % COLOR_TABLE.length]};
  height: 36px; /* h-9 */
  position: relative;
  z-index: 10;
  border-radius: var(--rounded-lg); /* rounded-lg */
  padding: 4px; /* p-1 */
  display: flex;
  flex-direction: column;
  color: white;
  margin-bottom: 4px; /* mb-1 */
  overflow: hidden;
  width: ${(props) => `${props.userBlock.startToEndInterval * BLOCK_WIDTH}px`};
  margin-left: ${(props) =>
    `${props.userBlock.startInterval * BLOCK_WIDTH + BLOCK_WIDTH / 2 + 4}px`};
  font-size: 10px; /* text-xxs */
`;
