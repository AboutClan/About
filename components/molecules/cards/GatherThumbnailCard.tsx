import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import {
  GatherCategory,
  GatherStatus,
  IGatherParticipants,
} from "../../../types/models/gatherTypes/gatherTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
import { InfinityIcon } from "./StudyThumbnailCard";

const VOTER_SHOW_MAX = 6;
export interface GatherThumbnailCardProps {
  title: string;
  status: string;
  category: string;
  date: string;
  place: string;
  participants?: IGatherParticipants[];
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  maxCnt: number;
  id: number;
  func?: () => void;
  age: number[];
  gatherType: GatherCategory;
  memberReview: {
    isCompleted: boolean;
    handleBtn: () => void;
  };
  gatherReview: {
    isCompleted: boolean;
    handleBtn: () => void;
  };
  homePath?: boolean;
}

const STATUS_TO_BADGE_PROPS: Record<GatherStatus, { text: string; colorScheme: string }> = {
  open: { text: "모집 마감", colorScheme: "red" },
  expired: { text: "모집 종료", colorScheme: "red" },
  close: { text: "취소", colorScheme: "gray" },
  pending: { text: "모집중", colorScheme: "mint" },
  end: { text: "종료", colorScheme: "gray" },
  planned: { text: "오픈 예정", colorScheme: "purple" },
};

export function GatherThumbnailCard({
  participants: par2,
  title: title2,
  status,
  category,
  date: date2,
  place,
  imageProps,
  id,
  maxCnt: m,
  func,
  age,
  gatherType,
  gatherReview,
  memberReview,
  homePath,
}: GatherThumbnailCardProps) {
  const participantsMember = par2.filter((par) => par.user?._id !== "65df1ddcd73ecfd250b42c89");

  const has = !!(gatherReview || memberReview);

  let date = date2;
  const statusProps = STATUS_TO_BADGE_PROPS[dayjs(date).isBefore(dayjs()) ? "expired" : status];
  let title = title2;
  let participants = participantsMember;

  let maxCnt = m;

  if (title === "맛집 탐방: 야키토리 + 낭낭한 디저트") {
    date = dayjs(date2).date(12).toISOString();
    maxCnt = 12;
    console.log(124);
    const temp: IGatherParticipants = {
      user: {
        avatar: {
          type: 6,
          bg: 2,
        },
      },
    };
    const temp2: IGatherParticipants = {
      user: {
        avatar: {
          type: 14,
          bg: 9,
        },
      },
    };
    participants.push(temp2);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
  } else if (title === "아바타 영화 관람 🍿 with 카페") {
    date = dayjs(date2).date(12).toISOString();
    const temp2: IGatherParticipants = {
      user: {
        avatar: {
          type: 14,
          bg: 9,
        },
      },
    };
    participants.push(temp2);
  } else if (title === "💖 종강 & 연말 ABOUT 소셜 파티! 🎉") {
    title = "💖 ABOUT 소셜 파티 나잇! 🎉";
    date = dayjs(date2).year(2026).month(0).date(13).toISOString();
    const temp: IGatherParticipants = {
      user: {
        avatar: {
          type: 6,
          bg: 2,
        },
      },
    };
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);
    participants.push(temp);

    maxCnt = 80;
  } else if (title === "오프라인 토익 스터디 2회차!") {
    date = dayjs(date2).date(12).toISOString();
  } else if (title === "🎬 영화 관람부터 보드게임, 술자리까지! 11월 ABOUT 올데이 파티 🎲🍻") {
  } else if (title === "") {
  }

  return (
    <CardLink
      href={`/${"gather"}/${id}` + (homePath ? "?path=home" : "")}
      has={has ? "true" : "false"}
      onClick={func}
    >
      <Flex justify="space-between">
        <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
        <Flex direction="column" ml="12px" flex={1}>
          <Flex justify="space-between">
            <Flex>
              <Badge
                mr={1}
                size="md"
                variant="solid"
                colorScheme={
                  gatherType === "event" || gatherType === "official"
                    ? "yellow"
                    : statusProps.colorScheme
                }
              >
                {gatherType === "event"
                  ? "이벤트"
                  : gatherType === "official"
                  ? "공식 행사"
                  : statusProps.text}
              </Badge>

              <Badge size="md" colorScheme="gray" color="var(--gray-600)">
                {category}
              </Badge>
            </Flex>
            {title === "🎬 영화 관람부터 보드게임, 술자리까지! 11월 ABOUT 올데이 파티 🎲🍻" && (
              <Badge size="md" variant="subtle" colorScheme="blue">
                만 {19} ~ {23}세
              </Badge>
            )}
          </Flex>
          <Title>{title}</Title>
          <Subtitle>
            {gatherType !== "event" ? (
              <>
                <Box as="span">{dayjsToFormat(dayjs(date).locale("ko"), "M.D(ddd) HH:mm")}</Box>
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>
                <Box as="span" fontWeight={600}>
                  {place || "온라인"}
                </Box>
              </>
            ) : (
              <Box as="span" fontWeight={600}>
                About 이벤트 챌린지
              </Box>
            )}
          </Subtitle>

          <Flex mt={1} alignItems="center" justify="space-between">
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
        </Flex>
      </Flex>
      {has && (
        <Flex mt={3} ml="auto">
          <Button
            size="sm"
            mr={2}
            borderColor={gatherReview?.isCompleted ? "inherit" : "gray.800"}
            {...(gatherReview?.isCompleted ? { colorScheme: "mint" } : {})}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              gatherReview?.handleBtn();
            }}
          >
            {gatherReview?.isCompleted ? "모임 후기 보기" : "모임 후기 작성"}
          </Button>
          <Button
            size="sm"
            colorScheme="black"
            isDisabled={memberReview?.isCompleted}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              memberReview?.handleBtn();
            }}
          >
            {!memberReview?.isCompleted ? "멤버 평가" : "평가 완료"}
          </Button>
        </Flex>
      )}
    </CardLink>
  );
}

type PlaceImageProps = Omit<ComponentProps<typeof Image>, "alt" | "sizes" | "fill">;

function PlaceImage(props: PlaceImageProps) {
  const [imgSrc, setImgSrc] = useState(props?.src || "");
  return (
    <Box
      aspectRatio={1 / 1}
      borderRadius="var(--rounded-lg)"
      position="relative"
      overflow="hidden"
      pos="relative"
      w="98px"
      h="98px"
      bg="gray.100"
      border="var(--border-main)"
    >
      <Image
        {...props}
        src={imgSrc}
        alt="thumbnailImage"
        sizes="98px"
        fill
        onError={() =>
          setImgSrc(
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/choosing-perfect-movie.jpg",
          )
        }
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
}

const CardLink = styled(Link)<{ has: "true" | "false" }>`
  height: ${(props) => (props.has === "true" ? "max-content" : "114px")};
  display: flex;
  flex-direction: column;
  padding: 8px;
  padding-right: 12px;
  border: var(--border);
  border-radius: 12px;
  background-color: white;
  &:hover {
    background-color: var(--gray-200);
  }

  margin-bottom: 12px;
`;

const Title = styled(SingleLineText)`
  font-weight: 700;
  font-size: 14px;
  margin: 8px 0;
  color: var(--gray-800);
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;
`;
