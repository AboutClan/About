import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";

import { AVATAR_BG_IMAGES } from "../../assets/images/avatarBgImages";
import { AVATAR_IMAGES } from "../../assets/images/avatarImages";
import { COLOR_TABLE_LIGHT } from "../../constants/colorConstants";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { AvatarProps } from "../../types/models/userTypes/userInfoTypes";

// type Size = "2xs" | "xs" | "sm" | "smd" | "mds" | "md" | "lg" | "xl" | "slg" | "xxl";
type Size = "xxs1" | "xs1" | "sm1" | "md1" | "lg1" | "xl1" | "xxl1";

//xxs: 16
//xs:32
//sm : 40
//md: 48
//lg:60
//xl:80
//xxl:120

const SIZE_MAPPING: Record<Size, number> = {
  xxs1: 16,
  xs1: 32,
  sm1: 40,
  md1: 48,
  lg1: 60,
  xl1: 72,
  xxl1: 120,
};
interface IAvatar {
  size: Size;
  sizeLength?: number;
  isPriority?: boolean;
  shadowAvatar?: number;
  isLink?: boolean;
  user: {
    avatar: AvatarProps;
    _id?: string;
    profileImage?: string;
  };
  isSquare?: boolean;
}

function AvatarComponent({
  size,
  isPriority,
  shadowAvatar,
  isLink = true,
  user = ABOUT_USER_SUMMARY,
  isSquare,
}: IAvatar) {
  const { avatar, _id: userId, profileImage } = user || {};

  const image =
    typeof profileImage === "string"
      ? profileImage.startsWith("http://")
        ? profileImage.replace("http://", "https://")
        : profileImage
      : undefined;

  const hasAvatar = avatar !== undefined && avatar?.type !== null && avatar?.bg !== null;

  const [imageUrl, setImageUrl] = useState(!hasAvatar ? image : AVATAR_IMAGES[avatar.type].image);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(!hasAvatar ? image : AVATAR_IMAGES[avatar.type].image);
    if (avatar?.bg >= 100) {
      setBgImage(`url(${AVATAR_BG_IMAGES[avatar?.bg - 100].image})`);
    } else {
      setBgImage(null);
    }
  }, [image, avatar]);

  const onError = () => {
    setImageUrl(AVATAR_IMAGES[0].image);
  };

  function AvatarComponent() {
    return (
      <AvatarContainer
        size={SIZE_MAPPING[size]}
        isSquare={isSquare}
        isShadowAvatar={!!shadowAvatar}
      >
        <ImageContainer
          bg={
            (!shadowAvatar && bgImage) ||
            (shadowAvatar
              ? "var(--gray-200)"
              : avatar?.bg === -1
              ? "mint"
              : hasAvatar && avatar.bg !== null && COLOR_TABLE_LIGHT[avatar.bg])
          }
          hasType={hasAvatar && avatar.type < 100}
          color="var(--gray-500)"
          isBgImage={!!bgImage}
          isSquare={isSquare}
        >
          <Box w="100%" h="100%" pos="relative">
            {!shadowAvatar ? (
              <Image
                src={imageUrl}
                fill={true}
                sizes="200px"
                priority={isPriority}
                alt="avatar"
                onError={onError}
                style={{ objectPosition: "center", objectFit: "cover" }}
              />
            ) : (
              <Flex
                fontSize="6px"
                color="var(--gray-500)"
                fontWeight={600}
                justify="center"
                alignItems="center"
                h="100%"
                lineHeight="normal"
              >
                <Box h={2} textAlign="center">
                  +{shadowAvatar}
                </Box>
              </Flex>
            )}
          </Box>
        </ImageContainer>
      </AvatarContainer>
    );
  }

  return (
    <>
      {!isLink || !userId ? (
        <Box>
          <AvatarComponent />
        </Box>
      ) : (
        <Link href={`/profile/${userId}`} style={{ outline: "none" }}>
          <AvatarComponent />
        </Link>
      )}
    </>
  );
}

const Avatar = memo(AvatarComponent);

export default Avatar;

const AvatarContainer = styled.div<{
  size: number;
  isSquare: boolean;
  isShadowAvatar: boolean;
}>`
  overflow: hidden;
  position: relative;
  border-radius: ${(props) => (props.isSquare ? "12px" : "50%")};
  background-color: white;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  padding: ${(props) => (props.isShadowAvatar ? 0 : "1px")};
`;

const ImageContainer = styled.div<{
  bg: string | null;
  hasType: boolean;
  isBgImage: boolean;
  isSquare: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${(props) => (props.isSquare ? "12px" : "50%")};
  overflow: hidden;

  background: ${(props) => (props.isBgImage ? `center/cover no-repeat ${props.bg}` : props.bg)};
`;
