import styled from "styled-components";

import { Badge } from "../../../components/atoms/badges/Badges";
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
      <Badge text={STATUS_TO_TEXT[status]} colorScheme={color} size="lg" />
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
