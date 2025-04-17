import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import { RankingNumIcon } from "../../components/Icons/RankingIcons";
import { RANKING_ANONYMOUS_USERS } from "../../constants/storage/anonymous";
import { UserRankingProps } from "../../pages/ranking";
import { formatMinutesToTime } from "../../utils/dateTimeUtils";

interface IRankingMembers {
  users: UserRankingProps[];
  fieldName: "studyRecord" | "monthScore" | "score";
}

function RankingMembers({ users, fieldName }: IRankingMembers) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || session?.user.role === "guest" || !users) return;
    setTimeout(() => {
      const element = document.getElementById(`ranking${session?.user.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [session, users]);

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
      {users?.map((user, idx) => {
        const who = user.user;

        const rankNum = idx + 1;
        const value =
          fieldName === "studyRecord"
            ? `${formatMinutesToTime(who[fieldName].monthMinutes)}(${who[fieldName].monthCnt}회)`
            : who[fieldName];
        return (
          <Item key={idx} id={`ranking${who._id}`}>
            <Box mr="16px">
              {rankNum <= 10 ? <RankingNumIcon num={rankNum} /> : <Rank>{rankNum}위</Rank>}
            </Box>
            <Name>
              <Avatar
                userId={who._id}
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
              {/* <UserBadge uid={who.uid} score={who.score} /> */}
            </Name>
            <Box fontSize="12px" fontWeight="semibold" color="gray.600">
              {value}
              {fieldName !== "studyRecord" && " 점"}
            </Box>
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

const RankingMine = styled.div<{ isMine?: boolean }>`
  margin-left: 12px;
  margin-right: 8px;

  font-weight: 600;
  color: ${(props) => props.isMine && "var(--color-mint)"};
  font-size: 13px;
`;

export default RankingMembers;
