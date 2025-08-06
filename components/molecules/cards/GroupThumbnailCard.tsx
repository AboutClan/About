import { Badge, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import {
  GroupParicipantProps,
  GroupStatus,
  IGroupWritingCategory,
} from "../../../types/models/groupTypes/group";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
import { InfinityIcon } from "./StudyThumbnailCard";

const VOTER_SHOW_MAX = 4;
export interface GroupThumbnailCardProps {
  title: string;
  text: string;
  status: GroupStatus;
  category: IGroupWritingCategory;
  participants: (GroupParicipantProps | { user: IUserSummary })[];
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  maxCnt: number;
  func: () => void;
  id: number;
  waitingCnt?: number;
  isBig?: boolean;
  isFree: boolean;
}

export function GroupThumbnailCard({
  participants,
  title,
  status,
  text,
  category,
  func,
  imageProps,
  id,
  maxCnt,
  waitingCnt,
  isBig = true,
  isFree,
}: GroupThumbnailCardProps) {
  const statusToBadgeProps: Record<GroupStatus, { text: string; colorScheme: string }> = {
    imminent: { text: `마감까지 ${maxCnt - participants.length}명`, colorScheme: "red" },
    full: { text: "인원마감", colorScheme: "orange" },
    pending: { text: "모집중", colorScheme: "mint" },
    end: { text: "종료됨", colorScheme: "blue" },
    planned: { text: "오픈 예정", colorScheme: "purple" },
    resting: { text: "휴식중", colorScheme: "blue" },
  };

  return (
    <CardLink href={`/group/${id}`} onClick={func}>
      <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
      <Flex direction="column" ml="12px" flex={1}>
        <Flex mb={1} justify="space-between" align="center">
          <Box
            fontSize="11px"
            lineHeight="12px"
            mr={2}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
            }}
          >
            <Box as="span" fontWeight="medium" lineHeight="12px" color="mint">
              {category?.main}
            </Box>

            <Box as="span" fontWeight="regular" color="var(--gray-400)">
              ・
            </Box>
            <Box as="span" color="gray.500" fontWeight="regular">
              {isFree ? "자유 가입" : "승인제"}
            </Box>
          </Box>
          <Badge mr={1} size="lg" colorScheme={statusToBadgeProps[status].colorScheme}>
            {status === "pending" ? "활동중" : statusToBadgeProps[status].text}
          </Badge>
        </Flex>
        <Title isBig={isBig}>{title}</Title>
        <Subtitle lineNum={2}>{text}</Subtitle>
        {waitingCnt === null ? (
          <Flex alignItems="center" justify="space-between">
            <AvatarGroupsOverwrap
              users={participants?.map((par) => par.user)}
              maxCnt={VOTER_SHOW_MAX}
            />
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
                  {maxCnt === 0 ? <InfinityIcon /> : maxCnt}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        ) : null}
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
      border="var(--border)"
      bg="gray.100"
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
    padding-bottom: 12px;
    border-bottom: var(--border);
    margin-bottom: 16px;
  }
`;

const Title = styled(SingleLineText)<{ isBig: boolean }>`
  font-weight: 700;
  font-size: ${(props) => (props.isBig ? "16px" : "14px")};
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
