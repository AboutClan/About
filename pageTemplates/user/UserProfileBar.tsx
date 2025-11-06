import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { CameraIcon, ProfileCamera } from "./UserProfileSection";

interface UserProfileBarProps {
  user: IUser;
}

function UserProfileBar({ user }: UserProfileBarProps) {
  const router = useRouter();
  const typeToast = useTypeToast();
  const isGuest = user?.role === "guest";
  const [isDrawer, setIsDrawer] = useState(false);
  return (
    <>
      <Flex px={5} py={3} align="center">
        <Box position="relative">
          <Avatar size="lg1" user={user} />
          <IconWrapper
            onClick={() => {
              if (isGuest) {
                typeToast("guest");
                return;
              }
              setIsDrawer(true);
            }}
          >
            <CameraIcon size="md" />
          </IconWrapper>
        </Box>
        <Flex direction="column" flex={0.95} justify="center" ml={3} my={1}>
          <Flex align="center" mb={1}>
            <Box lineHeight="20px" mr={1} fontWeight="semibold" fontSize="13px">
              {user?.name || "익명"}
            </Box>
            <UserBadge badgeIdx={user?.badge?.badgeIdx} />
          </Flex>
          <Flex lineHeight="18px" alignItems="center" color="gray.500" fontSize="12px">
            <CommentText>{user?.comment}</CommentText>
          </Flex>
        </Flex>
        <Box ml="auto">
          <Button
            onClick={() => {
              if (isGuest) {
                typeToast("guest");
                return;
              }
              router.push("/user/profile");
            }}
            size="sm"
            h="20px"
            bg="gray.100"
            color="gray.500"
            borderRadius="12px"
          >
            프로필 수정
          </Button>
        </Box>
      </Flex>
      {isDrawer && <ProfileCamera setIsModal={setIsDrawer} />}
    </>
  );
}

export default UserProfileBar;

const CommentText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--gray-500);
  font-size: 12px;
  line-height: 18px;
`;

const IconWrapper = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -3px;
  bottom: -3px;
  background-color: white;
  opacity: 0.96;
  border: 1px solid var(--gray-200);
  border-radius: 50%;
`;
