import { Badge, Progress } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { BADGE_COLOR_MAPPINGS, BADGE_INFO } from "../../constants/serviceConstants/badgeConstants";
import { SCHEME_TO_COLOR } from "../../constants/styles";
import BadgeInfoModal from "../../modals/store/badgeInfoModal/BadgeInfoModal";

interface IAttendanceBar {
  myScore: number;
  hasQuestion?: boolean;
}

function AttendanceBar({ myScore, hasQuestion = true }: IAttendanceBar) {
  const userBadge = { badge: "아메리카노", nextBadge: "망고" };

  const [isBadgeModal, setIsBadgeModal] = useState(false);

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
        <Progress
          value={(1 - (nextBadgePoint - myScore) / badgeGap) * 100}
          height="12px"
          colorScheme="mintTheme"
          hasStripe
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
  color: var(--gray-200);
  font-size: 14px;
  margin-left: var(--gap-2);
`;

export default AttendanceBar;
