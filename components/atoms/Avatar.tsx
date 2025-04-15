import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { AVATAR_BG_IMAGES } from "../../assets/images/avatarBgImages";
import { AVATAR_IMAGES } from "../../assets/images/avatarImages";
import { COLOR_TABLE_LIGHT } from "../../constants/colorConstants";
import { SPECIAL_AVATAR } from "../../storage/avatarStorage";
import { IAvatar as IAvatarProp } from "../../types/models/userTypes/userInfoTypes";

type Size = "2xs" | "xs" | "sm" | "smd" | "mds" | "md" | "lg" | "xl" | "slg" | "xxl";

interface IAvatar {
  image?: string;
  size: "2xs" | "md" | Size;
  sizeLength?: number;
  avatar?: IAvatarProp;
  uid?: string;
  userId?: string;
  isPriority?: boolean;
  shadowAvatar?: number;
  isLink?: boolean;
}

function AvatarComponent({
  image,
  size,
  sizeLength,
  avatar,
  uid,
  isPriority,
  userId,
  shadowAvatar,
  isLink = true,
}: IAvatar) {
  const hasAvatar = avatar !== undefined && avatar?.type !== null && avatar?.bg !== null;

  const [imageUrl, setImageUrl] = useState(
    !hasAvatar
      ? image
      : avatar.type >= 100
      ? SPECIAL_AVATAR[avatar.type - 100].image
      : AVATAR_IMAGES[avatar.type].image,
  );
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(
      !hasAvatar
        ? image
        : avatar.type >= 100
        ? SPECIAL_AVATAR[avatar.type - 100].image
        : AVATAR_IMAGES[avatar.type].image,
    );
    if (avatar?.bg >= 100) {
      setBgImage(`url(${AVATAR_BG_IMAGES[avatar?.bg - 100].image})`);
    } else {
      setBgImage(null);
    }
  }, [image, avatar, uid]);

  const onError = () => {
    setImageUrl(AVATAR_IMAGES[0].image);
  };

  function AvatarComponent() {
    return (
      <AvatarContainer size={size} sizeLength={sizeLength}>
        <ImageContainer
          bg={
            (!shadowAvatar && bgImage) ||
            (shadowAvatar
              ? "var(--gray-200)"
              : hasAvatar && avatar.bg !== null && COLOR_TABLE_LIGHT[avatar.bg])
          }
          hasType={hasAvatar && avatar.type < 100}
          size={size}
          color="var(--gray-500)"
          isBgImage={!!bgImage}
        >
          <Box w="100%" h="100%" pos="relative">
            {!shadowAvatar ? (
              <Image
                src={imageUrl}
                fill={true}
                sizes={
                  `${sizeLength}px` ||
                  (size === "2xs"
                    ? "16px"
                    : size === "xs"
                    ? "24px"
                    : size === "sm"
                    ? "28px"
                    : size === "smd"
                    ? "32px"
                    : size === "mds"
                    ? "40px"
                    : size === "md"
                    ? "48px"
                    : size === "lg"
                    ? "64px"
                    : size === "slg"
                    ? "60px"
                    : size === "xl"
                    ? "80px"
                    : size === "xxl"
                    ? "120px"
                    : "")
                }
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
  size: Size;
  sizeLength?: number; // make sizeLength optional
}>`
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  background-color: white;

  ${(props) => {
    const sizeStyles = (() => {
      switch (props.size) {
        case "2xs":
          return css`
            width: 16px;
            height: 16px;
            padding: 1px;
          `;
        case "xs":
          return css`
            width: 24px;
            height: 24px;
            padding: 2px;
          `;
        case "sm":
          return css`
            width: 28px; // w-7
            height: 28px; // h-7
            padding: 1.5px;
          `;
        case "smd":
          return css`
            width: 32px; // w-8
            height: 32px; // h-8
          `;
        case "mds":
          return css`
            width: 40px;
            height: 40px;
          `;
        case "md":
          return css`
            width: 48px; // w-11
            height: 48px; // h-11
          `;
        case "slg":
          return css`
            width: 60px;
            height: 60px;
          `;
        case "lg":
          return css`
            width: 64px;
            height: 64px;
          `;
        case "xl":
          return css`
            width: 80px; // w-20
            height: 80px; // h-20
          `;
        case "xxl":
          return css`
            width: 120px; // w-20
            height: 120px; // h-20
          `;
        default:
          return css``;
      }
    })();

    const sizeLengthStyles = props.sizeLength
      ? css`
          width: ${props.sizeLength}px;
          height: ${props.sizeLength}px;
        `
      : css``;

    return css`
      ${sizeStyles}
      ${sizeLengthStyles}
    `;
  }}
`;

const ImageContainer = styled.div<{
  bg: string | null;
  hasType: boolean;
  size: Size;
  isBgImage: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;

  background: ${(props) => (props.isBgImage ? `center/cover no-repeat ${props.bg}` : props.bg)};
`;
