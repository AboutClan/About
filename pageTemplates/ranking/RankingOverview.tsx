import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import Skeleton from "../../components/atoms/skeleton/Skeleton";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IMyRank } from "../../types/models/ranking";

interface IRankingOverview {
  myRankInfo: IMyRank;
}

function RankingOverview({ myRankInfo }: IRankingOverview) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo } = useUserInfoQuery();

  return (
    <>
      <Layout>
        <Flex flex={1} justify="center">
          <Box mr="4px" fontSize="16px" alignSelf="flex-end">
            랭킹:
          </Box>
          <Box w="48px" fontSize="18px" fontWeight={800}>
            <Skeleton isLoaded={!!myRankInfo}>
              {!myRankInfo?.value ? "NEW" : `${myRankInfo?.rankNum} 위`}
            </Skeleton>
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
        <Flex flex={1} fontSize="18px" justify="center">
          <Box ml="4px" mr="12px" fontSize="16px" alignSelf="flex-end">
            메달:
          </Box>
          <Box w="48px" fontWeight={800}>
            <Skeleton isLoaded={!!myRankInfo}>
              <Flex>
                <Box>
                  <i className="fa-solid fa-medal fa-xl" style={{ color: "var(--color-gray)" }} />
                </Box>
              </Flex>
            </Skeleton>
          </Box>
        </Flex>
      </Layout>
    </>
  );
}
const Layout = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  padding-top: 16px;

  min-height: 121px;
`;

const ProfileContainer = styled.div<{ isGuest: boolean }>`
  text-align: center;

  flex: 0.65;
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

export default RankingOverview;
