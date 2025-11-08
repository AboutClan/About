import { Box, Button, Flex } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import RequestChagneProfileImageModalBadge from "../../modals/userRequest/RequestChangeProfileImageModal/RequestChagneProfileImageModalBadge";
import RequestChangeProfileImageModalAvatar from "../../modals/userRequest/RequestChangeProfileImageModal/RequestChangeProfileImageModalAvatar";
import SpecialAvatarModal from "../../modals/userRequest/RequestChangeProfileImageModal/SpecialAvatarModal";
import { IModal } from "../../types/components/modalTypes";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import UserCollection from "./UserCollection2";
import UserInviteFriendSection from "./UserInviteFriendSection";
import UserPointBlock from "./UserPointBlock";
import UserProfile from "./UserProfile2";
import UserProfileBar from "./UserProfileBar";
import UserReviewBar from "./UserReviewBar";
import UserScoreBar from "./UserScoreBar";

interface UserProfileSectionProps {
  user: IUser;
}

function UserProfileSection({ user }: UserProfileSectionProps) {
  return (
    <>
      <Box borderBottom="var(--border)">
        <UserProfileBar user={user} />
        <UserPointBlock />
        <UserScoreBar score={user?.monthScore + 10} />
      </Box>
      <Box borderBottom="var(--border)" pb={2}>
        <UserReviewBar user={user} />
      </Box>
      <UserCollection />
      <UserProfile />
      <UserInviteFriendSection />
    </>
  );
}

interface ProfileCameraProps extends IModal {}

export function ProfileCamera({ setIsModal }: ProfileCameraProps) {
  const toast = useToast();
  const { data: session } = useSession();

  const typeToast = useTypeToast();
  const [modalType, setModalType] = useState<"dog" | "cat" | "badge" | "bg" | "special">();
  const queryClient = useQueryClient();

  const { mutate: setUserAvatar } = useUserInfoFieldMutation("avatar", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
  });

  const onClickKakao = async () => {
    if (session?.user?.role === "guest") {
      typeToast("guest");
      return;
    }

    await setUserAvatar({ type: null, bg: null });
    toast("info", "프로필 갱신을 위해 다시 로그인해 주세요!");
    await signOut({ callbackUrl: `/login` });
  };

  return (
    <>
      <BottomDrawerLg height={372 + iPhoneNotchSize()} setIsModal={setIsModal}>
        <Flex h="full" w="full" direction="column" fontSize="14px" color="gray.600">
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
            onClick={() => setModalType("dog")}
          >
            댕댕이 아바타 / 배경 선택
          </Button>
          <Button
            lineHeight="20px"
            mx={10}
            variant="unstyled"
            borderBottom="var(--border)"
            fontWeight="regular"
            py={3}
            onClick={() => setModalType("cat")}
          >
            똑냥이 아바타 / 배경 선택
          </Button>
          <Button
            lineHeight="20px"
            mx={10}
            variant="unstyled"
            borderBottom="var(--border)"
            fontWeight="regular"
            py={3}
            onClick={() => setModalType("special")}
          >
            유니크 아바타 / 배경 선택
          </Button>
          <Button
            lineHeight="20px"
            mx={10}
            variant="unstyled"
            borderBottom="var(--border)"
            fontWeight="regular"
            py={3}
            onClick={() => setModalType("bg")}
          >
            유니크 배경 선택
          </Button>

          <Button
            lineHeight="20px"
            mx={10}
            variant="unstyled"
            borderBottom="var(--border)"
            fontWeight="regular"
            py={3}
            onClick={onClickKakao}
          >
            카카오 프로필 변경 / 업데이트
          </Button>
          <Box mt="auto" w="full">
            <Button
              mt="auto"
              w="full"
              colorScheme="mint"
              size="lg"
              onClick={() => setIsModal(false)}
            >
              닫 기
            </Button>
          </Box>
        </Flex>
      </BottomDrawerLg>

      {modalType === "badge" && (
        <RequestChagneProfileImageModalBadge
          setIsModal={() => {
            setIsModal(false);
            setModalType(null);
          }}
        />
      )}
      {["dog", "cat", "special"].includes(modalType) && (
        <RequestChangeProfileImageModalAvatar
          type={modalType as "dog" | "cat" | "special"}
          setIsModal={() => {
            setIsModal(false);
            setModalType(null);
          }}
        />
      )}
      {modalType === "bg" && (
        <SpecialAvatarModal
          setIsModal={() => {
            setIsModal(false);
            setModalType(null);
          }}
        />
      )}
    </>
  );
}

