import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import { BADGE_COLOR_MAPPINGS } from "../../constants/serviceConstants/badgeConstants";
import { USER_ROLE } from "../../constants/settingValue/role";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IMyRank } from "../../types/models/ranking";
import { UserBadge } from "../../types/models/userTypes/userInfoTypes";
import { getUserBadge } from "../../utils/convertUtils/convertDatas";

interface IRankingOverview {
  myRankInfo: IMyRank;
  isScore: boolean;
}

function RankingOverview({ myRankInfo, isScore = false }: IRankingOverview) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const [userBadge, setUserBadge] = useState<UserBadge>();

  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    if (isGuest) setUserBadge("아메리카노");
    if (!userInfo) return;
    const badge = getUserBadge(userInfo.score, userInfo.uid);
    setUserBadge(badge);
  }, [isGuest, userInfo]);

  return (
    <>
      <Layout>
        <Flex flex={1} direction="column" align="center">
          <Box fontSize="20px" fontWeight={800}>
            {myRankInfo?.isRank ? (
              <Box>
                {isScore ? "누적" : "월간"}:{" "}
                {!myRankInfo?.value ? "NEW" : `${myRankInfo?.rankNum + 1}위`}
              </Box>
            ) : (
              <RankPercent>
                상위 <span>{myRankInfo?.percent}%</span>
              </RankPercent>
            )}
          </Box>
          <Box color="var(--gray-800)">
            {isScore ? "내 점수" : `${dayjs().month() + 1}월 참여`}:{" "}
            {myRankInfo.value ? `${myRankInfo.value}${isScore ? "점" : "회"}` : "기록없음"}
          </Box>
        </Flex>
        <ProfileContainer isGuest={isGuest}>
          {userInfo ? (
            <ProfileWrapper>
              <Avatar
                image={userInfo.profileImage}
                avatar={userInfo.avatar}
                uid={userInfo.uid}
                size="lg"
                isPriority={true}
              />
              <ProfileUserName>{userInfo?.name}</ProfileUserName>
            </ProfileWrapper>
          ) : isGuest ? (
            <ProfileWrapper>
              <Avatar image="" avatar={{ type: 0, bg: 1 }} uid="" size="lg" isPriority={true} />
              <ProfileUserName>게스트</ProfileUserName>
            </ProfileWrapper>
          ) : null}
        </ProfileContainer>{" "}
        <RankContainer>
          <RankBadge>
            <BadgeWrapper>
              <ScoreText>배지:</ScoreText>
              <Badge
                colorScheme={BADGE_COLOR_MAPPINGS[userBadge]}
                fontSize="14px"
                border="1px solid var(--gray-400)"
              >
                {userBadge}
              </Badge>
            </BadgeWrapper>
          </RankBadge>
          <RankBadge>
            <BadgeWrapper>
              <ScoreText>구성:</ScoreText>
              {USER_ROLE[session?.user.role]}
            </BadgeWrapper>
          </RankBadge>
        </RankContainer>
      </Layout>
    </>
  );
}
const Layout = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  padding-top: 12px;
  padding-bottom: 8px;
`;

/** RANK CONTAINER */
const RankContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 2;
`;

const RankPercent = styled.span`
  font-size: 16px;
  font-weight: 800;
  > span {
    font-size: 18px;
  }
`;

/** PROFILE CONTAINER */
const ProfileContainer = styled.div<{ isGuest: boolean }>`
  text-align: center;

  flex: 1;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileUserName = styled.span`
  display: inline-block;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const BadgeWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RankBadge = styled.div`
  margin-left: 12px;
  display: flex;

  justify-content: center;

  align-items: center;
`;

const ScoreText = styled.span`
  color: var(--gray-900);
  font-weight: 600;

  margin-right: var(--gap-1);
`;

export default RankingOverview;
