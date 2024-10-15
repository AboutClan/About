import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { IImageProps } from "../../../types/components/assetTypes";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import Skeleton from "../../atoms/skeleton/Skeleton";
export interface IHighlightedThumbnailCard {
  participants?: IUserSummary[];
  title: string;
  subtitle: string;
  image: IImageProps;
  url: string;
  badge: ITextAndColorSchemes;
  type: "study" | "gather";
  statusText?: string;
  maxCnt?: number;
  func?: () => void;
  registerDate?: string;
  id?: string;
}

interface IHighlightedThumbnailCardObj {
  date: string;
  isShort?: boolean;
}
export function HighlightedThumbnailCard({ date }: IHighlightedThumbnailCardObj) {
  const { data: session } = useSession();

  return (
    <CardLink
      href={`/vote?location=${convertLocationLangTo(session?.user.location, "en")}&date=${date}&tab=real`}
    >
      <Flex flex={1}>
        <Box
          w="80px"
          h="80px"
          borderRadius="var(--rounded-lg)"
          position="relative"
          overflow="hidden"
          pos="relative"
        >
          <Image src="/실시간.jpg" alt="thumbnailImage" fill={true} sizes="100px" />
        </Box>
        <Flex direction="column" ml="12px" flex={1}>
          <Flex align="center" fontSize="16px">
            <Box>
              <i
                className="fa-solid fa-location-dot"
                style={{
                  color: "var(--color-mint)",
                  marginRight: "4px",
                }}
              />
            </Box>
            <Title>실시간 스터디</Title>
          </Flex>
          <Subtitle>공부하고 인증하면 혜택을 드려요!</Subtitle>
          <Flex fontSize="14px" mt="auto" align="center">
            <Box mr={0.5}>
              <i className="fa-solid fa-user fa-sm" />
            </Box>
            <Box ml="4px">참여중인 인원: 14명</Box>
          </Flex>
        </Flex>
      </Flex>
    </CardLink>
  );
}

export function HighlightedThumbnailCardSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBlock style={{ width: "80px", height: "80px" }}>
        <Skeleton>t</Skeleton>
      </SkeletonBlock>
      <ContentContainer>
        <TitleHeader style={{ marginBottom: "4px" }}>
          <Box w="60px">
            <Skeleton>temp</Skeleton>
          </Box>
          <Box w="60px">
            <Skeleton>temp</Skeleton>
          </Box>
        </TitleHeader>
        <Box w="50px" h="16px">
          <Skeleton>temp</Skeleton>
        </Box>
      </ContentContainer>
    </SkeletonContainer>
  );
}

const CardLink = styled(Link)`
  position: relative;
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border-radius: var(--rounded-lg); /* 둥근 모서리 */
  justify-content: space-between;

  /* Hover 시 배경색 변경 */
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }

  border-bottom-right-radius: 0;
  /* 가상 요소를 사용해 그라데이션 테두리 추가 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--rounded-lg); /* 둥근 모서리 */
    border-bottom-right-radius: 0;
    padding: 2px; /* 테두리 두께 */
    background: linear-gradient(to right, #4de1b6, #1c5bd0); /* 그라데이션 */
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    pointer-events: none; /* 클릭 방지 */
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  margin-left: 12px;
`;

const TitleHeader = styled.div`
  height: 20px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled(SingleLineText)`
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 12px;
  width: 90%;
  font-weight: 500;
`;

const SkeletonContainer = styled.div`
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border: var(--border);
  border-radius: var(--rounded-lg);

  &:hover {
    background-color: var(--gray-200); // gray-100
  }
`;

const SkeletonBlock = styled.div`
  background-color: var(--gray-200); // gray-200 대응
  border-radius: var(--rounded-lg);
`;
