import Link from "next/link";
import styled from "styled-components";

import { SecretSquareItem } from "../../../types/models/square";

interface SquareItemProps {
  item: SecretSquareItem;
}

export default function SquareItem({ item }: SquareItemProps) {
  const id = item.id;

  return (
    <Layout href={`/square/${id}`}>
      <IconCategory category={item.category} />
      <Title>{item.title}</Title>
      <Content>{item.content}</Content>
      <Bottom>
        <span>{item.createdAt}</span>
        <span>조회수 {item.viewCount}</span>
      </Bottom>
    </Layout>
  );
}

function IconCategory({ category }: { category: string }) {
  return <IconLayout>{category}</IconLayout>;
}

const Layout = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 16px;
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
  color: var(--font-h2);
  font-size: 13px;
  margin-bottom: 6px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IconLayout = styled.span`
  background-color: var(--font-h6);
  color: var(--font-h1);
  font-size: 10px;
  width: max-content;

  text-align: center;
  padding: 1px 6px;
  border-radius: 3px;
`;

const Bottom = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--font-h3);

  & :after {
    content: " • ";
    margin: 0 5px;
  }

  & :last-child:after {
    content: "";
  }
`;
