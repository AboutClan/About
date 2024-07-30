import dayjs from "dayjs";
import styled from "styled-components";

import { SecretSquareItem } from "../../../types/models/square";
import { getDateDiff } from "../../../utils/dateTimeUtils";

interface SquareItemProps {
  item: SecretSquareItem;
}

export default function SquareItem({ item }: SquareItemProps) {
  const id = item.id;

  return (
    <Layout>
      <IconCategory category={item.category} />

      <Title>{item.title}</Title>
      <Content>{item.content}</Content>
      <Bottom>
        <span>{getDateDiff(dayjs(item.createdAt))}</span>
        <span>조회 {item.viewCount}</span>
      </Bottom>
    </Layout>
  );
}

function IconCategory({ category }: { category: string }) {
  return <IconLayout>#{category}</IconLayout>;
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-bottom: var(--border-main);
  padding: 12px 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  width: 240px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Content = styled.div`
  color: var(--font-h7);
  font-size: 13px;
  margin-top: 4px;
  margin-bottom: 6px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IconLayout = styled.span`
  background-color: var(--font-h6);
  color: var(--gray-600);
  font-size: 12px;
  width: max-content;
  text-align: center;
  margin-bottom: 2px;
`;

const Bottom = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--gray-600);

  & :after {
    content: "•";
    margin: 0 4px;
  }

  & :last-child:after {
    content: "";
  }
`;
