import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ICON_SIZE } from "../../../../constants/styles";

import {
  ABOUT_ICON,
  AVATAR_COLOR,
  AVATAR_ICON,
} from "../../../../constants/settingValue/avatar";
import { prevPageUrlState } from "../../../../recoil/previousAtoms";
import { transferUserDataState } from "../../../../recoil/transferDataAtoms";
import { Size } from "../../../../types/system";
import { IUser, IUserRegisterForm } from "../../../../types/user/user";

interface IProfileIcon {
  user: IUser | IUserRegisterForm | "guest" | "ABOUT";
  size: Size;
  isMember?: boolean;
  isImagePriority?: boolean;
}

function ProfileIcon({ user, size, isMember, isImagePriority }: IProfileIcon) {
  const router = useRouter();

  const setUserData = useSetRecoilState(transferUserDataState);
  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const avatarType = user !== "guest" ? (user as IUser)?.avatar?.type : 0;
  const avatarBg = (user as IUser)?.avatar?.bg;
  const isAvatar = Boolean(
    (avatarType !== null &&
      avatarType !== undefined &&
      avatarBg !== undefined &&
      avatarBg !== null &&
      avatarType >= 0 &&
      avatarBg >= 0) ||
      user === "guest"
  );

  const iconSize = ICON_SIZE[size];

  const [isError, setIsError] = useState(false);

  const imageUrl =
    user === "ABOUT"
      ? ABOUT_ICON
      : isAvatar
      ? `${AVATAR_ICON[avatarType]}`
      : `${(user as IUser)?.profileImage}`;

  const onClick = () => {
    if (!isMember) return;
    const url = router.pathname;
    setUserData(user as IUser);
    setPrevPageUrl(url);

    router.push(`/profile/${(user as IUser).uid}`);
  };

  const setAvatarBg =
    user === ("guest" || isError)
      ? AVATAR_COLOR[5]
      : user !== "ABOUT" && isAvatar && AVATAR_COLOR[avatarBg];

  return (
    <>
      {user && imageUrl && (
        <Layout avatarBg={setAvatarBg} size={iconSize} onClick={onClick}>
          <Image
            src={isError ? AVATAR_ICON[1] : imageUrl}
            width={isError || isAvatar ? 0.8 * iconSize : iconSize}
            height={isError || isAvatar ? 0.8 * iconSize : iconSize}
            alt="ProfileIcon"
            onError={() => setIsError(true)}
            priority={isImagePriority}
          />
        </Layout>
      )}
    </>
  );
}

const Layout = styled.button<{ avatarBg: string; size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.avatarBg || "white"};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export default ProfileIcon;
