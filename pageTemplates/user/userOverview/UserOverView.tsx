import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import RequestChangeProfileImageModal from "../../../modals/userRequest/RequestChangeProfileImageModal/RequestChangeProfileImageModal";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import UserOverviewComment from "./UserOverviewComment";

interface UserOverviewProps {
  userInfo: IUser;
}

export default function UserOverview({ userInfo }: UserOverviewProps) {
  const typeToast = useTypeToast();
  const router = useRouter();
  const isGuest = userInfo?.role === "guest";

  const [isProfileModal, setIsProfileModal] = useState(false);

  const onClickProfileChange = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    router.push("/register/name?edit=on");
  };

  return (
    <>
      <Box
        my={5}
        bgColor="white"
        p="16px"
        pt="12px"
        rounded="var(--rounded-lg)"
        border="var(--border-main)"
      >
        <UserInfoContainer>
          <UserInfo>
            <UserProfile>
              <UserName>{userInfo?.name}</UserName>
              <UserBadge uid={userInfo?.uid} score={userInfo?.score} />
            </UserProfile>
            <UserOverviewComment />
          </UserInfo>
          <UserImg>
            <Avatar
              avatar={userInfo?.avatar}
              image={userInfo.profileImage}
              uid={userInfo.uid}
              userId={userInfo._id}
              size="xl"
              isLink={false}
            />
            <IconWrapper
              onClick={() => {
                if (isGuest) {
                  typeToast("guest");
                  return;
                }
                setIsProfileModal(true);
              }}
            >
              <CameraIcon />
            </IconWrapper>
          </UserImg>
        </UserInfoContainer>
        <Link
          href={{
            href: "/register/name",
            query: { edit: "on" },
          }}
        >
          <Button w="100%" fontSize="16px" onClick={onClickProfileChange}>
            프로필 수정
          </Button>
        </Link>
      </Box>
      {isProfileModal && <RequestChangeProfileImageModal setIsModal={setIsProfileModal} />}
    </>
  );
}

const UserInfoContainer = styled.div`
  margin-bottom: var(--gap-4);

  display: flex;
  align-items: center;
`;

const UserImg = styled.div`
  position: relative;
`;

const UserInfo = styled.div`
  margin-right: var(--gap-3);
  display: flex;
  flex-direction: column;
  flex: 1;
  > div:first-child {
    display: flex;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: var(--gap-3) 0;
`;

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: white;
  border: 1px solid var(--gray-400);
  border-radius: 50%;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin-right: var(--gap-3);
`;

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
