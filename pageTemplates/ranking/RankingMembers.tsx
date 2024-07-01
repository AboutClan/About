import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import RankingNumberIcon from "../../components/atoms/Icons/RankingNumberIcon";
import { RANKING_ANONYMOUS_USERS } from "../../constants/storage/anonymous";
import { RankingUserProp } from "../../libs/userEventLibs/userHelpers";
import { RankingCategorySource } from "../../pages/statistics";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

interface IRankingMembers {
  categorySource: RankingCategorySource;
  rankingUsers: RankingUserProp[] | IUserSummary[];
  isScore: boolean;
}

function RankingMembers({ categorySource, rankingUsers, isScore }: IRankingMembers) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  let dupCnt = 0;
  let value;

  const uid = session?.user.uid;
  useEffect(() => {
    if (uid && !isGuest) {
      setTimeout(() => {
        const element = document.getElementById(`ranking${uid}`);

        element?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [isGuest, uid, rankingUsers]);

  return (
    <Box
      h="100%"
      overflow="scroll"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {(rankingUsers as RankingUserProp[])?.map((who, idx) => {
        const whoValue = who[categorySource];
        if (value === whoValue) dupCnt++;
        else dupCnt = 0;
        value = whoValue;

        const rankNum = idx - dupCnt + 1;

        return (
          <Item key={idx} id={`ranking${who.uid}`}>
            <Box mr="16px">
              {rankNum <= 3 ? <RankingNumberIcon rankNum={rankNum} /> : <Rank>{rankNum}위</Rank>}
            </Box>
            <Name>
              <Avatar
                image={who.profileImage}
                avatar={who.avatar}
                uid={who.uid}
                sizeLength={40}
                size="md"
                isPriority={idx < 6}
                isLink={!RANKING_ANONYMOUS_USERS.includes(who?.uid)}
              />

              <RankingMine isMine={who.uid === session?.user.uid}>
                {!RANKING_ANONYMOUS_USERS.includes(who?.uid) ? who.name : "비공개"}
              </RankingMine>
              <UserBadge uid={who.uid} score={who.score} />
            </Name>
            <Score>{`${value}${isScore ? "점" : "회"}`}</Score>
          </Item>
        );
      })}
    </Box>
  );
}

const Item = styled.div`
  display: flex;
  padding: 12px 16px;
  padding-right: 20px;
  align-items: center;
  border-bottom: var(--border);
`;

const Name = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Rank = styled.div`
  text-align: start;
  flex: 0.2;
  font-weight: 600;
`;

const Score = styled.div``;

const RankingMine = styled.div<{ isMine?: boolean }>`
  margin-left: 12px;
  margin-right: 8px;

  font-weight: 600;
  color: ${(props) => props.isMine && "var(--color-mint)"};
  font-size: 14px;
`;

export default RankingMembers;
