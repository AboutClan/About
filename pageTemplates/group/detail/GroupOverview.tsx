import { Box, Flex } from "@chakra-ui/react";

import MainBadge from "../../../components/atoms/MainBadge";
import BlurredLink from "../../../components/molecules/BlurredLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import { IGroup } from "../../../types/models/groupTypes/group";

interface GroupOverviewProps {
  group: IGroup;
  isMyGroup: boolean;
  gatherCnt: number;
  reviewCnt: number;
}

function GroupOverview({ group, isMyGroup, gatherCnt, reviewCnt }: GroupOverviewProps) {
  console.log(25, gatherCnt);
  return (
    <Flex direction="column" px={5} pt={4} pb={2}>
      <Flex mb={2}>
        <Box mr={1}>
          <MainBadge text={group?.category?.main} />
        </Box>
        <MainBadge text={group?.isFree ? "자유 가입" : "승인제"} type="sub" />
      </Flex>
      <Box mb={2} fontSize="18px" fontWeight="bold" lineHeight="28px">
        {group?.title}
      </Box>
      <InfoBoxCol
        infoBoxPropsArr={[
          {
            category: "인 원",
            text: `총 ${group?.participants?.length}명`,
          },
          {
            category: "활 동",
            text: gatherCnt === 0 ? "시작 전" : `모임 ${gatherCnt}번 / 후기 ${reviewCnt}개`,
          },

          {
            category: "단톡방",
            rightChildren: <BlurredLink isBlur={!isMyGroup} url={group?.link} />,
          },
        ]}
        size="md"
        highlightSide="left"
      />
    </Flex>
  );
}

export default GroupOverview;
