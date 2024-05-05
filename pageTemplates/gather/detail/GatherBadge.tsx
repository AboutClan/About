import { Badge } from "@chakra-ui/react";
import styled from "styled-components";

import { GATHER_TYPES, GatherCategoryIcons } from "../../../constants/contentsText/GatherContents";

interface IGatherBadge {
  typeTitle: string;
}

function GatherBadge({ typeTitle }: IGatherBadge) {
  const categoryIcon =
    GatherCategoryIcons[GATHER_TYPES?.findIndex((item) => item?.title === typeTitle)];
  return (
    <Badge p="2px 4px" fontSize="12px" alignSelf="flex-start">
      {categoryIcon}
      <Category>{typeTitle}</Category>
    </Badge>
  );
}

const Category = styled.span`
  margin-left: var(--gap-1);
`;

export default GatherBadge;