export default UserProfileSection;

export function CameraIcon({ size }: { size?: "md" | "lg" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size === "md" ? "15" : "18"}
      height={size === "md" ? "15" : "18"}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.00011 9.13309C5.30469 9.13229 4.63798 8.85569 4.14624 8.36395C3.65451 7.87221 3.3779 7.20551 3.37711 6.51009C3.37777 5.81458 3.65431 5.14774 4.14606 4.6559C4.63781 4.16405 5.3046 3.88738 6.00011 3.88659C6.69561 3.88738 7.3624 4.16405 7.85415 4.6559C8.3459 5.14774 8.62244 5.81458 8.62311 6.51009C8.62231 7.20551 8.34571 7.87221 7.85397 8.36395C7.36223 8.85569 6.69552 9.13229 6.00011 9.13309ZM10.0566 2.56759H8.57961L8.02311 1.48309C7.93486 1.3114 7.801 1.16737 7.63622 1.06681C7.47145 0.96625 7.28214 0.913061 7.08911 0.913086H4.88261C4.68577 0.913063 4.4929 0.968366 4.32598 1.07269C4.15907 1.17701 4.02484 1.32615 3.93861 1.50309L3.42061 2.56759H1.94361C1.7781 2.56752 1.6142 2.60006 1.46127 2.66335C1.30834 2.72665 1.16938 2.81945 1.05233 2.93645C0.935273 3.05346 0.842417 3.19239 0.779065 3.34529C0.715713 3.49819 0.683105 3.66208 0.683105 3.82759V9.62809C0.683105 9.79359 0.715713 9.95748 0.779065 10.1104C0.842417 10.2633 0.935273 10.4022 1.05233 10.5192C1.16938 10.6362 1.30834 10.729 1.46127 10.7923C1.6142 10.8556 1.7781 10.8882 1.94361 10.8881H10.0566C10.2221 10.8882 10.386 10.8556 10.5389 10.7923C10.6919 10.729 10.8308 10.6362 10.9479 10.5192C11.0649 10.4022 11.1578 10.2633 11.2211 10.1104C11.2845 9.95748 11.3171 9.79359 11.3171 9.62809V3.82759C11.3171 3.66208 11.2845 3.49819 11.2211 3.34529C11.1578 3.19239 11.0649 3.05346 10.9479 2.93645C10.8308 2.81945 10.6919 2.72665 10.5389 2.66335C10.386 2.60006 10.2221 2.56752 10.0566 2.56759Z"
        fill="#282828"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.00001 4.83203C5.55518 4.83256 5.12874 5.00954 4.81425 5.32412C4.49975 5.63871 4.32291 6.06521 4.32251 6.51003C4.32277 6.9549 4.49958 7.38147 4.8141 7.69609C5.12862 8.0107 5.55514 8.18763 6.00001 8.18803C6.44487 8.18763 6.8714 8.0107 7.18592 7.69609C7.50044 7.38147 7.67724 6.9549 7.67751 6.51003C7.67711 6.06521 7.50026 5.63871 7.18577 5.32412C6.87128 5.00954 6.44483 4.83256 6.00001 4.83203Z"
        fill="#282828"
      />
    </svg>
  );
}
