import { Badge } from "@chakra-ui/react";

import {
  BADGE_COLOR_MAPPINGS,
  USER_BADGE_ARR,
} from "../../../constants/serviceConstants/badgeConstants";
interface IUserBadge {
  badgeIdx: number;
}

export default function UserBadge({ badgeIdx }: IUserBadge) {
  const badge = badgeIdx ? USER_BADGE_ARR[badgeIdx] : "아메리카노";
  return (
    <Badge
      h="20px"
      variant="subtle"
      px={2}
      py={1}
      lineHeight="12px"
      fontWeight="semibold"
      fontSize="9px"
      borderRadius="10px"
      colorScheme={BADGE_COLOR_MAPPINGS[badge]}
    >
      {badge}
    </Badge>
  );
}
