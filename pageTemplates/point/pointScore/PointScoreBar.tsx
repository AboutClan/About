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

interface IPointScoreBar {
  hasQuestion?: boolean;
}

function PointScoreBar({ hasQuestion = true }: IPointScoreBar) {
  const { data: userInfo } = useUserInfoQuery();

  const [isBadgeModal, setIsBadgeModal] = useState(false);

  let badgeInfo = ["아메리카노", 0];

  Object.entries(BADGE_SCORE_MAPPINGS)?.forEach((items) => {
    if (items?.[1] > userInfo?.score) {
      badgeInfo = items;
    }
  });

  const currentBadgeObj = (userInfo !== undefined &&
    Object.entries(BADGE_SCORE_MAPPINGS).findIndex(([, value]) => value > userInfo?.score)) || [
    "에스프레소",
    1000,
  ];
  const nextBadgeObj = (userInfo !== undefined &&
    Object.entries(BADGE_SCORE_MAPPINGS).findIndex(([, value]) => value > userInfo?.score)) || [
    "에스프레소",
    1000,
  ];
  const nextBadge = Object.entries(BADGE_SCORE_MAPPINGS)[nextBadgeObj as number];

  return (
    <>
      <Layout>
        <Grade>
          <Flex align="center">
            <UserBadge badgeIdx={userInfo?.badge?.badgeIdx} />
            <Box
              fontSize="10px"
              fontWeight="semibold"
              lineHeight="12px"
              ml={1}
              py={1}
              color={BADGE_COLOR_MAPPINGS[badgeInfo[0]]}
            >
              {userInfo?.score}점
            </Box>
            {hasQuestion && (
              <Box ml={1} fontSize="12px" color="gray.500" onClick={() => setIsBadgeModal(true)}>
                <i className="fa-regular fa-question-circle fa-sm " />
              </Box>
            )}
          </Flex>
          {nextBadgeObj && (
            <div>
              <Box
                fontSize="10px"
                mt="1px"
                lineHeight="12px"
                fontWeight="semibold"
                color={BADGE_COLOR_MAPPINGS[nextBadge[0]]}
              >
                {nextBadge[1]}점
              </Box>
              <Box ml={1} h="20px">
                <UserBadge badgeIdx={nextBadgeObj as number} />
              </Box>
            </div>
          )}
        </Grade>{" "}
        <Flex w="100%">
          <Box ml="0" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
          <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
          <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
          <Box ml="auto" h="8px" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
        </Flex>
        <ProgressBar
          value={(1 - (nextBadgeObj[1] - userInfo?.score) / nextBadgeObj[1]) * 100}
          colorScheme="mint"
          hasStripe={true}
          size="sm"
        />
        <Flex lineHeight="12px" fontSize="10px" mt="8px" color="gray.500" fontWeight="medium">
          <Box>0</Box>
          <Box ml="calc(33.3% - 9px)">10</Box>
          <Box ml="calc(33.3% - 7px )">20</Box>
          <Box ml="auto">30</Box>
        </Flex>
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
  margin-bottom: 8px;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
  }
`;

export default PointScoreBar;
