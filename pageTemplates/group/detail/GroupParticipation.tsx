import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { IGroup } from "../../../types/models/groupTypes/group";

interface IGroupParticipation {
  data: IGroup;
}

function GroupParticipation({ data }: IGroupParticipation) {
  const isSecret = data?.isSecret;
  const isPlanned = data?.participants.length <= 1;
  const waitingCnt = data?.waiting.length;
  const userCardArr: IProfileCommentCard[] = data.participants
    .map((par) => {
      const roleText = GROUP_STUDY_ROLE[par.role];

      if (isSecret) {
        return {
          user: null,
          comment: { comment: "익명으로 진행되는 소모임입니다." },
          rightComponent: <ParticipateTime isFirst={true}>비공개</ParticipateTime>,
        };
      }
      return {
        user: par.user,
        comment: { comment: par.user?.comment || "비공개 계정입니다." },
        crownType: (roleText === "소모임장" ? "main" : roleText === "운영진" ? "sub" : null) as
          | "main"
          | "sub"
          | null,
        rightComponent: (
          <>
            <SocialingScoreBadge user={par.user} size="sm" />
          </>
        ),
      };
    })
    .sort((a, b) => {
      const rank = { main: 0, sub: 1, none: 2 };
      const aRank = rank[a.crownType as "main" | "sub"] ?? 2;
      const bRank = rank[b.crownType as "main" | "sub"] ?? 2;
      return aRank - bRank;
    });
  return (
    <Layout>
      <Flex mb={4} fontSize="18px" lineHeight="28px">
        <Box mr={2} fontWeight="bold">
          {!isPlanned ? "참여중인 인원" : "참여 대기 인원"}
        </Box>
        <Box as="span" color="mint">
          {!isPlanned ? data?.participants.length : waitingCnt + 7}
        </Box>
        <Box as="span" mx={1} color="gray.600">
          /
        </Box>
        <Box as="span">
          {data?.memberCnt.max ? (
            <span>{data?.memberCnt.max}</span>
          ) : (
            <>
              <span style={{ marginLeft: "4px" }} />
              <i className="fa-solid fa-infinity" style={{ color: "var(--gray-400)" }} />
            </>
          )}
        </Box>
      </Flex>
      <ProfileCardColumn hasCommentButton={false} userCardArr={userCardArr} />
    </Layout>
  );
}

const ParticipateTime = styled.div<{ isFirst: boolean }>`
  font-size: 11px;
  font-weight: medium;
  line-height: 12px;
  margin-left: auto;
  color: var(--color-mint);
`;

const Layout = styled.div`
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  background-color: white;

  padding-bottom: var(--gap-4);
`;

export default GroupParticipation;
