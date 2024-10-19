import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import UserBadge from "../../../components/atoms/badges/UserBadge";
import ProgressBar from "../../../components/atoms/ProgressBar";
import {
  BADGE_COLOR_MAPPINGS,
  BADGE_SCORE_MAPPINGS,
} from "../../../constants/serviceConstants/badgeConstants";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import BadgeInfoModal from "../../../modals/store/badgeInfoModal/BadgeInfoModal";
import { getUserBadge } from "../../../utils/convertUtils/convertDatas";

interface IPointScoreBar {
  hasQuestion?: boolean;
}

function PointScoreBar({ hasQuestion = true }: IPointScoreBar) {
  const { data: userInfo } = useUserInfoQuery();

  const [isBadgeModal, setIsBadgeModal] = useState(false);
  const myScoreBadge = getUserBadge(userInfo?.score, userInfo?.uid);
  const nextBadgeObj =
    userInfo !== undefined &&
    Object.entries(BADGE_SCORE_MAPPINGS).find(([, value]) => value > userInfo?.score);

  return (
    <>
      <Layout>
        <Grade>
          <Flex align="center">
            <UserBadge score={userInfo?.score || 0} uid={userInfo?.uid} />
            <Box
              fontSize="10px"
              alignSelf="flex-end"
              ml={2}
              color={
                BADGE_COLOR_MAPPINGS[myScoreBadge] !== "gray"
                  ? BADGE_COLOR_MAPPINGS[myScoreBadge]
                  : "var(--gray-600)"
              }
            >
              {userInfo?.score}점
            </Box>
            {hasQuestion && (
              <Box
                ml={2}
                mt={0.5}
                fontSize="12px"
                color="gray.600"
                onClick={() => setIsBadgeModal(true)}
              >
                <i className="fa-regular fa-question-circle fa-sm " />
              </Box>
            )}
          </Flex>
          {nextBadgeObj && (
            <div>
              <Box
                fontSize="10px"
                alignSelf="flex-end"
                color={BADGE_COLOR_MAPPINGS[nextBadgeObj[0]]}
              >
                {nextBadgeObj[1]}점
              </Box>
              <Box ml={2}>
                <UserBadge score={30} uid="" />
              </Box>
            </div>
          )}
        </Grade>
        <ProgressBar
          value={(1 - (nextBadgeObj[1] - userInfo?.score) / nextBadgeObj[1]) * 100}
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

export default PointScoreBar;
