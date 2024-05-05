import styled from "styled-components";

import ShadowBlockButton from "../atoms/buttons/ShadowBlockButton";
import {
  IPostThumbnailCard,
  PostThumbnailCard,
  PostThumbnailCardSkeleton,
} from "../molecules/cards/PostThumbnailCard";

interface ICardColumnLayout {
  cardDataArr: IPostThumbnailCard[];
  url: string;
  func?: () => void;
}
export function CardColumnLayout({ cardDataArr, url, func }: ICardColumnLayout) {
  return (
    <Layout>
      {cardDataArr.map((cardData, idx) => (
        <Item key={idx}>
          <PostThumbnailCard postThumbnailCardProps={cardData} />
        </Item>
      ))}
      <ShadowBlockButton text="더보기" url={url} func={func} />
    </Layout>
  );
}

export function CardColumnLayoutSkeleton() {
  return (
    <Layout>
      {[1, 2, 3].map((item) => (
        <Item key={item}>
          <PostThumbnailCardSkeleton />
        </Item>
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
  margin-bottom: 12px;
`;
