import { Badge } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import ProgressBar from "../../../components/atoms/ProgressBar";
import {
  BADGE_COLOR_MAPPINGS,
  BADGE_INFO,
} from "../../../constants/serviceConstants/badgeConstants";
import { SCHEME_TO_COLOR } from "../../../constants/styles";
import BadgeInfoModal from "../../../modals/store/badgeInfoModal/BadgeInfoModal";
import { UserBadge } from "../../../types/models/userTypes/userInfoTypes";
import { getNextBadge, getUserBadge } from "../../../utils/convertUtils/convertDatas";

interface IPointScoreBar {
  myScore: number;
  hasQuestion?: boolean;
}

function PointScoreBar({ myScore, hasQuestion = true }: IPointScoreBar) {
  const { data: session } = useSession();

  const [userBadge, setUserBadge] = useState<{
    badge: UserBadge;
    nextBadge: UserBadge;
  }>({ badge: null, nextBadge: null });
  const [isBadgeModal, setIsBadgeModal] = useState(false);

  useEffect(() => {
    if (myScore === 0) {
      setUserBadge({ badge: "아메리카노", nextBadge: "망고" });
      return;
    }
    const badge = getUserBadge(myScore, session?.user?.uid as string);
    const nextBadge = getNextBadge(badge);

    setUserBadge({ badge, nextBadge });
  }, [myScore, session?.user?.uid]);

  const { badge, nextBadge } = userBadge;

  const badgeColor = BADGE_COLOR_MAPPINGS[userBadge.badge];

  const getBadgePoint = () => {
    for (let i = 0; i < BADGE_INFO.length; i++) {
      const badgeInfo = BADGE_INFO[i];
      if (badgeInfo.badge === nextBadge) {
        return {
          nextBadgePoint: badgeInfo.minScore,
          badgeGap: badgeInfo.minScore - BADGE_INFO[i - 1].minScore,
        };
      }
    }
  };
  const { nextBadgePoint, badgeGap } = getBadgePoint() || {};

  return (
    <>
      <Layout>
        <Grade>
          <div>
            <Badge fontSize="14px" marginRight="var(--gap-2)" colorScheme={badgeColor}>
              {badge}
            </Badge>
            <BadgeName color={SCHEME_TO_COLOR[badgeColor] || badgeColor}>{myScore}점</BadgeName>
            {hasQuestion && (
              <IconWrapper onClick={() => setIsBadgeModal(true)}>
                <i className="fa-light fa-question-circle fa-sm" />
              </IconWrapper>
            )}
          </div>
          {nextBadge && (
            <div>
              <BadgeName color={BADGE_COLOR_MAPPINGS[nextBadge]}>{nextBadgePoint}점</BadgeName>
              <Badge fontSize="14px" colorScheme={BADGE_COLOR_MAPPINGS[nextBadge]} marginLeft="6px">
                {nextBadge}
              </Badge>
            </div>
          )}
        </Grade>
        <ProgressBar
          value={(1 - (nextBadgePoint - myScore) / badgeGap) * 100}
          colorScheme="mintTheme"
          hasStripe={true}
        />
      </Layout>

      {isBadgeModal && <BadgeInfoModal setIsModal={setIsBadgeModal} />}
    </>
  );
}

const Layout = styled.div`
  margin-bottom: var(--gap-3);
`;
const Grade = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--gap-3);
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
`;

const BadgeName = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: 600;
`;

const IconWrapper = styled.button`
  font-size: 14px;
  margin-left: var(--gap-2);
`;

export default PointScoreBar;
