import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
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
            {!value ? "순위권 외" : <RankingNumIcon num={rank} />}
          </Box>
          <Box fontSize="10px" mt={1} color="gray.600">
            5위 상품까지 단 10점!
          </Box>
        </Flex>
        <ProfileContainer isGuest={isGuest}>
          {userInfo ? (
            <ProfileWrapper>
              <Avatar user={userInfo} size="xl1" isPriority={true} isLink={false} />
              <Box fontSize="12px" mt={2} fontWeight="semibold">
                {userInfo?.name}
              </Box>
            </ProfileWrapper>
          ) : isGuest ? (
            <ProfileWrapper>
              <Avatar user={{ avatar: { type: 0, bg: 1 } }} size="xl1" isPriority={true} />
              <Box>게스트</Box>
            </ProfileWrapper>
          ) : null}
        </ProfileContainer>{" "}
        <Flex flex={1} h="40px" flexDir="column" align="center" fontSize="18px" justify="center">
          <Box fontWeight={800}>
            <i className="fa-solid fa-medal fa-2x" style={{ color: "var(--color-yellow)" }} />
          </Box>{" "}
          <Box fontSize="10px" mt={1} color="gray.600">
            지난 시즌 실버 3위
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
