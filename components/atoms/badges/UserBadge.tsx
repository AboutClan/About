import { Badge } from "@chakra-ui/react";

import { BADGE_COLOR_MAPPINGS } from "../../../constants/serviceConstants/badgeConstants";
import { getUserBadge } from "../../../utils/convertUtils/convertDatas";
interface IUserBadge {
  score: number;
  uid: string;
}

export default function UserBadge({ score, uid }: IUserBadge) {
  const badge = getUserBadge(score, uid);
 
  return (
    <Badge
      h="20px"
      variant="subtle"
      px={2}
      py={1}
      fontWeight="semibold"
      fontSize="9px"
      borderRadius="10px"
      colorScheme={BADGE_COLOR_MAPPINGS[badge]}
    >
      {badge}
    </Badge>
  );
}
