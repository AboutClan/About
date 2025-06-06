import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import SocialingScoreBadge from "../../components/molecules/SocialingScoreBadge";
import { useToast } from "../../hooks/custom/CustomToast";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import ProfileOverviewSkeleton from "./skeleton/ProfileOverviewSkeleton";

interface IProfileOverview {
  user?: IUser;
  groupCnt: number;
}

function ProfileOverview({ user, groupCnt }: IProfileOverview) {
  const toast = useToast();
  const { data: session } = useSession();
  const [isIntroduce, setIsIntroduce] = useState(false);
  const isFriend = user?.friend.includes(session?.user.uid);
  console.log(user?.temperature);
  return (
    <Flex flexDir="column" my={4}>
      {user ? (
        <>
          <Flex flexDir="column">
            <Flex align="center">
              <Avatar user={user} size="lg1" />
              <Flex ml={3} direction="column">
                <Flex mb={0.5} align="center">
                  <Box mr={1} fontSize="16px" fontWeight="bold">
                    {user?.name || session?.user.name}
                  </Box>
                  <Box mb={0.5}>
                    <UserBadge badgeIdx={user?.badge?.badgeIdx} />
                  </Box>
                </Flex>
                <Box fontSize="10px" color="gray.500">
                  {dayjsToFormat(dayjs(user?.registerDate), "YYYY년 M월 d일 가입") || "게스트"}
                </Box>
              </Flex>
              <Box ml="auto" mt={2}>
                <SocialingScoreBadge user={user} size="md" />
              </Box>
            </Flex>
            {session?.user.id !== user?._id && (
              <Button
                borderRadius="full"
                leftIcon={<ChatIcon />}
                border="var(--border)"
                mt={3}
                w="max-content"
                size="sm"
                onClick={() => {
                  if (!user?.introduceText) {
                    toast("info", "상대가 자기소개를 입력하지 않았어요!");
                    return;
                  }
                  setIsIntroduce((old) => !old);
                }}
              >
                {isIntroduce ? "자기소개 닫기" : "자기소개 보기"}
              </Button>
            )}
            {isIntroduce && (
              <Box
                mt={3}
                bg="gray.100"
                border="gray.100"
                borderRadius="8px"
                fontWeight={500}
                flex={1}
                fontSize="12px"
                px={4}
                py={3}
              >
                {user?.introduceText}
              </Box>
            )}
            <Box fontSize="13px" mt={4}>
              {user?.comment}
            </Box>
          </Flex>
          <Flex justify="space-between" align="center" mt={5}>
            <Flex>
              <RelationItem>
                <span>친구</span>
                <span>{user?.friend?.length}</span>
              </RelationItem>
              <RelationItem>
                <span>좋아요</span>
                <span>{user?.like || 0}</span>
              </RelationItem>
              <RelationItem>
                <span>소모임</span>
                <span>{groupCnt || 0}</span>
              </RelationItem>
            </Flex>
            <Flex
              align="center"
              onClick={(e) => {
                if (!isFriend) {
                  toast("info", "친구로 등록된 인원만 확인할 수 있어요!");
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }
                if (!user?.instagram) {
                  toast("info", "상대방이 인스타그램을 등록하지 않았어요!");
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }
              }}
            >
              {true && (
                <>
                  <Link href={`https://www.instagram.com/${user.instagram}`}>
                    <Flex
                      justify="center"
                      align="center"
                      p={1.5}
                      bgColor="var(--gray-100)"
                      border="var(--border-main)"
                      borderRadius="50%"
                    >
                      <InstagramIcon />
                    </Flex>
                  </Link>
                </>
              )}
            </Flex>
          </Flex>
        </>
      ) : (
        <ProfileOverviewSkeleton />
      )}
    </Flex>
  );
}

const RelationItem = styled.div`
  width: max-content;
  margin-right: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;

  > span:first-child {
    font-size: 10px;
    color: var(--gray-600);
    font-weight: light;
    margin-bottom: 8px;
  }
  > span:last-child {
    font-size: 10px;
    font-weight: 600;
  }
`;

export default ProfileOverview;

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--gray-600)"
    >
      <path d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm40-160h240q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480H280q-17 0-28.5 11.5T240-440q0 17 11.5 28.5T280-400Zm0-120h400q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600H280q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm0-120h400q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720H280q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="var(--gray-800)"
      width="16px"
      height="16px"
      viewBox="0 0 448 512"
    >
      <path
        fill="var(--gray-800)"
        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
      />
    </svg>
  );
}
