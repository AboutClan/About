import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

interface IGatherTitle {
  title: string;
  isEvent: boolean;
  category: string;
}

function GatherTitle({ title, category, isEvent }: IGatherTitle) {
  return (
    <Layout>
      <Badge variant="subtle" colorScheme="orange" size="lg">
        {isEvent ? "이벤트" : category}
      </Badge>
      <span>{title}</span>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 16px 20px;
  background-color: white;
  font-size: 16px;
  font-weight: bold;
  border: var(--border);
  > span:last-child {
    margin-left: var(--gap-2);
  }
`;

export default GatherTitle;
