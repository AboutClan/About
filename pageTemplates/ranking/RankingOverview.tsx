import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import Skeleton from "../../components/atoms/skeleton/Skeleton";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IMyRank } from "../../types/models/ranking";
import { UserBadge } from "../../types/models/userTypes/userInfoTypes";
import { getUserBadge } from "../../utils/convertUtils/convertDatas";

interface IRankingOverview {
  myRankInfo: IMyRank;
  isScore: boolean;
  totalCnt: number;
}

function RankingOverview({ totalCnt, myRankInfo, isScore = false }: IRankingOverview) {
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
  console.log(myRankInfo);
  return (
    <>
      <Layout>
        <Flex flex={1} direction="column" align="center">
          <Flex fontSize="18px" fontWeight={800}>
            <Box mr="4px">{isScore ? "누적" : "월간"}: </Box>
            <Box w="48px">
              <Skeleton isLoaded={!!myRankInfo}>
                {!myRankInfo?.value ? "NEW" : `${myRankInfo?.rankNum + 1}42위`}
              </Skeleton>
            </Box>
          </Flex>
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
        <Box>전체 20%</Box>
        <Box>전체 {Math.round((myRankInfo?.rankNum + 1 / totalCnt) * 100)}%</Box>
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
  color: var(--gray-800);
  font-weight: 600;

  margin-right: var(--gap-1);
`;

export default RankingOverview;
