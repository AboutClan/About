import { Badge } from "@chakra-ui/react";

import { BADGE_COLOR_MAPPINGS } from "../../../constants/serviceConstants/badgeConstants";
import { getUserBadge } from "../../../utils/convertUtils/convertDatas";
interface IUserBadge {
  score: number;
  uid: string;
}

export default function UserBadge({ score, uid }: IUserBadge) {
  const badge = getUserBadge(score, uid);
  return <Badge colorScheme={BADGE_COLOR_MAPPINGS[badge]}>{badge}</Badge>;
}
