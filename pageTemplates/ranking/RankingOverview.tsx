import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import Skeleton from "../../components/atoms/skeleton/Skeleton";
import { RankingNumIcon } from "../../components/Icons/RankingIcons";
import { useUserInfoQuery } from "../../hooks/user/queries";

interface IRankingOverview {
  rank: number;
  value: number;
}

function RankingOverview({ rank, value }: IRankingOverview) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo } = useUserInfoQuery();

  return (
    <>
      <Layout>
        <Flex flex={1} flexDir="column" justify="center" align="center">
          <Box fontSize="14px" fontWeight="bold">
            {!value ? "순위권 외" : <RankingNumIcon num={rank} size="lg" />}
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
                userId={userInfo._id}
                isPriority={true}
                isLink={false}
              />
              <Box fontSize="12px" mt={2} fontWeight="semibold">
                {userInfo?.uid === "2259633694" ? "비공개" : userInfo?.name}
              </Box>
            </ProfileWrapper>
          ) : isGuest ? (
            <ProfileWrapper>
              <Avatar image="" avatar={{ type: 0, bg: 1 }} uid="" size="lg" isPriority={true} />
              <Box>게스트</Box>
            </ProfileWrapper>
          ) : null}
        </ProfileContainer>{" "}
        <Flex flex={1} h="40px" align="center" fontSize="18px" justify="center">
          <Box fontWeight={800}>
            <Skeleton isLoaded={rank === undefined}>
              <Flex>
                <Box>
                  <i className="fa-solid fa-medal fa-2x" style={{ color: "var(--color-gray)" }} />
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
  padding: 16px 20px;

  min-height: 121px;
`;

const ProfileContainer = styled.div<{ isGuest: boolean }>`
  text-align: center;

  flex: 0.8;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default RankingOverview;
