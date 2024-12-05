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
        my={4}
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
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
      <ellipse cx="7" cy="7" rx="2.5" ry="3" fill="#00C2B3" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.2204 2.79742L3.83899 2.52844L4.5 1.66779L4.91284 0.685303H9.47632L10.2917 2.40778L13.1793 2.79742L14.1139 3.81976L14.0297 10.3777L13.1793 11.7411L11.3995 11.8903L1.94672 11.7411L0.467407 10.8599L0.668701 3.37689L1.2204 2.91382V2.79742Z"
        fill="#00C2B3"
        fillOpacity="0.1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4293 12.3285H2.06813C0.926035 12.3285 -0.00256165 11.432 1.06404e-05 10.3268V4.11779C1.06404e-05 3.01508 0.928607 2.1185 2.0707 2.1185H3.75555C3.81986 2.1185 3.87388 2.07628 3.88931 2.01419L4.09252 1.17722C4.25972 0.4843 4.8925 0 5.63075 0H8.86926C9.60751 0 10.2377 0.4843 10.4075 1.17722L10.6107 2.01667C10.6236 2.07876 10.6802 2.12098 10.7445 2.12098H12.4293C13.5714 2.12098 14.5 3.01756 14.5 4.12027V10.3292C14.5 11.432 13.5714 12.3285 12.4293 12.3285ZM2.06813 3.11442C1.49451 3.11442 1.02635 3.56643 1.02635 4.12027V10.3292C1.02635 10.8831 1.49451 11.3351 2.06813 11.3351H12.4293C13.0029 11.3351 13.4711 10.8831 13.4711 10.3292V4.12027C13.4711 3.56643 13.0029 3.11442 12.4293 3.11442H10.7445C10.1991 3.11442 9.73098 2.75678 9.60751 2.24516L9.4043 1.40571C9.34513 1.1648 9.12392 0.995919 8.86669 0.995919H5.63075C5.37352 0.995919 5.1523 1.1648 5.09314 1.40571L4.88993 2.24516C4.76389 2.75678 4.2983 3.11442 3.75298 3.11442H2.06813Z"
        fill="#343943"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5052 6.96399C10.5052 8.69753 9.04416 10.1082 7.2487 10.1082C5.45325 10.1082 3.99219 8.69753 3.99219 6.96399C3.99219 5.23044 5.45325 3.81976 7.2487 3.81976C9.04416 3.81976 10.5052 5.23044 10.5052 6.96399ZM9.47631 6.96399C9.47631 5.77683 8.47569 4.8132 7.2487 4.8132C6.01915 4.8132 5.0211 5.77683 5.0211 6.96399C5.0211 8.15114 6.01915 9.11477 7.2487 9.11477C8.47826 9.11477 9.47631 8.15114 9.47631 6.96399Z"
        fill="#343943"
      />
    </svg>
  );
}
