import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import ShadowBlockButton from "../atoms/buttons/ShadowBlockButton";
import { HighlightedThumbnailCard } from "../molecules/cards/HighlightedThumbnailCard";
import {
  IPostThumbnailCard,
  PostThumbnailCard,
  PostThumbnailCardSkeleton,
} from "../molecules/cards/PostThumbnailCard";

interface ICardColumnLayout {
  cardDataArr: IPostThumbnailCard[];
  url: string;
  func?: () => void;
  isShort?: boolean;
}
export function CardColumnLayout({ cardDataArr, url, func, isShort }: ICardColumnLayout) {
  return (
    <Layout>
      <Item>
        <HighlightedThumbnailCard
          highlightedThumbnailCardProps={cardDataArr[0]}
          isShort={isShort}
        />
      </Item>
      {cardDataArr.map((cardData, idx) => (
        <Item key={idx}>
          <PostThumbnailCard postThumbnailCardProps={cardData} isShort={isShort} />
        </Item>
      ))}
      {cardDataArr?.length >= 3 && <ShadowBlockButton text="더보기" url={url} func={func} />}
    </Layout>
  );
}

export function CardColumnLayoutSkeleton() {
  return (
    <Layout>
      {[1, 2, 3].map((item) => (
        <Box mb="16px" key={item}>
          <PostThumbnailCardSkeleton />
        </Box>
      ))}
      <ShadowBlockButton text="더보기" />
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  margin-bottom: 16px;
`;
