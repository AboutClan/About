import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { COLOR_TABLE_LIGHT } from "../../constants/colorConstants";
import { AVATAR_IMAGE_ARR, SPECIAL_AVATAR, SPECIAL_BG } from "../../storage/avatarStorage";
import { IAvatar as IAvatarProp } from "../../types/models/userTypes/userInfoTypes";

type Size = "2xs" | "xs" | "sm" | "smd" | "md" | "lg" | "xl";

interface IAvatar {
  image?: string;
  size: "2xs" | "md" | Size;
  sizeLength?: number;
  avatar?: IAvatarProp;
  uid?: string;
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
  shadowAvatar,
  isLink = true,
}: IAvatar) {
  const hasAvatar = avatar !== undefined && avatar?.type !== null && avatar?.bg !== null;

  const [imageUrl, setImageUrl] = useState(
    !hasAvatar
      ? image
      : avatar.type >= 100
        ? SPECIAL_AVATAR[avatar.type - 100].image
        : AVATAR_IMAGE_ARR[avatar.type],
  );
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(
      !hasAvatar
        ? image
        : avatar.type >= 100
          ? SPECIAL_AVATAR[avatar.type - 100].image
          : AVATAR_IMAGE_ARR[avatar.type],
    );
    if (avatar?.bg >= 100) {
      setBgImage(`url(${SPECIAL_BG[avatar?.bg - 100].image})`);
    } else {
      setBgImage(null);
    }
  }, [image, avatar, uid]);

  const onError = () => {
    setImageUrl(AVATAR_IMAGE_ARR[0]);
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
                          : size === "md"
                            ? "44px"
                            : size === "lg"
                              ? "64px"
                              : size === "xl"
                                ? "80px"
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
                <Box w={2} h={2} textAlign="center">
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
      {!isLink ? (
        <Box>
          <AvatarComponent />
        </Box>
      ) : (
        <Link href={`/profile/${uid}`} style={{ outline: "none" }}>
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
            padding: 1px;
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
        case "md":
          return css`
            width: 48px; // w-11
            height: 48px; // h-11
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

  padding: ${(props) =>
    props.hasType &&
    (props.size === "2xs"
      ? "1px"
      : props.size === "xs"
        ? "2px"
        : props.size === "sm"
          ? "3px"
          : props.size === "smd"
            ? "4px"
            : props.size === "md"
              ? "6px"
              : props.size === "lg"
                ? "6px"
                : "8px")};

  background: ${(props) => (props.isBgImage ? `center/cover no-repeat ${props.bg}` : props.bg)};
`;
