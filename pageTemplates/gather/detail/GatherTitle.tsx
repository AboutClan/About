import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

import { GatherCategory } from "../../../types/models/gatherTypes/gatherTypes";

interface IGatherTitle {
  title: string;
  category: string;
  type: GatherCategory;
}

function GatherTitle({ title, category, type }: IGatherTitle) {
  return (
    <Layout>
      <Badge variant="subtle" colorScheme="orange" size="lg">
        {type === "event" ? "이벤트" : type === "official" ? "공식 행사" : category}
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
