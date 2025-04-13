import { Box } from "@chakra-ui/react";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";

function StudyPageRecordBlock() {
  return (
    <Box my={5} p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
      <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
        내 스터디 참여 기록
      </Box>
      <InfoBoxCol
        infoBoxPropsArr={[
          { category: "이번 달 참여 횟수", text: "6회" },
          { category: "누적 참여 시간", text: "16시간 20분" },
          { category: "최근 만난 인원", rightChildren: <></> },
        ]}
        size="md"
      />
    </Box>
  );
}

export default StudyPageRecordBlock;
