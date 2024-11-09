import { Badge, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import styled from "styled-components";
import { ABOUT_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
import { SingleLineText } from "../../../styles/layout/components";
import {
  GroupParicipantProps,
  GroupStatus,
  IGroupWritingCategory,
} from "../../../types/models/groupTypes/group";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";

const VOTER_SHOW_MAX = 4;
export interface GroupThumbnailCardProps {
  title: string;
  text: string;
  status: "pending" | "end";
  category: IGroupWritingCategory;

  participants: (GroupParicipantProps | IUserSummary)[];
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  maxCnt: number;
  id: number;
}

const STATUS_TO_BADGE_PROPS: Record<GroupStatus, { text: string; colorScheme: string }> = {
  open: { text: "모집 마감", colorScheme: "red" },
  close: { text: "취소", colorScheme: "gray" },
  pending: { text: "모집중", colorScheme: "mint" },
  end: { text: "종료", colorScheme: "gray" },
};

export function GroupThumbnailCard({
  participants,
  title,
  status,
  text,
  category,

  imageProps,
  id,
  maxCnt,
}: GroupThumbnailCardProps) {
  const userAvatarArr = participants
    ?.filter((par) => par)
    .map((par) =>
      par.user
        ? {
            image: par.user?.profileImage,
            ...(par.user.avatar?.type !== null ? { avatar: par.user.avatar } : {}),
          }
        : { image: ABOUT_USER_SUMMARY.profileImage },
    );

  return (
    <CardLink href={`/group/${id}`}>
      <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
      <Flex direction="column" ml="12px" flex={1}>
        <Flex my={1} justify="space-between" align="center">
          <Box fontSize="11px" lineHeight="12px">
            <Box as="span" fontWeight="medium" lineHeight="12px" color="mint">
              {category.main}
            </Box>
            <Box as="span" fontWeight="regular" color="var(--gray-400)">
              ・
            </Box>
            <Box as="span" color="gray.500" fontWeight="regular">
              {category.sub}
            </Box>
          </Box>

          <Badge mr={1} size="lg" colorScheme={STATUS_TO_BADGE_PROPS[status].colorScheme}>
            {STATUS_TO_BADGE_PROPS[status].text}
          </Badge>
        </Flex>
        <Title>{title}</Title>
        <Subtitle lineNum={2}>{text}</Subtitle>

        <Flex alignItems="center" justify="space-between">
          <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} maxCnt={VOTER_SHOW_MAX} />
          <Flex align="center" color="var(--gray-500)">
            <UserIcon size="sm" />
            <Flex ml={1} fontSize="10px" align="center" fontWeight={500}>
              <Box
                fontWeight={600}
                as="span"
                color={
                  maxCnt !== 0 && participants.length >= maxCnt
                    ? "var(--color-red)"
                    : "var(--color-gray)"
                }
              >
                {participants.length}
              </Box>
              <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                /
              </Box>
              <Box as="span" color="var(--gray-500)" fontWeight={500}>
                {maxCnt === 0 ? <i className="fa-regular fa-infinity" /> : maxCnt}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CardLink>
  );
}

type PlaceImageProps = Omit<ComponentProps<typeof Image>, "alt" | "sizes" | "fill">;

function PlaceImage(props: PlaceImageProps) {
  return (
    <Box
      aspectRatio={1 / 1}
      borderRadius="var(--rounded-lg)"
      position="relative"
      overflow="hidden"
      pos="relative"
      w="98px"
      h="98px"
    >
      <Image
        {...props}
        alt="thumbnailImage"
        sizes="98px"
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
}

const CardLink = styled(Link)`
  height: fit-content;
  display: flex;

  border-radius: 12px;
  background-color: white;
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200);
  }

  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
`;

const Title = styled(SingleLineText)`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
  line-height: 24px;
  color: var(--gray-800);
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 12px;
  font-weight: regular;
  line-height: 18px;
  margin-bottom: 12px;
`;
