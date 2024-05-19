import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { COLOR_TABLE_LIGHT } from "../../constants/colorConstants";
import { AVATAR_IMAGE_ARR } from "../../storage/avatarStorage";
import { IAvatar as IAvatarProp } from "../../types/models/userTypes/userInfoTypes";

type Size = "sm" | "smd" | "md" | "lg" | "xl";

interface IAvatar {
  image: string;
  size: Size;
  avatar?: IAvatarProp;
  uid?: string;
  isPriority?: boolean;
  shadowAvatar?: number;
  isLink?: boolean;
}

export default function Avatar({
  image,
  size,
  avatar,
  uid,
  isPriority,
  shadowAvatar,
  isLink = true,
}: IAvatar) {
  const hasAvatar = avatar !== undefined && avatar?.type !== null && avatar?.bg !== null;

  const [imageUrl, setImageUrl] = useState(!hasAvatar ? image : AVATAR_IMAGE_ARR[avatar.type]);

  useEffect(() => {
    setImageUrl(!hasAvatar ? image : AVATAR_IMAGE_ARR[avatar.type]);
  }, [image, avatar]);

  const onError = () => {
    setImageUrl(AVATAR_IMAGE_ARR[0]);
  };

  function AvatarComponent() {
    return (
      <AvatarContainer size={size}>
        <ImageContainer
          bg={
            shadowAvatar
              ? "var(--gray-300)"
              : hasAvatar && avatar.bg !== null && COLOR_TABLE_LIGHT[avatar.bg]
          }
          hasType={hasAvatar}
          size={size}
        >
          <Box w="100%" h="100%" pos="relative">
            {!shadowAvatar ? (
              <Image
                src={imageUrl}
                fill={true}
                sizes={
                  size === "sm"
                    ? "28px"
                    : size === "smd"
                      ? "32px"
                      : size === "md"
                        ? "44px"
                        : size === "lg"
                          ? "64px"
                          : size === "xl"
                            ? "80px"
                            : ""
                }
                priority={isPriority}
                alt="avatar"
                onError={onError}
              />
            ) : (
              <Flex fontSize="12px" h="100%" justify="center" alignItems="center">
                +{shadowAvatar}
              </Flex>
            )}
          </Box>
        </ImageContainer>
      </AvatarContainer>
    );
  }

  return (
    <>
      {size === "sm" || !isLink ? (
        <AvatarComponent />
      ) : (
        <Link href={`/profile/${uid}`}>
          <AvatarComponent />
        </Link>
      )}
    </>
  );
}
const AvatarContainer = styled.div<{
  size: Size;
}>`
  overflow: hidden;
  position: relative;
  border-radius: 50%; // rounded-full
  background-color: var(--gray-100);

  ${(props) => {
    switch (props.size) {
      case "sm":
        return css`
          width: 28px; // w-7
          height: 28px; // h-7
          padding: 2px;
        `;
      case "smd":
        return css`
          width: 32px; // w-7
          height: 32px; // h-7
        `;
      case "md":
        return css`
          width: 44px; // w-11
          height: 44px; // h-11
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
    }
  }}
`;

const ImageContainer = styled.div<{
  bg: string | null;
  hasType: boolean;
  size: Size;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  padding: ${(props) =>
    props.hasType &&
    (props.size === "sm"
      ? "2px"
      : props.size === "md"
        ? "4px"
        : props.size === "lg"
          ? "6px"
          : "8px")};

  background-color: ${(props) => (props.bg ? props.bg : "var(--gray-700)")};
`;
