import { Box, Flex } from "@chakra-ui/react";

import BlurredLink from "../../../components/molecules/BlurredLink";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";

interface GroupOverviewProps {
  title: string;
  isFree: boolean;
  link: string;
  isMyGroup: boolean;
}

function GroupOverview({ title, isFree, link, isMyGroup }: GroupOverviewProps) {
  return (
    <Flex direction="column" px={5} pt={5} pb={3}>
      <Box mb={4} fontSize="18px" fontWeight="bold" lineHeight="28px">
        {title}
      </Box>
      <InfoBoxCol
        infoBoxPropsArr={[
          {
            category: "가입 방식",
            text: isFree ? "자유 가입" : "승인제",
          },
          {
            category: "활동 톡방",
            rightChildren: <BlurredLink isBlur={!isMyGroup} url={link} />,
          },
        ]}
        size="md"
      />
    </Flex>
  );
}

export default GroupOverview;
