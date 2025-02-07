import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";

import ProgressMark from "../../components/molecules/ProgressMark";
import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import RequestChagneProfileImageModalBadge from "../../modals/userRequest/RequestChangeProfileImageModal/RequestChagneProfileImageModalBadge";
import RequestChangeProfileImageModalAvatar from "../../modals/userRequest/RequestChangeProfileImageModal/RequestChangeProfileImageModalAvatar";
import SpecialAvatarModal from "../../modals/userRequest/RequestChangeProfileImageModal/SpecialAvatarModal";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import UserCollection from "./userCollection";
import UserPointBlock from "./UserPointBlock";
import UserProfile from "./userProfile";

interface UserProfileSectionProps {
  user: IUser;
}

function UserProfileSection({ user }: UserProfileSectionProps) {
  const router = useRouter();
  const [isDrawer, setIsDrawer] = useState(false);

  const [modalType, setModalType] = useState<"avatar" | "badge" | "specialAvatar">();

  return (
    <>
      <Box borderBottom="var(--border)" px={5} pb={3}>
        <Box>
          <Flex py={3} align="center">
            <Box position="relative">
              <Avatar
                userId={user._id}
                image={user.profileImage}
                size="slg"
                avatar={user.avatar}
                uid={user.uid}
              />
              <IconWrapper
                onClick={() => {
                  //   if (isGuest) {
                  //     // typeToast("guest");
                  //     return;
                  //   }
                  setIsDrawer(true);
                  // setIsProfileModal(true);
                }}
              >
                <CameraIcon />
              </IconWrapper>
            </Box>
            <Flex direction="column" flex={0.95} justify="center" ml={3} my={1}>
              <Flex align="center" mb={1}>
                <Box lineHeight="20px" mr={1} fontWeight="semibold" fontSize="13px">
                  {user?.name || "익명"}
                </Box>
                <UserBadge score={user?.score || 0} uid={user?.uid} />
              </Flex>
              <Flex lineHeight="18px" alignItems="center" color="gray.500" fontSize="12px">
                <CommentText>{user?.comment}</CommentText>
              </Flex>
            </Flex>
            <Box ml="auto">
              <Button
                onClick={() => router.push("/user/profile")}
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
        </Box>
        <Box border="var(--border)" px={3} py={2} borderRadius="8px">
          <ProgressMark value={25} />
          <Flex
            justify="center"
            align="center"
            mt={2}
            color="var(--color-gray)"
            fontSize="10px"
            fontWeight="semibold"
            h="28px"
          >
            이번 달 점수가 부족합니다{" "}
          </Flex>
        </Box>
      </Box>
      <UserPointBlock />{" "}
      <Box>
        <Box mb={4} mx={5} fontWeight="bold" fontSize="16px" lineHeight="24px">
          활동
        </Box>
        <UserProfile />
        <UserCollection />
      </Box>
      {isDrawer && (
        <BottomDrawerLg height={284 + iPhoneNotchSize()} setIsModal={setIsDrawer}>
          <Flex w="full" direction="column" fontSize="14px" color="gray.600">
            <Button
              lineHeight="20px"
              mx={10}
              variant="unstyled"
              borderBottom="var(--border)"
              fontWeight="regular"
              py={3}
              onClick={() => setModalType("badge")}
            >
              배지 변경
            </Button>
            <Button
              lineHeight="20px"
              mx={10}
              variant="unstyled"
              borderBottom="var(--border)"
              fontWeight="regular"
              py={3}
              onClick={() => setModalType("avatar")}
            >
              기본 아바타 / 배경 선택
            </Button>
            <Button
              lineHeight="20px"
              mx={10}
              variant="unstyled"
              borderBottom="var(--border)"
              fontWeight="regular"
              py={3}
              onClick={() => setModalType("specialAvatar")}
            >
              스페셜 아바타 / 배경 선택
            </Button>

            <Button
              lineHeight="20px"
              mx={10}
              variant="unstyled"
              borderBottom="var(--border)"
              fontWeight="regular"
              py={3}
            >
              카카오 프로필 변경 / 업데이트
            </Button>
            <Box h="64px" w="full" py={2}>
              <Button w="full" colorScheme="mint" size="lg">
                닫 기
              </Button>
            </Box>
          </Flex>
        </BottomDrawerLg>
      )}
      {modalType === "badge" && (
        <RequestChagneProfileImageModalBadge setIsModal={() => setModalType(null)} />
      )}
      {modalType === "avatar" && (
        <RequestChangeProfileImageModalAvatar setIsModal={() => setModalType(null)} />
      )}
      {modalType === "specialAvatar" && (
        <SpecialAvatarModal setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

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
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: white;
  opacity: 0.96;
  border: 1px solid var(--gray-100);
  border-radius: 50%;
`;

export default UserProfileSection;

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.00011 9.13309C5.30469 9.13229 4.63798 8.85569 4.14624 8.36395C3.65451 7.87221 3.3779 7.20551 3.37711 6.51009C3.37777 5.81458 3.65431 5.14774 4.14606 4.6559C4.63781 4.16405 5.3046 3.88738 6.00011 3.88659C6.69561 3.88738 7.3624 4.16405 7.85415 4.6559C8.3459 5.14774 8.62244 5.81458 8.62311 6.51009C8.62231 7.20551 8.34571 7.87221 7.85397 8.36395C7.36223 8.85569 6.69552 9.13229 6.00011 9.13309ZM10.0566 2.56759H8.57961L8.02311 1.48309C7.93486 1.3114 7.801 1.16737 7.63622 1.06681C7.47145 0.96625 7.28214 0.913061 7.08911 0.913086H4.88261C4.68577 0.913063 4.4929 0.968366 4.32598 1.07269C4.15907 1.17701 4.02484 1.32615 3.93861 1.50309L3.42061 2.56759H1.94361C1.7781 2.56752 1.6142 2.60006 1.46127 2.66335C1.30834 2.72665 1.16938 2.81945 1.05233 2.93645C0.935273 3.05346 0.842417 3.19239 0.779065 3.34529C0.715713 3.49819 0.683105 3.66208 0.683105 3.82759V9.62809C0.683105 9.79359 0.715713 9.95748 0.779065 10.1104C0.842417 10.2633 0.935273 10.4022 1.05233 10.5192C1.16938 10.6362 1.30834 10.729 1.46127 10.7923C1.6142 10.8556 1.7781 10.8882 1.94361 10.8881H10.0566C10.2221 10.8882 10.386 10.8556 10.5389 10.7923C10.6919 10.729 10.8308 10.6362 10.9479 10.5192C11.0649 10.4022 11.1578 10.2633 11.2211 10.1104C11.2845 9.95748 11.3171 9.79359 11.3171 9.62809V3.82759C11.3171 3.66208 11.2845 3.49819 11.2211 3.34529C11.1578 3.19239 11.0649 3.05346 10.9479 2.93645C10.8308 2.81945 10.6919 2.72665 10.5389 2.66335C10.386 2.60006 10.2221 2.56752 10.0566 2.56759Z"
        fill="#282828"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.00001 4.83203C5.55518 4.83256 5.12874 5.00954 4.81425 5.32412C4.49975 5.63871 4.32291 6.06521 4.32251 6.51003C4.32277 6.9549 4.49958 7.38147 4.8141 7.69609C5.12862 8.0107 5.55514 8.18763 6.00001 8.18803C6.44487 8.18763 6.8714 8.0107 7.18592 7.69609C7.50044 7.38147 7.67724 6.9549 7.67751 6.51003C7.67711 6.06521 7.50026 5.63871 7.18577 5.32412C6.87128 5.00954 6.44483 4.83256 6.00001 4.83203Z"
        fill="#282828"
      />
    </svg>
  );
}
