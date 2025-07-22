import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function ProfileOverviewSkeleton() {
  return (
    <>
      <Top>
        <Flex justify="space-between" align="center">
          <Profile>
            <ProfileIcon>
              <Skeleton>temp</Skeleton>
            </ProfileIcon>
            <ProfileInfo>
              <div>
                <Box w="42px" h="24px">
                  <Skeleton>temp</Skeleton>
                </Box>
                <Badge>
                  <Skeleton>temp</Skeleton>
                </Badge>
              </div>
              <Status>
                <Skeleton>temp</Skeleton>
              </Status>
            </ProfileInfo>
          </Profile>

          <Flex flexDir="column">
            <Box w="60px" h="28px" mb={1}>
              <Skeleton>temp</Skeleton>
            </Box>
            <Box w="60px" h="12px">
              <Skeleton>temp</Skeleton>
            </Box>
          </Flex>
        </Flex>
        <Box w="100px" h="28px" mt="13px" borderRadius="full" overflow="hidden">
          <Skeleton>temp</Skeleton>
        </Box>
        <Comment>
          <Skeleton>temp</Skeleton>
        </Comment>
      </Top>
      <Bottom>
        <div>
          <RelationItem>
            <span>친구</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
          <RelationItem>
            <span>좋아요</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
          <RelationItem>
            <span>소모임</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
        </div>
      </Bottom>
    </>
  );
}

const Status = styled.span`
  margin-top: 2px;
  width: 93px;
  height: 15px;
`;

const Top = styled.div``;

const Bottom = styled.div`
  display: flex;
  margin-top: 18px;
  align-items: center;
  justify-content: space-between;

  > div:first-child {
    display: flex;
  }
`;

const RelationItem = styled.div`
  margin-right: 16px;
  text-align: center;
  margin-top: 4px;
  display: flex;
  align-items: center;
  flex-direction: column;

  > span:first-child {
    font-size: 10px;
    color: var(--gray-600);
    font-weight: light;
    margin-bottom: 8px;
  }
  > span:last-child {
    width: 16px;
    font-size: 10px;
    font-weight: 600;
  }
`;
const ProfileIcon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  overflow: hidden;
`;
const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.div`
  width: 47px;
  margin-left: 4px;
  height: 18px;
`;

const ProfileInfo = styled.div`
  margin-left: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > div:first-child {
    display: flex;
    align-items: center;
    > span:first-child {
      display: inline-block;
      width: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-right: 8px;
    }
  }
  > span:last-child {
    font-size: 12px;
    color: var(--gray-600);
  }
`;

const Comment = styled.div`
  margin-top: var(--gap-4);
  color: var(--gray-800);
  font-size: 13px;
  font-weight: 600;
  width: 100px;
  height: 18px;
`;

export default ProfileOverviewSkeleton;
