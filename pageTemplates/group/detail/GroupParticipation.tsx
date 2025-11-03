import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { IGroup } from "../../../types/models/groupTypes/group";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface IGroupParticipation {
  data: IGroup;
  text: string;
  isPlanned: boolean;
  isTemp?: boolean;
}

function GroupParticipation({ data, text, isPlanned, isTemp }: IGroupParticipation) {
  const isSecret = data?.isSecret;

  const [isOpen, setIsOpen] = useState(false);

  const userCardArr: IProfileCommentCard[] = data.participants
    .filter((par) => par.user.uid !== "3224546232")
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
      <Flex mb={2} fontSize="18px" lineHeight="28px" alignItems="flex-end">
        <Box mr={2} fontWeight="bold">
          {text} {!isPlanned ? userCardArr?.length : "(오픈 대기중)"}
        </Box>
        {isTemp && (
          <Box ml="auto" mt="auto" fontSize="11px" color="mint" lineHeight={1}>
            ※ 활동 유효 기간: {dayjsToFormat(dayjs().endOf("month"), "M월 D일")}
          </Box>
        )}
      </Flex>
      <ProfileCardColumn
        hasCommentButton={false}
        userCardArr={!isOpen ? userCardArr?.slice(0, 5) : userCardArr}
      />
      {!isOpen && (
        <Button
          mt={2}
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          onClick={() => setIsOpen(true)}
        >
          더보기
        </Button>
      )}
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

  padding-bottom: 20px;
  margin-bottom: 20px;
`;

export function InfinityIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="var(--gray-600)"
    >
      <path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" />
    </svg>
  );
}

export default GroupParticipation;
