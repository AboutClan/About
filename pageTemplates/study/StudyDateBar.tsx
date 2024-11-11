import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { PlusIcon } from "../../components/Icons/MathIcons";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  date: string;

  memberCnt: number;
}
function StudyDateBar({ date, memberCnt }: IStudyDateBar) {
  const typeToast = useTypeToast();

  return (
    <>
      <Box mt={10} mb={2}>
        <Flex justify="space-between" align="center">
          <Box fontWeight="bold" fontSize="18px">
            {dayjsToFormat(dayjs(date), "M월 D일 참여 멤버")}
          </Box>
          <Button variant="unstyled" onClick={() => typeToast("not-yet")}>
            <PlusIcon color="mint" size="sm" />
          </Button>
        </Flex>
        <Box mt={1} fontSize="12px" color="gray.500">
          현재 <b>{memberCnt}의 멤버</b>가 참여중이에요 !
        </Box>
      </Box>
    </>
  );
}

export default StudyDateBar;
