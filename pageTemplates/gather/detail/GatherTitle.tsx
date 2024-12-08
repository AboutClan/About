import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

import { STATUS_TO_TEXT } from "../../../constants/util/convert";
import { GatherStatus } from "../../../types/models/gatherTypes/gatherTypes";

interface IGatherTitle {
  title: string;
  status: GatherStatus;
}

function GatherTitle({ status, title }: IGatherTitle) {
  const color = status === "pending" ? "mint" : status === "open" ? "red" : null;

  return (
    <Layout status={status}>
      <Badge colorScheme={color} size="lg">
        {STATUS_TO_TEXT[status]}
      </Badge>
      <span>{title}</span>
    </Layout>
  );
}

const Layout = styled.div<{ status: GatherStatus }>`
  padding: Var(--gap-4);
  background-color: white;
  color: var(--gray-800);
  font-size: 16px;
  font-weight: 700;
  border: var(--border);
  > span:last-child {
    margin-left: var(--gap-2);
  }
`;

export default GatherTitle;
